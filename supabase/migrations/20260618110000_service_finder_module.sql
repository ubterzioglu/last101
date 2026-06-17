-- Service Finder modülü — AI uzman/hizmet bulucu scraper şeması.
-- Kaynak: corteqsmvp 20260614100000_create_service_finder_module.sql (uyarlandı).
-- RLS farkı: bu repoda admin ŞİFRE tabanlı (lib/admin/adminAuth.ts), Supabase-auth değil.
-- Bu yüzden is_admin/authenticated politikaları YOK; tüm erişim service-role API route
-- üzerinden (news pattern). RLS açık ama anon/authenticated'a grant verilmez (kilitli).
-- Worker RPC'leri YOK: kuyruk claim/heartbeat doğrudan service-role API route'ta yapılır.

-- ---------------------------------------------------------------------------
-- 1) Sağlayıcı ayarları (sır YOK — secret_ref yalnızca env değişken adıdır)
-- ---------------------------------------------------------------------------
create table if not exists public.service_finder_provider_configs (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null unique,
  provider_kind text not null check (provider_kind in ('search', 'extract', 'classify')),
  display_name text not null,
  is_enabled boolean not null default true,
  priority integer not null default 100,
  default_model text,
  base_url text,
  request_defaults jsonb not null default '{}'::jsonb,
  rate_limit_per_min integer,
  monthly_cap_usd numeric(12,4),
  secret_ref text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.service_finder_provider_configs is
  'Service Finder dış sağlayıcı ayarları. secret_ref = edge function ortamındaki env değişken adı; ham API anahtarı asla DB''de tutulmaz.';

-- ---------------------------------------------------------------------------
-- 2) Meslek şablonları (sorgu üretim girdileri; providers.type ile eşlenir)
-- ---------------------------------------------------------------------------
create table if not exists public.service_finder_profession_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  label text not null,
  provider_type text not null,
  category_group text not null default 'services' check (category_group in ('services', 'gastronomy')),
  language_terms text[] not null default array['Türk', 'Türkçe', 'Turkish speaking', 'Türkisch'],
  must_include_terms text[] not null default '{}'::text[],
  must_exclude_terms text[] not null default '{}'::text[],
  query_templates jsonb not null default '[]'::jsonb,
  default_max_queries integer not null default 8,
  default_max_source_urls integer not null default 24,
  default_max_extract_urls integer not null default 15,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3) İşler — queue-in-table (run_after + status ile claim edilir)
-- ---------------------------------------------------------------------------
create table if not exists public.service_finder_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null default 'queued'
    check (status in ('queued', 'running', 'review', 'completed', 'failed', 'cancelled', 'budget_stopped')),
  priority integer not null default 100,
  template_id uuid references public.service_finder_profession_templates(id) on delete set null,
  provider_type text not null,
  category_group text not null default 'services',
  location_label text not null,
  country_code text default 'DE',
  region text,
  city text,
  language_code text not null default 'tr',
  freeform_topic text,
  must_include_terms text[] not null default '{}'::text[],
  must_exclude_terms text[] not null default '{}'::text[],
  seed_queries jsonb not null default '[]'::jsonb,
  seed_urls text[] not null default '{}'::text[],
  max_queries integer not null default 8,
  max_source_urls integer not null default 24,
  max_extract_urls integer not null default 15,
  max_candidates integer not null default 50,
  soft_cap_usd numeric(12,4) not null default 2.0000,
  hard_cap_usd numeric(12,4) not null default 4.0000,
  cost_total_usd numeric(12,4) not null default 0.0000,
  search_requests integer not null default 0,
  extract_requests integer not null default 0,
  classify_requests integer not null default 0,
  result_summary jsonb not null default '{}'::jsonb,
  progress jsonb not null default '{}'::jsonb,
  attempts integer not null default 0,
  last_error_code text,
  last_error_message text,
  run_after timestamptz not null default now(),
  locked_by text,
  lease_expires_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4) Çalıştırılan arama sorguları
-- ---------------------------------------------------------------------------
create table if not exists public.service_finder_job_queries (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.service_finder_jobs(id) on delete cascade,
  stage text not null check (stage in ('seed', 'expansion', 'retry')),
  provider_key text not null,
  query_text text not null,
  external_request_id text,
  usage_units numeric(12,4) not null default 0,
  estimated_cost_usd numeric(12,4) not null default 0.0000,
  result_count integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'succeeded', 'failed', 'skipped')),
  created_at timestamptz not null default now(),
  executed_at timestamptz,
  unique (job_id, stage, query_text)
);

