# 24 Ekim 2026 site denetimi: düzeltme planı

**Kaynak:** Depo kökündeki `01M5P9ZWMDKZC51S52VBEDYZ4C.json`  
**Hedef:** `https://almanya101.de`  
**Durum:** Uygulama planı; aşağıdaki işler henüz yapılmış sayılmaz.

## Amaç ve kapsam

Denetimin bildirdiği **41 hata ve 315 uyarının tamamını** kural kimliği bazında ele al. Her bulgu için sonuç `düzeltildi`, `yeniden taramada doğrulanamadı` veya `gerekçeli kabul` olarak kaydedilsin. Denetim 34 sayfayı taradı; süre sınırı yüzünden bulunan 26 sayfayı taramadı. Bu nedenle rapor, bütün sitenin eksiksiz envanteri değildir. Toplam sağlık puanını tek başına başarı ölçütü olarak kullanma.

Bu planda alınmış ürün kararları:

- Üyelik gerektiren araç URL'leri aynı adreste, anonim ziyaretçiye sunucudan render edilen yararlı tanıtım içeriği gösterecek. Kişisel hesaplama ve sonuç işlemleri oturum gerektirecek.
- Google Analytics, GoatCounter ve Clarity yalnızca açık analitik izni sonrasında yüklenecek. Ret, izin değişikliği ve geri alma desteklenecek.
- Yayımlanmış haber URL'leri korunacak; yalnızca uzunluk uyarısı için mevcut bağlantılar değiştirilmeyecek.
- Tüm kullanıcıya görünen yeni metinler Türkçe olacak. Sayfalarda `createMetadata()` / makalelerde `createArticleMetadata()`, iç bağlantılarda `next/link`, sınıf birleştirmede `cn()` kullanılacak.

## Uygulama sırası

### 1. Temel hatalar ve erişilebilirlik

1. `app/layout.tsx` içindeki tek ana landmark'ı koru. İçte yeniden `<main>` oluşturan herkese açık sayfaları ve ilgili bileşenleri `<div>` veya anlamına uygun `<section>` olarak düzenle. Atlama bağlantısı `#main-content` çalışmaya devam etmeli. Bu, `a11y/landmark-one-main` ve `a11y/landmark-regions` bulgularını birlikte çözer.
2. `/tatil/almanya`, `/tatil/turkiye`, `/hizmet-rehberi` ve `/is-ilanlari` üzerindeki raporlanan `input` / `select` kontrollerine `htmlFor` + `id` ile ilişkili görünür etiket veya yerinde uygun erişilebilir ad ekle. Placeholder'ı etiket sayma. `a11y/aria-input-field-name`, `a11y/form-labels`, `a11y/select-name` tekrar taramada geçmeli.
3. Aynı metinle farklı sayfalara giden “Aracı aç” ve “Devamını oku” bağlantılarının erişilebilir adlarına hedef başlığını kat. Görselin yanındaki aynı bilgiyi gereksiz tekrarlayan `alt` metinlerini düzelt; dekoratif görsellerde boş `alt` kullan. `a11y/identical-links-same-purpose`, `a11y/image-redundant-alt`.
4. Görünür içerikteki `*Anmeldung der Wohnung*` gibi ham Markdown parçalarının veri kaynağını bul. İçerik Markdown ise mevcut `MarkdownPreview` ile işle; düz metinse işaretleri temizle. Yalnızca ekranda görünen metni doğrula. `content/unrendered-markup`.

### 2. İndekslenebilir araçlar, metadata ve şema

