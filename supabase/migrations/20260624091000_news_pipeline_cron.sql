-- Haber pipeline'ı için günlük otomatik tetikleme (news.md §12).
-- pg_cron her gün 06:00 UTC'de pg_net üzerinden news-ingest Edge Function'ını çağırır.
-- Almanya: yaz saatinde ~08:00, kış saatinde ~07:00.
--
-- GÜVENLIK: Token/secret SQL içine açık yazılmaz. Supabase Vault kullanılır.
-- Bu migration çalışmadan ÖNCE Vault'a iki secret eklenmelidir (bkz. NEWS_PIPELINE_DEPLOY.md):
--   - news_ingest_url            : https://<PROJECT-REF>.supabase.co/functions/v1/news-ingest
--   - news_pipeline_service_role : <SUPABASE_SERVICE_ROLE_KEY>
--   - news_pipeline_secret       : <NEWS_PIPELINE_SECRET ile aynı değer>

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Vault secret'larını okuyup Edge Function'ı POST eden yardımcı fonksiyon.
create or replace function public.trigger_news_ingest()
returns void
language plpgsql
security definer
set search_path = public, vault, extensions
as $$
declare
  v_url text;
  v_service_role text;
  v_pipeline_secret text;
begin
  select decrypted_secret into v_url
    from vault.decrypted_secrets where name = 'news_ingest_url';
  select decrypted_secret into v_service_role
    from vault.decrypted_secrets where name = 'news_pipeline_service_role';
  select decrypted_secret into v_pipeline_secret
    from vault.decrypted_secrets where name = 'news_pipeline_secret';

  if v_url is null or v_service_role is null then
    raise warning 'trigger_news_ingest: Vault secret(ler)i eksik, çağrı atlandı';
    return;
  end if;

  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_role,
      'x-pipeline-secret', coalesce(v_pipeline_secret, '')
    ),
    body := jsonb_build_object('trigger', 'cron'),
    timeout_milliseconds := 60000
  );
end;
$$;

-- Önceki tanımı (varsa) kaldırıp günlük job'ı (idempotent) yeniden kur.
do $$
begin
  if exists (select 1 from cron.job where jobname = 'news-ingest-daily') then
    perform cron.unschedule('news-ingest-daily');
  end if;
end $$;

select cron.schedule(
  'news-ingest-daily',
  '0 6 * * *',
  $$ select public.trigger_news_ingest(); $$
);

-- Haftalık temizlik job'ı için yer tutucu (news.md §19). Cleanup fonksiyonu
-- henüz tanımlı değilse şimdilik kurulmaz; ileride ayrı migration ile eklenir.
