# Kalan Güvenlik İşleri — Küçük Batch Planı (almanya101)

## Context

[Veritabanı güvenlik denetimi](../security/db-audit-2026-10-21.md) 21 Ekim 2026'da tamamlandı (main: `1b1876a`). Açık bulgular: 4 kritik, 4 yüksek, 3 orta — ayrıca `security_notes` tablosunda 11 kayıt.

Bu belge o bulguları **her biri tek PR, bağımsız review + canlıya alınabilir** batch'lere böler. Kod düzenleme işleri ayrı izleniyor: [clean-code-batches.md](./clean-code-batches.md).

## Durum (21 Ekim 2026, gün sonu)

| Batch | Durum | Kanıt / iz |
|---|---|---|
| S1 — atıl + açık tablolar | ✅ canlıda | `20261021180000_close_anonymous_write_paths.sql`; anon REST → 401/42501 |
| S2 — fonksiyonlar | ✅ canlıda | `trigger_news_ingest` S1 içinde; `search_path` `20261021190000_function_search_path.sql` |
| S3 — `devuser` | ✅ canlıda | yazma S1; okuma `2c76898` + `20261021203000_devuser_base_table_private.sql` (canlı kanarya: liste 81, sayım 81) |
| S4 — filtre enjeksiyonu | ✅ main'de | 5 route + `get-users` (+ `ilgi` dizi filtresi); edge deploy aşağıda |
| S5 — storage listeleme | ✅ canlıda | `20261021191000_storage_no_public_listing.sql`; liste 5 → 0, public URL 200 |
| S6 — CI | ✅ main'de | `ci.yml` (lint + tsc + unit + build), `e2e.yml` salt-okunur token, Dependabot, admin-guards +8 uç. Kalan: branch protection'da `ci / checks` zorunlu yapılması (repo ayarı) |
| S7 — korumasız uçlar | ⛔ karar bekliyor | öneri aşağıda |
| S8 — admin kapısı | ⛔ ayrı alt plan | — |
| S9 — GRANT daraltma | ◐ harita hazır, en acil parçalar yapıldı | `20261021200000`, `20261021201000`; kalan tablolar gruplar hâlinde |
| S10 — temizlik | ◐ | 5 eski tablo silindi (`20261021202000`, kullanıcı kararı); kalan maddeler aşağıda |

**Doğrulamada bulunan ek açıklar (hepsi kapatıldı, canlıda anon REST ile kanıtlandı):**
- `corner_authors.password_hash / password_salt` (5 yazar) ve `devuser.login_email / user_id` (81), `ek_notlar` (16) anon'a açıktı → sütun düzeyinde yetki (`20261021200000`), ardından `devuser` tamamen kapandı (`20261021203000`).
- "authenticated" güven sınırı değil (kayıt herkese açık): "Admin silebilir/güncelleyebilir" katılımcı policy'leri ve bracket'lerdeki `ALL/true` her kayıtlı kullanıcıya silme/değiştirme veriyordu → kaldırıldı; bracket'lerde authenticated için yalnızca `SELECT` (realtime).
- Eski uygulama tabloları (`meeting_surveys` ad + telefon, `supporteachother`, `sprachcafe_submissions`, `cvopt_satisfaction_surveys`, `question_submissions`, `zgen_*`) tam yetkiyle açıktı → kilitlendi (`20261021201000`).

**S9 için önemli düzeltme:** `lib/public-news.ts`, `lib/corner.ts`, `lib/rehber-articles.ts` canlıda **anon key** ile çalışır (anahtar adayları sırayla denenir, anon önce gelir). Bu tabloların (`news_posts`, `corner_*`, rehber) anon SELECT'i kaldırılırsa public site kırılır; ya bu modüller service role'e taşınır ya da yalnızca yazma yetkileri alınır. Erişim haritası: oturum çıktısı, 77 nesne; S9 alt batch'leri bu haritadan üretilir.

**S7 önerisi (karar bekliyor):** Üye dizini, tartışma listesi ve kurucu listesi bilinçli herkese açık özellikler olarak kalsın; ancak (1) CORS `*` yerine yalnızca `https://almanya101.de`, (2) sahiplik açıkları kapatılsın (S7.1: UUID bilen herkesin oyu üzerine yazabilmesi, whatsapp/linkedin eşleşmesiyle başkasının başvurusunun güncellenebilmesi), (3) hız sınırı DB destekli ayrı iş. Veri tarafı zaten küçültüldü: liste artık izne bağlı maskeleyen view'dan geliyor.

