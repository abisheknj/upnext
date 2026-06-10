import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/** Returns the authenticated Supabase auth user, or null if not signed in. */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("getUser:", error.message);
    return null;
  }

  return user;
}
