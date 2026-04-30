-- ============================================================
-- Schema para gastos-app
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

create table if not exists categories (
  id          text primary key,
  name        text not null,
  ico         text not null default '💰',
  color       text not null default '#a3a3a3',
  kind        text not null default 'gasto' check (kind in ('gasto', 'ingreso')),
  budget      numeric,
  logo        text,
  created_at  timestamptz not null default now()
);

create table if not exists transactions (
  id          text primary key,
  name        text not null,
  cat_id      text not null,
  amt         numeric not null,
  date        timestamptz not null,
  recurring   boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists loans (
  id               text primary key,
  name             text not null,
  ico              text not null default '🏦',
  color            text not null default '#60a5fa',
  total_amount     numeric not null,
  monthly_payment  numeric not null,
  start_date       date not null,
  total_months     integer not null,
  created_at       timestamptz not null default now()
);

-- Sin RLS para uso personal (app privada)
-- Si despliegas públicamente, habilita RLS con autenticación.
alter table categories  disable row level security;
alter table transactions disable row level security;
alter table loans        disable row level security;
