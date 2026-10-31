# Admin panelini yeni (açık) layouta taşıma planı

## Context

Public site yeni açık temaya geçti (firmascope/Corteqs: `bg-page`, beyaz kartlar, `border-line`, tek etkileşim rengi `brand-*`). `/admin` hâlâ eski koyu temada: `bg-black text-white`, cam efektli sidebar (`backdrop-blur`), gradient/blur süsleri, `google-*` renkleri ve `white/NN` opaklıklarıyla yazılmış kartlar. Hedef: yalnızca görünüm ve yerleşimi yeni tasarım diline getirmek. İşlev, API (`app/api/*-admin-*`), `lib/admin/*`, yetkilendirme (`isAdminAuthorized`, `useAdminGate`) ve `data-devuser` ilk-boyama bayrağı DEĞİŞMEZ. Kaynak: `docs/handovers/ADMIN_REDESIGN_HANDOFF.md` (2026-10-31).

Kararlar (kullanıcı onaylı):
- Tam açık tema; sidebar da tamamen açık (`bg-white` + `border-line`, aktif öğe `bg-brand-50 text-brand-800`).
- Fazlı teslimat: önce iskelet (kabuk, sidebar, giriş, ana panel) → onay → ortak bileşenler → bölümler küçükten büyüğe, `SoftwareHubAdminClient` en son.
- Kapsam: `components/admin/**`, `app/admin/**` + admin sayfalarında render olan dış istemciler (`HomeNewsAdminClient`, `BrokenLinkReportsAdminClient`, `RecruitmentAgenciesAdminClient`, `CornerAdminClient`). `app/(devuser)`, yazar paneli (`CornerAuthorPanelClient`) ve `/giris` kapsam dışı, `google-*` orada kalır.
- Doğrulama: Playwright ile önce/sonra masaüstü + mobil ekran görüntüsü, konsol kontrolü.

## Keşif özeti

- Admin dosyaları: `app/admin/*` ince sayfa sarmalayıcıları (4–55 satır), mantık `components/admin/*Client.tsx`. Toplam ~7.4k satır. Admin UI'ı için e2e yok (yalnız `e2e/smoke/admin-guards.spec.ts` API yetkisi).
- Renk mekanizması: `app/globals.css` `body[data-devuser]` bloğu gövdeyi `background:#000 !important` yapıyor ve header/footer'ı gizliyor; `[data-admin-main]` 264px sidebar boşluğunu geri veriyor; `:focus-visible` brand outline'ı `body:not([data-devuser])` ile admin'i dışlıyor. Admin ile devuser aynı bayrağı paylaşıyor → admin açık olacağı için ayırmak gerek.
- `google-*`: 17 dosya / 215 kullanım (en yoğun: `GuidesAdminClient` 38, `UygulamaRehberiClient` 28, `NewsGuideAdminClient` 25, `SecurityNotesAdminClient` 22).
- Yeniden kullanılabilir hazır parçalar: `components/ui/Button` (`primary|secondary|outline|ghost|danger|success`), `Card`, `Badge`, `Container`, `Section`; `components/site/Chip`, `FilterPanel`, `StatRow`, `Eyebrow`, `SectionHeader`, `ArrowLink`, `Accordion`; `TONE_STYLES`/`toneAt` (`components/site/tones.ts`); `ToolProgress`/`ToolOption` desenleri.
- Eksik (yeni yazılacak, `components/admin/ui/` altında): `AdminPageHeader`, `AdminStatCard`, `AdminTable`, `AdminFilterBar`, `AdminStatusBadge`, `AdminField` (input/select/textarea), `AdminEmptyState`, `AdminModal`, `AdminTabs`.
- Dikkat: `Button` `asChild` desteklemiyor, href varsa `Link` render eder; `Badge`'de orange/teal yok → `Chip` ya da `BadgeColor` genişletme. `<main>` admin sayfalarına eklenmemeli (kök layout tek `<main>` sağlar).

## Faz 0 — Hazırlık

