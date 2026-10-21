import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { parseRssItems } from './adapters/rss.ts'
import { parseMrssItems } from './adapters/mrss.ts'
import { parseAtomItems } from './adapters/atom.ts'
import { parseTrtHaberItems } from './adapters/trthaber.ts'
import { fetchTheNewsApiItems } from './adapters/thenewsapi.ts'
import { fetchGdeltItems, type GdeltConfig } from './adapters/gdelt.ts'
import { createUniqueHash } from './dedupe.ts'
import { generateGeminiDraft } from './gemini.ts'
import { decideLanguage, normalizeAllowedLanguages } from './language.ts'
import { normalizeFeedItem, type NewsSourceLike } from './normalize.ts'
import { computeRelevance } from './relevance.ts'
import { fetchWithValidatedRedirects } from './source-security.ts'

// CORS başlığı bilerek yok: fonksiyonu yalnızca sunucu tarafı çağırır (pg_cron + Next admin route'ları).
function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Sabit zamanlı karşılaştırma: secret'ın uzunluğu/içeriği yanıt süresinden çıkarılamasın. */
function secretsMatch(expected: string, provided: string): boolean {
  const encoder = new TextEncoder()
  const a = encoder.encode(expected)
  const b = encoder.encode(provided)
  let diff = a.length ^ b.length
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ (b[i] ?? 0)
  return diff === 0
}

function startOfUtcDayIso(): string {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString()
}

const GEMINI_MODEL = 'gemini-2.0-flash'

// news_posts_category_check ile aynı küme; Next tarafındaki karşılığı lib/news/shared.ts NEWS_CATEGORIES.
const NEWS_CATEGORIES = ['almanya', 'turkiye', 'avrupa', 'dunya', 'duyuru'] as const

/** AI'nın serbest metin kategorisini ("Türkiye", "politics") geçerli kümeye indirger; değilse null. */
function normalizeAiCategory(value: unknown): string | null {
  const ascii = String(value ?? '').trim().toLocaleLowerCase('tr-TR').replace(/ü/g, 'u').replace(/ı/g, 'i')
  return (NEWS_CATEGORIES as readonly string[]).includes(ascii) ? ascii : null
}

function normalizeSecret(value: string | null): string {
  return String(value || '').trim()
}

