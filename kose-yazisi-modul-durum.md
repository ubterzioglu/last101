# Köşe Yazısı Modülü — Son Durum Raporu

**Tarih:** 2026-04-26
**Modül adı (kullanıcıya yönelik):** Arkadaşın Köşesi
**Repo:** `almanya101last`
**İlgili commit'ler:** `4685556` (köseler — ilk versiyon), `7cc2372` (new sections! — multi-author refactor)

---

## 1. Özet

Köşe yazısı modülü, **çok yazarlı (multi-author) bir blog/köşe sistemi** olarak çalışmakta. Her yazarın kendi public profil sayfası (`/<authorSlug>`), kendi giriş sayfası (`/kose-giris/<authorSlug>`) ve kendi yönetim paneli (`/kose-panel/<authorSlug>`) var. Tüm yazarlar ve yazılar tek bir merkezden (admin panel + Supabase) yönetiliyor.

Modül, ilk olarak **24 Nisan 2026**'da tek-yazarlı (singleton) yapı olarak eklendi, **26 Nisan 2026**'da çok-yazarlı yapıya refactor edildi.

---

## 2. Modül Mimarisi

### 2.1 URL Yapısı

| URL | Sayfa | Açıklama |
|---|---|---|
| `/yazi-dizisi` | Liste sayfası | Tüm köşe yazarları + tüm yayındaki yazılar |
| `/yazi-dizisi/<slug>` | Yazı detayı | Slug formatı: `<baslik>--<uuid>` |
| `/<authorSlug>` | Yazar public sayfası | Yazarın bio'su + yazı listesi |
| `/kose-giris/<authorSlug>` | Yazar girişi | Şifre ile yazar paneline giriş |
| `/kose-panel/<authorSlug>` | Yazar paneli | Yazar kendi yazılarını yönetir |
| `/admin/yazi-dizisi` | Admin panel | Tüm yazarları + yazıları yönetim |

> Yazar slug'ları `RESERVED_AUTHOR_SLUGS` listesi ile koruma altında — `admin`, `api`, `devuser`, `haberler` gibi sistem rotalarıyla çakışma engellenmiş (`lib/admin/cornerAuthorAuth.ts:83-110`).

### 2.2 Veritabanı Şeması

İki tablo, iki migration:

**`corner_authors`** (`20260424110000_corner_multi_author.sql`)
- `id`, `display_name`, `slug` (unique)
- `short_bio`, `bio_content` (Markdown destekler)
- `avatar_image_url`, `display_order`
- `password_hash`, `password_salt`, `hash_iterations` (PBKDF2)
- `is_active` — pasifleştirme bayrağı
- RLS: yalnızca aktif yazarlar herkese açık

