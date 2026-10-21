# H1–H3, yapılandırılmış veri ve SEO/GEO doğrulama planı

**Hazırlanma tarihi:** 21 Ekim 2026  
**Amaç:** Başka bir mühendisin veya ajanın denetimi tekrarlayıp bulguları düzeltmesi için uygulama planı. Genel bulgular için [SEO/GEO denetimi](./seo-geo-2026-10-21.md) ile birlikte okunur.

## Özet ve başlangıç ölçümü

Tüm herkese açık URL'lerde teknik SEO, H1–H3 hiyerarşisi ve JSON-LD denetimi yapılacak. Sonuçlar URL bazında kaydedilecek; doğrulanmış hatalar öncelik sırasıyla düzeltilecek. GEO çalışması, üretken aramada kaynak olarak kullanılabilecek erişilebilir, güncel ve kaynaklı Türkçe içeriğe odaklanacak.

21 Ekim 2026 canlı taramasında sitemap'teki **54 URL'nin 18'i** anonim istekte girişe `307` yönlendi. Erişilebilir **36 sayfada** iki eksik H1 (`/is-ilanlari`, `/iletisim`), üç çift H1 (haber detayları) ve bir H1→H3 sıçraması (`/ekibimize-katil`) görüldü. JSON-LD blokları ayrıştırılabildi; bu, şemaların Google Rich Results Test'ten geçtiğini veya içerikle uyumlu olduğunu kanıtlamaz.

Çalışma ağacında sitemap, H1 ve `LocalBusiness` için commit edilmemiş değişiklikler bulunabilir. Uygulamayı üstlenen ajan önce `git status` ve ilgili diff'leri okuyacak; mevcut çalışmayı geri almayacak. Canlı sürüm ile çalışma ağacı ayrı başlangıç durumları olarak raporlanacak.

## 1. Tekrarlanabilir denetim

