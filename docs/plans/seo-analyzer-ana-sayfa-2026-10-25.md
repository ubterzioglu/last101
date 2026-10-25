# Ana sayfa SEO analizinde yanlış pozitifleri düzeltme planı

**Tarih:** 25 Ekim 2026

**Hedef:** `https://almanya101.de/`

**Araç:** Kökteki `seo-analyzer.js`, mevcut `seo-runner.js` üzerinden çalıştırıldı.

**Durum:** Uygulandı; doğrulama sonuçları aşağıda.

## Amaç ve mevcut durum

Canlı ana sayfa analizinde genel SEO 95/100, teknik SEO 95/100, içerik 100/100, GEO 89/100 ve GEO içerik 82/100 çıktı. Genel skordaki tek kesinti, 39 görselin 35'inde `alt` metni bulunmadığı iddiasıyla verilen 5 puandı. Canlı HTML üzerinde yapılan ayrı kontrolde **39 görselin tamamında `alt` niteliği bulunduğu** görüldü: 35'i `alt=""`, 4'ü dolu `alt` kullanıyor. Boş `alt` kullananların 31'i aynı bağlantı içinde görünür başlık ve açıklaması olan kart görselleri; kalan 4'ü yakınında haber başlığı ve özeti bulunan haber görselleri. Dolayısıyla 35 sayısı gerçek anlamda “eksik `alt` niteliği” sayısı değildir.

Yayın tarihi (`2026-01-01`) ve güncelleme tarihi (`2026-10-24`) ana sayfada görünür `<time>` öğelerinde ve `WebPage` JSON-LD içinde mevcut. GEO içerik denetimi yalnızca `article:published_time` / `article:modified_time` meta etiketlerini okuyarak bunları “eksik” işaretliyor. Önceki SEO raporundaki “tarihler görünür içerikte eksik olabilir” yorumu bu nedenle geçersizdir.

Bu çalışma gerçek görsel erişilebilirliği eksiklerini bulup düzeltmeyi ve analiz aracının mevcut doğru işaretlemeyi cezalandırmamasını amaçlar. Puan, kalite göstergesi olarak tek başına kullanılmayacak.

## Uygulama adımları

### 1. Görsellerin içerik kararını doğrula

- `components/home/LinkCard.tsx` içindeki kart görsellerini ve `components/sections/NewsCarousel.tsx` içindeki dört haber görselini bağlamlarıyla incele. Görsel yalnızca yakındaki bağlantı başlığını veya haber metnini destekliyorsa `alt=""` bırak. Metinden öğrenilemeyen önemli bir bilgi taşıyorsa kısa, doğal Türkçe açıklama yaz.
- Slayt, logo ve diğer dört dolu `alt` metnini aynı ilkeyle gözden geçir; gereksiz tekrar veya anlamsız genel adları düzelt. Her `<img>` için `alt` niteliği bulunmaya devam etmeli.
- Dolu `alt` değerlerini yalnızca araç puanını yükseltmek için ekleme. W3C, yakındaki metnin zaten karşıladığı veya yalnızca süs olan görseller için boş `alt` önerir: <https://www.w3.org/WAI/tutorials/images/decorative/>. Anlamlı görsel metinlerinde bağlama uygun açıklama kullan: <https://developers.google.com/search/docs/appearance/google-images>.

### 2. `seo-analyzer.js` görsel ölçümünü düzelt

