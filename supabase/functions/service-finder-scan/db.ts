// DB katmanı: corteqs'in worker_* RPC'leri yerine doğrudan service-role tablo işlemleri.
// Tek Edge Function eşzamanlılığı düşük olduğundan basit run_after + status claim yeterli.
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import type {
  CandidateResult,
  JobSourceRow,
  ProfessionTemplate,
  ProviderConfig,
  ServiceFinderJob,
} from './schemas.ts'

export type Db = SupabaseClient

export function createDb(supabaseUrl: string, serviceRoleKey: string): Db {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

const LEASE_MS = 5 * 60 * 1000

/** Kuyruktan tek iş claim et: queued+run_after<=now VEYA running+lease süresi dolmuş. */
export async function claimOneJob(db: Db, workerId: string, jobId?: string): Promise<ServiceFinderJob | null> {
  const nowIso = new Date().toISOString()
  const leaseIso = new Date(Date.now() + LEASE_MS).toISOString()

  let candidateQuery = db
    .from('service_finder_jobs')
    .select('id')
    .or(`and(status.eq.queued,run_after.lte.${nowIso}),and(status.eq.running,lease_expires_at.lt.${nowIso})`)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)

  if (jobId) candidateQuery = db.from('service_finder_jobs').select('id').eq('id', jobId).limit(1)

  const { data: rows, error } = await candidateQuery
  if (error) throw new Error(`claimOneJob select: ${error.message}`)
  const target = rows?.[0]
  if (!target) return null

  // Atomik claim: yalnızca hâlâ claim edilebilir durumdaysa güncelle.
  const { data: claimed, error: claimError } = await db
    .from('service_finder_jobs')
    .update({
      status: 'running',
      locked_by: workerId,
      lease_expires_at: leaseIso,
      started_at: nowIso,
      updated_at: nowIso,
    })
    .eq('id', target.id)
    .in('status', ['queued', 'running'])
    .select('*')
    .maybeSingle()

  if (claimError) throw new Error(`claimOneJob update: ${claimError.message}`)
  if (!claimed) return null

  // attempts ayrı artır (update içinde kendine referans veremiyoruz).
  await db
    .from('service_finder_jobs')
    .update({ attempts: (claimed.attempts ?? 0) + 1 })
    .eq('id', claimed.id)

  return claimed as ServiceFinderJob
}

export async function heartbeat(db: Db, jobId: string, workerId: string, progress: Record<string, unknown>): Promise<boolean> {
  const { data, error } = await db
    .from('service_finder_jobs')
    .update({ lease_expires_at: new Date(Date.now() + LEASE_MS).toISOString(), progress, updated_at: new Date().toISOString() })
    .eq('id', jobId)
    .eq('locked_by', workerId)
    .eq('status', 'running')
    .select('id')
    .maybeSingle()
  if (error) return false
  return Boolean(data)
}

export async function appendEvent(
  db: Db,
  jobId: string,
  eventType: string,
  message: string,
  options: { level?: string; candidateId?: string; payload?: Record<string, unknown> } = {}
): Promise<void> {
  const { error } = await db.from('service_finder_job_events').insert({
    job_id: jobId,
    candidate_id: options.candidateId ?? null,
    event_type: eventType,
    event_level: options.level ?? 'info',
    message,
    event_payload: options.payload ?? {},
  })
  if (error) console.error(`appendEvent başarısız (${eventType}): ${error.message}`)
}

export interface CostTotals {
  cost_total_usd: number
  soft_cap_usd: number
  hard_cap_usd: number
  soft_cap_exceeded: boolean
  hard_cap_exceeded: boolean
}

