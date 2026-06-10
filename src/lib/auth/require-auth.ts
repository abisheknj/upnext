import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { getUser } from "./get-user";

/** Redirects to `/login` when there is no authenticated user. */
export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
