-- Hizmet Rehberi birleştirme: gastronomy_providers -> providers (tek tablo, type ile yönetim).
-- Service Finder scraper'ının yazacağı ek alanlar da burada eklenir.
-- Canlı şema (Faz 0) doğrulandı: providers ve gastronomy_providers kolonları birebir aynı.
-- Eski gastronomi tabloları DROP EDİLMEZ; veri taşındıktan sonra kod yolundan çıkarılır,
-- _deprecated yorumuyla geri-dönüş güvenliği için bırakılır.

-- ---------------------------------------------------------------------------
-- 1) providers tablosuna eksik kanonik kolonları ekle (idempotent)
-- ---------------------------------------------------------------------------
alter table public.providers
  add column if not exists email text,
  add column if not exists region text,
  add column if not exists country_code text not null default 'DE',
  add column if not exists appointment_url text,
  add column if not exists services text[] not null default '{}'::text[],
  add column if not exists source text not null default 'manual',
  add column if not exists relevance_score numeric(5,2);

-- source değer kümesi: manual (admin/eski), submission (Türk Öner), scraper (Service Finder)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'providers_source_check') then
    alter table public.providers
      add constraint providers_source_check
      check (source in ('manual', 'submission', 'scraper'));
  end if;
end $$;

-- type CHECK'i: hem hizmet hem gastronomi tiplerini tek tabloda kapsa.
-- Mevcut bir type CHECK'i varsa kaldırıp genişlet (idempotent).
alter table public.providers drop constraint if exists providers_type_check;
alter table public.providers
  add constraint providers_type_check
  check (type in (
    'doctor','lawyer','terapist','ebe','nakliyat','sigorta','vergi_danismani',
    'berber','kuafor','surucu_kursu','tamirci_otomobil','tamirci_tesisat','tamirci_boyaci',
    'restaurant','cafe','market','kasap','bakery'
  ));

-- ---------------------------------------------------------------------------
-- 2) Gastronomi verisini providers'a taşı (type korunur, source=manual)
--    Çift çalıştırmaya karşı: aynı (type, display_name, city) varsa atla.
-- ---------------------------------------------------------------------------
insert into public.providers (
  id, type, display_name, city, address, phone, website, languages, notes_public,
  status, google_place_id, google_rating, google_user_ratings_total, google_maps_url,
  lat, lng, google_last_sync_at, google_raw, source, created_at, updated_at
)
select
  g.id, g.type, g.display_name, g.city, g.address, g.phone, g.website, g.languages, g.notes_public,
  g.status, g.google_place_id, g.google_rating, g.google_user_ratings_total, g.google_maps_url,
  g.lat, g.lng, g.google_last_sync_at, g.google_raw, 'manual', g.created_at, g.updated_at
from public.gastronomy_providers g
where not exists (
  select 1 from public.providers p where p.id = g.id
)
on conflict (id) do nothing;

-- Gastronomi tag tanımlarını tags tablosuna taşı (slug+type tekil varsayımı).
insert into public.tags (id, type, label, slug, created_at)
select gt.id, gt.type, gt.label, gt.slug, gt.created_at
from public.gastronomy_tags gt
where not exists (select 1 from public.tags t where t.id = gt.id)
on conflict (id) do nothing;

-- Gastronomi tag ilişkilerini provider_tags'e taşı.
insert into public.provider_tags (provider_id, tag_id)
select gpt.provider_id, gpt.tag_id
from public.gastronomy_provider_tags gpt
where not exists (
  select 1 from public.provider_tags pt
  where pt.provider_id = gpt.provider_id and pt.tag_id = gpt.tag_id
)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 3) İndeksler (tek tablo sorguları için)
-- ---------------------------------------------------------------------------
create index if not exists providers_type_status_idx
  on public.providers (type, status);
create index if not exists providers_city_idx
  on public.providers (city);
create index if not exists providers_source_idx
  on public.providers (source);

comment on column public.providers.source is
  'Kaydın kaynağı: manual (admin/eski + taşınan gastronomi), submission (Türk Öner), scraper (Service Finder).';
comment on column public.providers.relevance_score is
  'Service Finder sınıflandırıcı güven skoru (0-100); manuel kayıtlarda NULL.';

-- Not: gastronomy_providers / gastronomy_tags / gastronomy_provider_tags tabloları
-- bilinçli olarak DROP edilmez (geri-dönüş güvenliği). Kod yolu artık tek providers
-- tablosunu kullanır; doğrulama sonrası bu tablolar el ile arşivlenebilir/silinebilir.