**Planda olmayan, S1'e eklenen bulgu (kritik):** `public` şemasındaki 13 view `postgres`'e ait ve `security_invoker` değil; anon/authenticated bu view'larda `INSERT/UPDATE/DELETE` yetkisine sahipti. Otomatik güncellenebilir `devuser_public` üzerinden yazma view sahibinin yetkisiyle çalışıp `devuser`'ın RLS'ini atlıyordu (`PATCH /rest/v1/devuser_public`). S1 view'larda yalnızca `SELECT` bıraktı.

### Planı belirleyen iki keşif

**1. RLS'siz 5 tablo atıl.** `event_e1_date_votes`, `event_e1_questions`, `event_e2_questions`, `event_e2_topic_votes`, `vizeqa_questions` adları uygulama kodunda **hiç geçmiyor**. `E1Client.tsx:310-313` `/api/event-e1-*` uçlarını çağırıyor ama **bu route'lar repoda yok** (canlıda 404) — sayfanın oylama özelliği zaten kırık. Son yazma tarihleri Şubat 2026.

→ Kilitlemek **sıfır riskli**.

**2. Aktif tablolara erişim zaten service-role üzerinden.** `feedback_submissions` ve `bookmark_submissions`'a uygulama yalnızca sunucudan, service-role istemcisiyle erişiyor (`devuser-dis-*` route'ları). `service_role` RLS'i baypas ettiği için `anon` yetkilerini kaldırmak bu akışları etkilemez.

## Her batch için ortak kurallar

- Kendi branch'i; `main`'e fast-forward. Ana çalışma alanını paralel oturum kullanabiliyor — stash'e güvenme, `git status --short --branch` ile başla.
- DB batch'lerinde **önce `ROLLBACK`'li kuru çalıştırma**, etkilenen satır/politika listesi gösterilir, onay alınır, sonra uygulanır. Kuru çalıştırmadaki yan etkili kontroller (tetikleyici sınamak için satır güncelleme vb.) commit adımında **tekrarlanmaz**.
- Her DB batch'i bir migration dosyası olarak `supabase/migrations/` altına yazılır — canlıya elle uygulanıp migration atlanmaz, yoksa şema yeniden kurulamaz.
- Kod okuma yolunu değiştiren batch'lerde sıra: **önce kod deploy, sonra yetki revoke** (ör. S3).
- Bitiş kriteri: `npx tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build` temiz.
- **Ek bitiş kriteri:** düzeltmenin işe yaradığı **anon anahtarla kanıtlanır** (`GET /rest/v1/...` → artık 401/boş; yazma denemeleri eşleşmeyen filtreyle). Kanıt PR açıklamasına / commit mesajına yazılır.
- Batch bitince ilgili `security_notes` kaydı `resolved` yapılır, `resolution_note` doldurulur.
- `get_advisors` yeniden çalıştırılır; bulgu sayısının beklendiği gibi düştüğü görülür.

## Batch'ler

### S1 — Atıl ve açık tabloları kilitle ✅

Kapsam: 5 atıl tablo + `bookmark_submissions` + `feedback_submissions` (+ planda olmayan view yazma yolu).