- `analyzeImagesAlt()` üç ayrı sayaç döndürsün: `missing` (`alt` niteliği yok), `empty` (`alt=""`) ve `described` (dolu değer). Mevcut `total`, `missing`, `status`, `ok` alanları korunsun; `missing` bundan sonra yalnızca gerçekten eksik niteliği ifade etsin.
- Genel ve teknik skor kesintisi ile premium anahtar kelime kontrolündeki “alt eksiği yok” maddesi yalnızca `missing > 0` olduğunda başarısız olsun. Böylece bilinçli boş `alt` cezalandırılmasın.
- GEO skorundaki görsel oranı, dolu `alt` yüzdesi yerine `alt` niteliği bulunan görsellerin oranını ölçsün. İlgili etiket ve açıklamalar “alt niteliği kapsamı” olarak değişsin. GEO istatistiğinde mevcut `imageAltRatio` alanını kullanan kod varsa semantik değişiklik açıkça belgelenip rapor etiketi güncellensin. Dolu ve boş sayılar ayrıca gösterilsin.
- Otomatik analiz, boş `alt` kullanan görselin gerçekten dekoratif olup olmadığını kesin biçimde iddia etmesin; bu editoryal inceleme gerektirir. Eksik nitelik için görsel `src` değerlerini raporda listelemek düzeltmeyi kolaylaştırır.

### 3. GEO içerik tarih kontrolünü düzelt

- `analyzeGeoContent()` yayın ve güncelleme tarihlerinde makale meta etiketlerine ek olarak JSON-LD `datePublished` / `dateModified` alanlarını kabul etsin. Dosyada zaten bulunan JSON-LD tarih çıkarma yardımcısı yeniden kullanılsın; aynı ayrıştırma mantığı kopyalanmasın.
- Tarih durumuna yalnızca ayrıştırılabilir, boş olmayan değerler olumlu sonuç versin. JSON-LD yoksa mevcut meta etiketleri çalışmaya devam etsin. Görünür `<time>` öğesi doğrulama aşamasında yapılandırılmış tarihle karşılaştırılsın; sayfadaki herhangi bir haber kartı tarihi otomatik olarak sayfanın yayın tarihi sayılmasın.
- “Tarih mutlaka görünmeli” gibi kesin ve kaynaklanmamış GEO ifadelerini, aracın ölçtüğü sinyali doğru anlatacak şekilde yumuşat. Ana sayfadaki mevcut tarihleri sırf puan için yeniden yazma veya bugüne çekme.

### 4. Diğer GEO maddelerini puan baskısından ayır

- `seo-runner.js` şu an şema önerileri için sabit `profileId: 'service'` kullanıyor. Ana sayfa bir hizmet/yerel işletme sayfası olmadığı için buradaki `Service`, `Review`, `Offer`, `OpeningHoursSpecification` gibi eksikleri ana sayfa işi olarak açma. Raporu yeniden üretirken uygun genel site profili varsa onu seç; yoksa bu bölümü ana sayfa için “uygulanamaz” olarak açıkça işaretle.
- Video, `Speakable`, görsel alt yazısı, `twitter:site` ve `hreflang` eklemeleri ancak ilgili içerik, resmî hesap veya dil alternatifi gerçekten varsa ayrı bir iş olarak değerlendirilsin. Yapılandırılmış veri, sayfanın gerçek içeriğini temsil etmeli: <https://developers.google.com/search/docs/appearance/structured-data/sd-policies>.
- Bu plan, 24 Ekim tarihli [GEO denetimi planının](./geo-audit-2026-10-24.md) içerik doğruluğu ve yayın sonrası kontrol işlerini değiştirmez.

## Test ve kabul ölçütleri

