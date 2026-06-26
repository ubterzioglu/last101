# Almanya101 Yeni Araçlar Özeti

## Amaç

`newtools.md` içindeki plan, Almanya101 içinde 10 ayrı interaktif araca dönüştürüldü. Yaklaşım, tek tek bağımsız sayfalar üretmek yerine ortak bir araç altyapısı kurup her aracı veri odaklı konfigürasyonla beslemek oldu.

Tüm kullanıcıya görünen içerikler Türkçe yazıldı. Araçlar public `app/(site)` rotaları olarak açıldı ve auth gerektirmeyecek şekilde yayınlandı.

## Eklenen Araçlar

- `almanya-yolunu-sec`
- `almanya-maas-beklentisi`
- `almanyaya-hazir-misin`
- `hangi-sehir-sana-uygun`
- `topluluk-ve-danismanlik`
- `kariyer-ve-egitim-rotasi`
- `almanya-yasam-tarzi-uyumu`
- `ilk-90-gun-planlayici`
- `once-hangi-sorunu-cozmelisin`
- `almanyada-is-bulma-olasiligi`

Ek olarak tüm araçları tek yerden listeleyen public hub sayfası eklendi:

- `almanya-araclari`

## Ortak Mimari

Yeni araçlar için tekrar kullanılabilir bir iskelet oluşturuldu:

- `lib/tools/types.ts`
  Ortak soru, seçenek, state, sonuç ve araç konfigürasyonu tipleri.
- `lib/tools/catalog.ts`
  Araç kataloğu, ortak legal not ve resmi kaynak tanımları.
- `lib/tools/helpers.ts`
  Resolver tarafında kullanılan küçük state yardımcıları.
- `components/tools/ToolPageScaffold.tsx`
  Metadata, breadcrumb, FAQ JSON-LD ve sayfa kabuğu.
- `components/tools/ToolExperience.tsx`
  Ortak soru akışı, ilerleme çubuğu, sonuç kartı, resmi kaynaklar ve FAQ render mantığı.

Bu sayede her araç için iş mantığı büyük ölçüde `toolConfig.ts` içinde tutuldu; UI kopyala-yapıştır ile değil, paylaşımlı bir motor ile üretildi.

## SEO ve İçerik Standardı

Her araçta aşağıdaki standart korundu:

- `createMetadata()` ile metadata üretimi
- `WebPageJsonLd`
- `BreadcrumbJsonLd`
- `FaqJsonLd`
- “Nasıl çalışır?”
- “Bu araç neden var?”
- “Bu araç kim için?”
- “Resmi kaynaklar”
- “Yasal not”
- “Sıkça Sorulan Sorular”

## Test ve Doğrulama

Smoke kapsamı genişletildi:

- `e2e/smoke/public-routes.spec.ts`
  Yeni public araç rotaları eklendi.
- `e2e/smoke/almanya-tools.spec.ts`
  10 yeni araç için açılış, sonuç üretimi, dead-end olmaması ve sıfırlama davranışı test edildi.

Çalıştırılan kontroller:

- `npm run lint`
- `npm run build`
- `npx playwright install chromium`
- `npx playwright test e2e/smoke/public-routes.spec.ts e2e/smoke/almanya-tools.spec.ts --project=chromium`

Sonuç: smoke testlerde `59 passed`.

## Operasyonel Düzeltme

Repo `output: 'standalone'` kullanmasına rağmen standalone sunucu yolu bu ortamda sabit `.next/standalone/server.js` altında oluşmuyordu. Bu yüzden:

- `scripts/start-standalone.mjs` eklendi
- `package.json` içindeki `start` script’i güncellendi

Bu script doğru standalone `server.js` dosyasını buluyor, gerekli statik dosyaları kopyalıyor ve sunucuyu güvenli şekilde başlatıyor. Böylece hem local smoke test hem de üretim başlangıç akışı daha dayanıklı hale geldi.

## Commit Kapsamı

Bu iş kapsamında commit’e dahil edilenler:

- yeni araç rotaları
- ortak `tools` altyapısı
- yeni smoke test dosyası ve public route güncellemesi
- standalone start script düzeltmesi
- bu özet doküman

Bu iş kapsamında commit’e dahil edilmeyenler:

- `.kilo/package-lock.json`
- `.kilocode/package-lock.json`
- untracked `newtools.md`