1. `scripts/verify-seo.mjs` denetimini genişlet. URL envanterini sitemap, herkese açık statik rotalar ve yayımlı dinamik makalelerden oluştur. HTTP istemcisi yönlendirmeleri otomatik izlemesin. Her URL için durum kodu, yönlendirme hedefi, robots, canonical, title, meta açıklama, `html lang`, H1–H3 dizisi, iç bağlantılar ve JSON-LD türlerini kaydet. Giriş, admin ve kullanıcı rotalarını ayrı “indekslenmemeli” grubunda tut.
2. Her indekslenebilir sayfa için görünür ve anlamlı **tek H1** ara. Ana içerikte boş heading, çift H1 veya H1→H3 gibi düzey atlamalarını raporla. İlgili haber kartlarının H3'lerini üstlerindeki H2 bağlamında değerlendir. Rapor her ihlalin URL'sini, heading metnini ve tam dizisini göstersin.
3. Her JSON-LD bloğunu ayrıştır ve `@type`, URL, başlık, yazar, yayın/güncelleme tarihi, breadcrumb ve SSS değerlerini görünür içerikle karşılaştır. `LocalBusiness`, `Organization`, `WebSite`, `Article`, `FAQPage`, `HowTo` ve `Speakable` kullanımlarını ayrı incele. Ana sayfa, haber, rehber ve araç merkezi örneklerini [Google Rich Results Test](https://search.google.com/test/rich-results) ve [Schema Markup Validator](https://validator.schema.org/) ile ayrıca doğrula.
4. Sitemap'teki her URL'nin anonim istekte doğrudan `200`, indekslenebilir ana içerik ve kendine işaret eden canonical verdiğini kontrol et. `robots.txt`, RSS, `www` yönlendirmesi, sayfa vaadi–içerik uyumu, resmî kaynaklar ve güncelleme tarihlerini incele. Search Console ve gerçek kullanıcı Core Web Vitals verisine erişim yoksa sonuçları “ölçülemedi” diye işaretle; tahmin üretme.

**Denetim çıktısı:** URL bazlı tablo; P0/P1/P2 bulgu listesi; her bulgu için yeniden üretme adımı, canlı ve kod kanıtı, önerilen düzeltme; denetimi yeniden çalıştırma komutu.

## 2. Öncelikli düzeltmeler

### P0 — indekslenebilirlik ve heading

- Mevcut üyelik kuralını koru. Anonim istekte girişe yönlenen 18 araç URL'sini sitemap'ten çıkaran çalışma ağacı değişikliğini doğrula. Giriş gerektiren hesaplama ve sonuç ekranlarını bu aşamada herkese açma. Araçlar için ileride ayrı, herkese açık bilgi sayfası oluşturulması ayrı ürün işi olarak kaydedilsin.
- `/iletisim` sayfasının ana başlığını H1 yap. `/is-ilanlari` sayfasına eklenmiş H1 değişikliğini doğrula. `/ekibimize-katil` dizisini H1→H2→H3 olarak düzelt.
- Haber ve rehber detay şablonundaki sayfa başlığı tek H1 olarak kalsın. Makale Markdown gövdesindeki `#` başlıklarını **yalnızca herkese açık makale render'ında** H2'ye dönüştür; `##` ve `###` başlıkları H2 ve H3 kalsın. Yönetici önizlemesinin davranışını değiştirme. Mevcut üç çift H1'li haber bu değişiklikle tek H1'e düşmeli.

### P1 — şema, sitemap ve sayfa doğruluğu

- Site genelindeki `LocalBusiness` şemasını kaldıran çalışma ağacı değişikliğini doğrula. Eski canlı şemadaki Berlin koordinatları, Impressum'daki Dortmund adresiyle uyuşmuyor. Gerçek fiziksel müşteri lokasyonu doğrulanmadıkça bu şemayı yeniden ekleme; `Organization` ve `WebSite` şemaları kalsın.
- Makale şemasındaki yazar, kaynak, URL ve tarihler görünür sayfayla eşleşsin. Doğrulanmamış kişisel yazar, uzmanlık veya güncelleme tarihi üretme. Görünür karşılığı olmayan `FAQPage`, `HowTo` veya `Speakable` işaretlerini kaldır. SSS şemasını zengin sonuç garantisi olarak sunma.
- Statik URL'lerde istek anını `lastmod` olarak yazmayan çalışma ağacı değişikliğini doğrula. `/is-ilanlari` başlık, açıklama, H1 ve içerik birlikte gerçek iş ilanları yerine iş bulma ajansları/kariyer platformları listesini anlatsın. Boş `/rehber` merkezinin durumunu raporla; yayımlanmamış makaleleri sitemap'e ekleme.

### P2 — kaynak gösterilebilir GEO içeriği

- Adres kaydı, vize/oturum, sağlık sigortası, brüt-net maaş ve iş arama için beş özgün rehber taslağı hazırla. Her birinde kısa doğrudan yanıt, kapsam ve istisnalar, doğrulanmış resmî kaynak bağlantıları, sorumlu yazar/kurum ve son kontrol tarihi bulunsun.
- Değişebilen oran ve kuralları yayımdan hemen önce güncel birincil kaynaklardan doğrula. Rehber–araç–ilgili haber arasında konuyla uyumlu iç bağlantılar kur. Taslakları kaynak doğrulaması tamamlanmadan yayımlama.

## 3. Test ve kabul

- Genişletilmiş `npm run verify:seo`, sitemap'teki **bütün URL'leri** anonim olarak kontrol etsin; yönlendirme, hata, `noindex`, eksik/çift H1, heading sıçraması, hatalı canonical ve ayrıştırılamayan JSON-LD için başarısız olsun. Mevcut betiğin giriş gerektiren araçları `200` beklemesi düzeltilsin. Keyfi title/açıklama karakter aralıklarını başarı koşulu yapma; boşluk, tekrar ve arama niyeti uyumunu denetle.
- En az ana sayfa, `/rehber`, `/haberler`, bir haber detayı, `/is-ilanlari`, `/iletisim` ve `/ekibimize-katil` için şema–görünür içerik eşleşmesini kontrol et. Yayımlı rehber oluşunca rehber detayını da ekle. Üyelik gerektiren araçların yönlendirmesi ayrı auth testinde korunsun.
- `npm run lint`, `npm run test:unit`, `npm run build` ve ilgili Playwright smoke testlerini çalıştır. Canlıya alımdan sonra aynı URL taramasını tekrarla; Search Console sitemap ve örnek URL Inspection sonuçlarını başlangıç ölçümü olarak kaydet.

**Kabul ölçütleri:** Sitemap'te **0 yönlenen veya `noindex` URL**; erişilebilir indekslenebilir sayfalarda **0 eksik/çift H1 ve 0 heading düzeyi atlaması**; ayrıştırılamayan veya görünür içerikle çelişen JSON-LD **0**. Rehber yayını ayrı editoryal kabul gerektirir. Trafik artışı veya AI yanıtlarında kaynak gösterimi garanti edilmez.

## Varsayımlar ve kaynaklar

- Bu plan denetimi ve bulguların kod düzeltmelerini kapsar. CMS içeriği kaynak doğrulaması bitmeden yayımlanmaz.
- Commit edilmemiş SEO değişiklikleri korunur; ajan canlı sürümle yerel kodun farklı olabileceğini raporlar.
- GEO için yeni bir “AI şeması” veya `llms.txt` genişletmesi öncelik değildir. [Google'ın AI arama rehberi](https://developers.google.com/search/docs/appearance/ai-features), erişilebilir ve yararlı içerik için temel SEO uygulamalarını esas alır.
- Sitemap `lastmod` değeri yalnızca gerçek önemli değişikliği yansıtmalı; Google `priority` ve `changefreq` değerlerini dikkate almaz. [Google sitemap rehberi](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