1. `git status --short --branch`, `git log --oneline -5`; dal `integrate/redesign-on-main` (JsonLd.tsx'te commitlenmemiş değişiklik var, ona dokunma/ayrı tut). `main` ya da dal ilerlemişse ondan yeni dal aç.
2. `npm run dev` ile çalıştır; Playwright ile mevcut ekranların "önce" görüntülerini al: giriş, ana panel, sidebar (masaüstü + mobil drawer), temsilî sayfalar (Üyeler, Hizmet Rehberi, Haberler editör, Software Hub menü). Görüntüler scratchpad'e.
3. Kök `CLAUDE.md`/`AGENTS.md` kurallarını hatırla: `cn()`, `Link`, Server Component varsayılanı, Türkçe metin, emoji/em-dash yok (mevcut "Hoş geldin 👋" emojisi kalkar).

## Faz 1 — İskelet (bu fazın sonunda kullanıcı onayı al)

Dosyalar:
- `app/globals.css`: `body[data-devuser]` kuralını ikiye ayır. Devuser için siyah/gizleme aynen kalsın; admin için yeni bayrak `data-admin` (header/footer/skip-link/cookie gizleme + `[data-admin-main]` gutter) ve `background` bırakılmaz (`bg-page` miras). `:focus-visible` brand outline'ı admin'e de uygulansın (`body:not([data-devuser])` → admin'i de kapsayacak şekilde). `app/admin/layout.tsx` içindeki `beforeInteractive` script ve `AdminLayoutShell` effect'i hem `data-admin` (yeni) hem gerekiyorsa eski bayrakla uyumlu çalışsın; header/footer gizleme mekanizması korunur. Not: `components/layout/SiteFooter.tsx` ve diğer `data-devuser` okuyan yerler (`grep data-devuser`) güncellenir.
- `components/admin/AdminLayoutShell.tsx`: `bg-black text-white` → `bg-page text-ink`; mobil üst bar `bg-white border-line` (backdrop-blur yok), hamburger `Button`/hedef 44px; aynı session/pathname/event mantığı.
- `components/admin/AdminSidebar.tsx` (366 satır): açık stil `bg-white border-r border-line`, öğeler `text-muted`, hover `bg-band`, aktif `bg-brand-50 text-brand-800` + `brand-600` sol işaret, rozetler `TONE_STYLES.red` (google-red yok), çıkış butonu `alm-red-ink`. `NAV_ITEMS` verisini `constants/adminNav.tsx`e çıkar (dosya küçülür); ikon accent'leri `TONE_STYLES.*.text` ile. Logo: şu an `/almanya101.png`; public Header `almanya101header.png` kullanıyor, açık zeminde `almanya101header.png` değerlendir.
- `components/admin/AdminHomeClient.tsx`: giriş + dashboard.
  - Dashboard: gradient/blur/emoji kaldır; `AdminPageHeader` (eyebrow + h1 + açıklama) + `AdminStatCard` grid (3 kolon) + iki bağlantı kartı (`Card variant="hoverable"` + `ArrowLink`). Stat kartları `router.push` yerine `Link`. `loadStats` mantığı aynen.
  - Giriş: `AuthSplitLayout`'a açık varyant ekle (`tone: 'dark' | 'light'`, varsayılan dark → `/giris` ve yazar paneli bozulmaz); admin `tone="light"` kullanır. Form alanları `AdminField`/`Button variant="primary"`. Hata kutusu `TONE_STYLES.red`.
  - Yükleniyor ekranı `bg-page text-muted`.
- Yeni `components/admin/ui/`: `AdminPageHeader.tsx`, `AdminStatCard.tsx`, `AdminField.tsx` (bu fazda gerekenler).
- Testler: `tests/auth-split-layout.test.ts` — dark snapshot değişmemeli; light varyant için yeni snapshot/test ekle (TDD: önce test).

Faz 1 çıkışı: lint + `tsc --noEmit` + `test:unit` temiz; Playwright "sonra" görüntüleri → kullanıcıya göster, onay bekle.

## Faz 2 — Ortak admin bileşenleri

`components/admin/ui/` altında (her biri <150 satır, `cn()` kullanır, `components/site/*` ve `components/ui/*` üzerine kurulu, `google-*` yok):
- `AdminTable` (başlık satırı `bg-band`, satır `border-line`, hover `bg-page`, taşma için `overflow-x-auto`, mobilde kart yığını opsiyonu)
- `AdminFilterBar` (`FilterPanel` tabanlı), `AdminTabs`, `AdminStatusBadge` (durum → `Chip` tone eşlemesi: pending=yellow, approved=green, rejected/open=red, nötr=neutral), `AdminEmptyState`, `AdminModal` (focus trap için `components/layout/useDrawerA11y` desenini kullan), `AdminField` genişletme (select/textarea/checkbox).
- Birim testleri: `AdminStatusBadge` eşleme, `AdminTable` boş durum; `tests/` altında mevcut `*.test.ts` render deseni (renderToStaticMarkup) ile.
- `MarkdownPreview`: admin editörleri `tone="light"` kullanacak (Faz 3'te); `tests/markdown-preview.test.ts` dark testi yazar paneli (`CornerAuthorPanelClient`) kullandığı için korunur, light için test eklenir.

## Faz 3 — Bölümler (küçükten büyüğe, her grup sonrası lint+tsc+test+görsel kontrol)

Sıra (satır sayısı):
1. Küçük/ince: `app/admin/home/page.tsx` (+ `HomeNewsAdminClient`), `ServiceFinderAdminClient` (306), `AraclarAdminClient` (215), `app/admin/*/page.tsx` sarmalayıcılarındaki sınıflar, `BrokenLinkReportsAdminClient`, `RecruitmentAgenciesAdminClient`.
2. Orta: `MembersAdminClient` (325), `SecurityNotesAdminClient` (377), `ProviderSubmissionsAdminClient` (490), `UygulamaRehberiClient` (342), `GuidesAdminClient` (534), `CornerAdminClient`.
3. Haberler: `news/NewsAdminShell`, `NewsAdminPanel`, `NewsQueueAdminClient`, `NewsSourcesAdminClient`, `NewsPipelineAdminClient`, `NewsSettingsAdminClient`, `NewsGuideAdminClient`, `NewsEditorAdminClient` (+ `MarkdownPreview tone="light"`).
4. `FounderSubmissionsAdminSection`, `FounderEventSurveyAdminSection`.
5. `SoftwareHubAdminClient` (1600): önce bölme, sonra tema.
   - Inline `const css` (satır 30–170) ve `<style>` kaldırılır; Space Grotesk / hardcoded Google gradient gider. Tailwind sınıfları + `AdminTable`/`Card`.
   - Bölümleri `components/admin/softwareHub/` altına çıkar (zaten ayrılmış founders/founderSurvey desenini izle): `DevUserSection`, `TournamentSection`, `HackathonSection`, `TypingSection`, `PromoteSection`, `CvOptSection`, `DiscussionSection`, `NewsSection`, `MeetingSection`; ortak state/API sabitleri `softwareHub/api.ts` ve küçük hook'lara. Hedef: hiçbir dosya >800 satır.
   - `loadAdminAuth/getAdminHeaders` kopyaları (`dad_admin_auth_v1`) `lib/admin/clientAuth` ile birleştirme davranış değişikliği olabilir → bu işte YAPMA, ayrı iş olarak not et (kapsam dışı: auth mantığı). Yalnız görünüm taşınır; bölme sırasında kodu birebir taşı.
   - `NewsategorySelect` yazım hatası düzeltilebilir (yalnızca bileşen adı).

Her dosyada dönüşüm tablosu:
| Eski | Yeni |
|---|---|
| `bg-black text-white` | `bg-page text-ink` |
| `bg-white/[0.03..0.08]` + `border-white/10` | `bg-white border border-line` (kart), `bg-band` (panel/filtre) |
| `text-white/45..72` | `text-muted` (ikincil), `text-ink` (birincil) |
| `google-blue` / `bg-google-blue` | `brand-700` (buton/link), `brand-600` (vurgu) |
| `google-red/green/yellow/orange` | `TONE_STYLES.red/green/yellow/orange` (`tint`, `text`=ink) |
| `rounded-2xl`, `rounded-xl` | `rounded-card` / `rounded-btn` / `rounded-tile` |
| `backdrop-blur`, gradient, `blur-3xl`, glow | kaldır |
| `focus-visible:ring-offset-black` | brand outline (global) |

## Faz 4 — Kapanış

- `grep -rln "google-" components/admin app/admin` → 0 (devuser ve yazar paneli hariç). Dış admin istemcilerinde de kontrol.
- `bg-black|backdrop-blur|bg-gradient|white/\[` taraması `components/admin` + `app/admin` içinde → 0.
- `google.*` Tailwind bloğu devuser için kalır (kaldırma kararı yok).
- Küçük commit'ler: `refactor:`/`feat:` formatında, faz/bölüm başına. Push ve `main`'e merge için kullanıcıdan onay al.
- Handoff dokümanını güncelle ve `docs/handovers/README.md`'ye ekle (şu an listede yok).

## Doğrulama

1. Her adım: `npm run lint`, `npx tsc --noEmit`, `npm run test:unit`; sonunda `npm run build` (Docker ESLint'te kırılır).
2. Playwright (`localhost:3000/admin`, şifre `ADMIN_PANEL_PASSWORD` `.env.local` veya kullanıcıdan): giriş, dashboard, sidebar (aktif durum, rozetler, mobil drawer aç/kapa), her bölüm sayfası; 1440px ve 390px; önce/sonra görüntü karşılaştırması; `browser_console_messages` ile konsol hatası yok; sidebar/gutter kayması yok, header/footer admin'de görünmüyor (`data-admin`), `/devuser/*` hâlâ siyah ve eski.
3. Kontrast: yeni kombinasyonlar yalnızca `design-tokens` çiftleri (`text-ink`/`text-muted` on `bg-page|white|band`, `brand-700` on white); `tests/design-tokens.test.ts` geçmeli.
4. Regresyon: `e2e/smoke/admin-guards.spec.ts` çalışır; `/giris` ve yazar paneli görünümü değişmedi (dark AuthSplitLayout + MarkdownPreview snapshot'ları geçer).
5. `Grep` ile placeholder/`test.skip`/TODO taraması; `code-reviewer` ajanı ile ayrı inceleme geçişi.

## Riskler

- `data-devuser` bayrağını ayırırken admin'de header/footer flash'ı: `beforeInteractive` script yeni bayrağı da erken atmalı.
- `SoftwareHubAdminClient` bölmesi büyük ve UI testi yok → bölmeyi tema değişikliğinden ayrı commit'le, birebir taşı, her bölümü Playwright ile aç.
- Dark `AuthSplitLayout`/`MarkdownPreview` snapshot'ları: varsayılan `dark` korunarak kırılmaz.
- Admin için emoji/em-dash yasağı public sayfalar için yazılmış; admin metinlerinde de uyumlu tutulur ama davranışsal metin (`tests/home-sections.test.ts` beklentisi gibi) değiştirilmez.
