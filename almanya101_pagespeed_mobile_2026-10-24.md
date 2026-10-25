# Almanya101.de – Google PageSpeed Insights Mobil Raporu

**Analiz edilen site:** https://almanya101.de/  
**Cihaz:** Mobil (Mobile)  
**Rapor tarihi:** 24 Ekim 2026, 18:53:27  
**Kaynak:** https://pagespeed.web.dev/analysis/https-almanya101-de/ud3wh4nn8u?utm_source=search_console&form_factor=mobile&hl=de

## 1. Erişilebilen doğrulanmış sonuçlar

| Alan | Sonuç |
|---|---|
| Raporun mevcut olması | Doğrulandı |
| Mobil analiz | Rapor bağlantısında ve sayfa üzerinde mevcut |
| Chrome User Experience Report (CrUX) | Bu sayfa için yeterli gerçek kullanıcı hız verisi bulunmuyor |
| Saha verisi / Core Web Vitals değerlendirmesi | **No Data** (Veri yok) |
| Lighthouse performans skoru | Sayfanın erişilebilir metin sürümünde alınamadı |
| Accessibility skoru | Sayfanın erişilebilir metin sürümünde alınamadı |
| Best Practices skoru | Sayfanın erişilebilir metin sürümünde alınamadı |
| SEO skoru | Sayfanın erişilebilir metin sürümünde alınamadı |

> **Veri bütünlüğü notu:** PageSpeed Insights raporunun herkese açık metin görünümü analiz tarihi ile CrUX veri yetersizliğini gösteriyor. JavaScript ile üretilen Lighthouse puanları, FCP/LCP/TBT/CLS/Speed Index ölçümleri ve tek tek denetim sonuçları bu erişimde sunulmadı. Bu nedenle sayısal skorlar ve teknik sorunlar tahmin edilmedi. **“No Data” performans testinin başarısız olduğu anlamına gelmez; yeterli saha verisi olmadığı anlamına gelir.**

## 2. Performans metrikleri

| Metrik | Rapor değeri | Açıklama |
|---|---|---|
| First Contentful Paint (FCP) | Erişilemedi | İlk içeriğin görünmesi |
| Largest Contentful Paint (LCP) | Erişilemedi | En büyük görünür içerik |
| Total Blocking Time (TBT) | Erişilemedi | Ana iş parçacığının bloklanması |
| Cumulative Layout Shift (CLS) | Erişilemedi | Sayfa düzenindeki kaymalar |
| Speed Index (SI) | Erişilemedi | Görsel yüklenme hızı |
| Interaction to Next Paint (INP, saha verisi) | Veri yok | Kullanıcı etkileşimlerine yanıt |

## 3. Lighthouse denetimleri

Aşağıdaki denetimlerin bu raporda başarısız olduğu **doğrulanmadı**. Yalnızca ayrıntılı skorlar elde edildiğinde incelenebilecek başlıklardır:

- Render engelleyici kaynaklar
- JavaScript ve CSS boyutu / kullanılmayan kod
- Görsel optimizasyonu ve uygun görsel boyutları
- Önbellek politikaları
- Sunucu yanıt süresi
- LCP öğesi ve kaynak keşfi
- Font yükleme davranışı
- Erişilebilirlik denetimleri
- SEO ve Best Practices denetimleri

## 4. Eksiksiz raporu alma

1. Yukarıdaki PageSpeed Insights bağlantısını bir tarayıcıda açın.
2. **Mobil** sekmesini seçin.
3. Dört kategori puanını, metrikleri ve tanı bölümlerini tarayıcıdan görüntüleyin.
4. Lighthouse JSON çıktısı veya rapor ekranının tamamı sağlandığında bu dosyadaki eksik tablolar kesin değerlerle tamamlanabilir.

## 5. Kaynak ve sınırlama

Bu belge, 24 Ekim 2026 tarihinde bağlantının erişilebilen rapor metninden çıkarılmış **doğrulanabilir kısmi rapordur**; eksiksiz Lighthouse JSON çıktısı değildir. Kaynaktaki “The Chrome User Experience Report does not have sufficient real-world speed data for this page” ifadesi raporda yer almaktadır.

## 6. Mobil ana sayfa iyileştirme planı

