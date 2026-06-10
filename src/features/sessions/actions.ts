"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getProfile, requireAuth } from "@/lib/auth";
import { createSession } from "@/services/sessions";

import {
  type SessionActionState,
  parseCreateSessionFormData,
} from "./validators";

export async function createSessionAction(
  _prevState: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) {
    return { error: "Profile not found. Please complete signup." };
  }

  const parsed = parseCreateSessionFormData(formData);
  if (!parsed.success) {
    return parsed.state;
  }

  const { title, description } = parsed.data;

  let session;
  try {
    session = await createSession({
      title,
      description: description ?? null,
      createdBy: profile.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create session.";
    return { error: message };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/sessions/${session.id}`);
}
