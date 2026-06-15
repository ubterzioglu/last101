# almanya101.de Admin Paneli ve Haber Pipeline Teknik Dökümanı

**Sürüm:** V1  
**Tarih:** 13 Haziran 2026  
**Amaç:** almanya101.de için sıfır bütçeyle başlayabilen, editör kontrollü, sürdürülebilir ve sonradan ölçeklenebilir haber yönetim sistemi kurmak.

---

## 1. Yönetici Özeti

almanya101.de bir genel haber portalı gibi çalışmayacak. Amaç, Almanya'da yaşayan Türklerin işine yarayacak gelişmeleri seçerek sosyal medya paylaşımlarından siteye gelen ziyaretçilere sade ve güvenilir bir landing page sunmak.

Önerilen yapı:

1. Haber adayları ücretsiz RSS kaynaklarından günde bir kez toplanır.
2. Gelen içerikler önce özel bir ham veri tablosuna kaydedilir.
3. Aynı haberin tekrar eklenmesi URL ve hash kontrolüyle engellenir.
4. İsteğe bağlı ücretsiz Gemini katmanı yalnızca Türkçe taslak başlık, kısa özet, kategori ve önem puanı üretir.
5. Hiçbir haber otomatik yayınlanmaz.
6. Editör admin panelinde haberi inceler, metni düzeltir, uygun görseli yükler ve yayınlar.
7. Kamuya açık sayfada yalnızca almanya101.de tarafından hazırlanmış özgün Türkçe içerik, kaynak adı ve kaynak bağlantısı gösterilir.

Bu yaklaşım hem ücretsiz servis sınırları içinde kalır hem de başka sitelerin haber metinlerini ve görsellerini otomatik kopyalama riskini azaltır.

---

## 2. Değiştirilmeyecek Ürün Kararları

Haberler sayfası daha önce belirlenen yapıyı korur:

- Sayfada arama alanı olmayacak.
- Yalnızca dört kategori olacak: **Almanya**, **Türkiye**, **Avrupa**, **Dünya**.
- Üstte tek bir hero haber kartı bulunacak.
- Hero kartın altında dört kategori filtresi tek bir bölümde gösterilecek.
- Alt bölümde görselli küçük haber kartları yer alacak.
- Sayfalama klasik pagination yerine **Daha fazla yükle** butonuyla yapılacak.
- Haber detayına ayrı SEO uyumlu sayfadan erişilecek.
- Paylaşım seçeneği yalnızca **WhatsApp** olacak.
- Alt navbar eklenmeyecek.
- Tüm içerik Supabase üzerinden yönetilecek.

Önerilen public URL yapısı:

```text
/haberler
/haberler/[slug]
```

---

## 3. Temel Mimari

```text
Resmî RSS Kaynakları
        │
        ▼
Supabase Cron — günde 1 kez
        │
        ▼
Supabase Edge Function: news-ingest
        │
        ├── XML / MRSS fetch
        ├── normalize
        ├── canonical URL üret
        ├── SHA-256 unique_hash üret
        ├── duplicate kontrolü
        └── ham kaydı sakla
        │
        ▼
news_posts — pending_review
        │
        ├── opsiyonel Gemini taslağı
        ├── relevance score
        └── kategori önerisi
        │
        ▼
Admin Paneli — editör onayı
        │
        ├── metni düzelt
        ├── kendi görselini yükle
        ├── hero seç
        ├── yayın tarihi belirle
        └── yayınla / reddet / arşivle
        │
        ▼
Public Haberler Sayfası
```

### Neden bu mimari?

- Kullanıcıya gösterilen içerik üzerinde son kontrol editörde kalır.
- Ücretli haber API'si zorunlu değildir.
- Kaynaklardan biri bozulursa tüm sistem durmaz.
- Tekrar haberler kontrol altında kalır.
- İleride otomasyon artırılabilir ancak V1 basit kalır.
- Var olan Next.js + Supabase altyapısı değiştirilmez.

---

## 4. Kullanılacak Ücretsiz Servisler

