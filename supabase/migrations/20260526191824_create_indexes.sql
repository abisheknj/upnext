create index idx_sessions_status
  on sessions(status);

create index idx_sessions_venue_id
  on sessions(venue_id);

create index idx_participants_session_id
  on participants(session_id);

create index idx_song_requests_session_id
  on song_requests(session_id);

create index idx_song_requests_participant_id
  on song_requests(participant_id);

create index idx_song_requests_status
  on song_requests(status);

create index idx_song_requests_session_status
  on song_requests(session_id, status);

create index idx_song_requests_session_created
  on song_requests(session_id, created_at);