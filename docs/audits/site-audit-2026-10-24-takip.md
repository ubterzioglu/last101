# 24 Ekim 2026 site denetimi — kural bazlı takip tablosu

**Kaynak rapor:** `01M5P9ZWMDKZC51S52VBEDYZ4C.json` (34 sayfa tarandı, 26 sayfa atlandı; 41 hata, 315 uyarı)
**Plan:** `docs/plans/site-audit-2026-10-24.md`
**Durum:** Kod değişiklikleri tamamlandı; canlı doğrulama ve tam kapsamlı yeniden denetim dağıtım sonrası yapılacak.

Karar sözlüğü:
- **düzeltildi** — kod/içerik değişikliği yapıldı, yerel doğrulama geçti.
- **dağıtım sonrası doğrulanacak** — düzeltme dağıtıldığında canlıda ölçülmeli.
- **gerekçeli kabul** — ürün/güvenilirlik kararıyla bilinçli olarak değiştirilmedi.

## 1. Erişilebilirlik ve temel hatalar

| Kural | Örnek sayfa | Karar | Kanıt / not |
|---|---|---|---|
| `a11y/landmark-one-main` | `/almanya-araclari`, `/giris`, araç sayfaları | düzeltildi | Kök `app/layout.tsx` tek `<main id="main-content">`; `almanya-araclari`, `yeniarachub`, `AuthSplitLayout`, tüm devuser/admin istemcilerindeki iç `<main>` etiketleri `<div>` yapıldı. Yerel duman testinde örneklenen tüm sayfalarda tek `<main>`. |
| `a11y/landmark-regions` | site geneli ("No `<footer>` landmark") | düzeltildi | Yeni `components/layout/SiteFooter.tsx` tüm herkese açık sayfalarda `<footer>` render eder; `globals.css` devuser/admin'de gizler. |
| `a11y/aria-input-field-name`, `a11y/form-labels`, `a11y/select-name` | `/tatil/almanya`, `/tatil/turkiye`, `/hizmet-rehberi`, `/is-ilanlari` | düzeltildi | `holiday-calculator.tsx` ve `german-holiday-calculator.tsx` tarih/eyalet kontrollerine `useId` ile `htmlFor`+`id`; `HizmetRehberiClient` arama ve şehir kontrollerine ilişkili etiket, kategori düğme grubuna `role="group"`; `RecruitmentAgencies` arama ve kategori `select`lerine `aria-label`. Placeholder etiket sayılmadı. |
| `a11y/identical-links-same-purpose` | `/almanya-araclari`, `/` | düzeltildi | "Aracı aç" bağlantılarına `aria-label="Aracı aç: <araç adı>"` (her iki hub); `NewsCarousel` "Devamını Oku →" bağlantılarına `aria-label="Devamını oku: <başlık>"`. |
| `a11y/image-redundant-alt` | `/giris`, `/haberler`, `/` | düzeltildi | Dosya adıyla birebir `alt="almanya101"` → "Almanya101 logosu" (`AuthSplitLayout`, `HomeHeroSection`); başlığı birebir tekrarlayan kart görselleri (`NewsCarousel`, `NewsListCard`, `NewsHeroCard`, makale kapağı, `LinkCard`) dekoratif sayılıp `alt=""` yapıldı. |
| `content/unrendered-markup` | `/belgeler` (73 `*…*`) | düzeltildi | Kaynak `app/(site)/belgeler/data.ts` düz metin; `**`/`*` vurgu işaretleri kaynağında temizlendi, kalan tek yetim `**` elle düzeltildi. Görünen metinde yıldız kalmadığı doğrulandı. |

## 2. İndekslenebilirlik, metadata, şema