| Servis | Kullanım amacı | Ücretsiz katmanda dikkate alınacak sınır | Karar |
|---|---|---|---|
| Supabase Database | Haberler, kaynaklar, loglar, ayarlar | Free planda 500 MB database kotası | Ana veritabanı |
| Supabase Storage | Editörün yüklediği kapak görselleri | Free planda 1 GB dosya alanı, dosya başına en fazla 50 MB | Kullanılacak |
| Supabase Edge Functions | RSS çekme ve normalize etme | Free planda aylık 500.000 invocation | Kullanılacak |
| Supabase Cron | Günlük pipeline tetikleme | `pg_cron` ve `pg_net` ile Edge Function çağrısı | Ana scheduler |
| Gemini Developer API | Taslak başlık, özet, kategori, önem puanı | Ücretsiz katman var; model ve proje bazlı rate limit uygulanır | Opsiyonel, kapatılabilir |
| TheNewsAPI | RSS yetersiz kalırsa aday haber bulma | Free planda günlük 100 istek, istek başına 3 haber | Opsiyonel destek kaynağı |
| Vercel Cron | Supabase Cron kullanılamazsa fallback | Hobby planında cron yalnızca günde bir kez çalışır ve ilgili saat içinde gecikmeli tetiklenebilir | Yedek |
| Cloudflare Workers Cron | İleride hafif orkestrasyon gerekirse fallback | Free planda günlük 100.000 request ve hesap başına 5 cron trigger | Şimdilik gerekli değil |
| Upstash QStash | Retry garantili scheduler gerekirse fallback | Free planda günlük 1.000 mesaj | Şimdilik gerekli değil |

### Bilinçli olarak ana çözüm yapılmayacak servisler

- **NewsAPI.org Free Developer planı** production yayını için uygun değildir; geliştirme ve test içindir.
- **GNews Free planı** da geliştirme ve test içindir.
- Google News RSS, resmî ve garanti edilmiş bir API olmadığı için ana omurga olmayacak. İleride yalnızca admin kuyruğuna ek sinyal kaynağı olarak değerlendirilebilir.
- Haber sayfası için ayrı bir ücretli CMS kurulmayacak.

---

## 5. Kaynak Stratejisi

### 5.1 Kaynak kullanım modları

Her kaynak için `usage_mode` alanı bulunacak:

| Mod | Açıklama |
|---|---|
| `signal_only` | RSS sadece admin kuyruğuna haber adayı taşır. Kaynak açıklaması ve kaynak görseli public sayfada otomatik yayınlanmaz. |
| `short_excerpt_allowed` | Kaynağın koşulları izin veriyorsa sınırlı kısa açıklama admin taslağına alınabilir. |
| `licensed` | Kullanım hakkı açıkça tanımlanmış içerikler. |
| `manual_only` | Editör manuel kontrol sonrasında içerik oluşturur. |

V1'de varsayılan değer her zaman `signal_only` olacak.

### 5.2 Başlangıç kaynak listesi

| Kaynak | Kategori | Tür | Kullanım şekli |
|---|---|---|---|
| tagesschau Inland RSS | Almanya | RSS | Yalnızca admin sinyali |
| tagesschau Europa RSS | Avrupa | RSS | Yalnızca admin sinyali |
| TRT Haber Türkiye RSS | Türkiye | RSS | Yalnızca admin sinyali |
| TRT Haber Dünya RSS | Dünya | RSS | Yalnızca admin sinyali |
| Euronews My Europe MRSS | Avrupa | MRSS | Yalnızca admin sinyali |
| Euronews World MRSS | Dünya | MRSS | Yalnızca admin sinyali |
| BAMF RSS | Almanya | RSS | Göç, oturum, entegrasyon gelişmeleri için yüksek öncelik |
| Bundesregierung RSS | Almanya | RSS | Resmî duyurular için yüksek öncelik |
| Bundesagentur für Arbeit duyuruları | Almanya | Manuel veya sonradan adaptör | İş, Kindergeld, dijital hizmetler için yüksek öncelik |
| TheNewsAPI | Dört kategori | JSON API | RSS açıklarını tamamlamak için opsiyonel |

### 5.3 Kaynak öncelikleri

- **100:** Almanya'daki Türkleri doğrudan etkileyebilecek resmî duyurular  
  Örnek: BAMF, Bundesregierung, Bundesagentur für Arbeit.
- **80:** Almanya gündemi  
  Örnek: tagesschau Inland.
- **60:** Avrupa gelişmeleri  
  Örnek: Euronews My Europe, tagesschau Europa.
- **50:** Türkiye gündemi  
  Örnek: TRT Haber Türkiye.
- **40:** Dünya gündemi  
  Örnek: TRT Haber Dünya, Euronews World.

### 5.4 Telif ve içerik güvenliği kuralı

