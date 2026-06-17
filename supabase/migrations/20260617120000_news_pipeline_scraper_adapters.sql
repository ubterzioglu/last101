-- News pipeline scraper genişletmesi (corteqsmvp radar-news-scan entegrasyonu).
-- Yeni adaptörler: 'atom' (Atom 1.0 feed) ve 'gdelt' (GDELT Doc API v2).
-- Ayrıca adaptöre özgü ayarlar için news_sources.config jsonb kolonu eklenir.

-- 1) Adaptöre özgü konfigürasyon (örn. GDELT query/timespan/allowedLanguages).
alter table public.news_sources
  add column if not exists config jsonb not null default '{}'::jsonb;

-- 2) source_type check kısıtına 'atom' ve 'gdelt' ekle.
alter table public.news_sources
  drop constraint if exists news_sources_source_type_check;

alter table public.news_sources
  add constraint news_sources_source_type_check
  check (source_type in ('rss', 'mrss', 'atom', 'api', 'gdelt', 'manual'));

comment on column public.news_sources.config is
  'Adaptöre özgü ayarlar. GDELT için: {query, mode, timespan, sort, maxrecords, allowedLanguages}.';