| Kural | Örnek sayfa | Karar | Kanıt / not |
|---|---|---|---|
| `core/robots-meta`, `crawl/canonical-chain` | 10 araç URL'si `/giris?next=`e yönleniyordu | düzeltildi | `middleware.ts` yönlendirmesi kaldırıldı. Anonim `GET /<araç>` artık 200 + sunucudan render tanıtım (açıklama, kapsam, sınırlar, resmî kaynaklar, görünür SSS, giriş CTA). Oturumlu kullanıcı aynı URL'de etkileşimli aracı alır (`ToolPageScaffold`, `ToolAccessGate`). `verify-seo` ve e2e (`tool-intro.spec.ts`, `public-routes.spec.ts`) yeni davranışa göre güncellendi; yerel koşuda 61/61 smoke + 8/8 auth'lu araç testi geçti. `/giris` noindex kaldı, sitemap'te yok. |
| Kişisel API yetkisi | `/api/tool-questionnaires` | düzeltildi | Anket gönderim API'sine oturum kontrolü eklendi (401); birim testi "rejects anonymous submissions" ile kapsandı. İstemcide bileşen gizleme yetki denetimi sayılmadı. |
| `crawl/sitemap-coverage` | `/kvkk-gdpr-ccpa`, `/cerez-politikasi` taranmadı | gerekçeli kabul + dağıtım sonrası doğrulanacak | İki URL sitemap'te ve yerel/canlı istekte 200. Bulgu, denetimin süre limitinden kaynaklı tarama boşluğu; yeniden taramada kapanmalı. Sitemap'e 17 araç URL'si eklendi; `/software-hub` (panoya yönlenen üye girişi) ve `/giris` bilinçli olarak hariç. |
| `core/meta-title`, `core/meta-description` | `/blog`, `/haberler`, `/belgeler` vb. | kısmen düzeltildi + gerekçeli kabul | İçeriği karşılamayan/zayıf metinler özgünleştirildi: `/haberler` açıklaması genişletildi, `/blog` başlığı "Blog — Yazı, Haber ve Rehber Merkezi", `/belgeler` başlığı H1 ile hizalandı ("Yararlı Belgeler Kataloğu"), `/maas-hesaplama` başlığı H1/JSON-LD ile eşitlendi. Salt "kısa başlık" uyarıları yeniden yazma sebebi sayılmadı (plan kararı). |
| `schema/entity-identity` | makale ve araç sayfaları | düzeltildi | `WebPageJsonLd.isPartOf` ve `ArticleJsonLd.publisher`/`author` artık `${SITE_URL}/#website` ve `#organization` `@id` referansı; kimliksiz tekrar Organization/WebSite düğümleri kaldırıldı. `WebPage` ve `Article` düğümlerine `@id` eklendi. |
| `schema/local-business` | 64 sayfa (carried) | gerekçeli kabul | Canlı ana sayfa HTML'inde `LocalBusiness` çıktısı yok (2026-10-24 doğrulandı). Kanıtlanmış fiziksel işletme adresi olmadığı için şema geri eklenmedi; bulgu eski taramalardan taşınmış. |
| `content/date-agreement` | 12 makale | düzeltildi | Görünür yayın tarihi `<time dateTime={publishedAt}>` olarak işaretlendi (makale şablonunda tarih zaten görünürdü, semantik time eklendi). |
| `crawl/sitemap-lastmod-drift` | 4 haber | düzeltildi | Şema `dateModified`, `og:article:modified_time` ve sitemap `lastmod` artık aynı kaynaktan (`news_posts.updated_at`, yoksa `published_at`). `lib/public-news.ts` + `haberler/[slug]/page.tsx` güncellendi. |
| `content/meta-in-body` | 12 sayfa (26-27 meta) | gerekçeli kabul (canlı kanıtla) | Googlebot UA ile canlı ham HTML kaydedildi: `/haberler` head 26 meta / body 0; makale sayfası head 30 meta / body 0; title, canonical, description head içinde okunur. Bulgu, tarayıcı sonrasındaki DOM görüntüsünden geliyor; Next.js 15 metadata akışı bot görünümünü bozmuyor. Sırf bu uyarı için metadata akışı kapatılmadı. |

## 3. İçerik, güven ve bağlantılar