Pipeline başka sitelerin tam haber metnini otomatik olarak çekmeyecek ve public sayfada yayınlamayacak. Kaynak başlığı, bağlantısı ve tarih bilgisi editöre sinyal olarak gösterilir. Public içerik, editör tarafından kontrol edilmiş özgün Türkçe metin olur.

Ayrıca:

- Haber görselleri otomatik hotlink yapılmaz.
- Kaynak görseli ancak açık kullanım hakkı veya izin varsa kullanılabilir.
- Varsayılan çözüm editörün kendi hazırladığı veya kullanım hakkı bulunan kapak görselini Supabase Storage'a yüklemesidir.
- Kaynak linki her haberde görünür biçimde yer alır.
- İçerik sayfasında “Kaynak” alanı zorunludur.
- Bu doküman teknik öneridir; yayın politikası için gerektiğinde hukukçu değerlendirmesi alınmalıdır.

---

## 6. Veritabanı Modeli

V1 için gereksiz karmaşıklık yaratmadan altı tablo yeterlidir.

### 6.1 `news_sources`

RSS ve API kaynaklarının yönetildiği tablo.

Önemli alanlar:

```text
id
name
source_type              rss | mrss | api | manual
feed_url
homepage_url
default_category         almanya | turkiye | avrupa | dunya
language_code
country_code
usage_mode               signal_only | short_excerpt_allowed | licensed | manual_only
priority
is_active
fetch_limit
last_fetched_at
last_success_at
last_error
```

### 6.2 `news_ingest_runs`

Her otomatik veya manuel çalışmanın özet logu.

```text
id
trigger_type             cron | manual | retry
status                   running | success | partial | failed
started_at
finished_at
source_count
fetched_count
inserted_count
duplicate_count
error_count
log_json
```

### 6.3 `news_raw_items`

Kaynaklardan gelen ham verilerin özel alanda saklandığı tablo. Public erişime kapalıdır.

```text
id
source_id
ingest_run_id
external_id
canonical_url
original_title
original_description
original_image_url
original_published_at
unique_hash
raw_payload
fetched_at
```

### 6.4 `news_posts`

Admin panelinden düzenlenen ve public sayfaya yayınlanan ana tablo.

```text
id
raw_item_id
slug
title
category
summary
content
cover_image_url
cover_image_alt
cover_image_credit
source_name
source_url
source_published_at
status                   pending_review | draft | published | rejected | archived
is_featured
featured_rank
reading_time_minutes
whatsapp_share_text
relevance_score
relevance_reason
ai_model
ai_generated_fields
editor_notes
published_at
reviewed_at
reviewed_by
created_at
updated_at
```

### 6.5 `news_editor_actions`

Kim, hangi haber üzerinde ne yaptı sorusunun cevabı.

```text
id
post_id
actor_user_id
action_type              create | update | approve | publish | reject | archive | feature
note
metadata
created_at
```

### 6.6 `news_pipeline_settings`

Kod değiştirmeden ayarlanabilen küçük konfigürasyonlar.

Örnek ayarlar:

```text
pipeline_enabled
ai_enabled
ai_daily_limit
max_items_per_source
raw_retention_days
ingest_run_retention_days
auto_create_pending_review
excluded_keywords
high_priority_keywords
```

---

## 7. Duplicate Kontrolü

Aynı haber farklı kaynaklarda veya aynı kaynakta farklı URL parametreleriyle tekrar gelebilir. Bu nedenle tek bir kontrol yeterli değildir.

### 7.1 URL normalizasyonu

Aşağıdaki parametreler canonical URL oluşturulurken kaldırılır:

```text
utm_source
utm_medium
utm_campaign
utm_term
utm_content
fbclid
gclid
```

### 7.2 Hash üretimi

```text
sha256(
  normalize(title)
  + "|" +
  source_domain
  + "|" +
  published_date_yyyy_mm_dd
)
```

### 7.3 Duplicate karar sırası

1. Aynı `canonical_url` varsa duplicate.
2. Aynı `unique_hash` varsa duplicate.
3. Başlık benzerliği çok yüksekse `possible_duplicate` etiketiyle editör kuyruğuna düşür.
4. Duplicate kayıtlar silinmez; ham veri tablosunda işaretlenir ve loglanır.

---

## 8. Relevance Scoring

almanya101.de her haberi yayınlamayacak. Adayların önce fayda puanı hesaplanacak.

### 8.1 Basit puanlama

