"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getProfile, requireAuth } from "@/lib/auth";
import { getRequestById, updateRequestStatus } from "@/services/requests";
import {
  createSession,
  endSession,
  getActiveSessionByDj,
  getSessionById,
  startSession,
} from "@/services/sessions";

import {
  type SessionActionState,
  parseCreateSessionFormData,
} from "./validators";

const sessionIdSchema = z.object({
  sessionId: z.uuid("Invalid session"),
});

const requestActionSchema = z.object({
  requestId: z.uuid("Invalid request"),
  sessionId: z.uuid("Invalid session"),
});

async function requireOwnedSession(sessionId: string) {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const session = await getSessionById(sessionId);

  if (!session || session.created_by !== profile.id) {
    throw new Error("Session not found.");
  }

  return { profile, session };
}

export async function createSessionAction(
  _prevState: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) {
    return { error: "Profile not found. Please complete signup." };
  }

  const existing = await getActiveSessionByDj(profile.id);
  if (existing) {
    redirect(`/dashboard/sessions/${existing.id}?notice=already_have_session`);
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

export async function startSessionAction(formData: FormData): Promise<void> {
  const parsed = sessionIdSchema.safeParse({
    sessionId: formData.get("sessionId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid session.");
  }

  const { sessionId } = parsed.data;
  await requireOwnedSession(sessionId);

  try {
    await startSession(sessionId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start session.";
    throw new Error(message);
  }

  revalidatePath(`/dashboard/sessions/${sessionId}`);
  redirect(`/dashboard/sessions/${sessionId}`);
}

export async function endSessionAction(formData: FormData): Promise<void> {
  const parsed = sessionIdSchema.safeParse({
    sessionId: formData.get("sessionId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid session.");
  }

  const { sessionId } = parsed.data;
  await requireOwnedSession(sessionId);

  try {
    await endSession(sessionId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not end session.";
    throw new Error(message);
  }

  revalidatePath(`/dashboard/sessions/${sessionId}`);
  redirect(`/dashboard/sessions/${sessionId}`);
}

export async function acceptRequestAction(formData: FormData): Promise<void> {
  const parsed = requestActionSchema.safeParse({
    requestId: formData.get("requestId"),
    sessionId: formData.get("sessionId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid request.");
  }

  const { requestId, sessionId } = parsed.data;
  await requireOwnedSession(sessionId);

  const request = await getRequestById(requestId, sessionId);
  if (!request) {
    throw new Error("Request not found.");
  }

  if (request.status !== "submitted") {
    throw new Error("Only submitted requests can be accepted.");
  }

  await updateRequestStatus({ requestId, sessionId, status: "accepted" });

  revalidatePath(`/dashboard/sessions/${sessionId}`);
  redirect(`/dashboard/sessions/${sessionId}`);
}

export async function rejectRequestAction(formData: FormData): Promise<void> {
  const parsed = requestActionSchema.safeParse({
    requestId: formData.get("requestId"),
    sessionId: formData.get("sessionId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid request.");
  }

  const { requestId, sessionId } = parsed.data;
  await requireOwnedSession(sessionId);

  const request = await getRequestById(requestId, sessionId);
  if (!request) {
    throw new Error("Request not found.");
  }

  if (request.status !== "submitted") {
    throw new Error("Only submitted requests can be rejected.");
  }

  await updateRequestStatus({ requestId, sessionId, status: "rejected" });

  revalidatePath(`/dashboard/sessions/${sessionId}`);
  redirect(`/dashboard/sessions/${sessionId}`);
}

export async function markPlayedAction(formData: FormData): Promise<void> {
  const parsed = requestActionSchema.safeParse({
    requestId: formData.get("requestId"),
    sessionId: formData.get("sessionId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid request.");
  }

  const { requestId, sessionId } = parsed.data;
  await requireOwnedSession(sessionId);

  const request = await getRequestById(requestId, sessionId);
  if (!request) {
    throw new Error("Request not found.");
  }

  if (request.status !== "accepted") {
    throw new Error("Only accepted requests can be marked as played.");
  }

  await updateRequestStatus({ requestId, sessionId, status: "played" });

  revalidatePath(`/dashboard/sessions/${sessionId}`);
  redirect(`/dashboard/sessions/${sessionId}`);
}
