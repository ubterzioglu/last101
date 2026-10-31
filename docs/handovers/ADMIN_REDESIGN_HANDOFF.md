# Admin paneli: yeni layout'a taşıma (handoff)

Tarih: 2026-10-31. Hedef okuyucu: admin panelini yeni tasarıma taşıyacak oturum.

## Amaç

Herkese açık site yeni açık temaya (firmascope/corteqs tasarımı) geçti. `/admin` hâlâ eski koyu temada (siyah zemin, cam efektli sidebar, `google-*` renkleri). Admin panelini yeni tasarım diline getir. İşlevi, API'leri ve yetkilendirmeyi değiştirme; yalnızca görünüm ve yerleşim.

## Başlamadan önce

- Çalışma dalı: `integrate/redesign-on-main` (redesign + `main`'in son 4 commit'i). Bu dal `main`'e alınmadan önce başka bir oturum tarafından doğrulanıyor. Başlamadan `git status --short --branch` ve `git log --oneline -5` ile hangi dalda olduğunu doğrula. `main` ya da bu dal güncellenmişse ondan dal aç.
- Node 20, `npm` (bun/yarn yok). Teslimden önce `npm run lint`, `npx tsc --noEmit`, `npm run test:unit`, `npm run build` temiz olmalı. Docker build ESLint hatasında kırılır.
- Kullanıcıya görünen tüm metin Türkçe. `AGENTS.md` ve `CLAUDE.md` kuralları geçerli: `cn()` (`@/lib/utils/cn`), `next/link` (iç bağlantıda `<a>` yok), varsayılan Server Component, `no-explicit-any` için disable yorumu yok.

## Tasarım sistemi (kullanılacak)

- Token'lar: `constants/design-tokens.ts` (tek kaynak, AA kontrastı `tests/design-tokens.test.ts` ile korunuyor).
  - Yüzeyler: `bg-page`, `bg-white`, `bg-band`, `bg-ink`. Metin: `text-ink`, `text-muted`. Çizgi: `border-line`.
  - Etkileşimli renk yalnızca `brand-*`. Kategori renkleri `alm-*`, `components/site/tones.ts` içindeki `TONE_STYLES` ile (metin için `.ink` varyantı).
- Yapı taşları: `components/site/*` (PageHead, SectionHeader, ServiceGrid, MediaCard, DarkBand, CtaRow, Chip, FilterPanel, StatRow, Accordion, StepList vb.), `components/ui/*` (Container, Section, Card, Button, Badge). Admin için gerekirse yeni ortak bileşenleri `components/admin/ui/` altında aç; `components/site/*` içindekileri bozma.
- `google-*` renkleri artık legacy: yalnızca admin/devuser içinde kalıyordu. Admin taşınınca bu kullanımların kaldırılması hedef. Henüz kaldırma kararı verilmedi: `devuser` panelini bu iş kapsamında DEĞİL kabul et, onun `google-*` kullanımı kalsın.

## Admin'in bugünkü durumu

- `app/admin/layout.tsx`: `robots noindex`, `data-devuser` bayrağını ilk boyamadan önce `next/script` ile atar (genel Header/Footer'ı `body[data-devuser]` CSS kuralıyla gizler). Bu mekanizmayı koru.
- `components/admin/AdminLayoutShell.tsx`: oturum varsa solda sabit `AdminSidebar`, mobilde hamburger üst bar; oturum yoksa `/admin` giriş ekranı tam genişlikte. Zemin `bg-black text-white`. Yetki sunucuda `isAdminAuthorized` ve her sayfada `useAdminGate` ile zorlanır; shell yalnızca navigasyonu çizer. Bu davranışı değiştirme.
- Sayfalar `app/admin/<bölüm>/`: araclar, broken-link-reports, guvenlik-notlari, haberler, haberler-rehberi, hizmet-rehberi, home, recruitment-agencies, rehber, service-finder, software-hub, uyeler, uygulama-rehberi, yazi-dizisi. Çoğu `page.tsx` (Server) + `components/admin/*Client.tsx` (Client) çifti.
- `components/admin/` toplam yaklaşık 7.500 satır. En büyükleri: `SoftwareHubAdminClient.tsx` (1600), `GuidesAdminClient.tsx` (534), `ProviderSubmissionsAdminClient.tsx` (490), `news/NewsEditorAdminClient.tsx` (466), `SecurityNotesAdminClient.tsx` (377), `AdminSidebar.tsx` (366). Yeni dosya kuralı: 800 satırı geçen dosyayı bölerek ilerle, `SoftwareHubAdminClient.tsx` için özellikle.
- `google-*` sınıfı kullanan 17 dosya var (`grep -rln "google-" components/admin app/admin`). Taşınacak yerlerin listesi bu.

## Dikkat edilecek bağımlılıklar

- `components/MarkdownPreview.tsx`: `tone` (`'dark'` varsayılan, `'light'`) ve `demoteH1` prop'ları var. Admin editörleri (`NewsEditorAdminClient`, `CornerAuthorPanelClient`) şu an varsayılan koyu tonu kullanıyor, `tests/markdown-preview.test.ts` bu markup'ı sabitliyor. Admin açık temaya geçince editör önizlemelerinde `tone="light"` kullan; koyu markup'ı yalnızca devuser/yazar paneli kullanıyorsa koru, testi gerekçesiyle güncelle.
- `components/auth/AuthSplitLayout.tsx`: koyu varyant admin giriş ve yazar paneli için; `tests/auth-split-layout.test.ts` snapshot'ı var. Yönetici girişinin görünümünü değiştirirsen snapshot'ı bilerek güncelle.
- Admin API rotaları (`app/api/*-admin-*`) ve `lib/admin/*`: dokunma.
- E2E: `e2e/smoke/admin-guards.spec.ts` yetki bekçilerini test ediyor; seçicileri kıracak değişikliklerde güncelle.
- Testler: `tests/admin-auth-wrapper.test.ts`, `tests/admin-resource.test.ts` mantığı sabitliyor, görünümü değil.

## Önerilen sıra

1. Mevcut admin ekranlarının (giriş, ana panel, sidebar, 3-4 temsilî yönetim sayfası) ekran görüntülerini al; taşıma sonrası karşılaştır.
2. `AdminLayoutShell` + `AdminSidebar` + `AdminHomeClient` + giriş ekranını yeni tasarımda kur. Bu iskelet onaylanmadan bölüm sayfalarına geçme.
3. Ortak admin bileşenlerini çıkar (tablo, filtre çubuğu, durum rozeti, form alanı, boş durum) ve bölümleri sırayla taşı: küçükten büyüğe, en son `SoftwareHubAdminClient`.
4. Her bölüm sonrası lint + tsc + test; en sonda `npm run build`.
5. Tarayıcıda gerçek oturumla her bölümü aç (masaüstü ve mobil), konsol hatası ve kontrast kontrolü yap.

## Kapsam dışı

`app/(devuser)` paneli, admin API ve yetkilendirme mantığı, Supabase şeması, haber hattı mantığı.

## Teslim

Değişiklikleri küçük commit'ler halinde (`feat:`/`refactor:`) yap. Push veya `main`'e merge için kullanıcıdan onay al.