async function fetchSourceItems(
  source: NewsSourceLike & {
    source_type: string
    feed_url?: string | null
    fetch_limit?: number | null
    config?: Record<string, unknown> | null
  },
  maxItems: number
) {
  if (source.source_type === 'manual') return []

  // GDELT API key gerektirmez; endpoint feed_url'den (boşsa varsayılan) gelir.
  if (source.source_type === 'gdelt') {
    return fetchGdeltItems(
      String(source.feed_url || '').trim(),
      (source.config as GdeltConfig) || {},
      { maxItems, timeoutMs: 20000 }
    )
  }

  const feedUrl = String(source.feed_url || '').trim()
  if (!feedUrl) return []

  if (source.source_type === 'api') {
    return fetchTheNewsApiItems(feedUrl, normalizeSecret(Deno.env.get('THENEWSAPI_TOKEN')))
  }

  // RSS/MRSS/Atom: SSRF doğrulaması her yönlendirme adımında tekrarlanır.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)
  let response: Response
  try {
    response = await fetchWithValidatedRedirects(feedUrl, {
      signal: controller.signal,
      headers: { 'user-agent': 'almanya101-news-ingest/1.0' },
    })
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    throw new Error(`Source fetch failed (${response.status})`)
  }

  const xml = await response.text()
  if (source.source_type === 'atom') return parseAtomItems(xml)
  if (source.source_type === 'trthaber') return parseTrtHaberItems(xml)
  return source.source_type === 'mrss' ? parseMrssItems(xml) : parseRssItems(xml)
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = normalizeSecret(Deno.env.get('SUPABASE_URL'))
  const supabaseServiceRoleKey = normalizeSecret(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return jsonResponse({ error: 'Service not configured' }, 503)
  }

  // Secret tanımlı değilse fonksiyon herkese açık kalmasın diye istek reddedilir (fail closed).
  const requiredSecret = normalizeSecret(Deno.env.get('NEWS_PIPELINE_SECRET'))
  if (!requiredSecret) {
    return jsonResponse({ error: 'Pipeline secret not configured' }, 503)
  }
  const providedSecret = normalizeSecret(req.headers.get('x-pipeline-secret'))
  if (!secretsMatch(requiredSecret, providedSecret)) {
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
    .select('pipeline_enabled, ai_enabled, ai_daily_limit, max_items_per_source, auto_create_pending_review, excluded_keywords, high_priority_keywords, allowed_languages')
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
    excluded_keywords: [] as string[],
    high_priority_keywords: [] as string[],
    allowed_languages: null as string[] | null,
  }
  const allowedLanguages = normalizeAllowedLanguages(settings.allowed_languages)

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
    .select('id, name, source_type, feed_url, homepage_url, default_category, language_code, fetch_limit, is_active, config')
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
  let skippedLanguageCount = 0
  let errorCount = 0
  const runLog: Record<string, unknown>[] = []
  let aiUsed = 0

  // ai_daily_limit gerçek günlük bütçedir: bugün (UTC) önceki çalışmalarda kullanılan çağrılar düşülür.
  // Sayılamazsa AI bu çalışmada atlanır (limit aşımını önlemek için temkinli taraf).
  const { data: todayRuns, error: todayRunsError } = await supabase
    .from('news_ingest_runs')
    .select('log_json')
    .gte('started_at', startOfUtcDayIso())
    .neq('id', run.id)
  const aiUsedEarlierToday = (todayRuns ?? []).reduce(
    (sum: number, row: { log_json?: Record<string, unknown> | null }) => sum + (Number(row.log_json?.aiUsed) || 0),
    0
  )
  const aiBudget = todayRunsError ? 0 : Math.max((settings.ai_daily_limit || 0) - aiUsedEarlierToday, 0)
  const geminiApiKey = normalizeSecret(Deno.env.get('GEMINI_API_KEY'))

  let sourceIndex = 0
  for (const source of sources) {
    // Kaynaklar arası küçük gecikme: paylaşılan egress IP'sinde rate-limit (429)
    // riskini azaltır. İlk kaynaktan önce beklemeye gerek yok.
    if (sourceIndex > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
    sourceIndex += 1

    const logEntry: Record<string, unknown> = {
      sourceId: source.id,
      sourceName: source.name,
      fetched: 0,
      inserted: 0,
      duplicates: 0,
      skippedLanguage: 0,
      errors: [],
    }

    try {
      const maxItems = Number.isFinite(requestedMaxItems)
        ? Math.min(Math.max(requestedMaxItems, 1), 50)
        : Math.min(source.fetch_limit || settings.max_items_per_source || 10, settings.max_items_per_source || 10)

      const items = await fetchSourceItems(source, maxItems)
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

        const payloadLanguage = (normalized.rawPayload as Record<string, unknown> | null)?.language
        const languageDecision = decideLanguage({
          title: normalized.title,
          description: normalized.description,
          sourceLanguage: source.language_code,
          itemLanguage: typeof payloadLanguage === 'string' ? payloadLanguage : null,
          allowedLanguages,
        })

        const duplicateChecks = await Promise.all([
          supabase.from('news_raw_items').select('id, filtered_reason').eq('canonical_url', normalized.canonicalUrl).limit(1).maybeSingle(),
          supabase.from('news_raw_items').select('id, filtered_reason').eq('unique_hash', uniqueHash).limit(1).maybeSingle(),
        ])

        const existingRows = [duplicateChecks[0].data, duplicateChecks[1].data].filter(
          (row): row is { id: string; filtered_reason: string | null } => Boolean(row)
        )
        // Daha önce yalnızca dil nedeniyle elenmiş öğe, kural/ayar değiştiyse yeniden işlenir.
        const canRetryFiltered = existingRows.length > 0
          && languageDecision.allowed
          && existingRows.every((row) => row.filtered_reason === 'language')

        if (existingRows.length > 0 && !canRetryFiltered) {
          duplicateCount += 1
          logEntry.duplicates = Number(logEntry.duplicates || 0) + 1
          continue
        }

        if (canRetryFiltered) {
          const { error: deleteError } = await supabase
            .from('news_raw_items')
            .delete()
            .in('id', [...new Set(existingRows.map((row) => row.id))])
          if (deleteError) throw new Error(`Elenmiş öğe yeniden işlenemedi: ${deleteError.message}`)
        }

        if (!languageDecision.allowed) {
          // Ham kayıt olarak saklanır ki sonraki çalışmalarda dedupe ile tekrar işlenmesin.
          // Kayıt başarısız olursa öğe bir sonraki çalışmada yeniden elenir; kaynak hataya düşmez.
          const { error: filteredInsertError } = await supabase.from('news_raw_items').insert([
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
              language_code: languageDecision.language,
              filtered_reason: 'language',
            },
          ])
          if (filteredInsertError) {
            ;(logEntry.errors as string[]).push(`Elenen öğe kaydedilemedi: ${filteredInsertError.message}`)
          }
          skippedLanguageCount += 1
          logEntry.skippedLanguage = Number(logEntry.skippedLanguage || 0) + 1
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
              language_code: languageDecision.language,
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
          excludedKeywords: Array.isArray(settings.excluded_keywords) ? settings.excluded_keywords : [],
          highPriorityKeywords: Array.isArray(settings.high_priority_keywords) ? settings.high_priority_keywords : [],
        })

        let title = normalized.title
        let summary = normalized.description.slice(0, 260)
        let category = normalized.category
        let whatsappShareText = ''
        let aiModel: string | null = null
        let aiGeneratedFields: Record<string, unknown> = {}

        if (settings.ai_enabled && geminiApiKey && aiUsed < aiBudget) {
          // Deneme başarısız olsa da kotadan sayılır ve hemen kaydedilir: yarıda kesilen veya eşzamanlı
          // çalışmalar da bütçeyi görsün. Gemini hatası kaynağı düşürmez, öğe AI'sız kaydedilir.
          aiUsed += 1
          await supabase.from('news_ingest_runs').update({ log_json: { aiUsed } }).eq('id', run.id)
          try {
            const geminiDraft = await generateGeminiDraft({ apiKey: geminiApiKey, item: normalized })
            if (geminiDraft) {
              title = geminiDraft.title_tr || title
              summary = geminiDraft.summary_tr || summary
              category = normalizeAiCategory(geminiDraft.category) ?? category
              whatsappShareText = geminiDraft.whatsapp_share_text || whatsappShareText
              aiGeneratedFields = geminiDraft as unknown as Record<string, unknown>
              aiModel = GEMINI_MODEL
            }
          } catch (geminiError) {
            ;(logEntry.errors as string[]).push(`Gemini: ${(geminiError as Error).message || 'unknown error'}`)
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
              language_code: languageDecision.language,
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
          // Ham kayıt işaretlenir (silinmez): kalıcı bir hatada her çalışmada yeniden denenip AI bütçesi
          // harcanmasın. Hata loglanır ve kaynağın kalan öğeleriyle devam edilir.
          const message = postInsert.error?.message || 'Failed to insert post'
          await supabase.from('news_raw_items').update({ filtered_reason: 'post_insert_failed' }).eq('id', rawInsert.data.id)
          ;(logEntry.errors as string[]).push(`Haber kaydedilemedi (${normalized.canonicalUrl}): ${message}`)
          errorCount += 1
          continue
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
        aiUsedEarlierToday,
        skippedLanguage: skippedLanguageCount,
        allowedLanguages,
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
    skippedLanguageCount,
    errorCount,
  })
})
