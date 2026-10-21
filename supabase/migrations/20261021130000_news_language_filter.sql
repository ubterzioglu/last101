-- Haber hattında dil filtresi: İngilizce (ve izin verilmeyen) haberlerin kuyruğa/yayına girmesini engeller.
-- Kapsam: dil kolonları, izinli diller ayarı, mevcut verinin düzeltilmesi.

-- 1) Şema
alter table public.news_posts
  add column if not exists language_code text;

alter table public.news_raw_items
  add column if not exists language_code text,
  add column if not exists filtered_reason text;

alter table public.news_pipeline_settings
  add column if not exists allowed_languages text[] not null default array['tr', 'de']::text[];

create index if not exists news_posts_language_code_idx
  on public.news_posts (language_code);

create index if not exists news_raw_items_language_code_idx
  on public.news_raw_items (language_code);

-- 2) Mevcut kayıtların dilini kaynağın language_code değerinden doldur
update public.news_raw_items r
set language_code = s.language_code
from public.news_sources s
where s.id = r.source_id
  and r.language_code is null
  and s.language_code is not null;

update public.news_posts p
set language_code = r.language_code
from public.news_raw_items r
where r.id = p.raw_item_id
  and p.language_code is null
  and r.language_code is not null;

-- 3) İngilizce kaynakları kapat (Euronews My Europe / World)
update public.news_sources
set is_active = false,
    updated_at = now()
where language_code = 'en'
  and is_active = true;

-- 4) GDELT: izinli dillerden english'i çıkar
update public.news_sources
set config = jsonb_set(config, '{allowedLanguages}', to_jsonb('turkish,german'::text)),
    updated_at = now()
where source_type = 'gdelt'
  and config ? 'allowedLanguages'
  and lower(config->>'allowedLanguages') like '%english%';

-- 5) Bekleyen İngilizce postları reddet ve audit kaydı bırak
with rejected as (
  update public.news_posts
  set status = 'rejected',
      reviewed_at = now(),
      reviewed_by = 'migration:news_language_filter',
      updated_at = now()
  where status = 'pending_review'
    and language_code = 'en'
  returning id
)
insert into public.news_editor_actions (post_id, actor_user_id, action_type, metadata)
select id,
       'migration',
       'reject',
       jsonb_build_object('reason', 'language_not_allowed', 'language', 'en')
from rejected;
