-- Citizen "¿Lo sentiste?" (Did You Feel It) reports for earthquakes.
-- Anonymous, zone-level only. No personal data is stored.

create table if not exists public.felt_reports (
  id uuid primary key default gen_random_uuid(),
  quake_id text not null,
  intensity smallint not null check (intensity between 0 and 4),
  lat double precision,
  lng double precision,
  zone text,
  created_at timestamptz not null default now()
);

create index if not exists felt_reports_quake_idx on public.felt_reports (quake_id);
create index if not exists felt_reports_created_idx on public.felt_reports (created_at desc);

alter table public.felt_reports enable row level security;

-- Anyone (including anonymous visitors) may submit a report.
drop policy if exists "anon can insert felt reports" on public.felt_reports;
create policy "anon can insert felt reports"
  on public.felt_reports for insert
  to anon, authenticated
  with check (intensity between 0 and 4);

-- Aggregated reports are public (anonymous, zone-level only). No update/delete
-- policies exist, so submitted reports are immutable through the public API.
drop policy if exists "felt reports are public" on public.felt_reports;
create policy "felt reports are public"
  on public.felt_reports for select
  to anon, authenticated
  using (true);
