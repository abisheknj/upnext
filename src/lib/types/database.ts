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
  created_at: string;
  updated_at: string;
};
