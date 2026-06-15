import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { parseRssItems } from './adapters/rss.ts'
import { parseMrssItems } from './adapters/mrss.ts'
import { fetchTheNewsApiItems } from './adapters/thenewsapi.ts'
import { createUniqueHash } from './dedupe.ts'
import { generateGeminiDraft } from './gemini.ts'
import { normalizeFeedItem, type NewsSourceLike } from './normalize.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-pipeline-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  })
}

function normalizeSecret(value: string | null): string {
  return String(value || '').trim()
}

function computeRelevance(item: { category: string; title: string; description: string; sourceName: string; publishedAt: string | null }) {
  const text = `${item.title} ${item.description}`.toLocaleLowerCase('tr-TR')
  let score = 0
  const reasons: string[] = []

  if (item.category === 'almanya') {
    score += 30
    reasons.push('Almanya kategorisinde')
  }
  if (/(oturum|goc|göç|vatandas|vatandaş|is|iş|vergi|sigorta|kindergeld|egitim|eğitim|saglik|sağlık|ulasim|ulaşım)/.test(text)) {
    score += 30
    reasons.push('Günlük hayatı doğrudan etkileyen konu')
  }
  if (item.publishedAt) {
    const diffHours = (Date.now() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60)
    if (diffHours <= 24) {
      score += 20
      reasons.push('Son 24 saat içinde yayınlanmış')
    }
  }
  if (/(bamf|bundesregierung|arbeitsagentur)/i.test(item.sourceName)) {
    score += 20
    reasons.push('Resmi kurum kaynağı')
  }
  if (/(spor|magazin|celebrity|yarisma|yarışma)/.test(text)) {
    score -= 40
    reasons.push('Düşük öncelikli içerik')
  }

  return {
    score: Math.max(score, 0),
    reason: reasons.join(', ') || 'Varsayılan değerlendirme',
  }
}