1. `lib/utils/gated-routes.ts`, `middleware.ts`, araç sayfaları ve `app/sitemap.ts` için tek bir açık/korumalı ayrımı uygula. Anonim `GET /<araç>` doğrudan `200` ile açıklama, kapsam, sınırlamalar ve varsa görünür SSS döndürsün. Oturum açmış kullanıcı aynı URL'de etkileşimli araca erişsin. Kişisel işlem API'leri ve sunucu verileri kendi yetki kontrolünü yapmaya devam etsin; istemcide bileşen gizlemek yetki denetimi değildir. Aracın görünür içeriği, metadata ve JSON-LD birbiriyle eşleşsin.
2. Yeni açık araç URL'lerini sitemap'e ekle; girişe yönlenen, `noindex` veya kendinden farklı canonical taşıyan URL'leri sitemap'te bırakma. `scripts/verify-seo.mjs` içindeki eski “araçlar anonim istekte yönlenir” beklentisini yeni davranışa göre güncelle. `core/robots-meta`, `crawl/canonical-chain`, `crawl/sitemap-coverage`.
3. Başlık ve açıklama uyarılarını sayfa bazında incele. Kısa olmaları tek başına yeniden yazma sebebi değildir; yanlış, belirsiz veya içeriği karşılamayan metinleri özgün biçimde düzelt. `core/meta-title`, `core/meta-description`.
4. `components/seo/JsonLd.tsx` içindeki sayfa ve makale düğümlerini mevcut `${SITE_URL}/#organization` ve `${SITE_URL}/#website` kimliklerine bağla; aynı kurumu veya siteyi her sayfada kimliksiz yeni bir düğüm olarak tanımlama. `schema/entity-identity`. Kodda artık bulunmayan `LocalBusiness` çıktısını canlı dağıtımda doğrula; gerçek fiziksel işletme adresi kanıtlanmadıkça şemayı geri ekleme. `schema/local-business`.
5. Haberlerde görünür yayın tarihi ile `Article.datePublished` değerini karşılaştır. Gerçek güncelleme zamanı varsa onu `dateModified` ve sitemap `lastmod` için aynı kaynaktan kullan; yoksa yayın tarihini güncelleme tarihi gibi sunma. `content/date-agreement`, `crawl/sitemap-lastmod-drift`.
6. `content/meta-in-body` için ham sunucu HTML'si, JavaScript sonrası DOM ve bot kullanıcı ajanı yanıtını ayrı kaydet. Next.js 15 dinamik `generateMetadata()` çıktısını bazı istemcilere gövde içinde akıtabilir; bu durumda önce gerçek bot görünümünü ve canonical/title/description okunurluğunu doğrula. Sırf denetim uyarısı için tüm sitede metadata akışını kapatma. [Next.js 15 metadata davranışı](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata).

### 3. İçerik, güven ve bağlantılar

1. `content/word-count` ve `content/keyword-stuffing` için raporlanan sayfaları editoryal olarak incele. Kısa haberleri 300 kelimeye şişirme. Boş veya faydasız merkez sayfalara kullanıcı sorusunu yanıtlayan özgün özet, ilgili bağlantı ve sonraki adım ekle; tekrar eden anahtar kelimeleri doğal dile çevir.
2. Makale şablonlarında gerçekten doğrulanmış yazar/kurum, kaynak, yayın ve gözden geçirme bilgisini görünür göster; JSON-LD bu bilgiden türesin. Kaynak veya yazar bilgisi elde yoksa uydurma. `eeat/authority-signals`.
3. Mevcut `/hakkimizda`, `/iletisim` ve `/gizlilik-politikasi` sayfalarının canlıda `200` döndüğünü, indekslenebilir olduğunu ve ortak gezinme veya footer üzerinden bulunabildiğini doğrula. Gerekirse bütün herkese açık sayfalara erişilebilir footer bağlantıları ekle. `eeat/about-page`, `eeat/contact-page`, `eeat/privacy-policy`, `legal/privacy-policy`.
4. `/hakkimizda` üzerindeki `https://ubterzioglu.dev/` bağlantısının `530` yanıtını yeniden kontrol et; kalıcı olarak çalışmıyorsa çalışan resmî hedefle değiştir veya kaldır. `mailto:info@almanya101.de` bağlantısında görünen metni ve erişilebilir adı eşleştir. `links/broken-external-links`, `links/tel-mailto`.
5. Yetim ve az iç bağlantılı sayfaları ilgili hub, kategori ve makalelerden bağla; yalnızca sayıyı yükseltmek için alakasız bağlantı ekleme. `links/orphan-pages`, `links/weak-internal-links`. Uzun haber slug'larını koru; yeni slug üretiminde okunabilir kısa başlık ve kalıcı benzersiz kimlik kullan. `url/length`.

