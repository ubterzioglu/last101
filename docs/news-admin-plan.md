# Plan: /admin/haberler – İngilizce haberleri engelle + iyileştirmeler

## Context
Haber hattı tek bir Supabase Edge Function ile çalışıyor (`supabase/functions/news-ingest/index.ts`). Kaynaklar `news_sources` tablosunda. Site tamamen Türkçe olmalı, ama:
- Seed'deki **Euronews My Europe** ve **Euronews World** (`language_code='en'`, aktif) çevrilmemiş İngilizce haberleri `pending_review` olarak kuyruğa düşürüyor (AI kapalıyken başlık/özet olduğu gibi yazılıyor).
- `news_sources.language_code` var ama hiçbir yerde kullanılmıyor; `news_posts` / `news_raw_items` üzerinde dil kolonu yok.
- Tek dil filtresi GDELT adapter'ında (`adapters/gdelt.ts:114-136`) ve dili boş olanları geçiriyor; GDELT'te `english` açıkça izinli.
- Admin UI'da kaynak için dil alanı yok; yeni eklenen RSS için doğrulama yok.

## Faz 1 – İngilizce haberleri engelle (kullanıcının asıl isteği)
1. **Acil/veri**: Yeni migration ile iki Euronews kaynağını `is_active=false` yap; GDELT `allowedLanguages` değerinden `english` çıkar. Mevcut İngilizce `pending_review` postlarını `rejected` yap (önce SELECT ile sayıyı göster, sonra uygula).
2. **Dil kolonu**: Migration: `news_posts.language_code` ve `news_raw_items.language_code` (text, index). Ingest'te `index.ts:318-346` içinde yazılır.
3. **Fetch-time filtre** (`index.ts`, item döngüsü ~satır 235, dedupe'dan ÖNCE): yeni `supabase/functions/news-ingest/language.ts`
   - Hafif heuristik tespit (Türkçe karakterler ve stopword'ler: `ve, bir, bu, için, ile`; Almanca: `der, die, und, nicht`; İngilizce: `the, and, of, to`) başlık+açıklama üzerinde.
   - Kural: tespit edilen dil `news_pipeline_settings.allowed_languages` (varsayılan `['tr','de']`; Almanca isteniyorsa kalır, sadece Türkçe isteniyorsa ayarlanır) içinde değilse atla. Kaynağın `language_code`'u yedek ipucu.
   - Atlanan öğeyi `news_raw_items`'e `filtered_reason='language'` ile yaz ki her çalışmada tekrar çekilmesin (dedupe). Run özetine `skipped_language` sayacı ekle.
4. **GDELT**: boş `language` artık geçmesin (`gdelt.ts:135`), tespit fonksiyonuna düşsün.
5. **Admin UI**:
   - `NewsSourcesAdminClient.tsx`: kaynak formuna `language_code` seçici (tr/de/en); uyarı: "en seçilirse bu kaynaktan haber alınmaz".
   - Ayarlar sekmesine "İzin verilen diller" (tr, de) kutuları.
   - `NewsQueueAdminClient.tsx` ~153-164: dil filtresi select + liste satırında dil rozeti; `listAdminPosts` (`lib/news/admin.ts:297-356`) `language` parametresi.
   - Sunucu tarafı: `createNewsSource/updateNewsSource` (`lib/news/admin.ts:574/609`) dil değerini doğrular.
6. **Genel görünüm güvenliği**: `lib/public-news.ts` sorgusuna `language_code in ('tr','de')` (veya null) ekle; böylece geçmişte yayınlanmış İngilizce haber sızmaz.

## Faz 2 – Hata düzeltmeleri (düşük risk, yüksek değer)
- `NEWS_SOURCE_TYPES` (`lib/news/admin.ts:107`) ve `types/news.ts:76`'ya `'trthaber'` ekle (TRT kaynağı kaydedilince `rss`'e dönüyor).
- `updateNewsSource` kısmi PATCH'te alanları sıfırlıyor ve `last_error`'ı eziyor → sadece gelen alanları güncelle.
- Raw insert sonrası post insert başarısızsa raw satırı sil/işaretle (öğe sonsuza dek bloklanıyor).
- `ai_daily_limit` gerçek günlük sayaç olsun (`news_ingest_runs` toplamından); Gemini hatası tüm kaynağı düşürmesin, öğe bazında yakala.
- Legacy `news-admin-action` `set_status` reddet/arşivle'yi `draft`'a çeviriyor → düzelt veya yeni API'ye yönlendir.
- `deleteAdminPost` audit kaydı cascade ile siliniyor → silmeden önce kalıcı log veya soft-delete.

## Faz 3 – Güvenlik
- `sources/[id]/test/route.ts`: `validateSourceUrl` + timeout + boyut sınırı ekle (SSRF); http'yi reddet, redirect'leri doğrula.
- `.or()` içindeki `q`/`source` değerlerini kaçışla (PostgREST filtre enjeksiyonu), `lib/news/admin.ts:321`.
- `x-admin-email` sahte olabiliyor → actor'ı sunucuda sabit/oturumdan türet.
- `NEWS_PIPELINE_SECRET` yoksa edge function reddetsin (`index.ts:106-110`); CORS `*` kaldır.
- Hata mesajlarını istemciye ham döndürme; sunucuda logla.
- Rate limit in-memory → DB/Redis destekli (ayrı iş; sadece not).

## Faz 4 – Performans / UX / bakım
- Dedupe: `insert ... on conflict do nothing` (SELECT-then-INSERT yarışını ve N+1'i kaldırır).
- Kuyruk: sayfalama (offset/cursor), varsayılan filtre `pending_review`, toplu onay/red, reddetmede onay, aksiyon butonlarında yükleniyor durumu, sıralama + `relevance_score` sütunu, arama debounce.
- Stat kartları aktif status/q filtresine uyumlu olsun.
- İndeksler: `news_posts(status, created_at)`, `raw_item_id`, `news_raw_items(fetched_at)`; `q` için pg_trgm.
- Retention job'u gerçekten yaz (`raw_retention_days` vb. şu an placeholder).
- Gemini model adı, `reading_minutes`, 260 karakter limiti, kategoriler tek yerde sabit/ayar olsun.
- `news_posts` için baseline migration eksik (şema migrations'tan yeniden kurulamıyor) → dokümante et/ekle.
- Test: `language.ts`, `dedupe.ts`, `relevance.ts`, `lib/news/admin.ts` için unit test; admin akışı için Playwright smoke.

## Önerilen uygulama sırası
Faz 1 (1→6) + Faz 2'nin ilk iki maddesi tek PR; Faz 3 ayrı PR; Faz 4 parça parça.

## Doğrulama
- `npm run lint` ve `npm run build` temiz.
- Unit testler: İngilizce/Türkçe/Almanca örnek başlıklar için `language.ts`.
- Migration'ı kendiliğinden uygulamadan önce SELECT ile etkilenen satırları listele; sonra `psql` ile uygula (erişim bilgisi memory'de).
- Edge function'ı elle çalıştır (admin "Çalıştır"), run özetinde `skipped_language > 0` ve kuyruğa yeni İngilizce kayıt düşmediğini gör.
- `/admin/haberler` kuyruğunda dil filtresi ve rozetini, `/haberler` public sayfasında İngilizce haber olmadığını tarayıcıda doğrula.
- Not: bu oturumda canlı veri veya edge function çalıştırılmadı; bulgular kod okumasına dayanıyor.
