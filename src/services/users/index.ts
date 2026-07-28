import { createAdminClient } from "@/lib/supabase/admin";
import type { UserProfile } from "@/lib/types/database";

function isMissingPublicJoinIdColumn(message: string): boolean {
  return (
    message.includes("public_join_id") && message.includes("does not exist")
  );
}

export async function getUserByPublicJoinId(
  publicJoinId: string,
): Promise<UserProfile | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("users")
    .select(
      "id, auth_user_id, organization_id, role, display_name, email, public_join_id, created_at, updated_at",
    )
    .eq("public_join_id", publicJoinId)
    .maybeSingle();

  if (error) {
    if (isMissingPublicJoinIdColumn(error.message)) {
      return null;
    }

    throw new Error(error.message);
  }

  return data as UserProfile | null;
}
