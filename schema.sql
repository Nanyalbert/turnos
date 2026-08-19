-- BLACK TURNOS · esquema inicial para Supabase/PostgreSQL
create extension if not exists pgcrypto;
create table if not exists professionals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null,
  slot_duration integer not null default 30 check (slot_duration > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists professional_availability (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  unique(professional_id, weekday, start_time, end_time)
);
create table if not exists schedule_blocks (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now()
);
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now()
);
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals(id),
  patient_id uuid not null references patients(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  service text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','attended','cancelled','no_show')),
  source text not null default 'internal' check (source in ('internal','web','whatsapp','instagram','phone','walk_in','referral')),
  notes text,
  created_at timestamptz not null default now()
);
-- Evita dos reservas exactamente iguales para un mismo profesional.
create unique index if not exists appointments_unique_active_slot on appointments(professional_id, starts_at) where status <> 'cancelled';
-- IMPORTANTE: la página pública no debe tener SELECT directo sobre appointments/patients.
-- La disponibilidad pública debe exponerse mediante una RPC/Edge Function que devuelva únicamente slots libres.
