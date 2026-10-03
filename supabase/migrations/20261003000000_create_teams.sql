-- The Grand Line: multi-device team sync + live leaderboard.
-- Run this in the Supabase SQL editor once.

create table if not exists public.teams (
  team_code text primary key,
  team_name text not null,
  state jsonb not null,
  phase text not null default 'r1',
  penalty_sec integer not null default 0,
  final_time_sec integer,
  updated_at timestamptz not null default now()
);

alter table public.teams enable row level security;

-- Prototype-friendly open access (event LAN). Tighten for production.
drop policy if exists "teams open read" on public.teams;
create policy "teams open read" on public.teams for select using (true);

drop policy if exists "teams open write" on public.teams;
create policy "teams open write" on public.teams for insert with check (true);

drop policy if exists "teams open update" on public.teams;
create policy "teams open update" on public.teams for update using (true);

create index if not exists teams_phase_time_idx on public.teams (phase, final_time_sec asc nulls last);