| Kriter | Puan |
|---|---:|
| Almanya'da yaşayan Türkleri doğrudan etkiliyor | +50 |
| Oturum, göç, vatandaşlık, iş, vergi, sigorta, Kindergeld, eğitim, sağlık, ulaşım | +30 |
| Son 24 saat içinde yayınlanmış | +20 |
| Resmî kurum kaynağı | +20 |
| Almanya ile Türkiye ilişkili | +15 |
| Avrupa'da günlük yaşamı etkileyen gelişme | +10 |
| Spor, magazin, clickbait | -40 |
| Kaynak veya tarih doğrulanamıyor | -50 |

### 8.2 Eşikler

| Puan | Sonuç |
|---|---|
| 70 ve üzeri | Admin kuyruğunda üst sıraya alınır |
| 40–69 | Normal inceleme kuyruğu |
| 0–39 | Düşük öncelikli kuyruğa alınır |
| 0 altı | Otomatik reddedilebilir ancak log saklanır |

V1'de düşük puanlı içeriklerin otomatik silinmesi yerine filtrelenmesi daha güvenlidir.

---

## 9. Opsiyonel Gemini Katmanı

Gemini zorunlu değildir. Sistem Gemini kapalıyken de çalışmalıdır.

### 9.1 Gemini ne yapabilir?

- Türkçe taslak başlık üretir.
- İki veya üç cümlelik Türkçe kısa özet üretir.
- Dört kategoriden birini önerir.
- Relevance score ve gerekçesi üretir.
- Potansiyel olarak hassas veya doğrulama gerektiren ifadeleri işaretler.
- WhatsApp paylaşım metni taslağı üretir.

### 9.2 Gemini ne yapmamalı?

- Otomatik yayın yapmamalı.
- RSS'te olmayan bilgi eklememeli.
- Tam haber metni kopyalamamalı.
- Kaynaksız iddia üretmemeli.
- Editör kontrolünü atlamamalı.
- Görsel telif durumuna karar vermemeli.

### 9.3 Önerilen JSON çıktısı

```json
{
  "title_tr": "En fazla 110 karakterlik özgün başlık",
  "summary_tr": "İki veya üç cümlelik kısa özet.",
  "category": "almanya",
  "relevance_score": 85,
  "relevance_reason": "Almanya'da yaşayan aileleri doğrudan etkileyebilir.",
  "needs_fact_check": true,
  "fact_check_notes": [
    "Tarih bilgisini kaynak sayfasından doğrula"
  ],
  "whatsapp_share_text": "Kısa ve sade paylaşım taslağı"
}
```

### 9.4 Günlük limit

Başlangıçta:

```text
ai_daily_limit = 10
```

Bu sayede ücretsiz katman değişse bile kontrol kaybedilmez. Admin panelinde AI kullanımı kapatılabilir.

---

## 10. Admin Paneli

Global admin panelinin mevcut landing sayfası kayıt tablosu olarak kalabilir. Üst header içine **Haber Yönetimi** bağlantısı eklenir.

### 10.1 Ana route yapısı

```text
/admin
/admin/haberler
/admin/haberler/yeni
/admin/haberler/[id]
/admin/haberler/kaynaklar
/admin/haberler/pipeline
/admin/haberler/ayarlar
```

### 10.2 `/admin/haberler`

Varsayılan ekran: **İnceleme Kuyruğu**

Üst özet kartları:

```text
Bekleyen
Taslak
Bugün Yayınlanan
Reddedilen
Son Pipeline Durumu
Aktif Kaynak Sayısı
```

Tablo kolonları:

```text
Seç
Başlık
Kategori
Kaynak
Kaynak Tarihi
Relevance
Durum
AI
Görsel
Hero
Oluşturma Tarihi
İşlemler
```

Her kolonda filtre bulunmalıdır. Türkçe karakterler eksiksiz çalışmalıdır.

### 10.3 Haber düzenleme ekranı

Alanlar:

```text
Başlık
Slug
Kategori
Kısa özet
Detay metni
Kapak görseli yükleme
Kapak alt metni
Görsel kredisi
Kaynak adı
Kaynak bağlantısı
Kaynak yayın tarihi
Okuma süresi
WhatsApp paylaşım metni
Hero olarak göster
Yayın tarihi
Editör notu
```

Sağ panel:

```text
Ham RSS başlığı
Ham RSS açıklaması
Kaynak bağlantısını aç
Duplicate bilgisi
AI önerileri
Fact-check notları
Editör işlem geçmişi
```

Butonlar:

```text
Taslak kaydet
Önizle
Yayınla
Yayından kaldır
Reddet
Arşivle
Hero yap
WhatsApp önizle
```