**`corner_posts`** (`20260424090000_create_corner_blog.sql` + multi-author migration)
- `id`, `author_id` (FK → corner_authors, ON DELETE CASCADE)
- `title`, `summary`, `content` (Markdown)
- `cover_image_url`, `reading_minutes` (1–60)
- `status` ('draft' | 'published'), `published_at`
- `is_primary` (legacy alan, multi-author migration'dan kalma)
- RLS: yalnızca `status = 'published'` herkese açık

**Storage bucket:** `corner` — public read, 5 MB limit, JPG/PNG/WEBP/GIF.

### 2.3 Kod Dosyaları

```
app/
├── (site)/
│   ├── yazi-dizisi/
│   │   ├── page.tsx                   ← liste (force-dynamic)
│   │   └── [slug]/page.tsx             ← yazı detayı + ArticleJsonLd
│   └── [authorSlug]/page.tsx           ← yazar public sayfası
├── kose-giris/[authorSlug]/page.tsx    ← noindex, mode='login'
├── kose-panel/[authorSlug]/page.tsx    ← noindex, mode='panel'
├── admin/yazi-dizisi/page.tsx          ← admin entry
└── api/
    ├── corner-admin-verify              ← admin şifre doğrula
    ├── corner-admin-list                ← yazar/yazı listele
    ├── corner-admin-action              ← create/update/delete (admin)
    ├── corner-admin-upload              ← admin görsel yükle
    ├── corner-author-verify             ← yazar şifre doğrula
    ├── corner-author-panel              ← yazarın kendi panel verisi
    ├── corner-author-action             ← yazarın kendi içerik aksiyonları
    └── corner-author-upload             ← yazarın görsel yüklemesi

components/
├── CornerAdminClient.tsx               ← admin paneli UI
└── CornerAuthorPanelClient.tsx         ← yazar paneli + giriş UI

lib/
├── corner.ts                           ← public read API (server-only)
├── admin/cornerAuth.ts                 ← admin auth + rate limit
├── admin/cornerAuthorAuth.ts           ← yazar auth + rate limit
└── admin/cornerPasswords.ts            ← PBKDF2 hash/verify
```

---

## 3. Kullanıcı Akışları

### 3.1 Okuyucu Akışı (Public)

1. Ana sayfa veya navigasyon → `/yazi-dizisi`
2. Hero (gradient arkaplan) + **Köşe yazarları** grid (max 5, `displayOrder` sıralı)
3. **Tüm yazılar** grid'i (max 120, eskiden yeniye)
4. Bir yazı kartına tıklama → `/yazi-dizisi/<slug>`
5. Yazı sayfası: kapak + başlık + özet + Markdown içerik (`MarkdownPreview` ile render) + ArticleJsonLd SEO
6. Yazardan tıklama → `/<authorSlug>` (yazarın tüm yayındaki yazıları)

### 3.2 Yazar Akışı

1. `/kose-giris/<authorSlug>` → şifre gir
2. Doğrulama: `corner_authors.password_hash` ile PBKDF2 (210k iterasyon) karşılaştırma
3. Başarılı → `sessionStorage`'a şifre kaydı + `/kose-panel/<authorSlug>`'a redirect
4. Panel ekranı:
   - **Profil**: ad, kısa bio, profil görseli (5 MB limit)
   - **Yazı oluşturma**: başlık, özet, kapak görseli, okuma süresi, status (draft/published), Markdown içerik + canlı önizleme (split screen)
   - **Yazılarım** sütunu: düzenle / sil / status badge
5. Çıkış → sessionStorage temizlenir

### 3.3 Admin Akışı

1. `/admin/yazi-dizisi` → `CORNER_ADMIN_PASSWORD` ile giriş
2. 3 sekme: **Yazarlar**, **Yeni Yazar / Yazarı Düzenle**, **Yazılar**
3. Üst dashboard: 4 metrik kartı (toplam yazar, aktif yazar, toplam yazı, yayında yazı)
4. Yazar oluştur: ad, slug (auto-slugify), profil görseli, kısa bio, profil metni, displayOrder, **yazar şifresi** (min 6 karakter)
5. Yazarlar sekmesi: public link, giriş linki, düzenle, aktif/pasif toggle, **şifre sıfırlama**
6. Yazılar sekmesi: tüm yazılar listesi + draft↔published toggle

---

## 4. Güvenlik

| Konu | Durum |
|---|---|
| Yazar şifre saklaması | PBKDF2 + salt + 210k iterasyon (`createPasswordHash`) |
| Admin auth | `CORNER_ADMIN_PASSWORD` env (`isCornerAdminAuthorized`) |
| Rate limit (admin) | `lib/admin/cornerAuth.ts` — IP başına |
| Rate limit (yazar) | 8 başarısız deneme / 10 dk → 10 dk blok |
| RLS | Tablolarda aktif: yazarlar `is_active=true`, yazılar `status='published'` |
| Service role kullanımı | Yalnızca server-side API rotalarında |
| Slug enjeksiyonu | `RESERVED_AUTHOR_SLUGS` + `normalizeAuthorSlug` (turkish-aware) |
| Görsel yükleme | MIME whitelist (jpg/png/webp/gif) + 5 MB cap |
| Robots | `/kose-giris/*` ve `/kose-panel/*` için `noindex, nofollow` |
| SessionStorage | Şifre client tarafında saklanıyor — XSS riskine açık (NOT) |

> **Dikkat noktası:** Yazar şifresi `sessionStorage`'da düz metin (plaintext) tutuluyor ve her API çağrısında header'a ekleniyor. JWT/HttpOnly cookie tabanlı bir oturum modeline geçiş, gelecekte değerlendirilebilir.

---

## 5. SEO & Performans

- **Liste sayfası** (`/yazi-dizisi`): `force-dynamic` — her istekte taze veri.
- **Yazı detayı** (`/yazi-dizisi/[slug]`): `force-dynamic` + `createArticleMetadata` + `ArticleJsonLd`.
- **Yazar sayfası** (`/<authorSlug>`): `force-dynamic` + `WebPageJsonLd` + breadcrumb.
- Tüm public sayfalarda `BreadcrumbJsonLd`.
- Görseller `next/image` ile fakat `unoptimized` (Coolify/standalone deploy gereği).
- `noStore()` her public read fonksiyonunda → cache yok.

> **Optimizasyon fırsatı:** Yayında yazı sayısı artarsa `force-dynamic` yerine ISR (`revalidate: 60`) modeline geçilebilir.

---

## 6. UX Özellikleri

- **Markdown desteği** hem profil bio'sunda hem yazı içeriğinde (`MarkdownPreview` component).
- **Canlı önizleme**: yazar paneli yazı yazma alanında split-screen markdown preview.
- **Görsel yükleme**: drag-free, file input + 5 MB / MIME doğrulama.
- **Slug oto-üretimi**: yazar adından Türkçe karakter normalize edilerek otomatik slug.
- **Display order**: admin yazar kartlarını `displayOrder` ile sıralayabilir; "Köşe yazarları" grid'inde max 5 kart gösterilir.
- **Status toggle**: tek tıkla taslak ↔ yayında.

---

## 7. Bilinen Sınırlar / İyileştirme Alanları

| # | Konu | Detay |
|---|---|---|
| 1 | Yazar oturumu | `sessionStorage`'da plaintext şifre — HttpOnly cookie + token modeline geçilmeli |
| 2 | Cache | Tüm sayfalar `force-dynamic` — yazı sayısı arttığında ISR'ye geçiş |
| 3 | Yazar başına yazı limiti | Yok; spam riski varsa eklenmeli |
| 4 | Markdown render | Server-side render değil, client component (`MarkdownPreview`) — SEO için içeriğin SSR olması gerekebilir |
| 5 | İçerik versiyonlama | Yok; geçmiş sürümler tutulmuyor |
| 6 | Yazar e-posta | Şifre sıfırlama link akışı yok, sadece admin elle resetliyor |
| 7 | Tag/kategori | Yok; sabit `tags: ['Arkadaşın Köşesi', 'Yazı Dizisi', 'Almanya']` |
| 8 | Yorumlar | Yok |
| 9 | RSS / sitemap | Köşe yazıları sitemap'e eklenmeli (varsa kontrol edilmeli) |
| 10 | Test kapsamı | Modül için E2E/unit test yok |
| 11 | `is_primary` alanı | Multi-author migration'dan kalma legacy alan, kullanılmıyor — temizlenebilir |
| 12 | Avatar default | `/images/profil.jpg` — eksikse fallback çalışıyor ama birden çok yazar varsa ayırt edilmiyor |

---

## 8. Env Değişkenleri (Modül için)

```
CORNER_ADMIN_PASSWORD=...                  # admin paneli için
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...              # API rotaları + storage upload için
```

`.env.example` dosyasında `CORNER_ADMIN_PASSWORD` mevcut.

---

## 9. Genel Değerlendirme

**Olgunluk seviyesi:** Üretime alınabilir, MVP+ seviyesinde.

**Güçlü yanlar:**
- Temiz multi-author mimari, doğru RLS politikaları.
- PBKDF2 + rate limit ile güvenli yazar auth.
- Admin ve yazar panelleri iyi ayrılmış (yetki sınırı net).
- SEO altyapısı (Article + Breadcrumb JsonLd) zaten kurulu.
- Görsel yükleme akışı whitelist + boyut kontrolü ile güvenli.

**Acil olmayan ama planlanmalı olanlar:**
1. Sessiz yenileme + HttpOnly cookie auth.
2. Cache stratejisi (ISR).
3. Sitemap entegrasyonu.
4. E2E test (yazar girişi → yazı oluştur → yayınla → public sayfada görme).

**Sonuç:** Modül kararlı, kullanılabilir. İçerik üretimi başlayabilir; teknik borç olarak yukarıdaki 12 maddelik liste backlog'a eklenebilir.
