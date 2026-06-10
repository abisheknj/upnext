create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_organizations_updated_at
before update on organizations
for each row
execute function update_updated_at_column();

create trigger update_venues_updated_at
before update on venues
for each row
execute function update_updated_at_column();

create trigger update_users_updated_at
before update on users
for each row
execute function update_updated_at_column();

create trigger update_sessions_updated_at
before update on sessions
for each row
execute function update_updated_at_column();

create trigger update_song_requests_updated_at
before update on song_requests
for each row
execute function update_updated_at_column();