### 10.4 Kaynak yönetimi ekranı

Kolonlar:

```text
Kaynak adı
Tür
Kategori
Feed URL
Öncelik
Kullanım modu
Aktif/Pasif
Son başarılı çekim
Son hata
İşlem
```

Butonlar:

```text
Yeni kaynak ekle
Kaynağı test et
Şimdi çek
Aktif/Pasif değiştir
Hata logunu görüntüle
```

### 10.5 Pipeline ekranı

Gösterilecek bilgiler:

```text
Son çalışma zamanı
Tetikleyici tipi
Toplanan kayıt
Yeni aday
Duplicate
Hata
Çalışma süresi
Kaynak bazlı sonuçlar
```

Butonlar:

```text
Pipeline'ı şimdi çalıştır
Yalnızca seçili kaynağı çalıştır
Logları temizle
AI işlemesini seçili adaylar için çalıştır
```

---

## 11. Public Haberler Sayfası

### 11.1 `/haberler`

Sorgu:

```sql
select *
from public.news_posts
where status = 'published'
  and published_at <= now()
order by is_featured desc, featured_rank asc, published_at desc;
```

Hero davranışı:

1. `is_featured = true` olan en düşük `featured_rank` değerli haber gösterilir.
2. Hero atanmadıysa en yeni yayınlanmış haber gösterilir.

Kart başına gösterilecek bilgiler:

```text
Kapak görseli
Kategori
Başlık
Kısa özet
Kaynak adı
Yayın tarihi
Okuma süresi
```

### 11.2 `/haberler/[slug]`

Detay sayfasında:

```text
Kategori
Başlık
Yayın tarihi
Okuma süresi
Kapak görseli
Özgün Türkçe haber metni
Kaynak adı + kaynak bağlantısı
WhatsApp paylaşım butonu
```

WhatsApp metni:

```text
{title}

{summary}

Devamını oku:
https://almanya101.de/haberler/{slug}
```

---

## 12. Cron ve Çalıştırma Modeli

### 12.1 Ana tercih: Supabase Cron

Tek bir Edge Function yeterlidir:

```text
news-ingest
```

Cron:

```text
0 6 * * *
```

Bu ifade sunucu tarafında her gün 06:00 UTC anlamına gelir. Almanya'da yaz saati döneminde yaklaşık 08:00, kış saati döneminde yaklaşık 07:00 karşılığıdır.

Edge Function çağrısında token doğrudan SQL içine açık biçimde yazılmamalıdır. Supabase Vault kullanılmalıdır.

### 12.2 Manuel tetikleme

Admin panelindeki **Pipeline'ı şimdi çalıştır** butonu aynı Edge Function'ı çağırır.

Örnek route:

```text
POST /api/admin/news/pipeline/run
```

### 12.3 Fallback

Supabase Cron geçici olarak tercih edilmezse Vercel Hobby Cron aynı endpoint'i günde bir kez çağırabilir. Daha sık tetikleme gerekirse ince bir Cloudflare Worker veya Upstash QStash değerlendirilebilir.

---

## 13. Storage Stratejisi

Bucket:

```text
news-covers
```

Kurallar:

- Public bucket olabilir çünkü yayınlanan haber görselleri zaten herkese açıktır.
- Upload işlemi yalnızca admin veya editor rolünden yapılır.
- Dosya formatı tercihen WebP.
- Önerilen ölçü: `1200x675`.
- Hedef dosya boyutu: `300 KB` altı.
- Aynı görselin dev boyutlu sürümleri yüklenmemeli.
- Free planda otomatik image transformation özelliğine bağımlı olunmamalı.
- Dosya adı standardı:

```text
news/YYYY/MM/{slug}-{timestamp}.webp
```

---

## 14. Güvenlik

### 14.1 RLS

- Public kullanıcı yalnızca `status = 'published'` haberleri okuyabilir.
- `news_raw_items`, `news_ingest_runs`, `news_pipeline_settings` public erişime tamamen kapalıdır.
- Admin ve editor işlemleri server route üzerinden yapılır.
- Supabase `service_role` anahtarı browser'a gönderilmez.
- API key'ler environment variable veya Vault içinde tutulur.

### 14.2 Roller

```text
admin
editor
```

| Yetki | admin | editor |
|---|---:|---:|
| Haber düzenle | Evet | Evet |
| Haber yayınla | Evet | Evet |
| Kaynak ekle/sil | Evet | Hayır |
| Pipeline çalıştır | Evet | Evet |
| Pipeline ayarlarını değiştir | Evet | Hayır |
| Admin rolü ata | Evet | Hayır |