### 4. Analitik izni ve güvenlik

1. `app/layout.tsx` içindeki üç izleme betiğini varsayılan yüklemeden çıkar. Türkçe tercih arayüzünde eşdeğer kabul/ret seçenekleri, kalıcı tercih ve ayarlardan geri alma sağla. Açık izin verilmeden bu betiklere istek gitmemeli; redden sonra da yüklenmemeli. Gizlilik ve çerez sayfalarını gerçek davranışla uyumlu tut. `legal/cookie-consent`, `security/third-party-cookies`.
2. Gerçek Next.js + Coolify/proxy yanıtında CSP ve HSTS başlıklarını doğrula. CSP'yi mevcut Next.js, fontlar ve yalnızca izinli analitik kaynaklarıyla uyumlu en dar uygulanabilir politika olarak ekle; önce raporla/izle, sonra zorunlu uygula. HSTS'yi yalnızca HTTPS tüm ilgili alanlarda doğrulandıktan sonra proxy veya uygulama katmanında ver. `security/csp`, `security/hsts`.
3. `/.well-known/security.txt` için çalışan güvenlik iletişim adresini, tercih edilen dili ve geçerlilik tarihini yayımla. Harici ve değişken betiklerde SRI'nin sabit sürümle uygulanıp uygulanamayacağını kontrol et; uygulanamıyorsa gerekçeyi kaydet ve CSP + izin kontrolü kullan. `security/security-txt`, `security/sri`.

### 5. Görsel, hız ve mobil sunum

1. `app/manifest.ts` içindeki `theme_color` ile `app/layout.tsx` viewport `themeColor` değerini aynı seçilmiş renge getir; mevcut siyah uygulama arka planıyla uyumlu varsayılan **`#000000`** kullan. `mobile/web-app-manifest`.
2. Ana sayfadaki büyük arka plan görsellerini ve logoları uygun boyut ve modern biçimlerde üret; bileşenlerde gerçek görüntü ölçüsü veya doğru `fill`/`sizes` kullan. İlk ekranda görünen LCP görselini öncelikli yükle, ekran altını tembel yükle. `images/dimensions`, `images/image-file-size`, `images/offscreen-lazy`, `images/optimized`, `perf/lazy-above-fold`, `perf/total-byte-weight`.
3. 3682 düğümlü sayfayı, 2454 düğümlü sayfayı ve 87 çocuklu öğeyi rapor ayrıntılarıyla eşleştir; uzun listeleri sayfala veya görünür aralığı render et. İçerik ve klavye erişimini koru. `perf/dom-size`.
4. CSS zincirini ve küçültülmemiş görünen JS dosyalarını üretim derlemesinde ölç. Önce rapordaki dosyaların gerçekten uygulama çıktısı mı, üçüncü taraf mı olduğunu belirle; anlamlı kazanç varsa kritik CSS, kod bölme veya betik zamanlamasını düzelt. `perf/critical-request-chains`, `perf/unminified-js`, `ax/token-weight`.
5. Statik, sürümlü varlıklar için uzun cache; dinamik herkese açık sayfalar için uygun yeniden doğrulama; oturumlu ve kişisel yanıtlar için özel/önbelleksiz politika uygula. Gerçek CDN/proxy yanıtlarında validator ve `Cache-Control` değerlerini ölç. `perf/bad-caching`, `perf/cache-headers`.

