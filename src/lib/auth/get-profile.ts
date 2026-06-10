import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/types/database";

import { getUser } from "./get-user";

/** Returns the business profile from `public.users` for the current session. */
export async function getProfile(): Promise<UserProfile | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, auth_user_id, organization_id, role, display_name, email, created_at, updated_at",
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("getProfile:", error.message);
    return null;
  }

  return data as UserProfile | null;
}
