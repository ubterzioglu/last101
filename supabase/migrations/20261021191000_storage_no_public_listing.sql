-- docs/plans/security-batches.md S5: corner ve news bucket'ları anonim listelenebiliyordu
-- (POST /storage/v1/object/list/{bucket}). İki bucket da public; nesneler /storage/v1/object/public/...
-- adresinden RLS'e bakılmadan sunulur, yani bu SELECT policy'leri yalnızca listelemeyi açıyordu.
-- Yükleme ve getPublicUrl service role ile yapılır (corner-admin-upload, corner-author-upload,
-- lib/news/admin.ts); hiçbir kod bucket listelemez.
drop policy if exists "Public can read corner storage" on storage.objects;
drop policy if exists "Public can read news storage" on storage.objects;