1. Analiz aracına hedefli birim testleri ekle: görselsiz belge, `alt` niteliği olmayan görsel, `alt=""` kullanan dekoratif görsel, dolu `alt` ve bunların karışımı. Sayılar ile genel/teknik/GEO puanları tutarlı olmalı.
2. Tarih testlerinde yalnızca meta etiketleri, yalnızca `WebPage` JSON-LD, hem meta hem JSON-LD ve tarih bulunmayan belge durumlarını doğrula. Haber listesindeki bir kart tarihinin sayfa tarihi sayılmadığı senaryoyu da kapsa.
3. `npm run lint`, `npm run test:unit` ve `npm run build` çalıştır. Yerel üretim sunucusunda `npm run verify:seo` ve ana sayfa için `node seo-runner.js https://almanya101.de` çalıştır; canlı sonuç dağıtım yapılmadan önce değişmeyebilir.
4. Değişiklik dağıtıldıktan sonra canlı ana sayfayı yeniden analiz et. Kabul: 35 boş `alt` “35 eksik” olarak görünmez; gerçekten eksik `alt` niteliği yakalanır; yayın/güncelleme tarihleri bulunur; title, H1, canonical ve JSON-LD kontrolleri gerilemez.
5. Skorun 100/100 olması kabul koşulu değildir. Kalan uyarılar gerçek eksik, uygulanamaz öneri veya aracın sınırlaması olarak gerekçesiyle kaydedilir.

## Varsayımlar ve sınırlar

- Kapsam ana sayfa ve `seo-analyzer.js` raporlama mantığıdır. Diğer sayfaların içerikleri topluca yeniden yazılmaz.
- `seo-runner.js` çalışmanın başında Git tarafından izlenmeyen mevcut dosyaydı. Kullanıcının dosyası korunarak rapor sunumu güncellendi.
- Ana sayfadaki görsel sayısı ve dağılımı 25 Ekim 2026 canlı HTML anlık görüntüsüne aittir; haber sayısı değiştiğinde tekrar ölçülür.

## Uygulama ve doğrulama kaydı (25 Ekim 2026)

- 39 görselin işaretlemesi incelendi. Kart ve haber görsellerindeki `alt=""`, yakınlarındaki görünür metni tekrar etmediği için korundu; iki logo ve `aria-hidden="true"` içindeki iki slayt görselinin dolu `alt` değerleri de kontrol edildi. Ana sayfanın görsel bileşenlerine toplu açıklama eklenmedi.
- `seo-analyzer.js` eksik, boş ve dolu `alt` değerlerini ayrı sayıyor; eksik görsellerin kaynaklarını döndürüyor. SEO ve GEO görsel puanlaması gerçek `alt` niteliği eksikliğini ölçüyor. GEO istatistiğindeki `imageAltRatio` artık `alt` niteliği kapsamını gösteriyor; boş ve dolu sayılar ayrıca dönüyor.
- GEO içerik tarihleri, sayfa URL'sine ait geçerli `WebPage`/makale JSON-LD veya meta tarihlerini kullanıyor. Başka URL'ye ait haber tarihleri ve geçersiz tarih değerleri kabul edilmiyor.
- Mevcut `seo-runner.js` raporu yeni görsel ayrımını gösteriyor ve sayfa türü seçilmeden hizmet şeması önerisi üretmiyor. İstenirse dördüncü komut satırı argümanıyla şema profili seçilebilir.
- `npm run lint` başarılı; `npm run test:unit` 111/111 başarılı; `npm run build` başarılı; yerel üretim sunucusunda `npm run verify:seo` ihlalsiz (önceden bilinen dört BreadcrumbList/H1 uyarısı sürüyor). `npm install --save-dev linkedom --ignore-scripts` sonrası npm denetimi 0 güvenlik açığı bildirdi.
- Yerel sunucu, Supabase şema önbelleğinde `public.rehber_articles` tablosunu bulamadığını bildirdi. SEO doğrulaması mevcut sitemap'teki 53 URL'de başarılıdır; bu yerel veri eksikliği nedeniyle yayımlanmış rehber makalelerinin envanteri tam olmayabilir.
- Güncel analiz kodu canlı ana sayfa HTML'sine uygulandığında genel/teknik/içerik SEO 100/100, GEO 93/100, GEO içerik 83/100 çıktı. Bu, **canlı dağıtımın güncellendiği anlamına gelmez**; yeni analiz koduyla mevcut canlı HTML yeniden değerlendirildi. Canlı dağıtım sonrasında aynı analiz tekrar çalıştırılmalı.