-- ---------------------------------------------------------------------------
-- 5) Keşfedilen kaynak URL'leri (robots kararı + ekstraksiyon durumu)
-- ---------------------------------------------------------------------------
create table if not exists public.service_finder_job_sources (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.service_finder_jobs(id) on delete cascade,
  discovery_query_id uuid references public.service_finder_job_queries(id) on delete set null,
  provider_key text not null,
  source_url text not null,
  normalized_url text not null,
  source_domain text not null,
  source_title text,
  source_snippet text,
  crawl_allowed boolean,
  robots_evaluated_at timestamptz,
  fetch_status text not null default 'discovered'
    check (fetch_status in ('discovered', 'queued', 'fetched', 'blocked_robots', 'failed', 'duplicate', 'irrelevant')),
  extracted_text text,
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  fetched_at timestamptz,
  unique (job_id, normalized_url)
);

-- ---------------------------------------------------------------------------
-- 6) Adaylar (sınıflandırıcı çıktısı + inceleme/yayınlama + providers bağı)
-- ---------------------------------------------------------------------------
create table if not exists public.service_finder_candidates (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.service_finder_jobs(id) on delete cascade,
  primary_source_id uuid references public.service_finder_job_sources(id) on delete set null,
  canonical_name text not null,
  profession_label text,
  organization_name text,
  provider_type text not null,
  category_group text not null default 'services',
  country_code text,
  region text,
  city text,
  address_line text,
  languages text[] not null default '{}'::text[],
  services text[] not null default '{}'::text[],
  contacts jsonb not null default '[]'::jsonb,
  website_url text,
  appointment_url text,
  source_urls jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  duplicate_key text not null,
  confidence_score numeric(5,2) not null default 0.00,
  classifier_model text,
  review_status text not null default 'pending'
    check (review_status in ('pending', 'approved', 'rejected', 'needs_edit', 'published')),
  review_notes text,
  reviewed_at timestamptz,
  -- Onaylanınca yazılan public providers kaydının id'si (Faz 1 birleşik tablo).
  provider_id uuid references public.providers(id) on delete set null,
  published_at timestamptz,
  cost_total_usd numeric(12,4) not null default 0.0000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, duplicate_key)
);

-- ---------------------------------------------------------------------------
-- 7) Olay günlüğü
-- ---------------------------------------------------------------------------
create table if not exists public.service_finder_job_events (
  id bigserial primary key,
  job_id uuid not null references public.service_finder_jobs(id) on delete cascade,
  candidate_id uuid references public.service_finder_candidates(id) on delete cascade,
  event_type text not null,
  event_level text not null default 'info'
    check (event_level in ('debug', 'info', 'warn', 'error')),
  message text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 8) Maliyet defteri — her sağlayıcı çağrısı bir satır