| Kural | Örnek sayfa | Karar | Kanıt / not |
|---|---|---|---|
| `content/word-count` | 17 sayfa (araçlar 144 kelime) | kısmen düzeltildi + gerekçeli kabul | Araç sayfaları anonim görünümde giriş metni, gerekçe, hedef kitle, çalışma biçimi, resmî kaynaklar, yasal not ve görünür SSS ile zenginleşti. Kısa haberler 300 kelimeye şişirilmedi (plan kararı). `/cerez-politikasi` gerçek izin davranışıyla genişletildi. |
| `content/keyword-stuffing` | `/almanya-araclari`, `/is-ilanlari`, `/ekibimize-katil` | gerekçeli kabul | Tekrarlar yapısal (araç kartları, ajans listesi). Doğal olmayan müdahale yapılmadı; hub metinleri zaten doğal dilde. |
| `eeat/authority-signals` | 6 araç sayfası | kısmen düzeltildi | Araç tanıtımlarında resmî kaynak bağlantıları görünür (Make it in Germany, BAMF, Bundesagentur für Arbeit vb.). Makalelerde kaynak adı/tarihi görünür "Kaynak" bloğunda; `Article.citation` bu bilgiden türetiliyor. Uydurma yazar/kurum eklenmedi. |
| `eeat/about-page`, `eeat/contact-page`, `eeat/privacy-policy`, `legal/privacy-policy` | site geneli | düzeltildi | Canlıda `/hakkimizda`, `/iletisim`, `/gizlilik-politikasi` 200 (2026-10-24 doğrulandı). Yeni global `<footer>` her sayfada Hakkımızda, İletişim, Gizlilik, Çerez, KVKK, Kullanım Şartları, Impressum bağlantılarını veriyor; bulgular footer yokluğundan kaynaklanıyordu. |
| `links/broken-external-links` | `/hakkimizda` → `https://ubterzioglu.dev/` (530) | düzeltildi | Bağlantı yerel kontrollerde de erişilemedi (timeout/530); "Kişisel Web Sayfam" düğmesi kaldırıldı. Çalışan resmî hedef doğrulanırsa geri eklenebilir. |
| `links/tel-mailto` | `/ekibimize-katil` | düzeltildi | mailto bağlantısına erişilebilir ad eklendi (`aria-label="E-posta: info@almanya101.de"`); görünen metin ile href eşleşiyor. |
| `links/orphan-pages`, `links/weak-internal-links` | `/almanya-araclari`, `/almanyada-yasam`, `/blog`, 2 haber | düzeltildi | Global footer her sayfadan İçerik ve Araçlar sütunuyla `/almanyada-yasam`, `/haberler`, `/belgeler`, `/almanya-araclari`, `/hizmet-rehberi`, `/is-ilanlari` + kurumsal/yasal sayfalara iç bağlantı veriyor. Haber detaylarında "Diğer haberler" korunuyor. Alakasız bağlantı eklenmedi. |
| `url/length` | 12 uzun haber slug'ı | gerekçeli kabul | Yayımlanmış URL'ler korunur (plan ürün kararı). Yeni slug üretiminde kısa okunabilir başlık + kalıcı kimlik desenine (`buildStableNewsSlug`) devam ediliyor. |

## 4. Analitik izni ve güvenlik

| Kural | Örnek | Karar | Kanıt / not |
|---|---|---|---|
| `legal/cookie-consent`, `security/third-party-cookies` | 64 sayfa | düzeltildi | GA + GoatCounter + Clarity `app/layout.tsx` varsayılanından çıkarıldı; `AnalyticsScripts` yalnızca açık izin sonrası yükler. Türkçe banner (`CookieConsent`): eşdeğer Kabul/Ret, `localStorage` kalıcılığı, footer "Çerez tercihleri" ile geri alma (temizle + yenile). E2E `cookie-consent.spec.ts`: izin öncesi/ret sonrası 0 analitik istek, kabul sonrası yükleme, yenilemede kalıcılık, geri alma — 2/2 geçti. Çerez ve gizlilik sayfaları gerçek davranışla uyumlu hale getirildi. |
| `security/csp` | site geneli | düzeltildi (Report-Only) + dağıtım sonrası doğrulanacak | `next.config.ts` tüm rotalarda `Content-Security-Policy-Report-Only`: self + Next/fontlar + yalnızca izinli analitik kaynakları + Supabase (env); `object-src/frame-src 'none'`, `frame-ancestors 'self'`. Canlıda ihlal raporu görülmeden zorunlu moda alınmayacak. Coolify/proxy başlıkları dağıtım sonrası ayrıca ölçülmeli. |
| `security/hsts` | site geneli | düzeltildi + dağıtım sonrası doğrulanacak | `Strict-Transport-Security: max-age=31536000; includeSubDomains` uygulama katmanında (HTTPS canlıda doğrulandı). `preload` bilinçli kapalı. Proxy'nin başlığı ezmediği dağıtım sonrası kontrol edilmeli. |
| `security/security-txt` | `/.well-known/security.txt` (404) | düzeltildi | Yeni route: Contact `mailto:info@almanya101.de`, Preferred-Languages tr/en, 1 yıl geçerli Expires, Canonical + Policy. Yerel yanıt 200 doğrulandı. |
| `security/sri` | `gc.zgo.at/count.js`, `clarity.ms` | gerekçeli kabul | Sürümsüz/değişken üçüncü taraf betiklerinde SRI uygulanamaz (sabit hash kırılır). Risk, izin kapısı + CSP kaynak allowlist'i ile yönetiliyor; karar plan 4.3'e uygun kaydedildi. |

