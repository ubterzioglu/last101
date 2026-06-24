-- TRT Haber özel mobil XML formatı için yeni source_type: 'trthaber'.
-- TRT standart RSS yayınlamadığından ('<haber>' elementli özel XML) ayrı adaptör
-- (supabase/functions/news-ingest/adapters/trthaber.ts) ile parse edilir.

alter table public.news_sources
  drop constraint if exists news_sources_source_type_check;

alter table public.news_sources
  add constraint news_sources_source_type_check
  check (source_type in ('rss', 'mrss', 'atom', 'api', 'gdelt', 'trthaber', 'manual'));
