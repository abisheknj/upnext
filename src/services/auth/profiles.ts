import { createAdminClient } from "@/lib/supabase/admin";
import type { AppUserRole, UserProfile } from "@/lib/types/database";

export type CreateUserProfileInput = {
  auth_user_id: string;
  display_name: string;
  email: string;
  role: AppUserRole;
};

export async function createUserProfile(
  input: CreateUserProfileInput,
): Promise<UserProfile> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("users")
    .insert({
      auth_user_id: input.auth_user_id,
      display_name: input.display_name,
      email: input.email,
      role: input.role,
      organization_id: null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile;
}

export async function deleteAuthUser(authUserId: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(authUserId);

  if (error) {
    throw new Error(error.message);
  }
}
