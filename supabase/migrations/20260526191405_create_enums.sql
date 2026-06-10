create type session_status as enum (
  'draft',
  'scheduled',
  'live',
  'paused',
  'ended'
);

create type request_status as enum (
  'submitted',
  'accepted',
  'rejected',
  'playing',
  'played',
  'expired'
);

create type user_role as enum (
  'super_admin',
  'venue_admin',
  'dj'
);