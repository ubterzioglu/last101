// Sınıflandırıcı çıktısının Zod doğrulaması + iş/aday tipleri.
// corteqs service-finder/src/schemas.ts'ten port (Deno zod import).
import { z } from 'https://esm.sh/zod@3.23.8'

export const contactSchema = z.object({
  type: z.enum(['phone', 'email', 'website', 'appointment_url']),
  value: z.string().min(1),
  label: z.string().nullable().optional(),
  is_primary: z.boolean().nullable().optional(),
})

export const candidateResultSchema = z.object({
  is_match: z.boolean(),
  match_reason: z.string(),
  confidence_score: z.number().min(0).max(100),
  canonical_name: z.string().nullable(),
  organization_name: z.string().nullable(),
  profession_label: z.string().nullable(),
  provider_type: z.string().nullable(),
  city: z.string().nullable(),
  country_code: z.string().nullable(),
  languages: z.array(z.string()),
  services: z.array(z.string()),
  contacts: z.array(contactSchema),
  website_url: z.string().nullable(),
  appointment_url: z.string().nullable(),
  // Gemini bazen 6'dan fazla alıntı döndürür; reddetmek yerine ilk 6'ya kırp (veri kaybetme).
  evidence_quotes: z.array(z.string()).transform((arr) => arr.slice(0, 6)),
})

export type CandidateResult = z.infer<typeof candidateResultSchema>
export type CandidateContact = z.infer<typeof contactSchema>

export interface ServiceFinderJob {
  id: string
  title: string
  status: string
  template_id: string | null
  provider_type: string
  category_group: string
  location_label: string
  country_code: string | null
  region: string | null
  city: string | null
  language_code: string
  freeform_topic: string | null
  must_include_terms: string[]
  must_exclude_terms: string[]
  seed_queries: unknown
  seed_urls: string[]
  max_queries: number
  max_source_urls: number
  max_extract_urls: number
  max_candidates: number
  soft_cap_usd: number
  hard_cap_usd: number
  cost_total_usd: number
  attempts: number
}

export interface ProviderConfig {
  id: string
  provider_key: string
  provider_kind: string
  is_enabled: boolean
  priority: number
  default_model: string | null
  base_url: string | null
  request_defaults: Record<string, unknown>
  secret_ref: string
}

export interface ProfessionTemplate {
  id: string
  template_key: string
  label: string
  provider_type: string
  category_group: string
  language_terms: string[]
  must_include_terms: string[]
  must_exclude_terms: string[]
  query_templates: unknown
}

export interface JobSourceRow {
  id: string
  job_id: string
  source_url: string
  normalized_url: string
  source_domain: string
  source_title: string | null
  source_snippet: string | null
  fetch_status: string
  extracted_text: string | null
}

export interface RawSearchResult {
  url: string
  title?: string
  snippet?: string
  domain?: string
}

export interface SearchUsage {
  units: number
  estimatedCostUsd: number
  billingUnit: string
}
