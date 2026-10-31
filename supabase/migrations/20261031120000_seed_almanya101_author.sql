-- Kurumsal yazar: "almanya101" (Organization). Rehber, haber ve yazarsız içerik bu kimliğe atfedilir.
-- Plan: docs/plans/blog-seo-geo-2026-10-31.md bölüm 3.1.
--
-- * Additive ve idempotent: yeniden çalıştırmak güvenlidir.
-- * Yeni sütun EKLENMEZ: corner_authors için anon'a sütun bazlı GRANT verilmiş durumda
--   (20261021200000_hide_secret_columns_and_participant_writes.sql); GRANT'siz yeni bir sütun
--   seçilirse lib/corner.ts hatayı yutup boş liste döner.
-- * Boş password_hash / password_salt: panel girişi kapalı (verifyPasswordHash boş hash'i reddeder).
-- * Görünen ad kodda SEO_SITE_NAME ile aynı olmalı (lib/utils/constants.ts).

insert into public.corner_authors (
  display_name,
  slug,
  short_bio,
  bio_content,
  avatar_image_url,
  display_order,
  password_hash,
  password_salt,
  is_active
)
values (
  'Almanya101',
  'almanya101',
  'Almanya101 editör ekibi: Almanya''da yaşam, vize, iş ve günlük işlemler üzerine rehberleri ve haberleri hazırlar ve günceller.',
  E'Almanya101, Almanya''da yaşayan veya Almanya''ya taşınmayı düşünen Türkçe konuşan kullanıcılar için hazırlanan bir bilgi platformudur.\n\n'
  E'Bu sayfadaki içerikler Almanya101 editör ekibi tarafından hazırlanır. Editör ekibi; rehberleri, haberleri ve araçları yayınlar, içerikleri düzenli olarak gözden geçirir ve güncel tutmaya çalışır.\n\n'
  E'Yayın ilkeleri\n\n'
  E'- Rehber ve haber içeriklerinde, mümkün olduğunda resmî kurumların ve ilgili kaynakların bilgileri esas alınır.\n'
  E'- İçeriklerde yayın ve güncelleme tarihleri görünür biçimde belirtilir.\n'
  E'- Yanlış veya eski bir bilgi fark edilirse iletişim sayfasından bildirilebilir; bildirimler incelenir ve gerekli düzeltmeler yapılır.\n\n'
  E'Almanya101 içerikleri genel bilgilendirme amacı taşır; hukuki, mali veya bireysel danışmanlık yerine geçmez. Ayrıntılar için Hakkımızda sayfasına bakabilirsiniz.',
  '/almanya101.png',
  9999,
  '',
  '',
  true
)
on conflict (slug) do nothing;

-- Silme koruması: corner_posts.author_id FK'si "on delete cascade"; sistem yazarı silinirse ona
-- atfedilen tüm yazılar gider. Trigger service role dahil her silmeyi engeller.
create or replace function public.prevent_system_corner_author_delete()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.slug = 'almanya101' then
    raise exception 'Sistem yazarı (almanya101) silinemez.'
      using errcode = '23503';
  end if;
  return old;
end;
$$;

drop trigger if exists corner_authors_protect_system_author on public.corner_authors;
create trigger corner_authors_protect_system_author
  before delete on public.corner_authors
  for each row
  execute function public.prevent_system_corner_author_delete();

comment on function public.prevent_system_corner_author_delete() is
  'almanya101 sistem yazarının silinmesini engeller (cascade ile yazıların kaybolmasını önler).';
