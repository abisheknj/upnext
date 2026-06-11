do $$
begin
  alter publication supabase_realtime
  add table public.song_requests;
exception
  when duplicate_object then
    null;
end $$;