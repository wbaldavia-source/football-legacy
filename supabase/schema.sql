-- FOOTBALL LEGACY: schema inicial. Aplicar em projeto Supabase novo após revisão.
create extension if not exists pgcrypto;

create table if not exists public.careers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  mode text not null check (mode in ('player','manager')),
  season integer not null default 2026,
  age integer not null default 18,
  club_id uuid,
  overall integer not null default 50 check (overall between 1 and 99),
  reputation integer not null default 0 check (reputation between 0 and 100),
  morale integer not null default 70 check (morale between 0 and 100),
  balance_cents bigint not null default 0,
  profile_photo_path text,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.career_history (
  id uuid primary key default gen_random_uuid(),
  career_id uuid not null references public.careers(id) on delete cascade,
  season integer not null,
  event_type text not null,
  title text not null,
  description text not null default '',
  effects jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.persons (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  person_type text not null check (person_type in ('player','manager')),
  nationality_code text,
  birth_date date,
  data_source_id text,
  external_id text,
  image_asset_id uuid,
  is_fictional boolean not null default false,
  unique(data_source_id, external_id)
);

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country_code text not null,
  city text,
  founded_year integer,
  data_source_id text,
  external_id text,
  is_fictional boolean not null default false,
  unique(data_source_id, external_id)
);

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country_code text not null,
  tier integer,
  gender text not null default 'men' check (gender in ('men')),
  format text not null default 'round_robin',
  data_source_id text,
  external_id text,
  unique(data_source_id, external_id)
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.persons(id),
  club_id uuid not null references public.clubs(id),
  starts_on date not null,
  ends_on date not null,
  wage_cents bigint not null default 0,
  release_clause_cents bigint,
  status text not null default 'active'
);

create table if not exists public.transfer_negotiations (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.persons(id),
  from_club_id uuid references public.clubs(id),
  to_club_id uuid not null references public.clubs(id),
  fee_cents bigint not null default 0,
  wage_cents bigint not null default 0,
  contract_years numeric(3,1) not null default 3,
  status text not null default 'scouting'
    check (status in ('scouting','offer','counteroffer','club_agreed','personal_terms','medical','completed','rejected','expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.careers enable row level security;
alter table public.career_history enable row level security;
create policy "career owner can read" on public.careers for select using (auth.uid() = owner_id);
create policy "career owner can insert" on public.careers for insert with check (auth.uid() = owner_id);
create policy "career owner can update" on public.careers for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "career owner can delete" on public.careers for delete using (auth.uid() = owner_id);
create policy "history through owned career" on public.career_history for all
  using (exists(select 1 from public.careers c where c.id = career_id and c.owner_id = auth.uid()))
  with check (exists(select 1 from public.careers c where c.id = career_id and c.owner_id = auth.uid()));