**Kapsam:** `https://almanya101.de/` adresinin mobil görünümü. Ortak bileşenlerde yapılacak değişikliklerin etkilediği diğer sayfalar regresyon açısından kontrol edilecek. Sabit bir Lighthouse puanı hedeflenmeyecek; başarı, alınacak başlangıç ölçümüne karşı doğrulanmış iyileşme ve çalışan sayfa davranışıyla değerlendirilecek.

### 6.1. Başlangıç ölçümü

1. Canlı ana sayfanın mobil Lighthouse JSON raporunu ve ağ kaydını al. PageSpeed API `429 Too Many Requests` yanıtı verirse tarayıcıdaki Lighthouse çıktısını kullan.
2. Aynı mobil profil ve ağ koşullarında beş ölçüm yap; FCP, LCP, TBT, CLS, Speed Index, toplam aktarılan bayt ve sunucu yanıt süresinin medyanını kaydet. LCP öğesini ve en maliyetli kaynakları belirle.
3. Laboratuvar ölçümlerini CrUX saha verisinden ayrı göster. CrUX için “No Data” sonucu devam ederse bunu performans hatası olarak yorumlama.

### 6.2. Ölçüme göre uygulama

1. **Görsel aktarımı veya LCP baskınsa:** Ana sayfa kart görsellerinin gerçek aktarım boyutlarını ve `sizes` değerlerini kontrol et. İlk yedi kartın öncelikli yüklenmesi ile sayfanın altındaki slayt gösterisinin ilk görseline verilen `priority` değerini, mobil ilk ekranda görünürlüklerine göre düzelt. LCP öğesinin kaynak keşfini ve yükleme sırasını doğrula.
2. **Sunucu yanıtı baskınsa:** `app/page.tsx` içindeki `force-dynamic` ve haber sorgusundaki `noStore()` etkisini ölç. Haberlerin güncellik ihtiyacını karşılayan süreli önbellekleme uygula; kişisel ve oturumlu yanıtları bu önbelleğe dahil etme.
3. **TBT veya CLS baskınsa:** Lighthouse kaydında işaretlenen bileşenleri hedefle. Slayt gösterisi, haber karuseli, fontlar ve izin sonrası analitik betiklerinin yükleme sırasını ve düzen kararlılığını kontrol et. Türkçe içerik ve mevcut etkileşimler korunmalı.
4. Her değişikliği tek başına yeniden ölç. Ölçümde yararı doğrulanmayan değişikliği performans düzeltmesi olarak kabul etme.

### 6.3. Doğrulama ve teslim

- Her değişiklikten sonra başlangıçla aynı koşullarda beş mobil ölçüm yap. Etkilenen metriğin medyanı iyileşmeli; diğer temel metriklerde belirgin gerileme olmamalı. Başlangıç ve sonuç JSON dosyalarını, test koşullarını ve kararları birlikte kaydet.
- Mobil ilk ekranı, kartları, haber karuselini ve slayt gösterisini görsel olarak ve klavyeyle kontrol et.
- `npm run lint`, `npm run test:unit`, `npm run build` ve ilgili herkese açık sayfa smoke testlerini çalıştır.
- Dağıtımdan sonra canlı ana sayfada aynı mobil Lighthouse ölçümünü tekrarla ve yerel sonuçla karşılaştır.

**Çalışma ağacı notu:** Depoda mevcut, henüz commit edilmemiş değişiklikler bulunuyor. Uygulama sırasında bunlar korunmalı; plan, bu değişikliklerin tamamlandığını varsaymıyor.

## 7. Uygulama kaydı (24 Ekim 2026)

### 7.1. Başlangıç ölçümü (canlı, https://almanya101.de/)

Koşullar: Lighthouse 13.5.0 CLI, `--form-factor=mobile`, `--only-categories=performance`, Edge headless, 5 koşu. Ham JSON: `%TEMP%\lh-baseline\run1-5.json`.

| Metrik | Medyan |
|---|---|
| Performans skoru | 68 |
| FCP | 2.317 ms |
| LCP | 11.231 ms |
| TBT | 122 ms |
| CLS | 0 |
| Speed Index | 4.781 ms |
| Sunucu yanıtı | 204 ms |
| Toplam aktarım | 1.708 KB |

