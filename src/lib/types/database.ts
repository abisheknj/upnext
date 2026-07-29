/** Matches `user_role` enum in Postgres (super_admin excluded from app flows for now). */
export type AppUserRole = "dj" | "venue_admin";

export type UserRole = AppUserRole | "super_admin";

export type UserProfile = {
  id: string;
  auth_user_id: string;
  organization_id: string | null;
  role: UserRole;
  display_name: string;
  email: string;
  public_join_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SessionStatus = "draft" | "scheduled" | "live" | "paused" | "ended";

export type RequestStatus =
  | "submitted"
  | "accepted"
  | "rejected"
  | "playing"
  | "played"
  | "expired";

export type Session = {
  id: string;
  venue_id: string | null;
  title: string;
  description: string | null;
  status: SessionStatus;
  starts_at: string | null;
  ends_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Participant = {
  id: string;
  session_id: string;
  nickname: string;
  joined_at: string;
  last_active_at: string;
};

export type SongRequest = {
  id: string;
  session_id: string;
  participant_id: string;
  spotify_track_id: string;
  song_title: string;
  artist_name: string;
  artwork_url: string | null;
  message: string | null;
  status: RequestStatus;
  submitted_at: string;
  accepted_at: string | null;
  rejected_at: string | null;
  played_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SongRequestWithParticipant = SongRequest & {
  participant: Pick<Participant, "nickname">;
};
