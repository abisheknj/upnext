create table venues (
  id uuid primary key default gen_random_uuid(),

  organization_id uuid
    references organizations(id)
    on delete set null,

  name text not null,

  slug text not null unique,

  city text not null,

  timezone text not null default 'Asia/Kolkata',

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);