async function fetchSourceItems(source: NewsSourceLike & { source_type: string; feed_url?: string | null }) {
  const feedUrl = String(source.feed_url || '').trim()
  if (source.source_type === 'manual' || !feedUrl) return []

  if (source.source_type === 'api') {
    return fetchTheNewsApiItems(feedUrl, normalizeSecret(Deno.env.get('THENEWSAPI_TOKEN')))
  }

  const response = await fetch(feedUrl, {
    headers: { 'user-agent': 'almanya101-news-ingest/1.0' },
  })

  if (!response.ok) {
    throw new Error(`Source fetch failed (${response.status})`)
  }

  const xml = await response.text()
  return source.source_type === 'mrss' ? parseMrssItems(xml) : parseRssItems(xml)
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = normalizeSecret(Deno.env.get('SUPABASE_URL'))
  const supabaseServiceRoleKey = normalizeSecret(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return jsonResponse({ error: 'Service not configured' }, 503)
  }

  const requiredSecret = normalizeSecret(Deno.env.get('NEWS_PIPELINE_SECRET'))
  const providedSecret = normalizeSecret(req.headers.get('x-pipeline-secret'))
  if (requiredSecret && requiredSecret !== providedSecret) {
    return jsonResponse({ error: 'Invalid pipeline secret' }, 401)
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json().catch(() => ({}))
  } catch {
    body = {}
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const triggerType = String(body.trigger || 'manual')
  const sourceId = String(body.sourceId || '').trim()
  const requestedMaxItems = Number.parseInt(String(body.maxItems || ''), 10)

  const { data: settingsRow, error: settingsError } = await supabase
    .from('news_pipeline_settings')
    .select('pipeline_enabled, ai_enabled, ai_daily_limit, max_items_per_source, auto_create_pending_review')
    .eq('id', true)
    .maybeSingle()

  if (settingsError) {
    return jsonResponse({ error: settingsError.message }, 500)
  }

  const settings = settingsRow || {
    pipeline_enabled: true,
    ai_enabled: false,
    ai_daily_limit: 10,
    max_items_per_source: 10,
    auto_create_pending_review: true,
  }

  const { data: run, error: runError } = await supabase
    .from('news_ingest_runs')
    .insert([
      {
        trigger_type: triggerType,
        status: 'running',
      },
    ])
    .select('id')
    .maybeSingle()

  if (runError || !run) {
    return jsonResponse({ error: runError?.message || 'Failed to create run' }, 500)
  }

  if (!settings.pipeline_enabled && triggerType !== 'source_test') {
    await supabase
      .from('news_ingest_runs')
      .update({
        status: 'success',
        finished_at: new Date().toISOString(),
        log_json: { skipped: true, reason: 'pipeline_disabled' },
      })
      .eq('id', run.id)

    return jsonResponse({ ok: true, skipped: true, runId: run.id })
  }

  const sourcesQuery = supabase
    .from('news_sources')
    .select('id, name, source_type, feed_url, homepage_url, default_category, fetch_limit, is_active')
    .eq('is_active', true)
    .order('priority', { ascending: false })

  const { data: sourceRows, error: sourceError } = sourceId
    ? await sourcesQuery.eq('id', sourceId)
    : await sourcesQuery

  if (sourceError) {
    await supabase
      .from('news_ingest_runs')
      .update({
        status: 'failed',
        finished_at: new Date().toISOString(),
        error_count: 1,
        log_json: { error: sourceError.message },
      })
      .eq('id', run.id)

    return jsonResponse({ error: sourceError.message }, 500)
  }

  const sources = Array.isArray(sourceRows) ? sourceRows : []
  let fetchedCount = 0
  let insertedCount = 0
  let duplicateCount = 0
  let errorCount = 0
  const runLog: Record<string, unknown>[] = []
  let aiUsed = 0

  for (const source of sources) {
    const logEntry: Record<string, unknown> = {
      sourceId: source.id,
      sourceName: source.name,
      fetched: 0,
      inserted: 0,
      duplicates: 0,
      errors: [],
    }

    try {
      const items = await fetchSourceItems(source)
      const maxItems = Number.isFinite(requestedMaxItems)
        ? Math.min(Math.max(requestedMaxItems, 1), 50)
        : Math.min(source.fetch_limit || settings.max_items_per_source || 10, settings.max_items_per_source || 10)

      const slicedItems = items.slice(0, maxItems)
      logEntry.fetched = slicedItems.length
      fetchedCount += slicedItems.length

      for (const item of slicedItems) {
        const normalized = normalizeFeedItem(item, source)
        const uniqueHash = await createUniqueHash({
          title: normalized.title,
          sourceDomain: normalized.sourceDomain,
          publishedAt: normalized.publishedAt,
        })

        const duplicateChecks = await Promise.all([
          supabase.from('news_raw_items').select('id').eq('canonical_url', normalized.canonicalUrl).limit(1).maybeSingle(),
          supabase.from('news_raw_items').select('id').eq('unique_hash', uniqueHash).limit(1).maybeSingle(),
        ])

        const hasDuplicate = Boolean(duplicateChecks[0].data || duplicateChecks[1].data)
        if (hasDuplicate) {
          duplicateCount += 1
          logEntry.duplicates = Number(logEntry.duplicates || 0) + 1
          continue
        }

        const rawInsert = await supabase
          .from('news_raw_items')
          .insert([
            {
              source_id: source.id,
              ingest_run_id: run.id,
              external_id: normalized.externalId,
              canonical_url: normalized.canonicalUrl,
              original_title: normalized.title,
              original_description: normalized.description,
              original_image_url: normalized.imageUrl || null,
              original_published_at: normalized.publishedAt,
              unique_hash: uniqueHash,
              raw_payload: normalized.rawPayload,
            },
          ])
          .select('id')
          .maybeSingle()

        if (rawInsert.error || !rawInsert.data) {
          throw new Error(rawInsert.error?.message || 'Failed to insert raw item')
        }

        const relevance = computeRelevance({
          category: normalized.category,
          title: normalized.title,
          description: normalized.description,
          sourceName: normalized.sourceName,
          publishedAt: normalized.publishedAt,
        })

        let title = normalized.title
        let summary = normalized.description.slice(0, 260)
        let category = normalized.category
        let whatsappShareText = ''
        let aiModel: string | null = null
        let aiGeneratedFields: Record<string, unknown> = {}

        if (settings.ai_enabled && aiUsed < (settings.ai_daily_limit || 0)) {
          const geminiDraft = await generateGeminiDraft({
            apiKey: normalizeSecret(Deno.env.get('GEMINI_API_KEY')),
            item: normalized,
          })
          if (geminiDraft) {
            title = geminiDraft.title_tr || title
            summary = geminiDraft.summary_tr || summary
            category = geminiDraft.category || category
            whatsappShareText = geminiDraft.whatsapp_share_text || whatsappShareText
            aiGeneratedFields = geminiDraft as unknown as Record<string, unknown>
            aiModel = 'gemini-2.0-flash'
            aiUsed += 1
          }
        }

        const slugBase = title
          .toLocaleLowerCase('tr-TR')
          .replace(/[çğıöşü]/g, (char) => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' }[char] || char))
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          || 'haber'

        const postInsert = await supabase
          .from('news_posts')
          .insert([
            {
              raw_item_id: rawInsert.data.id,
              slug: `${slugBase}--${rawInsert.data.id}`,
              title,
              category,
              summary: summary || null,
              content: null,
              cover_image_url: normalized.imageUrl || null,
              cover_image_alt: title,
              source_name: normalized.sourceName,
              source_url: normalized.canonicalUrl,
              source_published_at: normalized.publishedAt,
              status: settings.auto_create_pending_review ? 'pending_review' : 'draft',
              is_featured: false,
              featured_rank: null,
              reading_minutes: 3,
              whatsapp_share_text: whatsappShareText || null,
              relevance_score: relevance.score,
              relevance_reason: relevance.reason,
              ai_model: aiModel,
              ai_generated_fields: aiGeneratedFields,
              reviewed_at: null,
              reviewed_by: null,
              show_in_carousel: false,
            },
          ])
          .select('id')
          .maybeSingle()

        if (postInsert.error || !postInsert.data) {
          throw new Error(postInsert.error?.message || 'Failed to insert post')
        }

        await supabase.from('news_editor_actions').insert([
          {
            post_id: postInsert.data.id,
            actor_user_id: 'pipeline',
            action_type: 'create',
            metadata: {
              sourceId: source.id,
              ingestRunId: run.id,
              autoStatus: settings.auto_create_pending_review ? 'pending_review' : 'draft',
            },
          },
        ])

        insertedCount += 1
        logEntry.inserted = Number(logEntry.inserted || 0) + 1
      }

      await supabase
        .from('news_sources')
        .update({
          last_fetched_at: new Date().toISOString(),
          last_success_at: new Date().toISOString(),
          last_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', source.id)
    } catch (error) {
      errorCount += 1
      const message = (error as Error).message || 'Unknown source error'
      ;(logEntry.errors as string[]).push(message)
      await supabase
        .from('news_sources')
        .update({
          last_fetched_at: new Date().toISOString(),
          last_error: message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', source.id)
    }

    runLog.push(logEntry)
  }

  const finalStatus = errorCount > 0 && insertedCount > 0
    ? 'partial'
    : errorCount > 0
      ? 'failed'
      : 'success'

  await supabase
    .from('news_ingest_runs')
    .update({
      status: finalStatus,
      finished_at: new Date().toISOString(),
      source_count: sources.length,
      fetched_count: fetchedCount,
      inserted_count: insertedCount,
      duplicate_count: duplicateCount,
      error_count: errorCount,
      log_json: {
        sources: runLog,
        aiUsed,
      },
    })
    .eq('id', run.id)

  return jsonResponse({
    ok: true,
    runId: run.id,
    status: finalStatus,
    sourceCount: sources.length,
    fetchedCount,
    insertedCount,
    duplicateCount,
    errorCount,
  })
})
