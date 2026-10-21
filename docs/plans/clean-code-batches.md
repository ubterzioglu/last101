# Kalan Clean Code İşleri — Küçük Batch Planı (almanya101)

## Context
21 Ekim'de birleşik planın (docs/plans/clean-code-plan.md) Aşama 0–3'ü ve Aşama 4'ün CLAUDE.md uyumu kısmı canlıya alındı (main: `bfbea4c`). Kalan işler büyük aşamalar halindeydi (ör. "Aşama 5: admin client tekrarı"), bu da uzun review'lar ve riskli tek seferlik merge'ler demek. Amaç: kalanı **her biri tek PR, ~5–10 dosya, tek başına review + canlıya alınabilir** küçük batch'lere bölmek.

## Her batch için ortak kurallar
- Kendi worktree'si + branch'i (ana çalışma alanını paralel oturum kullanabiliyor; stash'e güvenme).
- Davranış değişmez (aksi batch'te açıkça yazılı). Türkçe UI metinleri, route URL'leri değişmez.
- Bitiş kriteri: `npx tsc --noEmit`, `npm run lint`, `npx vitest run` (bilinen `survey.test.ts` hariç), `npm run build` temiz; LF satır sonu (`git diff --stat` = `--ignore-cr-at-eol`).
- Bağımsız code-review → düzelt → kullanıcı onayı → `main`'e fast-forward push → canlı smoke test.
- DB değişikliği olan batch'lerde: önce ROLLBACK'li kuru çalıştırma, onay, sonra uygulama (scratchpad `dbtool`, `pg`).
- Bulunan güvenlik konuları `security_notes` tablosuna `source='agent'` ile kaydedilir.

Güvenlik işleri ayrı izleniyor: [security-batches.md](./security-batches.md) (S1–S10). Güvenlik batch'leri öncelikli; B3 ve sonrası onlarla aynı dosyalara dokunmadığı sürece paralel yürütülebilir.

## Sıra ve batch'ler

### B0 — Ön koşul / hijyen (çok küçük)
- **B0.1** ✅ vitest 4 yükseltmesi ve `tests/footer.test.ts` JSX hatası: npm audit çalışmasında çözüldü (`18af1f7`).
- **B0.2** ✅ `tests/survey.test.ts`: test bayattı. `f2f63ed` (2026-07-05 anket sürümü) 15 azalan ağırlığı 20 eşit ağırlığa (0.05) çevirmişti; test yeni ağırlıklara göre güncellendi ve ağırlıklı hesabı sınayan ayrı bir test eklendi.
- **B0.3** Temizlik: birleştirilmiş yerel branch'ler + `.claude/worktrees/*` (agent worktree'leri) silinir. Kod değişmez.

### B1 — Küçük ertelenmiş düzeltmeler
- **B1.1** `app/api/broken-link-reports/route.ts`: modül seviyesindeki anon client'ı handler içine al (env eksikse build çökmesin). 1 dosya.
- **B1.2** `public/haberler-old/` (anon key ile `news_posts` okuyan eski statik sayfalar, dil filtresini atlıyor): referans yoksa sil. Önce grep + canlı trafik/yönlendirme kontrolü.
- **B1.3** DB CHECK constraint'leri: `news_posts.language_code`, `news_raw_items.language_code` ∈ (tr,de,en) veya null; `news_pipeline_settings.allowed_languages <@ {tr,de,en}`. 1 migration (kuru çalıştırma → onay).

### B2 — Tip güvenliği (Aşama 4 kalanı), dosya bazında
- **B2.1** Küçük `any`'ler: `participant-admin-*` route'ları, `FounderSubmissionsAdminSection`, `lib/public-news.ts`, `founder-submissions`, `devuser/list` (≈20 adet). Tipler `types/` altına.
- **B2.2** ✅ `SoftwareHubAdminClient.tsx` (1574 satır, 48 `any` → 0) — veri tipleri `types/software-hub.ts`'te; yapı bölünmedi.
- **B2.3** 5 `react-hooks/exhaustive-deps` disable'ı: `DisadClient`, `DuClient` ×2, `ProfileEditClient`, `SoftwareHubAdminClient`. Her biri `useCallback`/bağımlılıkla; davranış (gereksiz yeniden fetch) elle kontrol.
  - Durum: `DuClient`'in ikisi kaldırıldı (Enter ile çift gönderim ve başarı sonrası yeniden gönderim hataları da düzeltildi). `DisadClient`, `ProfileEditClient` (yalnızca mount) ve `SoftwareHubAdminClient.loadSectionData` (sabit kimlik gerekiyor) bilinçli; açıklamalı disable olarak kaldı (B2.4 / B5.7).
- **B2.4** `eslint-plugin-react-hooks` v7'ye yükseltme (`eslint-config-next` 5.2.0 getiriyor; v7 React 19.2 `useEffectEvent`'i tanır). Ayrı batch çünkü v7 yeni kurallar (compiler kuralları) getirir; önce yeni uyarıların sayımı, sonra kalan mount-only disable'ların `useEffectEvent`'e çevrilmesi.

