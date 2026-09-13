# Haber Pipeline — Kurulum ve Deploy Rehberi

Proje ref: `ldptefnpiudquipdsezr`

## DURUM (2026-06-24) — pipeline CANLI ve çalışıyor

`DIRECT_CONNECTION_STRING` (.env.local) ile prod DB'ye bağlanılarak tamamlananlar:

- ✅ 4 yeni migration prod'a uygulandı (trthaber tipi, kaynak seed, cron)
- ✅ **8 kaynak seed edildi** (7 aktif RSS/MRSS + GDELT pasif)
- ✅ **Cron job aktif**: `news-ingest-daily`, her gün `0 6 * * *` (06:00 UTC)
- ✅ **Vault secret'ları** kuruldu: `news_ingest_url`, `news_pipeline_service_role`, `news_pipeline_secret`
- ✅ Edge Function zaten deploy edilmişti; manuel tetikleme test edildi → **15 haber pending_review**

### ⚠️ KALAN TEK İŞ: Edge Function'ı yeniden deploy et (TRT için)

Canlıdaki function eski sürüm; **TRT adaptörü (`trthaber`) içermiyor**, bu yüzden TRT
kaynakları 0 haber döndürüyor (5/7 kaynak çalışıyor). TRT'nin de çalışması için:

1. https://supabase.com/dashboard/account/tokens → "Generate new token" (PAT)
2. Tek komut:
   ```powershell
   $env:SUPABASE_ACCESS_TOKEN = "sbp_xxx..."; ./scripts/deploy-news-ingest.ps1
   ```
   (veya `.env.local`'a `SUPABASE_ACCESS_TOKEN=sbp_xxx` ekleyip script'i çalıştır)

Script deploy eder + pipeline'ı tetikleyip TRT dahil tüm kaynakları doğrular.

---

## Referans: sıfırdan kurulum adımları

Aşağıdakiler yeni bir ortam için tam adım listesidir (yukarıdakiler zaten yapıldı).

---

## Ön koşul: Supabase CLI login

CLI kurulu (`supabase --version` → 2.75.0) ancak login değil. Önce:

```bash
supabase login
supabase link --project-ref ldptefnpiudquipdsezr
```

---

## 1. Migration'ları prod'a uygula

Aşağıdaki migration'lar dahil tüm bekleyen migration'ları gönderir:

- `20260615170000_news_module_v2.sql` — 6 tablo + RLS + `news` storage bucket
- `20260617120000_news_pipeline_scraper_adapters.sql` — atom/gdelt + `config`
- `20260624090000_seed_news_sources.sql` — başlangıç kaynakları (YENİ)
- `20260624091000_news_pipeline_cron.sql` — günlük cron (YENİ)

```bash
supabase db push
```

> Not: Cron migration'ı, Vault secret'ları yoksa çalışma anında uyarı verip atlar
> (hata vermez). Bu yüzden Adım 3'teki Vault secret'larını mutlaka ekleyin.

---

## 2. Edge Function'ı deploy et

```bash
supabase functions deploy news-ingest
```

---

## 3. Secret'ları ayarla

### 3a. Edge Function secret'ları (Deno runtime)

```bash
supabase secrets set NEWS_PIPELINE_SECRET="<güçlü-rastgele-değer>"
# Opsiyonel (AI ve ek kaynak):
supabase secrets set GEMINI_API_KEY="<gemini-key>"
supabase secrets set THENEWSAPI_TOKEN="<thenewsapi-token>"
```

> `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` Edge Function ortamında Supabase
> tarafından otomatik sağlanır; ayrıca set etmeniz gerekmez.

### 3b. Vault secret'ları (cron'un Edge Function'ı çağırması için)

Supabase Dashboard → Project Settings → Vault, veya SQL Editor'de:

```sql
select vault.create_secret(
  'https://ldptefnpiudquipdsezr.supabase.co/functions/v1/news-ingest',
  'news_ingest_url'
);
select vault.create_secret('<SERVICE_ROLE_KEY>', 'news_pipeline_service_role');
select vault.create_secret('<NEWS_PIPELINE_SECRET ile AYNI değer>', 'news_pipeline_secret');
```

### 3c. Next.js (Coolify / .env) — admin "Şimdi çalıştır" butonu için

```
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEWS_PIPELINE_SECRET=<3a ile AYNI değer>
```

`NEWS_PIPELINE_SECRET` üç yerde de (Edge secret, Vault, Next.js env) **aynı** olmalıdır,
aksi halde Edge Function 401 döner.

---

## 4. Doğrulama

### Manuel tetikleme (admin paneli)
`/admin/haberler/pipeline` → **Pipeline'ı şimdi çalıştır**. Sonuç: `inserted_count > 0`
ve inceleme kuyruğunda `pending_review` haberler.

### CLI ile manuel test
```bash
curl -X POST "https://ldptefnpiudquipdsezr.supabase.co/functions/v1/news-ingest" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "x-pipeline-secret: <NEWS_PIPELINE_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"trigger":"manual"}'
```

### Cron doğrulaması
```sql
select jobname, schedule, active from cron.job where jobname = 'news-ingest-daily';
select * from cron.job_run_details order by start_time desc limit 5;
```

### Kaynak ve run logları
```sql
select name, is_active, last_success_at, last_error from public.news_sources order by priority desc;
select status, fetched_count, inserted_count, duplicate_count, error_count, started_at
  from public.news_ingest_runs order by started_at desc limit 5;
```

---

## 5. Rollback

```sql
-- Cron'u durdur
select cron.unschedule('news-ingest-daily');
drop function if exists public.trigger_news_ingest();

-- Seed kaynaklarını kaldır (yalnızca seed'lenenler)
delete from public.news_sources
where feed_url in (
  'https://www.tagesschau.de/inland/index~rss2.xml',
  'https://www.tagesschau.de/ausland/index~rss2.xml',
  'https://www.bamf.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed/RSSNewsfeed.xml',
  'https://www.bundesregierung.de/service/rss/breg-de/1151244/feed.xml',
  'https://www.trthaber.com/xml_mobile.php?tur=xml_genel&kategori=turkiye&adet=20',
  'https://www.trthaber.com/xml_mobile.php?tur=xml_genel&kategori=dunya&adet=20',
  'https://www.euronews.com/rss?level=theme&name=my-europe',
  'https://www.euronews.com/rss?level=vertical&name=news'
)
or name = 'GDELT Türk Diasporası';
```

---

## Özet checklist

- [ ] `supabase login` + `link`
- [ ] `supabase db push` (seed + cron migration dahil)
- [ ] `supabase functions deploy news-ingest`
- [ ] Edge secret: `NEWS_PIPELINE_SECRET` (+ opsiyonel `GEMINI_API_KEY`)
- [ ] Vault: `news_ingest_url`, `news_pipeline_service_role`, `news_pipeline_secret`
- [ ] Next.js env: `SUPABASE_SERVICE_ROLE_KEY`, `NEWS_PIPELINE_SECRET`
- [ ] Manuel tetikleme testi → `pending_review` haberler geliyor
- [ ] Cron job aktif doğrulandı
