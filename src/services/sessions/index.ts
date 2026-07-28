import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Session, SessionStatus } from "@/lib/types/database";
import { getUserByPublicJoinId } from "@/services/users";

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
      status: "draft",
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

export async function getSessionByDj(
  djUserId: string,
): Promise<Session | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select()
    .eq("created_by", djUserId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Session | null;
}

export async function getActiveSessionByDj(
  djUserId: string,
): Promise<Session | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select()
    .eq("created_by", djUserId)
    .in("status", ["draft", "live"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Session | null;
}

export async function getLiveSessionByDj(
  djUserId: string,
): Promise<Session | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("sessions")
    .select()
    .eq("created_by", djUserId)
    .eq("status", "live")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Session | null;
}

export async function getActiveSessionByPublicJoinId(
  publicJoinId: string,
): Promise<Session | null> {
  const user = await getUserByPublicJoinId(publicJoinId);

  if (!user) {
    return null;
  }

  return getLiveSessionByDj(user.id);
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

export async function updateSessionStatus(
  sessionId: string,
  status: SessionStatus,
  extra?: { ends_at?: string },
): Promise<Session> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .update({
      status,
      ...extra,
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Session;
}

export async function startSession(sessionId: string): Promise<Session> {
  const session = await getSessionById(sessionId);

  if (!session) {
    throw new Error("Session not found.");
  }

  if (session.status !== "draft") {
    throw new Error("Only draft sessions can be started.");
  }

  return updateSessionStatus(sessionId, "live");
}

export async function endSession(sessionId: string): Promise<Session> {
  const session = await getSessionById(sessionId);

  if (!session) {
    throw new Error("Session not found.");
  }

  if (session.status !== "live") {
    throw new Error("Only live sessions can be ended.");
  }

  return updateSessionStatus(sessionId, "ended", {
    ends_at: new Date().toISOString(),
  });
}
