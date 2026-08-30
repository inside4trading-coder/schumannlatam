-- Hourly cron that refreshes the Schumann readings cache from Notion.
-- Requires pg_cron + pg_net (also enabled by 20260308114727_*).
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Re-runnable: cron.schedule upserts by job name.
select cron.schedule(
  'sync-notion-readings-hourly',
  '17 * * * *',
  $$
  select net.http_post(
    url     := 'https://mjbuljbvqwogxkbdfgdu.supabase.co/functions/v1/sync-notion-readings',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body    := '{}'::jsonb
  );
  $$
);