- 5 atıl tabloda `enable row level security`, politika yok, `revoke all from anon, authenticated`
- `feedback_submissions` / `bookmark_submissions`: `ALL / public / true / true` politikaları ve `feedback`'in iki dar politikası (`Allow anonymous feedback submission`, `Only authenticated can read feedback` — ikincisi her oturum açmış kullanıcıya tüm geri bildirimleri okutuyordu) kaldırıldı, `revoke all`
- `devuser` yazma politikaları ve yazma yetkileri (S3'ün yazma kısmı) bu migration'da kapatıldı
- 13 view'da anon/authenticated için yalnızca `SELECT`

**Kanıt:** Öncesi — feedback 15 satır okunabiliyor, `devuser`/`devuser_public` güncellenebiliyor, atıl tablolar okunup silinebiliyor. Sonrası — hepsi `42501 permission denied`; `devuser` (81), `devuser_public` (81), `*_public` view'lar okunabiliyor; `/api/devuser/list`, `/api/devuser-count`, `/api/devuser-dis-list` 200.

**Açık soru (onay gerekir):** Atıl tablolar **silinsin mi**? İçlerinde `full_name` + `ip_hash` + `user_agent` var ve 8 aydır kullanılmıyor. Karar kullanıcıya ait; S1 yalnızca kilitledi.

### S2 — Fonksiyon yetkileri ve `search_path` ✅

- `trigger_news_ingest` EXECUTE geri alındı (S1 migration'ında) — cron `postgres` rolüyle çalışıyor
- `is_admin`, `update_updated_at_column`, `set_security_notes_updated_at` → `search_path = ''`; `set_qa1_code` → `pg_catalog, public` (niteliksiz `qa1_code_seq`)
- **Düzeltme:** planın ilk sürümündeki `get_devuser_public_safe` ve `check_duplicate_registration` hiçbir şemada yok.
- **Bilinçli olarak yapılmadı:** `is_admin` EXECUTE yetkisi anon'dan alınmadı — 24 RLS politikası (providers, tags, gastronomy_*, *_submissions) onu çağırıyor; yetki alınırsa bu tablolardaki anon sorguları hata verir.

### S3 — `devuser` okuma ve yazma politikaları ◐

- **Yazma ✅** (S1): koşulsuz `Users can update own profile` ve `Public insert access` kaldırıldı; anon/authenticated yazma yetkileri alındı. Yazmalar `/api/devuser-{register,update,me}` ve admin route'larında service role ile yapılıyor.
- **Okuma, adım 1 ✅ (kod, `2c76898`):** `/api/devuser/list` `devuser_public` view'ından okur (filtre + izne bağlı WhatsApp maskesi DB'de); `/api/devuser-count` aynı sayıyı service role ile hesaplar. Canlı karşılaştırma: 81/81 satır, aynı sıra, aynı maskeli değerler.
- **Okuma, adım 2 (deploy sonrası):** `devuser` taban tablosunda anon `SELECT` revoke. `authenticated` için karar erişim haritasına (S9) bağlı — tarayıcıdaki `getDevUserClient` oturumunun taban tabloyu okuyup okumadığı doğrulanır. Denetimin 7. bulgusu böylece kapanır.

### S4 — PostgREST filtre enjeksiyonunu genelle ⏳

Mevcut `buildIlikeOrFilter` dört çağrı yerine uygulanır; Edge Function için birebir test edilen bir Deno kopyası.

- `app/api/recruitment-agencies-admin-list/route.ts`
- `app/api/broken-link-reports-admin-list/route.ts`
- `app/api/admin/security-notes/route.ts`
- `supabase/functions/get-users/index.ts` — **en yüksek etkili**: herkese açık Edge Function, service-role istemcisiyle çalışıyor; Edge Function deploy gerekir

### S5 — Storage bucket listeleme ✅

`corner` ve `news` bucket'larındaki geniş `SELECT` politikaları kaldırıldı. İki bucket da public; nesneler public URL'den RLS'siz sunuluyor. Hiçbir kod bucket listelemiyor (yalnızca service role ile `upload` / `getPublicUrl`). Kanıt: anon liste 5 → 0, public nesne 200 → 200.

### S6 — CI güvenlik kontrolleri ⏳

- Yeni workflow: `npm run lint` + `npx tsc --noEmit` + `npm run test:unit` (push to main + PR)
- Bekleyen ek parçalar: `e2e/smoke/admin-guards.spec.ts` listesine `/api/admin/security-notes`; `npm audit` adımı + Dependabot yapılandırması

**Not:** E2E süiti şu an **41 başarısız / 34 geçiyor**. E2E zorunlu kapı yapılmaz; yoksa her PR kırmızı olur.

### S7 — Korumasız API uçları (ürün kararı gerekir) ⛔

`/api/devuser/list` (tek istekte 81 üyenin profili, `ACAO: *`), `/api/devuser-dis-list`, `/api/founder-submissions` — kimlik doğrulamasız ve CORS sınırsız servis edilmesi **kasıtlı mı**?

- **S7.1** Sahiplik kontrolü: `founder-event-vote-submit` (UUID bilen herkes oyu üzerine yazıyor) ve `founder-submissions` POST (whatsapp/linkedin eşleşmesiyle mevcut başvuruyu güncelliyor)
- **S7.2** Hız sınırı: 10 korumasız yazma ucunun hiçbirinde yok; bellek içi sınırlayıcı replikalar arası paylaşılmıyor → DB destekli çözüm
- **S7.3** CORS: `ACAO: *` gerçekten gerekli mi

### S8 — Admin kapısı sertleştirme (ayrı alt plan) ⛔

- `sessionStorage`'daki düz metin admin şifresi → `HttpOnly` cookie + CSRF token (**en büyük parça**)
- DB modundaki PBKDF2 amplifikasyonu (500 satır × 210.000 iterasyon) → anahtar etiketiyle tek satır
- Hız sınırını DB'ye taşı; güvenilir proxy IP'si (şu an istemcinin `X-Forwarded-For`'una dayanıyor)
- Ham DB hata mesajlarını kimliği doğrulanmamış çağırana döndürme
- `cornerAuthorAuth` yazar numaralandırması + 404 yolunda kaydedilmeyen başarısız deneme

### S9 — `anon` / `authenticated` GRANT daraltma (kök neden) ⏳

**Ön koşul:** tablo-kullanım eşlemesi (yapılıyor) — her tablo/view/fonksiyon için erişen kod ve client türü (tarayıcı anon, tarayıcı kullanıcı oturumu, sunucu anon/cookie, service role, edge). Yalnızca service role ile erişilenlerde revoke **sıfır riskli**. Eşleme bağımsız bir doğrulayıcı tarafından "kaçırılan erişim" açısından sınanır. Tablo grupları hâlinde alt batch'ler; Supabase'in yeni tablolar için `default privileges`'ı da daraltılır, yoksa her yeni tablo yeniden açık doğar.

### S10 — Temizlik

- `public/rehber-old/`, `public/article-old/` — `rehber-old/ua.js`, `ue.js` gömülü publishable anahtar ve proje URL'i içeriyor. `public/haberler-old/` `d71d009` ile kaldırıldı; aynısı bunlara uygulanır (önce referans ve canlı trafik kontrolü)
- `app/api/supabase-config/route.ts` — kaynak koda gömülü publishable anahtarlar (biri "revoked" listesinde) → env
- `DEVUSER_AUTH_SECRET` ölü konfigürasyon → kaldırılır
- `devuser.login_pin_hash` / `login_pin_salt`: eski PIN şemasından kalma → kaldırılması değerlendirilir (veri kararı)
- `E1Client.tsx` / `E2Client.tsx`: var olmayan `/api/event-e1-*` uçlarını çağırıyor → özellik tamamlanmalı ya da sayfa kaldırılmalı (ürün kararı)

## Batch dışı — operasyonel açık madde (en az S1 kadar acil)

[public-files-2026-10-21.md](../security/public-files-2026-10-21.md)'de kayıtlı: sızan parola listesindeki **9 adres canlı Supabase Auth kullanıcılarıyla eşleşiyor**; parolalar değiştirilmedi, oturumlar iptal edilmedi, kullanıcılara bildirim yapılmadı. Git geçmişi de temizlenmedi. Bu bir kod batch'i değil — hesap işlemi ve kullanıcı iletişimi gerektirir.

## Önerilen sıra (kalan)

S7 (karar sonrası; önce S7.1 sahiplik açıkları) → S9 kalan gruplar (önce yalnızca yazma yetkileri; okuma için public modüllerin service role'e taşınması) + `ALTER DEFAULT PRIVILEGES` → S10 kalanları → S8 (ayrı alt plan). Takip: `get-users` tech filtresi büyük/küçük harf hatası (mevcut, davranış korunarak bırakıldı); Node 20 EOL (Dockerfile + workflow'lar birlikte 22/24'e); `ci / checks` branch protection'da zorunlu.

## Doğrulama (her batch)

1. `npx tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`
2. **Anon anahtarla kanıt:** düzeltmeden önce ve sonra aynı istek; yanıt kodu ve gövdesi kayda geçer
3. Etkilenen uygulama akışının hâlâ çalıştığı kontrol edilir
4. DB batch'lerinde: migration sonrası politika/yetki durumu `pg_policies` ve `role_table_grants` ile doğrulanır
5. `get_advisors` yeniden çalıştırılır, bulgu sayısı karşılaştırılır
6. İlgili `security_notes` kaydı `resolved` + `resolution_note`
