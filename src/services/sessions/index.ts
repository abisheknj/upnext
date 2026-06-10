import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/types/database";

export type CreateSessionInput = {
  title: string;
  description?: string | null;
  createdBy: string;
};

export async function createSession(
  input: CreateSessionInput,
): Promise<Session> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      title: input.title,
      description: input.description ?? null,
      status: "live",
      created_by: input.createdBy,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Session;
}

export async function getSessionById(id: string): Promise<Session | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("sessions")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Session | null;
}

export async function listSessionsByDj(djUserId: string): Promise<Session[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select()
    .eq("created_by", djUserId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Session[];
}