### 14.3 Audit log

Yayınlama, reddetme, arşivleme ve hero değiştirme işlemleri `news_editor_actions` tablosuna yazılmalıdır.

---

## 15. Önerilen Dosya Yapısı

```text
app/
  haberler/
    page.tsx
    [slug]/
      page.tsx

  admin/
    haberler/
      page.tsx
      yeni/
        page.tsx
      [id]/
        page.tsx
      kaynaklar/
        page.tsx
      pipeline/
        page.tsx
      ayarlar/
        page.tsx

  api/
    admin/
      news/
        pipeline/
          run/
            route.ts
        posts/
          route.ts
          [id]/
            route.ts
        sources/
          route.ts
          [id]/
            route.ts

components/
  news/
    NewsHeroCard.tsx
    NewsCategoryFilter.tsx
    NewsListCard.tsx
    NewsLoadMoreButton.tsx
    WhatsAppShareButton.tsx

  admin/news/
    NewsReviewTable.tsx
    NewsEditorForm.tsx
    NewsSourceTable.tsx
    NewsPipelineRunTable.tsx
    NewsStatusBadge.tsx

lib/
  news/
    canonical-url.ts
    dedupe.ts
    relevance.ts
    slug.ts
    whatsapp.ts

supabase/
  functions/
    news-ingest/
      index.ts
      adapters/
        rss.ts
        mrss.ts
        thenewsapi.ts
      normalize.ts
      dedupe.ts
      gemini.ts

  migrations/
    YYYYMMDD_news_pipeline.sql
```

---

## 16. Edge Function İş Akışı

Pseudo-code:

```ts
export async function ingestNews(trigger: "cron" | "manual") {
  const run = await createRun(trigger);

  const settings = await getPipelineSettings();
  if (!settings.pipeline_enabled) {
    return finishRun(run.id, "success", { skipped: true });
  }

  const sources = await getActiveSources();

  for (const source of sources) {
    try {
      const items = await fetchSource(source);

      for (const item of items.slice(0, source.fetch_limit)) {
        const normalized = normalizeItem(item, source);
        const uniqueHash = await createUniqueHash(normalized);

        const exists = await findDuplicate(
          normalized.canonicalUrl,
          uniqueHash
        );

        if (exists) {
          await logDuplicate(run.id, source.id, normalized);
          continue;
        }

        const rawItem = await insertRawItem(
          run.id,
          source.id,
          normalized,
          uniqueHash
        );

        const draft = await createPendingReviewPost(rawItem, source);

        if (settings.ai_enabled && withinAiDailyLimit()) {
          await enrichDraftWithGemini(draft, rawItem, source);
        }
      }

      await markSourceSuccess(source.id);
    } catch (error) {
      await markSourceError(source.id, error);
      await appendRunError(run.id, source.id, error);
    }
  }

  return finishRun(run.id, "success");
}
```

---

## 17. API Endpointleri

### Public

```text
GET /api/news?category=almanya&limit=12&cursor=...
GET /api/news/[slug]
```

### Admin

```text
GET    /api/admin/news/posts
POST   /api/admin/news/posts
GET    /api/admin/news/posts/[id]
PATCH  /api/admin/news/posts/[id]
POST   /api/admin/news/posts/[id]/publish
POST   /api/admin/news/posts/[id]/reject
POST   /api/admin/news/posts/[id]/archive
POST   /api/admin/news/posts/[id]/feature

GET    /api/admin/news/sources
POST   /api/admin/news/sources
PATCH  /api/admin/news/sources/[id]
POST   /api/admin/news/sources/[id]/test
POST   /api/admin/news/sources/[id]/run

GET    /api/admin/news/pipeline/runs
POST   /api/admin/news/pipeline/run
```

---

## 18. SEO

Her yayınlanmış haber için:

- Benzersiz slug.
- `title` ve `description`.
- Canonical URL.
- Open Graph alanları.
- Kapak görseli alt metni.
- Kaynak adı ve kaynak linki.
- Tarih alanları.
- JSON-LD `NewsArticle` veya `Article`.
- Sitemap'e ekleme.
- Arşivlenen içerikte kontrollü davranış: gerekli ise `noindex`.

Örnek canonical:

```text
https://almanya101.de/haberler/{slug}
```

---

## 19. Retention ve Temizlik

Ücretsiz kota için ham veriyi sonsuza kadar tutmaya gerek yoktur.

