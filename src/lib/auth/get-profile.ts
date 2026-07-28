import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/types/database";

import { getUser } from "./get-user";

const PROFILE_SELECT =
  "id, auth_user_id, organization_id, role, display_name, email, public_join_id, created_at, updated_at";

const LEGACY_PROFILE_SELECT =
  "id, auth_user_id, organization_id, role, display_name, email, created_at, updated_at";

function isMissingPublicJoinIdColumn(message: string): boolean {
  return (
    message.includes("public_join_id") && message.includes("does not exist")
  );
}

/** Returns the business profile from `public.users` for the current session. */
export async function getProfile(): Promise<UserProfile | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select(PROFILE_SELECT)
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    if (isMissingPublicJoinIdColumn(error.message)) {
      const { data: legacyData, error: legacyError } = await supabase
        .from("users")
        .select(LEGACY_PROFILE_SELECT)
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (legacyError) {
        console.error("getProfile:", legacyError.message);
        return null;
      }

      return legacyData
        ? ({ ...legacyData, public_join_id: null } as UserProfile)
        : null;
    }

    console.error("getProfile:", error.message);
    return null;
  }

  return data as UserProfile | null;
}
