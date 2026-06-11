"use server";

import { redirect } from "next/navigation";

import { createParticipant } from "@/services/participants";
import { createSongRequest } from "@/services/requests";
import { getSessionById } from "@/services/sessions";

import {
  type JoinActionState,
  type SongRequestActionState,
  parseSongRequestFormData,
} from "./validators";

function generateGuestNickname(): string {
  const number = Math.floor(1000 + Math.random() * 9000);
  return `Guest${number}`;
}

export async function joinSessionAction(
  sessionId: string,
): Promise<JoinActionState> {
  const session = await getSessionById(sessionId);

  if (!session) {
    return { error: "Session not found." };
  }

  try {
    const participant = await createParticipant({
      sessionId,
      nickname: generateGuestNickname(),
    });

    return { participantId: participant.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not join session.";
    return { error: message };
  }
}

export async function submitSongRequestAction(
  _prevState: SongRequestActionState,
  formData: FormData,
): Promise<SongRequestActionState> {
  const parsed = parseSongRequestFormData(formData);
  if (!parsed.success) {
    return parsed.state;
  }

  const {
    sessionId,
    participantId,
    songId,
    songTitle,
    artistName,
    artworkUrl,
    message,
  } = parsed.data;

  const session = await getSessionById(sessionId);
  if (!session) {
    return { error: "Session not found." };
  }

  let request;

  try {
    request = await createSongRequest({
      sessionId,
      participantId,
      songTitle,
      artistName,
      spotifyTrackId: songId,
      artworkUrl: artworkUrl ?? null,
      message: message ?? null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not submit request.";
    return { error: message };
  }

  const params = new URLSearchParams({
    song: songTitle,
    artist: artistName,
    requestId: request.id,
  });

  redirect(`/join/${sessionId}/success?${params.toString()}`);
}
