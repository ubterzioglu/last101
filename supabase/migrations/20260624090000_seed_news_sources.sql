-- Haber pipeline'ı için başlangıç kaynaklarının seed'lenmesi.
-- Kaynak: news.md §5.2 (Başlangıç kaynak listesi) ve §5.3 (öncelikler).
--
-- Idempotent: feed_url üzerinden unique kontrol ile tekrar çalıştırılabilir.
-- Tüm kaynaklar V1 kuralı gereği usage_mode = 'signal_only' (news.md §5.1).
-- Pipeline hiçbir haberi otomatik yayınlamaz; yalnızca pending_review oluşturur.

-- feed_url üzerinde tekil indeks (duplicate kaynak engeli; ON CONFLICT arbiter'ı
-- olarak kullanılmaz çünkü partial indeks). Idempotency aşağıda where not exists ile.
create unique index if not exists news_sources_feed_url_idx
  on public.news_sources (feed_url)
  where feed_url is not null;

-- Idempotent seed: aynı feed_url zaten varsa o satır atlanır.
-- Tekrar çalıştırılabilir; var olan kaynaklara dokunmaz.
insert into public.news_sources
  (name, source_type, feed_url, homepage_url, default_category, language_code, country_code, usage_mode, priority, is_active, fetch_limit)
select v.name, v.source_type, v.feed_url, v.homepage_url, v.default_category,
       v.language_code, v.country_code, v.usage_mode, v.priority, v.is_active, v.fetch_limit
from (values
  -- Almanya gündemi (priority 80) — news.md §5.3
  ('tagesschau Inland', 'rss', 'https://www.tagesschau.de/inland/index~rss2.xml',
   'https://www.tagesschau.de', 'almanya', 'de', 'DE', 'signal_only', 80, true, 10),

  -- Avrupa gelişmeleri (priority 60)
  ('tagesschau Ausland', 'rss', 'https://www.tagesschau.de/ausland/index~rss2.xml',
   'https://www.tagesschau.de', 'avrupa', 'de', 'DE', 'signal_only', 60, true, 10),

  -- Resmî kurum duyuruları (priority 100) — göç, oturum, entegrasyon
  -- NOT: BAMF RSS feed URL'si (news.md §5.2) doğrulama anında 404/400 döndü.
  -- Doğru feed URL'si teyit edildiğinde admin panelinden eklenmelidir.
  -- Bundesregierung resmî duyuru slotunu (priority 100) karşılıyor.
  ('Bundesregierung Aktuelles', 'rss', 'https://www.bundesregierung.de/service/rss/breg-de/1151244/feed.xml',
   'https://www.bundesregierung.de', 'almanya', 'de', 'DE', 'signal_only', 100, true, 10),

  -- Türkiye gündemi (priority 50). TRT özel mobil XML formatı kullanır → 'trthaber'.
  ('TRT Haber Türkiye', 'trthaber', 'https://www.trthaber.com/xml_mobile.php?tur=xml_genel&kategori=turkiye&adet=20',
   'https://www.trthaber.com', 'turkiye', 'tr', 'TR', 'signal_only', 50, true, 10),

  -- Dünya gündemi (priority 40)
  ('TRT Haber Dünya', 'trthaber', 'https://www.trthaber.com/xml_mobile.php?tur=xml_genel&kategori=dunya&adet=20',
   'https://www.trthaber.com', 'dunya', 'tr', 'TR', 'signal_only', 40, true, 10),

  -- Euronews MRSS (Avrupa / Dünya) — news.md §5.2.
  -- Feed URL'leri canlı doğrulandı (200 + geçerli XML).
  ('Euronews My Europe', 'mrss', 'https://www.euronews.com/rss?level=vertical&name=my-europe',
   'https://www.euronews.com', 'avrupa', 'en', 'EU', 'signal_only', 60, true, 10),

  ('Euronews World', 'mrss', 'https://www.euronews.com/rss?level=theme&name=news',
   'https://www.euronews.com', 'dunya', 'en', 'EU', 'signal_only', 40, true, 10)
) as v(name, source_type, feed_url, homepage_url, default_category,
       language_code, country_code, usage_mode, priority, is_active, fetch_limit)
where not exists (
  select 1 from public.news_sources s where s.feed_url = v.feed_url
);

-- GDELT: Türk diasporası / Almanya odaklı ek sinyal kaynağı (API key gerekmez).
-- feed_url boş bırakılır (adaptör DEFAULT_ENDPOINT kullanır); config sorguyu taşır.
-- Burada feed_url null olduğu için unique indekse takılmaz; name ile idempotent kontrol.
insert into public.news_sources
  (name, source_type, feed_url, homepage_url, default_category, language_code, country_code, usage_mode, priority, is_active, fetch_limit, config)
select
  'GDELT Türk Diasporası', 'gdelt', null, 'https://www.gdeltproject.org',
  'almanya', 'tr', 'DE', 'signal_only', 70, false, 10,
  jsonb_build_object(
    'query', '(Turkish diaspora Germany) OR (Türken Deutschland)',
    'timespan', '1d',
    'sort', 'datedesc',
    'maxrecords', 50,
    'allowedLanguages', 'turkish,german,english'
  )
where not exists (
  select 1 from public.news_sources where name = 'GDELT Türk Diasporası'
);

-- Not: GDELT varsayılan olarak pasif (is_active = false) eklenir; agresif throttle
-- yaptığı için RSS kaynakları doğrulandıktan sonra admin panelinden açılması önerilir.
