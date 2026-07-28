"use server";

import { redirect } from "next/navigation";

import { createParticipant } from "@/services/participants";
import { getParticipantById } from "@/services/participants";
import { createSongRequest } from "@/services/requests";
import { getActiveSessionByPublicJoinId } from "@/services/sessions";

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
  publicJoinId: string,
): Promise<JoinActionState> {
  const session = await getActiveSessionByPublicJoinId(publicJoinId);

  if (!session) {
    return { error: "DJ is not live right now." };
  }

  try {
    const participant = await createParticipant({
      sessionId: session.id,
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
    publicJoinId,
    participantId,
    songId,
    songTitle,
    artistName,
    artworkUrl,
    message,
  } = parsed.data;

  const session = await getActiveSessionByPublicJoinId(publicJoinId);
  if (!session) {
    return { error: "DJ is not live right now." };
  }

  const participant = await getParticipantById(participantId);
  if (!participant || participant.session_id !== session.id) {
    return { error: "Please join this live session again." };
  }

  let request;

  try {
    request = await createSongRequest({
      sessionId: session.id,
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

  redirect(`/join/${publicJoinId}/success?${params.toString()}`);
}
