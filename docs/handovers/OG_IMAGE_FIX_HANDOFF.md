# OG Görseli Bulanık Görünüyor — Devir Dökümanı (Handoff)

> Tarih: 2026-06-25
> Konu: WhatsApp link önizlemesinde OG görseli (og.png) bulanık/düşük kaliteli görünüyor.

## TL;DR (Özet)

- **Dosya ve kodda sorun YOK.** `public/og.png` HD: 1200×630, 8-bit RGB, ~140 KB. Sunucu doğru servis ediyor.
- Bulanıklığın gerçek sebebi **WhatsApp'ın kendi davranışı**: önizleme görselini sunucusunda küçültüp (~300px) JPEG'e sıkıştırır ve uzun süre cache'ler. Eski/bozuk bir thumbnail cache'lenmişse bulanık görünür.
- Çözüm olarak **OG URL'ine versiyon parametresi** eklendi (`/og.png` → `/og.png?v=2`) ki Facebook/WhatsApp görseli "yeni" sanıp yeniden çeksin.
- WhatsApp önizlemesi **hiçbir zaman tam HD görünmez** — küçük kutuda sıkıştırılmış kalır. Bu değişiklik bulanık/eski cache sorununu çözer, önizleme kutusunun boyutunu değiştirmez.

## Yapılan Kod Değişiklikleri

| Dosya | Değişiklik | Neden |
|---|---|---|
| `lib/utils/constants.ts:10` | `DEFAULT_OG_IMAGE = '/og.png'` → `'/og.png?v=2'` | Cache-busting. WhatsApp/FB yeni görsel sanıp yeniden çeker. |
| `lib/seo/metadata.ts:59` | `imageUrl.endsWith('.png')` → `/\.png(\?|$)/.test(imageUrl)` | `?v=2` query string eklenince `endsWith` `false` döner ve `og:image:type` meta tag'i kaybolurdu; regex query'yi yok sayar. |
| `lib/public-news.ts:87` | hardcode `'/og.png'` fallback → `DEFAULT_OG_IMAGE` (import eklendi, satır 22) | Versiyonu tek yerden yönetmek; haber fallback'i de aynı versiyonlu görseli kullanır. |

### Önemli detay (gelecek için)
OG görselini tekrar güncellersen (`public/og.png` dosyasını değiştirirsen), `constants.ts`'teki `v=2` değerini **`v=3` yap**. Tek satır. Bu, cache'i her seferinde tazeler. `metadata.ts` ve `public-news.ts` otomatik olarak yeni versiyonu kullanır — onlara dokunmana gerek yok.

## Doğrulama (yapıldı)

- `npm run lint` → temiz, hata yok.
- Canlı kontrol (`curl`): `https://almanya101.de/og.png` → `Content-Type: image/png`, `Content-Length: 139926`, 1200×630. Meta tag'ler doğru:
  ```
  og:image = https://almanya101.de/og.png
  og:image:width = 1200, og:image:height = 630
  og:image:type = image/png
  twitter:image = https://almanya101.de/og.png
  ```
  (Not: bu kontrol DEPLOY ÖNCESİ canlıda yapıldı; deploy sonrası URL'ler `?v=2` içerecek.)

## KALAN İŞLER (deploy sonrası — kullanıcı/sonraki session yapacak)

1. **Commit + push + Coolify build** (deploy).
2. **Facebook Debugger ile cache temizle (KRİTİK ADIM):**
   - https://developers.facebook.com/tools/debug/
   - `https://almanya101.de/sigorta-secim` yapıştır → **"Scrape Again"** tıkla.
   - Diğer önemli sayfalar için de tekrarla (ana sayfa, sık paylaşılan tool sayfaları).
   - WhatsApp, Facebook'un scrape altyapısını kullandığı için bu WhatsApp önizleme cache'ini de tazeler.
3. **WhatsApp'ta test:** Linki YENİ bir sohbette paylaş (eski sohbette cache kalmış olabilir).
4. Deploy sonrası `curl -s https://almanya101.de/sigorta-secim | grep og:image` ile URL'lerin `?v=2` içerdiğini doğrula.

## Beklenti Yönetimi (kullanıcıya anlatılacak)

WhatsApp önizleme kutusu küçük thumbnail'dır ve görseli sıkıştırır — **tasarım gereği HD görünmez.** Bu fix "eski/bozuk cache" ve "bulanık görünme" sorununu çözer ama önizleme kutusunu büyütmez. Tam kaliteyi görmek isteyen linke tıklayıp asıl sayfayı açar.

## DİKKAT: Bu işle İLGİSİZ değişiklikler (commit'lerken ayır)

Çalışma ağacında (working tree) benim dokunmadığım, başka bir işten kalma değişiklikler de var:
- `components/admin/AdminSidebar.tsx`
- `eslint.config.mjs`

Ayrıca branch başlangıcında zaten var olan untracked dosyalar (news pipeline ile ilgili, bu işle alakasız):
- `NEWS_PIPELINE_DEPLOY.md`, `scripts/deploy-news-ingest.ps1`
- `supabase/functions/news-ingest/index.ts` (M), `.../adapters/trthaber.ts`
- `supabase/migrations/2026062408*.sql` (3 dosya)

**OG fix commit'ine sadece şu 3 dosyayı dahil et:**
```
git add lib/utils/constants.ts lib/seo/metadata.ts lib/public-news.ts
```

Önerilen commit mesajı:
```
fix(seo): version OG image URL to bust WhatsApp/Facebook preview cache

og.png served HD (1200x630) but WhatsApp showed a stale, compressed
thumbnail. Added ?v=2 cache-buster so scrapers refetch. Fixed png type
detection to ignore query strings. News fallback now reuses DEFAULT_OG_IMAGE.

Constraint: WhatsApp always downscales/compresses preview thumbnails — cannot be made full-HD
Directive: When updating public/og.png, bump v=N in constants.ts to refresh caches
Confidence: high
Scope-risk: narrow
```