### 6. Ajan deneyimi ve gerekçeli kabul

1. `public/llms.txt` zaten var; canlı URL'de `200` döndüğünü ve bağlantıların güncel olduğunu doğrula. `ai/llm-parsability` uyarısındaki düşük puanı, gerçek metin erişimi ve sayfa yapısıyla karşılaştır.
2. Depodaki `AGENTS.md` geliştirici talimatıdır; yalnızca `ax/agents-md` uyarısını susturmak için herkese açık kopyasını yayımlama. `Accept: text/markdown` veya `.md` varyantını ancak gerçek içerik tüketimi ihtiyacı ve sürdürülebilir tek kaynaklı üretim varsa ekle. `ax/markdown-response` aksi halde gerekçeli kabul edilebilir.
3. `ax/token-weight` için yukarıdaki DOM, görsel ve betik iyileştirmelerinden sonra yeniden ölç. HTML/JS maliyeti hâlâ yüksekse sunucudan anlamlı metnin erişimini ve gereksiz istemci yükünü düzelt. Salt tarayıcı eşiği için ikinci bir içerik sistemi kurma.

## Doğrulama ve teslim ölçütleri

- Önce mevcut rapordaki **her benzersiz kural kimliği** için sayfa örneği, kod/canlı kanıtı ve karar içeren bir takip tablosu oluştur. Aynı kök nedenden çıkan çoklu sayfa bulgularını tek düzeltmeyle ilişkilendir. `passed`/`failed` toplamlarını kural sayısı olarak yorumlama.
- Etkilenen herkese açık sayfalarda tek `<main>`, etiketli kontroller, çalışan atlama bağlantısı ve anlamlı bağlantı adlarını tarayıcı, klavye ve otomatik erişilebilirlik testiyle doğrula.
- Anonim ve oturum açmış senaryolarda araç sayfası, korumalı hesaplama/API, sitemap, canonical ve robots davranışını uçtan uca sınayın. Mevcut oturumlu kullanıcı işlevleri bozulmamalı.
- Analitik için temiz tarayıcı profiliyle izin öncesi, kabul, ret, sayfa yenileme ve izin geri alma durumlarında ağ isteklerini kontrol et.
- `npm run lint`, `npm run test:unit`, `npm run build`, `npm run verify:seo` ve `npm run e2e:smoke` çalıştır. Gereken doğrulamayı yapan hedefli testleri ekle; uygulamanın iç mantığını aynen tekrar eden testler yazma.
- Dağıtımdan sonra tam kapsamlı yeni denetim al; eski rapordaki 34 sayfaya ek olarak önce atlanan 26 sayfayı da kapsa. Kalan her uyarının nedeni ve kabul kararı kayıtlı olsun. Yanıt başlıkları, HTML metadata, JSON-LD ve gerçek sayfa ağırlığı canlı ortamda ayrıca doğrulansın.

## Bilinen başlangıç durumu

- Depoda `public/llms.txt`, Hakkımızda, İletişim ve Gizlilik Politikası sayfaları bulunuyor. Bunların “eksik” uyarıları canlı bağlantı/erişim ve tarayıcı algısıyla yeniden doğrulanmalı.
- Kök `Organization` ve `WebSite` JSON-LD düğümlerinde `@id` mevcut; `Article` ve `WebPage` içindeki tekrar tanımlanan düğümlerde kimlik eksikliği görüldü.
- `app/manifest.ts` `#4285F4`, `app/layout.tsx` viewport ise `#000000` bildiriyor.
- `next.config.ts` görsel optimizasyonunu container için kapatıyor (`images.unoptimized: true`); `next/image` kullanmak tek başına görsel baytlarını küçültmez.
- `docs/plans/seo-geo-2026-10-21.md` tarihli önceki plandır. Koda karşı doğrulanmadan tamamlanmış iş kabul edilmemeli.
