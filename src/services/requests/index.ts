import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  RequestStatus,
  SongRequest,
  SongRequestWithParticipant,
} from "@/lib/types/database";
import { getSessionById } from "@/services/sessions";

const ACTIVE_STATUSES: RequestStatus[] = ["submitted", "accepted"];
const MAX_ACTIVE_REQUESTS = 3;
const REQUEST_COOLDOWN_MS = 30_000;

export type CreateSongRequestInput = {
  sessionId: string;
  participantId: string;
  songTitle: string;
  artistName: string;
  spotifyTrackId: string;
  artworkUrl?: string | null;
  message?: string | null;
};

export async function countActiveRequests(
  sessionId: string,
  participantId: string,
): Promise<number> {
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from("song_requests")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("participant_id", participantId)
    .in("status", ACTIVE_STATUSES);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getLatestRequestAt(
  sessionId: string,
  participantId: string,
): Promise<string | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("song_requests")
    .select("created_at")
    .eq("session_id", sessionId)
    .eq("participant_id", participantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.created_at ?? null;
}

async function validateCanCreateRequest(
  sessionId: string,
  participantId: string,
): Promise<void> {
  const session = await getSessionById(sessionId);

  if (!session) {
    throw new Error("Session not found.");
  }

  if (session.status !== "live") {
    throw new Error("Session is not accepting requests.");
  }

  const activeCount = await countActiveRequests(sessionId, participantId);
  if (activeCount >= MAX_ACTIVE_REQUESTS) {
    throw new Error("You already have 3 active requests.");
  }

  const latestAt = await getLatestRequestAt(sessionId, participantId);
  if (latestAt) {
    const elapsed = Date.now() - new Date(latestAt).getTime();
    if (elapsed < REQUEST_COOLDOWN_MS) {
      throw new Error("Please wait before sending another request.");
    }
  }
}

export async function createSongRequest(
  input: CreateSongRequestInput,
): Promise<SongRequest> {
  await validateCanCreateRequest(input.sessionId, input.participantId);

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("song_requests")
    .insert({
      session_id: input.sessionId,
      participant_id: input.participantId,
      song_title: input.songTitle,
      artist_name: input.artistName,
      spotify_track_id: input.spotifyTrackId,
      artwork_url: input.artworkUrl ?? null,
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

type UpdateRequestStatusInput = {
  requestId: string;
  sessionId: string;
  status: RequestStatus;
};

export async function getRequestById(
  requestId: string,
  sessionId: string,
): Promise<SongRequest | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("song_requests")
    .select()
    .eq("id", requestId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as SongRequest | null;
}

export async function updateRequestStatus(
  input: UpdateRequestStatusInput,
): Promise<SongRequest> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const updates: Record<string, string> = { status: input.status };

  if (input.status === "accepted") {
    updates.accepted_at = now;
  } else if (input.status === "rejected") {
    updates.rejected_at = now;
  } else if (input.status === "played") {
    updates.played_at = now;
  }

  const { data, error } = await supabase
    .from("song_requests")
    .update(updates)
    .eq("id", input.requestId)
    .eq("session_id", input.sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SongRequest;
}
