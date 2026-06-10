create table song_requests (
  id uuid primary key default gen_random_uuid(),

  session_id uuid not null
    references sessions(id)
    on delete cascade,

  participant_id uuid not null
    references participants(id)
    on delete cascade,

  spotify_track_id text not null,

  song_title text not null,

  artist_name text not null,

  artwork_url text,

  message text,

  status request_status not null default 'submitted',

  submitted_at timestamptz not null default now(),

  accepted_at timestamptz,

  rejected_at timestamptz,

  played_at timestamptz,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);