-- Acil: erişim haritası doğrulamasında bulunan ve anon anahtarla canlıda doğrulanan açıklar.
--  * corner_authors: 5 yazarın password_hash / password_salt / hash_iterations değerleri anon'a açıktı.
--  * devuser: login_email (81), user_id (81), ek_notlar (16), login_pin_* anon'a açıktı.
--  * "authenticated" bir güven sınırı değil (herkes kayıt olabilir): "Admin silebilir/güncelleyebilir"
--    policy'leri ve bracket'lerdeki ALL/true policy'leri her kayıtlı kullanıcıya silme/değiştirme veriyordu.
-- Tüm yönetim yazmaları service role ile yapılır (participant-admin-*, corner-admin-*, corner-author-*,
-- devuser-*); service role yetki ve RLS'ten etkilenmez.
-- Üç bağımsız doğrulayıcı (public sayfalar, katılımcı akışları, PostgREST semantiği) kırılma bulmadı.

-- Policy değişiklikleri ACCESS EXCLUSIVE kilit alır; trafik altında uzun beklemesin.
set local lock_timeout = '10s';

-- 1) corner_authors: tablo düzeyinde SELECT yerine yalnızca açık sütunlar. lib/corner.ts (canlıda anon key)
--    bu sütunları okur/filtreler/sıralar (id, slug, display_name, short_bio, bio_content, avatar_image_url,
--    display_order, updated_at; eq is_active/slug; order display_order, created_at).
revoke select, insert, update, delete, truncate, references, trigger on public.corner_authors from anon, authenticated;
grant select (id, slug, display_name, short_bio, bio_content, avatar_image_url, display_order, is_active, created_at, updated_at)
  on public.corner_authors to anon, authenticated;

-- 2) devuser: yalnızca herkese açık profil sütunları. Canlıdaki /api/devuser/list (PUBLIC_SELECT +
--    aratilabilir/approval_status filtresi) ve /api/devuser-count (id) bununla çalışmaya devam eder.
--    Yeni kod (2c76898) bunlara da ihtiyaç duymaz; deploy sonrası tablo SELECT'i tamamen kaldırılacak.
revoke select on public.devuser from anon, authenticated;
grant select (
  id, ad_soyad, sehir, rol, deneyim_seviye, aktif_kod, guclu_alanlar, programlama_dilleri,
  framework_platformlar, devops_cloud, ilgi_konular, ogrenmek_istenen, is_arama_durumu, freelance_aciklik,
  katilma_amaci, isbirligi_turu, profesyonel_destek_verebilir, profesyonel_destek_almak, linkedin_url,
  whatsapp_tel, iletisim_izni, created_at, aratilabilir, approval_status
) on public.devuser to anon, authenticated;
-- Onay filtresi DB'de: onay bekleyen/reddedilen kayıtların telefon/LinkedIn'i doğrudan REST ile okunmasın.
-- Canlı liste zaten aynı filtreyi uygular; sayım bugün aynı sonucu verir (onaysız aranabilir kayıt yok).
drop policy if exists "Public read access for searchable profiles" on public.devuser;
create policy "Public read access for searchable profiles" on public.devuser
  for select to anon, authenticated
  using (aratilabilir = true and approval_status = 'approved');

-- 3) Katılımcılar: "Admin ..." adlı ama yalnızca auth.role()='authenticated' kontrol eden policy'ler.
drop policy if exists "Tavla: Admin silebilir" on public.tavla_participants;
drop policy if exists "Typing: Admin silebilir" on public.typing_participants;
drop policy if exists "Typing: Admin güncelleyebilir" on public.typing_participants;
drop policy if exists "VCT: Admin silebilir" on public.vct_participants;
drop policy if exists "Promote: Admin silebilir" on public.promote_participants;
-- Kayıt formları anon INSERT kullanır (korunur); güncelleme/silme yalnızca admin (service role).
revoke update, delete, truncate, references, trigger on
  public.tavla_participants, public.typing_participants, public.vct_participants,
  public.promote_participants, public.cvopt_participants
from anon, authenticated;

-- 4) Bracket'ler: authenticated için ALL/true yerine yalnızca okuma (Tavla/Typing istemcilerinin
--    realtime aboneliği okuma ister). Yazma yalnızca participant-admin-bracket-action (service role).
drop policy if exists tavla_bracket_auth on public.tavla_bracket;
drop policy if exists tavla_bracket_auth_read on public.tavla_bracket;
create policy tavla_bracket_auth_read on public.tavla_bracket for select to authenticated using (true);
drop policy if exists typing_bracket_auth on public.typing_bracket;
drop policy if exists typing_bracket_auth_read on public.typing_bracket;
create policy typing_bracket_auth_read on public.typing_bracket for select to authenticated using (true);
revoke insert, update, delete, truncate, references, trigger on public.tavla_bracket, public.typing_bracket
  from anon, authenticated;