export async function recordCost(
  db: Db,
  payload: {
    job_id: string
    provider_key: string
    provider_config_id?: string | null
    event_type: 'search' | 'extract' | 'classify' | 'manual_adjustment'
    billing_unit: string
    quantity: number
    unit_cost_usd: number
    amount_usd: number
    model_name?: string | null
    query_id?: string | null
    source_id?: string | null
    candidate_id?: string | null
    request_meta?: Record<string, unknown>
  }
): Promise<CostTotals> {
  await db.from('service_finder_cost_ledger').insert({
    job_id: payload.job_id,
    query_id: payload.query_id ?? null,
    source_id: payload.source_id ?? null,
    candidate_id: payload.candidate_id ?? null,
    provider_config_id: payload.provider_config_id ?? null,
    provider_key: payload.provider_key,
    event_type: payload.event_type,
    billing_unit: payload.billing_unit,
    quantity: payload.quantity,
    unit_cost_usd: payload.unit_cost_usd,
    amount_usd: payload.amount_usd,
    model_name: payload.model_name ?? null,
    request_meta: payload.request_meta ?? {},
  })

  // İş toplamını oku-güncelle (düşük eşzamanlılık; atomik RPC gerekmez).
  const { data: job, error } = await db
    .from('service_finder_jobs')
    .select('cost_total_usd, soft_cap_usd, hard_cap_usd, search_requests, extract_requests, classify_requests')
    .eq('id', payload.job_id)
    .single()
  if (error || !job) throw new Error(`recordCost job okunamadı: ${error?.message}`)

  const newTotal = Number(job.cost_total_usd) + Number(payload.amount_usd)
  await db
    .from('service_finder_jobs')
    .update({
      cost_total_usd: newTotal,
      search_requests: job.search_requests + (payload.event_type === 'search' ? 1 : 0),
      extract_requests: job.extract_requests + (payload.event_type === 'extract' ? 1 : 0),
      classify_requests: job.classify_requests + (payload.event_type === 'classify' ? 1 : 0),
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.job_id)

  if (payload.candidate_id) {
    const { data: cand } = await db
      .from('service_finder_candidates')
      .select('cost_total_usd')
      .eq('id', payload.candidate_id)
      .maybeSingle()
    if (cand) {
      await db
        .from('service_finder_candidates')
        .update({ cost_total_usd: Number(cand.cost_total_usd) + Number(payload.amount_usd) })
        .eq('id', payload.candidate_id)
    }
  }

  const soft = Number(job.soft_cap_usd)
  const hard = Number(job.hard_cap_usd)
  return {
    cost_total_usd: newTotal,
    soft_cap_usd: soft,
    hard_cap_usd: hard,
    soft_cap_exceeded: newTotal >= soft,
    hard_cap_exceeded: newTotal >= hard,
  }
}

export async function completeJob(
  db: Db,
  jobId: string,
  status: 'review' | 'completed' | 'budget_stopped' | 'failed',
  resultSummary: Record<string, unknown>,
  errorInfo?: { code: string; message: string }
): Promise<void> {
  await db
    .from('service_finder_jobs')
    .update({
      status,
      finished_at: new Date().toISOString(),
      result_summary: resultSummary,
      last_error_code: errorInfo?.code ?? null,
      last_error_message: errorInfo?.message ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)
}

export async function loadProviderConfigs(db: Db): Promise<ProviderConfig[]> {
  const { data, error } = await db.from('service_finder_provider_configs').select('*')
  if (error) throw new Error(`loadProviderConfigs: ${error.message}`)
  return (data ?? []) as ProviderConfig[]
}

export async function loadTemplate(db: Db, templateId: string | null): Promise<ProfessionTemplate | null> {
  if (!templateId) return null
  const { data, error } = await db
    .from('service_finder_profession_templates')
    .select('*')
    .eq('id', templateId)
    .maybeSingle()
  if (error) throw new Error(`loadTemplate: ${error.message}`)
  return (data as ProfessionTemplate | null) ?? null
}

export interface QueryRecord {
  job_id: string
  stage: 'seed' | 'expansion' | 'retry'
  provider_key: string
  query_text: string
  external_request_id?: string | null
  usage_units: number
  estimated_cost_usd: number
  result_count: number
  status: 'pending' | 'succeeded' | 'failed' | 'skipped'
  executed_at?: string
}

export async function insertQuery(db: Db, record: QueryRecord): Promise<string> {
  const { data, error } = await db
    .from('service_finder_job_queries')
    .upsert(record, { onConflict: 'job_id,stage,query_text' })
    .select('id')
    .single()
  if (error) throw new Error(`insertQuery: ${error.message}`)
  return data.id as string
}

export interface DiscoveredSource {
  job_id: string
  discovery_query_id: string | null
  provider_key: string
  source_url: string
  normalized_url: string
  source_domain: string
  source_title?: string | null
  source_snippet?: string | null
}

export async function insertDiscoveredSources(db: Db, sources: DiscoveredSource[]): Promise<number> {
  if (sources.length === 0) return 0
  const { data, error } = await db
    .from('service_finder_job_sources')
    .upsert(sources, { onConflict: 'job_id,normalized_url', ignoreDuplicates: true })
    .select('id')
  if (error) throw new Error(`insertDiscoveredSources: ${error.message}`)
  return (data ?? []).length
}

export async function loadSourcesByStatus(
  db: Db,
  jobId: string,
  fetchStatus: string,
  limit: number
): Promise<JobSourceRow[]> {
  const { data, error } = await db
    .from('service_finder_job_sources')
    .select('id, job_id, source_url, normalized_url, source_domain, source_title, source_snippet, fetch_status, extracted_text')
    .eq('job_id', jobId)
    .eq('fetch_status', fetchStatus)
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) throw new Error(`loadSourcesByStatus: ${error.message}`)
  return (data ?? []) as JobSourceRow[]
}

export async function updateSource(db: Db, sourceId: string, patch: Record<string, unknown>): Promise<void> {
  const { error } = await db.from('service_finder_job_sources').update(patch).eq('id', sourceId)
  if (error) throw new Error(`updateSource: ${error.message}`)
}

export async function countCandidates(db: Db, jobId: string): Promise<number> {
  const { count, error } = await db
    .from('service_finder_candidates')
    .select('id', { count: 'exact', head: true })
    .eq('job_id', jobId)
  if (error) throw new Error(`countCandidates: ${error.message}`)
  return count ?? 0
}

export async function upsertCandidate(
  db: Db,
  jobId: string,
  sourceId: string,
  duplicateKey: string,
  parsed: CandidateResult,
  job: ServiceFinderJob,
  classifierModel: string,
  sourceUrl: string
): Promise<string | null> {
  const row = {
    job_id: jobId,
    primary_source_id: sourceId,
    canonical_name: parsed.canonical_name ?? 'İsimsiz kayıt',
    profession_label: parsed.profession_label,
    organization_name: parsed.organization_name,
    provider_type: parsed.provider_type ?? job.provider_type,
    category_group: job.category_group,
    country_code: parsed.country_code ?? job.country_code,
    region: job.region,
    city: parsed.city ?? job.city,
    languages: parsed.languages,
    services: parsed.services,
    contacts: parsed.contacts,
    website_url: parsed.website_url,
    appointment_url: parsed.appointment_url,
    source_urls: [sourceUrl],
    evidence: parsed.evidence_quotes.map((quote) => ({ quote, source_url: sourceUrl })),
    normalized_payload: parsed,
    duplicate_key: duplicateKey,
    confidence_score: parsed.confidence_score,
    classifier_model: classifierModel,
    updated_at: new Date().toISOString(),
  }
  const { data, error } = await db
    .from('service_finder_candidates')
    .upsert(row, { onConflict: 'job_id,duplicate_key', ignoreDuplicates: true })
    .select('id')
    .maybeSingle()
  if (error) throw new Error(`upsertCandidate: ${error.message}`)
  return (data?.id as string | undefined) ?? null
}