Baskın sorun: görsel aktarımı / LCP (`image-delivery-insight` ~799 KB tasarruf). LCP öğesi hero logosu `/yeniherologo.png` (271 KB, 1160×400, 278×96 çizim). TTFB iyi olduğu için `force-dynamic`/`noStore` değişikliği yapılmadı.

### 7.2. Yapılan değişiklikler

1. `public/yeniherologo.avif` (32 KB, 560×193) üretildi; `HomeHeroSection` ve `not-found` bu kaynağı kullanıyor. `public/almanya101header.webp` (13 KB, 240×56) üretildi; `Header` bunu kullanıyor.
2. LCP görseli için `fetchPriority="high"` ile açık preload (`HomeHeroSection`, `Header`); Next 15.1'in `priority` prop'unun üretti preload bağları Low öncelikte kaldığı için prop yerine preload + `loading="eager"` + `fetchPriority="high"` kullanıldı. Ölçümde her iki görselin de High öncelikle indiği doğrulandı.
3. `KenBurnsSlideshow`: ilk slayttaki `priority` kaldırıldı (bölüm mobil ilk ekranın çok altında); görseller yalnızca ziyaret edilmiş/sonraki slayt için `loading="lazy"` ile çiziliyor.
4. `app/page.tsx`: kart ızgarasındaki `priorityFirst={7}` kaldırıldı; ızgara mobil ilk ekranda olmadığı için 27 uzak görsel artık bant genişliği için LCP ile yarışmıyor.
5. `constants/home-data.ts`: Unsplash URL'lerine `&auto=format` eklendi (36 URL).
6. `app/layout.tsx`: `images.unsplash.com` için preconnect/dns-prefetch.
7. `next.config.ts`: kök statik cache başlığı regex'ine `yeniherologo.avif` ve `almanya101header.webp` eklendi.

### 7.3. Sonuç ölçümü (yerel production build, aynı koşullar, 5 koşu)

Ham JSON: `%TEMP%\lh-after2\run1-5.json`.

| Metrik | Başlangıç | Sonuç | Değişim |
|---|---|---|---|
| Performans skoru | 68 | 80 | +12 |
| FCP | 2.317 ms | 2.134 ms | -183 ms |
| LCP | 11.231 ms | 4.605 ms | -6.626 ms |
| TBT | 122 ms | 78 ms | -44 ms |
| CLS | 0 | 0 | aynı |
| Speed Index | 4.781 ms | 3.346 ms | -1.435 ms |
| Sunucu yanıtı | 204 ms | 240 ms | +36 ms (gürültü) |
| Toplam aktarım | 1.708 KB | 814 KB | -894 KB |

### 7.4. Doğrulama

- `npm run lint`: temiz. `npm run test:unit`: 102/102. `npm run build`: başarılı.
- `e2e/smoke` (public-routes + cookie-consent): 30/30 (ilk koşudaki 4 flaky başarısızlık yeniden koşuda geçti).
- Mobil görsel/klavye kontrolü: hero, kartlar, haber karuseli (butonla kaydırma), slayt gösterisi (kaydırma sonrası 3/3 görsel yüklü), odak sırası; konsol/sayfa hatası yok.

### 7.5. Kalan darboğaz ve karar

Yerel ölçümde LCP'nin ~4,6 s kalmasının nedeni görsel değil font-swap: iki font ailesinin latin + latin-ext (Türkçe ğ/ş) dosyaları (~102 KB, 4 woff2) simüle 1,6 Mbps bağlamda geç tamamlanıyor ve `display: 'swap'` nedeniyle LCP metni web fontuyla yeniden çizilince LCP zamanı güncelleniyor. Çözümler tasarım kararı gerektirir: (a) `display: 'optional'` (ilk ziyarette marka fontu görünmeyebilir), (b) fontları Türkçe+ASCII gliflere subsetlemek. Bu oturumda marka tipografisi korunarak ikisi de uygulanmadı.

### 7.6. Dağıtım sonrası

Canlıda aynı 5 koşulu mobil ölçüm tekrarlanmalı ve bu tabloyla karşılaştırılmalı (plan 6.3). CrUX "No Data" durumu performans hatası olarak yorumlanmaz.
