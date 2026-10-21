-- docs/plans/security-batches.md S2: sabit search_path (Supabase advisor "function_search_path_mutable").
-- is_admin() SECURITY DEFINER olduğu için en önemlisi. EXECUTE yetkileri bilerek değiştirilmez: is_admin()
-- 24 RLS policy'sinde kullanılır; anon'dan EXECUTE alınırsa bu tablolardaki anon sorguları hata verir.
-- trigger_news_ingest() zaten 20261021180000 ile kapatıldı ve sabit search_path'e sahip.

-- Gövdeler yalnızca nitelenmiş (auth.jwt) veya pg_catalog yerleşiklerini (now, timezone) kullanır.
alter function public.is_admin() set search_path = '';
alter function public.update_updated_at_column() set search_path = '';
alter function public.set_security_notes_updated_at() set search_path = '';

-- Niteliksiz nextval('qa1_code_seq') kullanır.
alter function public.set_qa1_code() set search_path = pg_catalog, public;
