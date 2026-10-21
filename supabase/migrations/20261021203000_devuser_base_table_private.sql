-- Güvenlik batch S3, adım 2: devuser taban tablosu anon/authenticated'a tamamen kapanır.
-- Adım 1 (2c76898, canlıda): /api/devuser/list devuser_public view'ından okur (filtre + izne bağlı WhatsApp
-- maskesi DB'de); /api/devuser-count service role ile sayar. Diğer tüm devuser erişimi service role.
-- devuser_public view'ı postgres'e ait olduğu için bu revoke'tan etkilenmez.
-- Sonuç: denetim bulgusu 7 (maskeleme yalnızca view'da) kapanır; iletisim_izni=false olan üyelerin
-- telefonu artık hiçbir anon yoldan okunamaz.
revoke all on public.devuser from anon, authenticated;
drop policy if exists "Public read access for searchable profiles" on public.devuser;
