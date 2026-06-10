import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  SongRequest,
  SongRequestWithParticipant,
} from "@/lib/types/database";

export type CreateSongRequestInput = {
  sessionId: string;
  participantId: string;
  songTitle: string;
  artistName: string;
  spotifyTrackId: string;
  message?: string | null;
};

export async function createSongRequest(
  input: CreateSongRequestInput,
): Promise<SongRequest> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("song_requests")
    .insert({
      session_id: input.sessionId,
      participant_id: input.participantId,
      song_title: input.songTitle,
      artist_name: input.artistName,
      spotify_track_id: input.spotifyTrackId,
      message: input.message ?? null,
      status: "submitted",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SongRequest;
}

export async function listSongRequestsBySession(
  sessionId: string,
): Promise<SongRequestWithParticipant[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("song_requests")
    .select(
      `
      *,
      participant:participants (
        nickname
      )
    `,
    )
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SongRequestWithParticipant[];
}
