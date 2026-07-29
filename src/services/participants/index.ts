import { createAdminClient } from "@/lib/supabase/admin";
import type { Participant } from "@/lib/types/database";

export type CreateParticipantInput = {
  sessionId: string;
  nickname: string;
};

export async function createParticipant(
  input: CreateParticipantInput,
): Promise<Participant> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("participants")
    .insert({
      session_id: input.sessionId,
      nickname: input.nickname,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Participant;
}

export async function getParticipantById(
  id: string,
): Promise<Participant | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("participants")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Participant | null;
}
