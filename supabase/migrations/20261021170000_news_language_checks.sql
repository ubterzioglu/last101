-- Dil kolonları yalnızca desteklenen kodları alabilsin (uygulama tipleri: NewsLanguage = 'tr' | 'de' | 'en').
-- not valid + validate: mevcut satırlar ayrı adımda doğrulanır (aykırı satır varsa migration hata verir).

alter table public.news_posts
  drop constraint if exists news_posts_language_code_check;
alter table public.news_posts
  add constraint news_posts_language_code_check
  check (language_code is null or language_code in ('tr', 'de', 'en')) not valid;
alter table public.news_posts
  validate constraint news_posts_language_code_check;

alter table public.news_raw_items
  drop constraint if exists news_raw_items_language_code_check;
alter table public.news_raw_items
  add constraint news_raw_items_language_code_check
  check (language_code is null or language_code in ('tr', 'de', 'en')) not valid;
alter table public.news_raw_items
  validate constraint news_raw_items_language_code_check;

alter table public.news_pipeline_settings
  drop constraint if exists news_pipeline_settings_allowed_languages_check;
alter table public.news_pipeline_settings
  add constraint news_pipeline_settings_allowed_languages_check
  check (
    cardinality(allowed_languages) > 0
    and allowed_languages <@ array['tr', 'de', 'en']::text[]
  );