-- ---------------------------------------------------------------------------
create table if not exists public.service_finder_cost_ledger (
  id bigserial primary key,
  job_id uuid not null references public.service_finder_jobs(id) on delete cascade,
  query_id uuid references public.service_finder_job_queries(id) on delete set null,
  source_id uuid references public.service_finder_job_sources(id) on delete set null,
  candidate_id uuid references public.service_finder_candidates(id) on delete set null,
  provider_config_id uuid references public.service_finder_provider_configs(id) on delete set null,
  provider_key text not null,
  event_type text not null
    check (event_type in ('search', 'extract', 'classify', 'manual_adjustment')),
  billing_unit text not null,
  quantity numeric(12,4) not null,
  unit_cost_usd numeric(12,6) not null,
  amount_usd numeric(12,4) not null,
  currency text not null default 'USD',
  model_name text,
  request_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- İndeksler
-- ---------------------------------------------------------------------------
create index if not exists idx_sf_jobs_queue
  on public.service_finder_jobs (status, run_after, priority desc);
create index if not exists idx_sf_jobs_created_at
  on public.service_finder_jobs (created_at desc);
create index if not exists idx_sf_sources_job_fetch
  on public.service_finder_job_sources (job_id, fetch_status);
create index if not exists idx_sf_candidates_job_review
  on public.service_finder_candidates (job_id, review_status, confidence_score desc);
create index if not exists idx_sf_cost_ledger_job
  on public.service_finder_cost_ledger (job_id, created_at desc);
create index if not exists idx_sf_events_job
  on public.service_finder_job_events (job_id, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS: tüm tablolar kilitli; erişim yalnızca service-role API route üzerinden.
-- (anon/authenticated'a grant YOK; service_role RLS bypass eder.)
-- ---------------------------------------------------------------------------
alter table public.service_finder_provider_configs enable row level security;
alter table public.service_finder_profession_templates enable row level security;
alter table public.service_finder_jobs enable row level security;
alter table public.service_finder_job_queries enable row level security;
alter table public.service_finder_job_sources enable row level security;
alter table public.service_finder_candidates enable row level security;
alter table public.service_finder_job_events enable row level security;
alter table public.service_finder_cost_ledger enable row level security;

revoke all on table public.service_finder_provider_configs from anon, authenticated;
revoke all on table public.service_finder_profession_templates from anon, authenticated;
revoke all on table public.service_finder_jobs from anon, authenticated;
revoke all on table public.service_finder_job_queries from anon, authenticated;
revoke all on table public.service_finder_job_sources from anon, authenticated;
revoke all on table public.service_finder_candidates from anon, authenticated;
revoke all on table public.service_finder_job_events from anon, authenticated;
revoke all on table public.service_finder_cost_ledger from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Seed: sağlayıcı ayarları (anahtarlar env'de — secret_ref yalnız referans)
-- ---------------------------------------------------------------------------
insert into public.service_finder_provider_configs
  (provider_key, provider_kind, display_name, is_enabled, priority, default_model, base_url, request_defaults, monthly_cap_usd, secret_ref)
values
  ('tavily', 'search', 'Tavily Search + Extract', true, 10, null, 'https://api.tavily.com',
   '{"search_depth": "basic", "max_results": 8, "extract_depth": "basic"}'::jsonb, 100.0000, 'TAVILY_API_KEY'),
  ('serpapi', 'search', 'SerpAPI Google Search', true, 20, null, 'https://serpapi.com',
   '{"gl": "de", "hl": "de", "google_domain": "google.de", "num": 10}'::jsonb, 75.0000, 'SERPAPI_API_KEY'),
  ('gemini', 'classify', 'Gemini Classifier', true, 10, 'gemini-2.5-flash-lite',
   'https://generativelanguage.googleapis.com',
   '{"temperature": 0.1, "fallback_model": "gemini-2.5-flash"}'::jsonb, 50.0000, 'GEMINI_API_KEY')
on conflict (provider_key) do nothing;

-- ---------------------------------------------------------------------------
-- Seed: meslek şablonları (mevcut hizmet rehberi kategorileriyle birebir)
-- ---------------------------------------------------------------------------
insert into public.service_finder_profession_templates
  (template_key, label, provider_type, category_group, must_exclude_terms, query_templates,
   default_max_queries, default_max_source_urls, default_max_extract_urls)
values
  ('doctor', 'Doktor', 'doctor', 'services',
   array['forum', 'reddit', 'job', 'stellenangebot', 'wikipedia'],
   '["türkischer Arzt {{city}}", "Türkçe konuşan doktor {{city}}", "{{city}} Türk doktor", "turkish speaking doctor {{city}}", "türkische Ärzte {{city}} Praxis"]'::jsonb,
   8, 24, 15),
  ('lawyer', 'Avukat', 'lawyer', 'services',
   array['forum', 'reddit', 'job', 'stellenangebot', 'wikipedia'],
   '["türkischer Anwalt {{city}}", "Türkçe konuşan avukat {{city}}", "{{city}} Türk avukat", "turkish speaking lawyer {{city}}", "türkischer Rechtsanwalt {{city}}"]'::jsonb,
   8, 24, 15),
  ('terapist', 'Terapist', 'terapist', 'services',
   array['forum', 'reddit', 'job', 'stellenangebot', 'wikipedia'],
   '["türkischer Therapeut {{city}}", "Türkçe konuşan psikolog {{city}}", "{{city}} Türk terapist", "türkischer Psychologe {{city}}"]'::jsonb,
   8, 24, 15),
  ('sigorta', 'Sigortacı', 'sigorta', 'services',
   array['forum', 'reddit', 'job', 'stellenangebot', 'wikipedia'],
   '["türkischer Versicherungsmakler {{city}}", "Türkçe sigorta danışmanı {{city}}", "{{city}} Türk sigorta", "türkische Versicherung {{city}}"]'::jsonb,
   8, 24, 15),
  ('vergi_danismani', 'Vergi Danışmanı', 'vergi_danismani', 'services',
   array['forum', 'reddit', 'job', 'stellenangebot', 'wikipedia'],
   '["türkischer Steuerberater {{city}}", "Türkçe vergi danışmanı {{city}}", "{{city}} Türk mali müşavir", "türkische Steuerberatung {{city}}"]'::jsonb,
   8, 24, 15),
  ('kuafor', 'Kuaför', 'kuafor', 'services',
   array['forum', 'reddit', 'job', 'wikipedia'],
   '["türkischer Friseur {{city}}", "Türk kuaför {{city}}", "{{city}} türkische Friseursalon"]'::jsonb,
   6, 20, 12),
  ('nakliyat', 'Nakliyat', 'nakliyat', 'services',
   array['forum', 'reddit', 'job', 'wikipedia'],
   '["türkisches Umzugsunternehmen {{city}}", "Türk nakliyat {{city}}", "{{city}} türkische Spedition"]'::jsonb,
   6, 20, 12),
  ('restaurant', 'Restoran', 'restaurant', 'gastronomy',
   array['forum', 'reddit', 'job', 'wikipedia'],
   '["türkisches Restaurant {{city}}", "Türk restoranı {{city}}", "{{city}} türkische Küche Restaurant"]'::jsonb,
   6, 20, 12)
on conflict (template_key) do nothing;

comment on table public.service_finder_jobs is 'Service Finder iş kuyruğu (queue-in-table); Edge Function tek-sefer claim eder.';
comment on table public.service_finder_candidates is 'Sınıflandırıcı adayları; onaylanınca providers tablosuna (source=scraper) yazılır.';