## 5. Görsel, hız ve mobil

| Kural | Örnek | Karar | Kanıt / not |
|---|---|---|---|
| `mobile/web-app-manifest` | 34 sayfa | düzeltildi | `app/manifest.ts` `theme_color` `#4285F4` → `#000000` (viewport ile aynı, siyah uygulama arka planıyla uyumlu). Yerel manifest çıktısı doğrulandı. |
| `images/image-file-size`, `perf/total-byte-weight` | `/` (4495KB), `hero-background.jpg` 6.4MB | düzeltildi | sharp ile kaynak optimizasyonu: hero-background 6439→304KB, backgrounds/hero 2430→150KB, berlin/frankfurt/köln/münih %45-55 küçüldü; logolar (yeniherologo 265→87KB, almanya101 279→57KB). Ana sayfa ve bölüm arka planları WebP'ye geçirildi (`berlin1.webp`, `hero.webp`, `hero-background.webp` + referans güncellemeleri). 200KB üstü tek kalan fotoğraf frankfurt1/köln (~390KB JPEG, WebP 318-331KB). |
| `images/dimensions` | `/haberler` (40 görsel) | düzeltildi | Haber kartları, hero ve makale kapağı `fill` yerine `width`/`height` öznitelikleriyle render ediliyor (sabit oranlı kaplar korunarak); `LinkCard` görselleri de boyut öznitelikli. Harici TRT görselleri aspect-ratio kabında; CLS riski yok. |
| `images/offscreen-lazy`, `perf/lazy-above-fold` | `/`, `/haberler`, `/hakkimizda` | düzeltildi | LCP görseli (`yeniherologo.png`) `priority` korunuyor; KenBurns ilk slayt `priority`, diğerleri lazy. `NewsHeroCard` `priority`; arşiv ilk 3 kart `priority`; ana sayfa ilk ızgara `priorityFirst={7}`; `/hakkimizda` profil görselleri `priority`. Ana sayfadaki `berlin1` arka planı artık CSS background (ağdan eager `<img>` değil). |
| `images/optimized` | site geneli | gerekçeli kabul | Container ortamında `images.unoptimized: true` bilinçli (AGENTS.md). Bayt maliyeti kaynak dosyalar küçültülerek ve WebP'ye geçilerek düşürüldü; image CDN ek altyapı kararı gerektirir. |
| `perf/dom-size` | `/is-ilanlari` (3682), `/belgeler` (2454), 87 çocuklu öğe | kısmen düzeltildi + gerekçeli kabul | `/is-ilanlari`: ajans ızgarası 24 kayıtlık görünen aralıkla render ediliyor, "Daha fazla göster" ile tamamı erişilebilir (87 çocuklu öğe ve 3682 düğüm kökü). `/belgeler`: katalog bilerek tam render ediliyor (içerik bütünlüğü ve taranabilirlik önceliği); 2454 düğüm "Large" eşiğinde, "Excessive" değil. |
| `perf/unminified-js` | 16 sayfa (inline GA/Clarity ~2.8KB) | düzeltildi | Satır içi analitik betikleri artık yalnız izin sonrası ve tek satıra sıkıştırılmış yükleniyor; anonim HTML'de hiç yok. |
| `perf/critical-request-chains` | 34 sayfa (2 CSS zinciri) | gerekçeli kabul | Zincir, Next.js üretim CSS çıktısı (route + global). Tek global bundle zaten minimal; anlamlı kazanç gösterilemediği için kritik CSS ayrımı eklenmedi. Dağıtım sonrası gerçek CDN yanıtıyla yeniden ölçülmeli. |
| `perf/bad-caching`, `perf/cache-headers` | 17 sayfa validator'sız | kısmen düzeltildi + dağıtım sonrası doğrulanacak | `/images/*` immutable 1y (mevcut); kök statik dosyalara (logo/ikon/og) `max-age=604800, stale-while-revalidate` eklendi; `/_next/static` Next tarafından immutable. Dinamik/kişisel sayfalar tasarım gereği `no-store`; ETag/Last-Modified davranışı Coolify/proxy katmanına bağlı olduğundan canlıda ölçülmeli. |

