create table participants (
  id uuid primary key default gen_random_uuid(),

  session_id uuid not null
    references sessions(id)
    on delete cascade,

  nickname text not null,

  joined_at timestamptz not null default now(),

  last_active_at timestamptz not null default now()
);