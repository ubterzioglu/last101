// Service Finder Edge Function — TEK-SEFER job çalıştırıcı (uzun-ömürlü worker DEĞİL).
// Her çağrıda kuyruktan 1 iş claim eder, search→extract→classify yapar, işi review'a alır.
// Auth: x-pipeline-secret (news-ingest deseni). Tüm DB erişimi service-role ile.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import {
  appendEvent,
  claimOneJob,
  completeJob,
  countCandidates,
  createDb,
  heartbeat,
  insertDiscoveredSources,
  insertQuery,
  loadProviderConfigs,
  loadSourcesByStatus,
  loadTemplate,
  recordCost,
  updateSource,
  upsertCandidate,
  type CostTotals,
  type Db,
} from './db.ts'
import { extractDomain, makeDuplicateKey, normalizeUrl } from './dedupe.ts'
import { AuthOrConfigError, BudgetExceededError, errorCode, errorMessage, isRetryable } from './errors.ts'
import { buildClassifierUserPrompt, CLASSIFIER_SYSTEM_PROMPT } from './prompts.ts'
import { geminiClassify, serpApiSearch, tavilyExtract, tavilySearch } from './providers.ts'
import { buildQueries } from './queries.ts'
import { isRobotsAllowed } from './robots.ts'
import { candidateResultSchema, type ProviderConfig, type ServiceFinderJob } from './schemas.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-pipeline-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SOFT_DEGRADE_MODEL = 'gemini-2.5-flash-lite'
const MIN_CONFIDENCE_TO_KEEP = 30
const EXTRACT_BATCH_SIZE = 5

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
}

function normalizeSecret(value: string | null): string {
  return String(value || '').trim()
}

function resolveSecret(secretRef: string): string {
  const value = Deno.env.get(secretRef)
  if (!value) throw new AuthOrConfigError(`Sağlayıcı anahtarı bulunamadı: env ${secretRef} tanımlı değil`)
  return value
}

interface JobRuntime {
  db: Db
  workerId: string
  job: ServiceFinderJob
  providers: Map<string, ProviderConfig>
  softCapHit: boolean
}

function providerByKey(runtime: JobRuntime, key: string): ProviderConfig | null {
  return runtime.providers.get(key) ?? null
}

function applyTotals(runtime: JobRuntime, totals: CostTotals): void {
  if (totals.hard_cap_exceeded) {
    throw new BudgetExceededError(`Hard cap aşıldı: $${totals.cost_total_usd} / $${totals.hard_cap_usd}`)
  }
  if (totals.soft_cap_exceeded && !runtime.softCapHit) {
    runtime.softCapHit = true
  }
}

async function ensureLease(runtime: JobRuntime, progress: Record<string, unknown>): Promise<void> {
  const alive = await heartbeat(runtime.db, runtime.job.id, runtime.workerId, progress)
  if (!alive) throw new Error('lease_lost')
}

