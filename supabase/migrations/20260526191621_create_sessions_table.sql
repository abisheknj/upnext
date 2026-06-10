create table sessions (
  id uuid primary key default gen_random_uuid(),

  venue_id uuid
    references venues(id)
    on delete set null,

  title text not null,

  description text,

  status session_status not null default 'draft',

  starts_at timestamptz,

  ends_at timestamptz,

  created_by uuid not null
    references users(id)
    on delete restrict,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);