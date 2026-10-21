# Birleşik Plan — Haber Hattı Düzeltmeleri + Clean Code (almanya101)

Bu belge iki planı tek sıraya koyar:
- **Haber planı (H):** ayrıntılı hali [news-admin-plan.md](./news-admin-plan.md). Buradaki H maddeleri onun özetidir; satır numaraları ve gerekçeler orada.
- **Clean code planı (C):** repo genelinde tekrar, tip ve CLAUDE.md uyumu temizliği.

Not: Bulgular kod okumasına ve grep/`wc` taramasına dayanıyor. Canlı veri, edge function, `tsc` ve ESLint çalıştırılmadı.

## Context
- **H:** Haber hattı (`supabase/functions/news-ingest/index.ts`) İngilizce haberleri çevirmeden `pending_review` kuyruğuna düşürüyor (aktif iki Euronews kaynağı; AI kapalıyken başlık/özet olduğu gibi yazılıyor). Site tamamen Türkçe olmalı. Ayrıca hata, güvenlik ve performans bulguları var.
- **C:** 364 TS/TSX dosyasının 33'ü 400 satırın üzerinde; Supabase service client ~30 yerde inline (37 API route); 43 admin route'ta auth boilerplate; 12 admin client (~7.160 satır) aynı kalıpta; `SoftwareHubAdminClient.tsx` 1574 satır ve 48 `any`; kökte dağınık dosyalar.

