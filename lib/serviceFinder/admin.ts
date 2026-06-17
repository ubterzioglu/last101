import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Service Finder admin yardımcıları. lib/news/admin.ts:getNewsServiceClient deseniyle aynı.

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

export function getServiceFinderClient(): SupabaseClient {
  const supabaseUrl = normalizeEnvValue(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY
  );
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Service not configured');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface ServiceFinderJobRecord {
  id: string;
  title: string;
  status: string;
  provider_type: string;
  category_group: string;
  location_label: string;
  city: string | null;
  country_code: string | null;
  max_candidates: number;
  cost_total_usd: number;
  soft_cap_usd: number;
  hard_cap_usd: number;
  search_requests: number;
  extract_requests: number;
  classify_requests: number;
  attempts: number;
  last_error_message: string | null;
  result_summary: Record<string, unknown>;
  progress: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  finished_at: string | null;
}

export interface ServiceFinderCandidateRecord {
  id: string;
  job_id: string;
  canonical_name: string;
  profession_label: string | null;
  organization_name: string | null;
  provider_type: string;
  category_group: string;
  city: string | null;
  country_code: string | null;
  languages: string[];
  services: string[];
  contacts: Array<{ type: string; value: string; label?: string | null; is_primary?: boolean | null }>;
  website_url: string | null;
  appointment_url: string | null;
  source_urls: unknown;
  evidence: unknown;
  confidence_score: number;
  review_status: string;
  review_notes: string | null;
  provider_id: string | null;
  created_at: string;
}

export const SERVICE_FINDER_JOB_SELECT = `
  id, title, status, provider_type, category_group, location_label, city, country_code,
  max_candidates, cost_total_usd, soft_cap_usd, hard_cap_usd,
  search_requests, extract_requests, classify_requests, attempts,
  last_error_message, result_summary, progress, created_at, updated_at, finished_at
`;

export const SERVICE_FINDER_CANDIDATE_SELECT = `
  id, job_id, canonical_name, profession_label, organization_name, provider_type, category_group,
  city, country_code, languages, services, contacts, website_url, appointment_url,
  source_urls, evidence, confidence_score, review_status, review_notes, provider_id, created_at
`;

function normalizeStr(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max);
}

function normalizeInt(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

function normalizeNum(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number.parseFloat(String(value ?? ''));
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

/** Admin'in oluşturduğu yeni iş için DB payload (template seçimi + lokasyon). */
export function buildJobPayload(body: Record<string, unknown>, template: Record<string, unknown> | null) {
  const providerType = normalizeStr(body.provider_type ?? template?.provider_type, 60);
  const locationLabel = normalizeStr(body.location_label ?? body.city, 160);
  const city = normalizeStr(body.city, 120) || null;

  return {
    title: normalizeStr(body.title, 200) || `${providerType} • ${locationLabel}`,
    status: 'queued',
    template_id: (body.template_id ? String(body.template_id) : null) as string | null,
    provider_type: providerType,
    category_group: normalizeStr(body.category_group ?? template?.category_group ?? 'services', 20) || 'services',
    location_label: locationLabel,
    country_code: normalizeStr(body.country_code, 4) || 'DE',
    region: normalizeStr(body.region, 120) || null,
    city,
    language_code: normalizeStr(body.language_code, 8) || 'tr',
    freeform_topic: normalizeStr(body.freeform_topic, 240) || null,
    max_queries: normalizeInt(body.max_queries ?? template?.default_max_queries, 1, 30, 8),
    max_source_urls: normalizeInt(body.max_source_urls ?? template?.default_max_source_urls, 1, 80, 24),
    max_extract_urls: normalizeInt(body.max_extract_urls ?? template?.default_max_extract_urls, 1, 50, 15),
    max_candidates: normalizeInt(body.max_candidates, 1, 200, 50),
    soft_cap_usd: normalizeNum(body.soft_cap_usd, 0.1, 50, 2.0),
    hard_cap_usd: normalizeNum(body.hard_cap_usd, 0.1, 100, 4.0),
  };
}

/** Onaylanan adaydan public providers payload'u (Faz 1 birleşik şema). */
export function buildProviderPayloadFromCandidate(candidate: ServiceFinderCandidateRecord) {
  const phone = candidate.contacts?.find((c) => c.type === 'phone')?.value ?? null;
  const email = candidate.contacts?.find((c) => c.type === 'email')?.value ?? null;
  const notesParts: string[] = ['Service Finder taramasıyla eklendi.'];
  if (candidate.profession_label) notesParts.push(candidate.profession_label);
  if (candidate.services?.length) notesParts.push(`Hizmetler: ${candidate.services.join(', ')}.`);

  return {
    type: candidate.provider_type,
    display_name: candidate.canonical_name,
    city: candidate.city ?? '',
    phone,
    email,
    website: candidate.website_url,
    appointment_url: candidate.appointment_url,
    notes_public: notesParts.join(' '),
    languages: candidate.languages ?? [],
    services: candidate.services ?? [],
    country_code: candidate.country_code ?? 'DE',
    relevance_score: candidate.confidence_score,
    source: 'scraper',
    status: 'active',
  };
}
