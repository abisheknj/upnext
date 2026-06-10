create table users (
  id uuid primary key default gen_random_uuid(),

  auth_user_id uuid not null unique
    references auth.users(id)
    on delete cascade,

  organization_id uuid
    references organizations(id)
    on delete set null,

  role user_role not null,

  display_name text not null,

  email text not null unique,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);