Başlangıç ayarları:

```text
raw_retention_days = 30
ingest_run_retention_days = 90
published_posts_retention = unlimited
rejected_posts_retention_days = 180
```

Haftalık cleanup job:

```text
15 6 * * 0
```

Bu job:

- 30 günden eski ham verileri temizler.
- 90 günden eski pipeline loglarını temizler.
- Kullanılmayan yüklenmiş kapak dosyalarını raporlar.
- Yayınlanmış haberleri silmez.

---

## 20. Sıfır Bütçe Kapasite Hesabı

Başlangıç varsayımı:

```text
8 aktif RSS kaynağı
kaynak başına en fazla 10 kayıt
günde 1 pipeline
günde en fazla 10 Gemini taslağı
günde 2–3 yayınlanmış haber
```

Yaklaşık aylık yük:

```text
240 RSS fetch
2.400 ham adaydan az
300 Gemini çağrısından az
60–90 yayınlanmış haber
```

Bu kullanım Supabase Free katmanı için düşük seviyededir. Görsel tarafında WebP ve 300 KB altı hedef korunursa 1 GB Storage uzun süre yeterlidir.

---

## 21. Uygulama Fazları

### Faz 1 — Veritabanı ve güvenlik

- Migration çalıştır.
- Tabloları oluştur.
- RLS politikalarını doğrula.
- `news-covers` bucket oluştur.
- Admin ve editor rollerini doğrula.

### Faz 2 — Public haber sayfaları

- `/haberler` sayfasını oluştur.
- Dört kategori filtresini ekle.
- Hero kartı ekle.
- Daha fazla yükle davranışını ekle.
- `/haberler/[slug]` detay sayfasını ekle.
- WhatsApp paylaşımını ekle.

### Faz 3 — Admin CRUD

- İnceleme kuyruğunu ekle.
- Tüm kolonlarda filtre ekle.
- Türkçe karakter kontrolü yap.
- Haber düzenleme formu ekle.
- Kaydet, önizle, yayınla, reddet, arşivle işlemlerini ekle.
- Hero yönetimini ekle.
- Audit log ekle.

### Faz 4 — RSS Pipeline

- `news-ingest` Edge Function oluştur.
- RSS ve MRSS adaptörlerini ekle.
- URL normalizasyonunu ekle.
- Hash duplicate kontrolünü ekle.
- Kaynak bazlı loglamayı ekle.
- Manuel pipeline butonunu bağla.

### Faz 5 — Cron

- Vault secret oluştur.
- Supabase Cron job ekle.
- Günlük çalışmayı log ekranından doğrula.
- Haftalık cleanup job ekle.

### Faz 6 — Opsiyonel AI

- Gemini key'i server-side secret olarak ekle.
- `ai_enabled` kapalıyken sistemi test et.
- JSON schema doğrulamasını ekle.
- Günlük limiti uygula.
- AI çıktısını doğrudan yayınlamak yerine editör taslağı olarak göster.

### Faz 7 — QA

- Duplicate haber testi.
- Bozuk RSS testi.
- Yavaş kaynak testi.
- API key eksik testi.
- Yetkisiz admin route testi.
- Türkçe karakter testi.
- WhatsApp share testi.
- Mobile görünüm testi.
- SEO metadata testi.
- Cron log testi.

---

## 22. Kabul Kriterleri

V1 tamamlanmış sayılır quando:

- Admin kullanıcı kaynak ekleyebiliyor, pasife alabiliyor ve test edebiliyor.
- Pipeline günlük otomatik ve manuel çalışabiliyor.
- Aynı haber tekrar tekrar inceleme kuyruğuna düşmüyor.
- Haberler otomatik yayınlanmıyor.
- Editör haber metnini düzenleyip yayınlayabiliyor.
- Görsel yalnızca admin yüklemesi veya onaylı URL ile ekleniyor.
- Public sayfada yalnızca dört kategori görünüyor.
- Hero kartı çalışıyor.
- Daha fazla yükle butonu çalışıyor.
- Detay sayfası SEO uyumlu slug ile açılıyor.
- WhatsApp paylaşım butonu doğru linki oluşturuyor.
- Public kullanıcı ham RSS kayıtlarını okuyamıyor.
- `service_role` browser bundle içinde bulunmuyor.
- Türkçe karakterler tüm tablolarda, formlarda ve URL dışı alanlarda doğru gösteriliyor.

---

## 23. Claude Code İçin Uygulama Promptu