// --- Aşama 1: Arama ---
async function runSearchStage(runtime: JobRuntime): Promise<void> {
  const { db, job } = runtime
  const template = await loadTemplate(db, job.template_id)
  const queries = buildQueries(job, template)

  const searchConfig = providerByKey(runtime, 'tavily')
  if (!searchConfig || !searchConfig.is_enabled) throw new AuthOrConfigError('Etkin arama sağlayıcısı yok (tavily)')
  const tavilyKey = resolveSecret(searchConfig.secret_ref)

  const serpapiConfig = providerByKey(runtime, 'serpapi')
  let discoveredTotal = 0
  let queryIndex = 0

  for (const queryText of queries) {
    queryIndex += 1
    await ensureLease(runtime, { stage: 'search', query: queryIndex, of: queries.length })

    const requestDefaults = searchConfig.request_defaults ?? {}
    const depth: 'basic' | 'advanced' = runtime.softCapHit
      ? 'basic'
      : (typeof requestDefaults['search_depth'] === 'string' ? (requestDefaults['search_depth'] as 'basic' | 'advanced') : 'basic')
    const maxResults = runtime.softCapHit ? Math.min(5, Number(requestDefaults['max_results'] ?? 8)) : Number(requestDefaults['max_results'] ?? 8)

    let searchOutput
    try {
      searchOutput = await tavilySearch(tavilyKey, {
        query: queryText,
        locationLabel: job.location_label,
        languageCode: job.language_code,
        maxResults,
        searchDepth: depth,
      })
    } catch (error: unknown) {
      await insertQuery(db, {
        job_id: job.id, stage: 'seed', provider_key: 'tavily', query_text: queryText,
        usage_units: 0, estimated_cost_usd: 0, result_count: 0, status: 'failed', executed_at: new Date().toISOString(),
      })
      if (error instanceof AuthOrConfigError || error instanceof BudgetExceededError) throw error
      await appendEvent(db, job.id, 'search_failed', errorMessage(error), { level: 'warn' })
      continue
    }

    const queryId = await insertQuery(db, {
      job_id: job.id, stage: 'seed', provider_key: 'tavily', query_text: queryText,
      external_request_id: searchOutput.requestId ?? null,
      usage_units: searchOutput.usage.units, estimated_cost_usd: searchOutput.usage.estimatedCostUsd,
      result_count: searchOutput.results.length, status: 'succeeded', executed_at: new Date().toISOString(),
    })

    const totals = await recordCost(db, {
      job_id: job.id, provider_key: 'tavily', provider_config_id: searchConfig.id, event_type: 'search',
      billing_unit: searchOutput.usage.billingUnit, quantity: searchOutput.usage.units,
      unit_cost_usd: searchOutput.usage.units > 0 ? searchOutput.usage.estimatedCostUsd / searchOutput.usage.units : 0,
      amount_usd: searchOutput.usage.estimatedCostUsd, query_id: queryId, request_meta: { query: queryText, depth },
    })
    applyTotals(runtime, totals)

    // Az sonuçta SerpAPI fallback (soft cap'te kapalı)
    if (!runtime.softCapHit && searchOutput.results.length < 3 && serpapiConfig?.is_enabled) {
      try {
        const serpOutput = await serpApiSearch(resolveSecret(serpapiConfig.secret_ref), {
          query: queryText, locationLabel: job.location_label, languageCode: job.language_code, maxResults,
        }, serpapiConfig.request_defaults)
        const serpQueryId = await insertQuery(db, {
          job_id: job.id, stage: 'expansion', provider_key: 'serpapi', query_text: queryText,
          external_request_id: serpOutput.requestId ?? null, usage_units: serpOutput.usage.units,
          estimated_cost_usd: serpOutput.usage.estimatedCostUsd, result_count: serpOutput.results.length,
          status: 'succeeded', executed_at: new Date().toISOString(),
        })
        const serpTotals = await recordCost(db, {
          job_id: job.id, provider_key: 'serpapi', provider_config_id: serpapiConfig.id, event_type: 'search',
          billing_unit: serpOutput.usage.billingUnit, quantity: serpOutput.usage.units,
          unit_cost_usd: serpOutput.usage.estimatedCostUsd, amount_usd: serpOutput.usage.estimatedCostUsd,
          query_id: serpQueryId, request_meta: { query: queryText, fallback: true },
        })
        applyTotals(runtime, serpTotals)
        searchOutput.results.push(...serpOutput.results)
      } catch (error: unknown) {
        if (error instanceof BudgetExceededError) throw error
        await appendEvent(db, job.id, 'serpapi_fallback_failed', errorMessage(error), { level: 'warn' })
      }
    }

    const remainingBudget = job.max_source_urls - discoveredTotal
    if (remainingBudget <= 0) break
    const sources = searchOutput.results
      .filter((result) => /^https?:\/\//i.test(result.url))
      .slice(0, remainingBudget)
      .map((result) => ({
        job_id: job.id, discovery_query_id: queryId, provider_key: 'tavily',
        source_url: result.url, normalized_url: normalizeUrl(result.url),
        source_domain: result.domain || extractDomain(result.url),
        source_title: result.title ?? null, source_snippet: result.snippet ?? null,
      }))
    discoveredTotal += await insertDiscoveredSources(db, sources)
  }

  // Seed URL'leri doğrudan ekstraksiyon kuyruğuna ekle.
  const validSeedUrls = (job.seed_urls ?? []).filter((url) => /^https?:\/\//i.test(url))
  if (validSeedUrls.length > 0) {
    await insertDiscoveredSources(db, validSeedUrls.map((url) => ({
      job_id: job.id, discovery_query_id: null, provider_key: 'manual',
      source_url: url, normalized_url: normalizeUrl(url), source_domain: extractDomain(url),
      source_title: null, source_snippet: null,
    })))
  }

  await appendEvent(db, job.id, 'search_stage_done', `${queryIndex} sorgu, ${discoveredTotal} kaynak keşfedildi.`)
}

// --- Aşama 2: Ekstraksiyon (robots zorunlu) ---
async function runExtractStage(runtime: JobRuntime): Promise<void> {
  const { db, job } = runtime
  const extractConfig = providerByKey(runtime, 'tavily')
  if (!extractConfig || !extractConfig.is_enabled) throw new AuthOrConfigError('Etkin ekstraksiyon sağlayıcısı yok')
  const tavilyKey = resolveSecret(extractConfig.secret_ref)
  const baseDepth = typeof extractConfig.request_defaults?.['extract_depth'] === 'string'
    ? (extractConfig.request_defaults['extract_depth'] as 'basic' | 'advanced') : 'basic'

  const sources = await loadSourcesByStatus(db, job.id, 'discovered', job.max_extract_urls)
  const allowed: typeof sources = []
  for (const source of sources) {
    const robotsAllowed = await isRobotsAllowed(source.source_url)
    await updateSource(db, source.id, {
      crawl_allowed: robotsAllowed,
      robots_evaluated_at: new Date().toISOString(),
      fetch_status: robotsAllowed ? 'queued' : 'blocked_robots',
    })
    if (robotsAllowed) allowed.push(source)
  }
  if (sources.length > allowed.length) {
    await appendEvent(db, job.id, 'robots_blocked', `${sources.length - allowed.length} kaynak robots.txt nedeniyle atlandı.`)
  }

  let fetchedCount = 0
  for (let offset = 0; offset < allowed.length; offset += EXTRACT_BATCH_SIZE) {
    await ensureLease(runtime, { stage: 'extract', fetched: fetchedCount, of: allowed.length })
    const depth: 'basic' | 'advanced' = runtime.softCapHit ? 'basic' : baseDepth
    const batch = allowed.slice(offset, offset + EXTRACT_BATCH_SIZE)

    let output
    try {
      output = await tavilyExtract(tavilyKey, batch.map((s) => s.source_url), depth)
    } catch (error: unknown) {
      if (error instanceof AuthOrConfigError || error instanceof BudgetExceededError) throw error
      for (const source of batch) await updateSource(db, source.id, { fetch_status: 'failed' })
      await appendEvent(db, job.id, 'extract_failed', errorMessage(error), { level: 'warn' })
      continue
    }

    const docsByUrl = new Map(output.docs.map((doc) => [normalizeUrl(doc.url), doc]))
    for (const source of batch) {
      const doc = docsByUrl.get(source.normalized_url) ?? docsByUrl.get(normalizeUrl(source.source_url))
      if (doc?.text) {
        await updateSource(db, source.id, { fetch_status: 'fetched', extracted_text: doc.text.slice(0, 60_000), fetched_at: new Date().toISOString() })
        fetchedCount += 1
      } else {
        await updateSource(db, source.id, { fetch_status: 'failed' })
      }
    }

    if (output.usage.estimatedCostUsd > 0) {
      const totals = await recordCost(db, {
        job_id: job.id, provider_key: 'tavily', provider_config_id: extractConfig.id, event_type: 'extract',
        billing_unit: output.usage.billingUnit, quantity: output.usage.units,
        unit_cost_usd: output.usage.units > 0 ? output.usage.estimatedCostUsd / output.usage.units : 0,
        amount_usd: output.usage.estimatedCostUsd, request_meta: { urls: batch.length, depth },
      })
      applyTotals(runtime, totals)
    }
  }
  await appendEvent(db, job.id, 'extract_stage_done', `${fetchedCount} kaynak içeriği alındı.`)
}

// --- Aşama 3: Sınıflandırma ---
async function runClassifyStage(runtime: JobRuntime): Promise<void> {
  const { db, job } = runtime
  const classifierConfig = providerByKey(runtime, 'gemini')
  if (!classifierConfig || !classifierConfig.is_enabled) throw new AuthOrConfigError('Etkin sınıflandırıcı yok (gemini)')
  const geminiKey = resolveSecret(classifierConfig.secret_ref)
  const baseModel = classifierConfig.default_model ?? SOFT_DEGRADE_MODEL

  const sources = await loadSourcesByStatus(db, job.id, 'fetched', job.max_extract_urls)
  let candidateCount = await countCandidates(db, job.id)
  let classified = 0

  for (const source of sources) {
    if (candidateCount >= job.max_candidates) break
    await ensureLease(runtime, { stage: 'classify', classified, of: sources.length })

    const model = runtime.softCapHit ? SOFT_DEGRADE_MODEL : baseModel
    let classification
    try {
      classification = await geminiClassify(geminiKey, CLASSIFIER_SYSTEM_PROMPT, buildClassifierUserPrompt(job, source), model)
    } catch (error: unknown) {
      if (error instanceof AuthOrConfigError || error instanceof BudgetExceededError) throw error
      await updateSource(db, source.id, { fetch_status: 'failed' })
      await appendEvent(db, job.id, 'classify_failed', errorMessage(error), { level: 'warn' })
      continue
    }

    const totals = await recordCost(db, {
      job_id: job.id, provider_key: 'gemini', provider_config_id: classifierConfig.id, event_type: 'classify',
      billing_unit: 'tokens', quantity: classification.usage.inputTokens + classification.usage.outputTokens,
      unit_cost_usd: 0, amount_usd: classification.usage.estimatedCostUsd, source_id: source.id,
      model_name: classification.usage.model,
      request_meta: { input_tokens: classification.usage.inputTokens, output_tokens: classification.usage.outputTokens },
    })

    const validation = candidateResultSchema.safeParse(classification.parsed)
    if (!validation.success) {
      await updateSource(db, source.id, { fetch_status: 'failed' })
      await appendEvent(db, job.id, 'classifier_validation_failed', validation.error.issues.map((i) => i.message).join('; ').slice(0, 500), { level: 'warn' })
      applyTotals(runtime, totals)
      continue
    }

    const parsed = validation.data
    classified += 1

    if (!parsed.is_match || !parsed.canonical_name || parsed.confidence_score < MIN_CONFIDENCE_TO_KEEP) {
      await updateSource(db, source.id, { fetch_status: 'irrelevant' })
      applyTotals(runtime, totals)
      continue
    }

    const candidateId = await upsertCandidate(db, job.id, source.id, makeDuplicateKey(parsed), parsed, job, classification.usage.model, source.source_url)
    if (candidateId) candidateCount += 1
    else await updateSource(db, source.id, { fetch_status: 'duplicate' })
    applyTotals(runtime, totals)
  }
  await appendEvent(db, job.id, 'classify_stage_done', `${classified} kaynak sınıflandırıldı; toplam ${candidateCount} aday.`)
}

async function processJob(db: Db, workerId: string, job: ServiceFinderJob): Promise<Record<string, unknown>> {
  const providerList = await loadProviderConfigs(db)
  const runtime: JobRuntime = {
    db, workerId, job,
    providers: new Map(providerList.map((c) => [c.provider_key, c])),
    softCapHit: Number(job.cost_total_usd) >= Number(job.soft_cap_usd),
  }

  try {
    await appendEvent(db, job.id, 'job_started', `Worker ${workerId} işi aldı (deneme ${job.attempts}).`)
    await runSearchStage(runtime)
    await runExtractStage(runtime)
    await runClassifyStage(runtime)

    const candidates = await countCandidates(db, job.id)
    await completeJob(db, job.id, 'review', { candidates, finished_by: workerId })
    await appendEvent(db, job.id, 'job_review_ready', `İş incelemeye hazır: ${candidates} aday.`)
    return { jobId: job.id, status: 'review', candidates }
  } catch (error: unknown) {
    if (error instanceof BudgetExceededError) {
      await completeJob(db, job.id, 'budget_stopped', { reason: error.message }, { code: 'budget_exceeded', message: error.message })
      await appendEvent(db, job.id, 'budget_stopped', error.message, { level: 'warn' })
      return { jobId: job.id, status: 'budget_stopped' }
    }
    if (error instanceof Error && error.message === 'lease_lost') {
      return { jobId: job.id, status: 'lease_lost' }
    }
    // Retryable hatalarda işi tekrar kuyruğa al (run_after ileri); değilse failed.
    const retryable = isRetryable(error)
    if (retryable) {
      await db
        .from('service_finder_jobs')
        .update({
          status: 'queued',
          locked_by: null,
          lease_expires_at: null,
          run_after: new Date(Date.now() + 60_000).toISOString(),
          last_error_code: errorCode(error),
          last_error_message: errorMessage(error),
          updated_at: new Date().toISOString(),
        })
        .eq('id', job.id)
      await appendEvent(db, job.id, 'job_requeued', errorMessage(error), { level: 'warn' })
      return { jobId: job.id, status: 'requeued', error: errorMessage(error) }
    }
    await completeJob(db, job.id, 'failed', { error: errorMessage(error) }, { code: errorCode(error), message: errorMessage(error) })
    await appendEvent(db, job.id, 'job_failed', errorMessage(error), { level: 'error' })
    return { jobId: job.id, status: 'failed', error: errorMessage(error) }
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  const supabaseUrl = normalizeSecret(Deno.env.get('SUPABASE_URL'))
  const serviceRoleKey = normalizeSecret(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
  if (!supabaseUrl || !serviceRoleKey) return jsonResponse({ error: 'Service not configured' }, 503)

  // Secret: SERVICE_FINDER_SECRET varsa onu, yoksa NEWS_PIPELINE_SECRET'i kullan (paylaşımlı).
  const requiredSecret = normalizeSecret(Deno.env.get('SERVICE_FINDER_SECRET')) || normalizeSecret(Deno.env.get('NEWS_PIPELINE_SECRET'))
  const providedSecret = normalizeSecret(req.headers.get('x-pipeline-secret'))
  if (requiredSecret && requiredSecret !== providedSecret) {
    return jsonResponse({ error: 'Invalid pipeline secret' }, 401)
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const jobId = body.jobId ? String(body.jobId) : undefined
  const workerId = `sf-edge-${Math.floor(Date.now() / 1000)}`

  const db = createDb(supabaseUrl, serviceRoleKey)

  let job
  try {
    job = await claimOneJob(db, workerId, jobId)
  } catch (error: unknown) {
    return jsonResponse({ error: errorMessage(error) }, 500)
  }

  if (!job) return jsonResponse({ ok: true, claimed: false, message: 'Çalıştırılacak iş yok' })

  const result = await processJob(db, workerId, job)
  return jsonResponse({ ok: true, claimed: true, ...result })
})