## 6. Ajan deneyimi

| Kural | Örnek | Karar | Kanıt / not |
|---|---|---|---|
| `ai/llm-parsability` | 10 sayfa (40/100) | dağıtım sonrası doğrulanacak | Canlı `llms.txt` 200 ve bağlantılar güncel (2026-10-24 doğrulandı). Düşük skor büyük ölçüde `/giris`'e yönlenen araç sayfalarından geliyordu; araçlar artık anonim istekte gerçek tanıtım metni döndürüyor. Yeniden taramada karşılaştırılacak. |
| `ax/agents-md` | site geneli | gerekçeli kabul | Depodaki `AGENTS.md` geliştirici talimatıdır; sırf uyarıyı susturmak için herkese açık kopya yayımlanmadı (plan 6.2 kararı). |
| `ax/markdown-response` | site geneli | gerekçeli kabul | Gerçek içerik tüketimi ihtiyacı ve sürdürülebilir tek kaynaklı üretim yok; `llms.txt` + temiz semantik HTML yeterli (plan 6.2). |
| `ax/token-weight` | 17 sayfa | kısmen düzeltildi + gerekçeli kabul | `/is-ilanlari` HTML'i sayfalama ile küçüldü; inline betikler kalktı; görsel baytları düştü. Next.js akışlı HTML/JS taban maliyeti çerçeve gereği; ikinci içerik sistemi kurulmadı (plan 6.3). DOM/görsel/betik iyileştirmeleri sonrası canlıda yeniden ölçülecek. |

## Doğrulama kaydı (yerel, 2026-10-24)

- `npm run lint` — temiz.
- `npm run test:unit` — 102/102 geçti (yeni anonim anket 401 testi dahil).
- `npm run build` — başarılı; araç rotaları `ƒ (Dynamic)`, statik rotalar korundu.
- `npm run verify:seo` (yerel sunucu, anonim) — ihlal yok; 4 bilinen breadcrumb/H1 uyarısı (önceden var, uyarı seviyesi). Araç URL'leri sitemap'te ve 200; `/software-hub` üye alanı olarak yönleniyor; `/giris` sitemap dışında.
- `npx playwright test e2e/smoke` — 61/61 (araç tanıtım 200 + tek `<main>` + izin akışı + yazılım hub yönlenmesi).
- `npx playwright test --project=setup --project=chromium-auth` (banka-secim + almanya-maas-beklentisi) — 8/8; oturumlu kullanıcı etkileşimli aracı aynı URL'de alıyor.
- Yerel başlık kontrolü: HSTS, CSP-Report-Only, Permissions-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy mevcut; `/.well-known/security.txt` 200; manifest `theme_color #000000`.
- Canlı kontroller: `/llms.txt`, `/hakkimizda`, `/iletisim`, `/gizlilik-politikasi` 200; bot görünümünde meta etiketleri yalnız `<head>` içinde; canlı ana sayfada `LocalBusiness` yok.

## Dağıtım sonrası yapılacaklar

1. Coolify/proxy üzerinden gerçek yanıtlarda `Strict-Transport-Security`, `Content-Security-Policy-Report-Only`, `Cache-Control` ve `/.well-known/security.txt` doğrulaması.
2. CSP raporları bir süre izlenip ihlal yoksa `Content-Security-Policy` (zorunlu) başlığına geçiş.
3. Önce atlanan 26 sayfayı da kapsayan tam yeniden denetim; kalan her uyarının gerekçesinin bu tabloya işlenmesi.
4. Temiz tarayıcı profiliyle canlı izin akışı ağ izlemesi (izin öncesi/kabul/ret/yenileme/geri alma).