### B3 — Admin istemci tekrarı (Aşama 5), pilot-önce
- **B3.1** ✅ `hooks/useAdminResource.ts` (liste yükle, filtre, mesaj/hata, action fetch, yükleniyor durumu; `lib/admin/clientAuth.ts getAdminHeaders` kullanır) + test. Henüz hiçbir bileşen geçmez.
  - Durum: fetch/parse mantığı saf fonksiyonlarda: `lib/admin/adminResource.ts` (`buildAdminListUrl`, `fetchAdminList`, `postAdminAction`, `readJsonSafely`, `getErrorMessage`), testleri `tests/admin-resource.test.ts` (mock `fetch`). Hook yalnızca liste durumunu tutar (`data`/`setData`/`loading`/`error`/`reload`); action'lar `postAdminAction` ile çağrılır, ardından `setData` veya `reload`. Mesaj durumu bileşende kalır. Members/Provider'a özgü kısımlar (sunucu `error` mesajı, 401'de `/admin`'e yönlendirme, satır bazlı meşgul durumu) B3.3/B3.4'te gerekince eklenir.
- **B3.2** ✅ Pilot: `BrokenLinkReportsAdminClient` (208 satır) hook'a geçer. URL'ler, gövdeler, header'lar, mesajlar ve arayüz aynı.
- **B3.3** `RecruitmentAgenciesAdminClient` + `MembersAdminClient`.
- **B3.4** `ProviderSubmissionsAdminClient` + gerekiyorsa `components/admin/AdminTable.tsx`.
- **B3.5** Haber kuyruğu UX (`NewsQueueAdminClient`): sayfalama (offset), varsayılan filtre `pending_review`, reddetmede onay, buton yükleniyor durumu, arama debounce. `listAdminPosts`'a `offset`.
- **B3.6** Haber kuyruğu toplu onay/red (yeni `POST /api/admin/news/posts/bulk` + `withAdmin`; actor `getAdminActor`).

### B4 — Haber backend (Aşama 6)
- **B4.1** İndeksler: `news_posts(status, created_at)`, `news_posts(raw_item_id)`, `news_raw_items(fetched_at)`; arama için `pg_trgm` (title/summary). Migration, önce `EXPLAIN` + kuru çalıştırma.
- **B4.2** Dedupe: SELECT-then-INSERT yerine `insert ... on conflict do nothing` (canonical_url / unique_hash unique index'leri mevcut); `filtered_reason='language'` yeniden deneme mantığı korunur. Edge function deploy.
- **B4.3** Retention job: `raw_retention_days`, `ingest_run_retention_days`, `rejected_posts_retention_days` ayarlarını uygulayan pg_cron SQL fonksiyonu (önce kuru çalıştırma ile silinecek satır sayıları).
- **B4.4** `news_posts` baseline migration (şemanın migration'lardan yeniden kurulabilmesi) — yalnızca `create table if not exists`, canlıya etkisiz.
- **B4.5** Unit testler: `dedupe.ts`, `relevance.ts`, `normalize.ts`, `lib/news/admin.ts` saf yardımcıları (`buildSourcePayload` vb.).

### B5 — Büyük dosyaların bölünmesi (Aşama 7), her dosya ayrı batch
- **B5.1** `lib/news/admin.ts` (~750 satır) → `lib/news/admin/{posts,sources,settings,validation}.ts` + re-export (`lib/news/admin.ts` korunur, import'lar değişmez).
- **B5.2** `components/tools/ToolPageCards.tsx` (başlık / "Nasıl çalışır?" / "Neden var?" kartları) + 2 tool sayfası pilot; sonra **B5.3** kalan 8 sayfa.
- **B5.4** devuser `e1`/`e1a`/`e2`/`e2a` (630–690 satır, neredeyse kopya): önce diff ile ortak kısım tespiti, ortak bileşen + config; pilot e1/e1a, sonra e2/e2a.
- **B5.5** `DuClient`, `ListClient`, `ProfileEditClient` (1100–1450 satır): her biri bölümlere/alt bileşenlere (ayrı batch'ler).
- **B5.6** `toolConfig.ts` (1075/980 satır), `belgeler/data.ts`: veri modüllerine bölme (davranış yok, yalnızca dosya düzeni).
- **B5.7** `SoftwareHubAdminClient` yapı bölünmesi (B2.2 ve B3 sonrası).

## Önerilen ilk adım
B0.1 + B0.2 (test altyapısı yeşil olmadan sonraki batch'lerin "testler geçiyor" kriteri anlamsız), ardından B1 → B2 → B3 → B4 → B5. B2 ile B4 birbirinden bağımsız; paralel worktree'lerde yürütülebilir.

## Doğrulama (her batch)
1. `npx tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build` (gerçek env ile, worktree'ye geçici `.env.local` kopyası, iş bitince silinir).
2. Bağımsız code-review (read-only agent) → bulgular düzeltilir.
3. Canlı smoke: `/`, `/haberler`, `/api/news`, ilgili admin API'leri anahtarla (200) ve anahtarsız (401); batch'e özel sayfa/endpoint.
4. DB batch'lerinde: migration sonrası constraint/index varlığı ve satır sayıları sorgu ile doğrulanır.