## Birleştirme kararları (neden bu sıra)
1. **Önce H, sonra C refactor.** H'nin kullanıcıya dönük asıl sorunu var (İngilizce haber sızıyor). C refactor'ları aynı dosyalara (`lib/news/admin.ts`, news API route'ları, `NewsSourcesAdminClient`, `NewsQueueAdminClient`) dokunuyor; önce davranış değişiklikleri girip sonra yapı değişirse çakışma ve regresyon riski azalır.
2. **`lib/news/admin.ts` bölünmesi (C-6) H-1…H-3'ten sonra.** H satır numaralarına atıfta bulunuyor (`:297-356`, `:574/609`, `:107`, `:321`); bölme bu atıfları geçersiz kılar.
3. **Header sabitleri ve `withAdmin` (C-2) H-3'ten sonra.** H-3 `x-admin-email` sahteciliğini ve pipeline secret kontrolünü düzeltiyor; sabitler ve sarmalayıcı bu düzeltilmiş davranışı birebir taşımalı.
4. **Kuyruk UX'i (H-4) `useAdminResource` (C-5) sonrası.** Sayfalama, toplu işlem ve yükleniyor durumu hook'ta bir kez yazılsın, `NewsQueueAdminClient` ona geçsin.
5. **Şema kuralı.** C refactor'ları DB şemasını değiştirmez. Şema değişiklikleri yalnızca H migration'larıdır ve her biri önce SELECT ile etkilenen satırlar gösterilerek, onaydan sonra `psql` ile uygulanır.
6. **Test.** H-4'teki unit testler (`language.ts`, `dedupe.ts`, `relevance.ts`, `lib/news/admin.ts`) yazılırken hedef %80 kapsama; C aşamalarında refactor edilen yerler için mevcut davranışı kilitleyen testler önce yazılır.

## Ön koşul (Aşama 0)
- Çalışma ağacı: `RecruitmentAgenciesAdminClient.tsx` (değişiklik), `supabase/migrations/20261021120000_add_career_platforms_recruitment_agencies.sql` (yeni), `docs/news-admin-plan.md` (yeni), `docs/clean-code-plan.md` (bu dosya). Bunlar ayrı commit'lenir veya stash'lenir; haber PR'ına ve refactor'a karışmaz.
- `almanya101.de-20261013T181019.html` (1 MB) commit edilmez; sil veya `.gitignore`'a ekle.

### C-0 Güvenli temizlik
- `summarya.txt` tracked ise kaldır. 21 kök `.md` + `english-jobs-insert.sql`, `update_oneri.js` → `docs/` veya `scripts/`; `og.png`, `yeniherologo.png` → `public/` (kullanımlar grep'lenip yollar güncellenir).
- `scripts/corteqs-dump` içinde git'te olmaması gereken veri var mı kontrol et.
- Ölü kod adayları: `Carousel.tsx`, `ContactChannels.tsx`, `ContactForm.tsx`, `JobCard.tsx`, `use-mobile-menu.ts`. Silmeden önce knip/ts-prune + grep (dinamik import dahil). `HomeNewsAdminClient.tsx` büyük olasılıkla yanlış pozitif, dokunma.

## Aşama 1 — PR 1: İngilizce haberi engelle (H-1 + H-2'nin ilk iki maddesi)
H-1 (asıl istek):
1. **Veri migration'ı:** iki Euronews kaynağını `is_active=false`; GDELT `allowedLanguages`'dan `english` çıkar; mevcut İngilizce `pending_review` postlarını `rejected` yap. Önce SELECT ile sayıyı ve satırları göster.
2. **Dil kolonu:** `news_posts.language_code`, `news_raw_items.language_code` (text, index); ingest'te yazılır (`index.ts:318-346`).
3. **Fetch-time filtre:** yeni `supabase/functions/news-ingest/language.ts`. Başlık+açıklamada hafif heuristik (tr/de/en stopword ve Türkçe karakterler); `news_pipeline_settings.allowed_languages` (varsayılan `['tr','de']`) dışındakiler atlanır; kaynağın `language_code`'u yedek ipucu. Atlanan öğe `news_raw_items`'e `filtered_reason='language'` ile yazılır (tekrar çekilmesin); run özetine `skipped_language` sayacı.
4. **GDELT:** boş `language` artık filtreyi atlamasın (`gdelt.ts:135`).
5. **Admin UI:** kaynak formunda dil seçici (tr/de/en, "en seçilirse haber alınmaz" uyarısı); ayarlarda "İzin verilen diller"; kuyrukta dil filtresi ve rozet; `listAdminPosts` `language` parametresi; `createNewsSource/updateNewsSource` sunucu tarafı dil doğrulaması.
6. **Public güvenlik:** `lib/public-news.ts` sorgusuna `language_code in ('tr','de')` (veya null).

H-2'nin ilk iki maddesi (aynı PR):
- `NEWS_SOURCE_TYPES` ve `types/news.ts`'e `'trthaber'` ekle (TRT kaynağı kaydedilince sessizce `rss`'e dönüyor).
- `updateNewsSource` kısmi PATCH'te alanları sıfırlıyor ve `last_error`'ı eziyor → yalnızca gelen alanlar güncellensin.

Doğrulama: `language.ts` için tr/de/en örnek başlık testleri; edge function'ı elle çalıştır, run özetinde `skipped_language > 0` ve kuyruğa yeni İngilizce kayıt düşmediğini gör; `/admin/haberler` dil filtresi/rozeti ve `/haberler` sayfasında İngilizce haber olmadığını tarayıcıda doğrula.

## Aşama 2 — PR 2: Haber hata ve güvenlik düzeltmeleri (H-2 kalan + H-3)
Hatalar:
- Raw insert sonrası post insert başarısızsa raw satırı sil/işaretle (öğe sonsuza dek bloklanıyor).
- `ai_daily_limit` gerçek günlük sayaç olsun (`news_ingest_runs` toplamı); Gemini hatası tüm kaynağı düşürmesin, öğe bazında yakalansın.
- Legacy `news-admin-action` `set_status` reddet/arşivle'yi `draft`'a çeviriyor → düzelt veya yeni API'ye yönlendir.
- `deleteAdminPost` audit kaydı cascade ile siliniyor → kalıcı log veya soft-delete.

Güvenlik:
- `sources/[id]/test/route.ts`: `validateSourceUrl` + timeout + boyut sınırı (SSRF); http reddet, redirect doğrula.
- `.or()` içindeki `q`/`source` kaçışlansın (PostgREST filtre enjeksiyonu, `lib/news/admin.ts:321`).
- `x-admin-email` sahte verilebiliyor → actor sunucuda sabit/oturumdan türetilsin.
- `NEWS_PIPELINE_SECRET` yoksa edge function reddetsin (`index.ts:106-110`); CORS `*` kaldır.
- Hata mesajları istemciye ham dönmesin, sunucuda loglansın.
- Not (ayrı iş): in-memory rate limit → DB/Redis destekli.

Bu aşamadan sonra güvenlik incelemesi için `security-reviewer` ayrı geçiş olarak çalıştırılır.

## Aşama 3 — Altyapı tekilleştirme (C-1, C-2)
**C-1 Supabase service client:** yeni `lib/supabase/admin.ts` ile `createServiceClient()` (env doğrulaması, eksikse net hata). 37 route'taki inline `createClient(url, serviceRoleKey, ...)` ve yerel `getSupabaseAdmin` kopyaları (`participant-admin-list`, `participant-admin-bracket-action`) bununla değişir; `lib/news/admin.ts`'teki `createAdminPost` da kullanır.

**C-2 Admin auth:**
- `lib/admin/headers.ts`: `x-admin-password`, `x-admin-key`, `x-admin-email`, `x-corner-admin-key`, `x-corner-author-key`, `x-pipeline-secret` sabitleri.
- `lib/admin/withAdmin.ts`: `withAdmin(handler)` = `isAdminAuthorized(req)` + hata zarfı; `-admin-list` / `-admin-action` route'larına uygulanır. `cornerAuth` / `cornerAuthorAuth` aynı kalıba çekilir.
- Aşama 2'deki `x-admin-email` ve pipeline secret düzeltmeleri aynen korunur. Rate limit ve DB/simple mod davranışı birebir. Route URL'leri değişmez.

## Aşama 4 — Tip güvenliği ve CLAUDE.md uyumu (C-3, C-4)
**C-3:**
- `SoftwareHubAdminClient.tsx` 48 `any` ve diğerleri (`participant-admin-*`, `FounderSubmissionsAdminSection`, `lib/public-news.ts`, `JobCard`) için `types/` altında tipler. `no-explicit-any` disable yok.
- 5 `react-hooks/exhaustive-deps` disable'ı gerçek bağımlılıklarla çöz (`DisadClient`, `DuClient` x2, `ProfileEditClient`, `SoftwareHubAdminClient`).

**C-4:**
- `hizmet-rehberi/page.tsx` (673) ve `vatandaslik-testi/page.tsx` (492): client kısmı `*Client.tsx`'e, `page.tsx` Server Component + `createMetadata()`.
- `software-hub/page.tsx`, `authors/[authorSlug]/page.tsx` için `createMetadata`/`createArticleMetadata`; `kose-giris/*`, `kose-panel/*` noindex olabilir, önce kontrol.
- Gereksiz `'use client'` adayları (`MarkdownPreview`, `NewsGuideAdminClient`, `devuser/dev/page.tsx`) doğrulanıp kaldırılır.
- ~104 template-literal `className` (39 dosya) → `cn()`; çok satırlı `<a` etiketlerinde iç link olanlar `Link`'e (~10 dosya).

## Aşama 5 — Admin client tekrarı + kuyruk UX (C-5 + H-4 UI)
- `hooks/useAdminResource.ts` (liste yükleme, filtre, sayfalama, mesaj/hata, action fetch, yükleniyor durumu; `lib/admin/clientAuth.ts` kullanır) + `components/admin/AdminTable.tsx`.
- Pilot: `RecruitmentAgenciesAdminClient`, `ProviderSubmissionsAdminClient`, `MembersAdminClient`, `BrokenLinkReportsAdminClient`. Çalışırsa kalanlara yayılır.
- `NewsQueueAdminClient` bu hook'a geçerken H-4 UI maddeleri birlikte gelir: sayfalama (offset/cursor), varsayılan filtre `pending_review`, toplu onay/red, reddetmede onay, aksiyon butonlarında yükleniyor durumu, sıralama + `relevance_score` sütunu, arama debounce; stat kartları aktif filtreye uyumlu.
- Ardından `SoftwareHubAdminClient` (1574) alt bileşenlere bölünür (liste, form, satır, hook).

## Aşama 6 — Haber backend performans ve bakım (H-4 backend)
- Dedupe: `insert ... on conflict do nothing` (N+1 ve SELECT-then-INSERT yarışını kaldırır).
- İndeksler: `news_posts(status, created_at)`, `raw_item_id`, `news_raw_items(fetched_at)`; `q` için pg_trgm (migration; önce SELECT/EXPLAIN).
- Retention job'unu gerçekten yaz (`raw_retention_days` placeholder).
- Gemini model adı, `reading_minutes`, 260 karakter limiti, kategoriler tek yerde sabit/ayar.
- `news_posts` baseline migration eksik (şema migration'lardan kurulamıyor) → ekle veya dokümante et.
- Unit testler: `language.ts`, `dedupe.ts`, `relevance.ts`, `lib/news/admin.ts`; admin akışı için Playwright smoke. Hedef %80 kapsama.

## Aşama 7 — Büyük dosyaların bölünmesi (C-6)
- `lib/news/admin.ts` (727) modüllere bölünür (kaynaklar, postlar, audit, doğrulama). Aşama 1–6 bittikten sonra, çünkü H maddeleri bu dosyada.
- `components/tools/ToolPageCards.tsx`: başlık, "Nasıl çalışır?", "Neden var?" kartları (10 `(site)` sayfası).
- `e1`/`e1a`/`e2`/`e2a` (630–690 satır, birbirine çok benzer) ortak bileşen + konfigürasyon. `du`, `list`, `profile-edit` (1100–1450) bölümlere ayrılır.
- `toolConfig.ts` (1075/980), `belgeler/data.ts` modüllere/JSON'a bölünür.

## Kapsam dışı / risk
- C refactor'ları route URL'lerini, DB şemasını ve Türkçe UI metinlerini değiştirmez.
- En yüksek regresyon riski: Aşama 5 ve 7 (otomatik test kapsamı belirsiz → pilot-önce, davranış kilitleme testi, elle kontrol).
- Aşama 1 ve 6 canlı veriyi etkileyen migration içerir; her biri SELECT ile gösterilip onay alındıktan sonra uygulanır (erişim bilgisi memory'de).

## Doğrulama (her aşama sonunda)
1. `npm run lint` temiz, `npx tsc --noEmit`, `npm run build`.
2. Aşama 1–2: edge function elle çalıştırılır; admin ve public haber sayfaları tarayıcıda doğrulanır (yukarıdaki kontroller).
3. Aşama 3: birkaç admin endpoint'e yetkili/yetkisiz istek (401 ve normal akış değişmedi).
4. Aşama 4–7: `npm run dev` ile ilgili sayfalar elle gezilir (admin panel bölümleri, `/hizmet-rehberi`, `/vatandaslik-testi`, tool sayfaları, devuser e1/e2); gerekirse Playwright smoke.
5. C-0: silinen dosyalar için grep ile referans kalmadığı doğrulanır.
6. Her aşama ayrı commit/PR; sonunda `code-reviewer` ayrı geçiş olarak çalıştırılır.

## Önerilen başlangıç
Aşama 0 (commit/stash + C-0) → Aşama 1 (PR 1). Aşama 1'e başlarken ilk adım migration'ın etkileyeceği satırları SELECT ile listelemek.