Aşağıdaki metin doğrudan geliştirme aracına verilebilir:

```text
almanya101.de projesine mevcut Next.js App Router + TypeScript + Tailwind + shadcn/ui + Supabase yapısını bozmadan bir Haber Yönetimi modülü ekle.

Kurallar:
1. Public sayfa /haberler ve detay sayfası /haberler/[slug] olacak.
2. Public sayfada arama olmayacak.
3. Yalnızca dört kategori olacak: almanya, turkiye, avrupa, dunya.
4. Üstte hero kart, altında kategori filtresi, altında kart listesi ve Daha fazla yükle butonu olacak.
5. Paylaşım yalnızca WhatsApp olacak.
6. Alt navbar ekleme.
7. Admin panelde mevcut landing ekranını bozma; header içine Haber Yönetimi linki ekle.
8. Admin haber tablosundaki her sütunda filtre olmalı ve Türkçe karakterler doğru çalışmalı.
9. Supabase migration dosyasını ekle.
10. RLS uygula: public yalnızca published haberleri okuyabilsin. raw items, settings ve ingest logs yalnızca admin/editor tarafından server-side route üzerinden yönetilsin.
11. service_role key asla client bundle içine girme.
12. news-covers public storage bucket kullan; upload yalnızca admin/editor.
13. Supabase Edge Function news-ingest oluştur.
14. RSS, MRSS ve opsiyonel TheNewsAPI adapter yapısı oluştur.
15. canonical URL temizliği ve SHA-256 duplicate kontrolü ekle.
16. Hiçbir haber otomatik yayınlanmasın; pipeline yalnızca pending_review oluştursun.
17. Gemini entegrasyonunu optional feature flag arkasında oluştur. Gemini yokken tüm sistem çalışsın.
18. Admin ekranları: queue, edit, sources, pipeline logs, settings.
19. İşlem geçmişini news_editor_actions tablosuna yaz.
20. README içine kurulum, environment variables, Vault, cron SQL, test adımları ve rollback notlarını ekle.

Önce migration ve veri erişim katmanını yap. Ardından public sayfaları, sonra admin CRUD, sonra edge function, en son optional Gemini modülünü ekle. Her fazdan sonra lint, typecheck ve ilgili testleri çalıştır.
```

---

## 24. Environment Variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEWS_PIPELINE_SECRET=
GEMINI_API_KEY=
THENEWSAPI_TOKEN=
```

Kurallar:

- `NEXT_PUBLIC_*` dışındaki anahtarlar client tarafına gönderilmez.
- Gemini ve TheNewsAPI opsiyoneldir.
- `NEWS_PIPELINE_SECRET` Vault içinde de saklanır.
- Pipeline endpoint'i secret kontrolü yapar.

---

## 25. İzleme ve Hata Yönetimi

Admin dashboard'da şu uyarılar görünmelidir:

```text
Son pipeline 36 saatten eski
Bir kaynak son 3 çalışmada hata verdi
Duplicate oranı beklenmedik şekilde yükseldi
Storage kotası yüzde 80'i geçti
Database kotası yüzde 80'i geçti
Gemini günlük limite ulaştı
Pipeline secret eksik
```

Log seviyeleri:

```text
info
warning
error
```

Hata durumunda tüm pipeline durmamalıdır. Bir kaynak hata verirse diğer kaynaklar işlenmeye devam etmelidir.

---

## 26. Resmî Referanslar

Supabase:

- https://supabase.com/pricing
- https://supabase.com/docs/guides/cron
- https://supabase.com/docs/guides/functions/schedule-functions
- https://supabase.com/docs/guides/functions/pricing
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/serving/downloads
- https://supabase.com/docs/guides/database/vault

Scheduler fallback:

- https://vercel.com/docs/cron-jobs/usage-and-pricing
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/workers/configuration/cron-triggers/
- https://upstash.com/pricing/qstash

AI ve API:

- https://ai.google.dev/gemini-api/docs/pricing
- https://www.thenewsapi.com/pricing
- https://newsapi.org/pricing
- https://gnews.io/pricing

RSS kaynakları:

- https://www.tagesschau.de/infoservices/rssfeeds
- https://www.trthaber.com/sitene_ekle.html
- https://www.euronews.com/widgets
- https://www.bamf.de/DE/Service/Abonnieren/RSS/rss_node.html
- https://www.bundesregierung.de/breg-de/service/newsletter-und-abos/rss-newsfeed
- https://www.arbeitsagentur.de/news

Telif çerçevesi:

- https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L0790
