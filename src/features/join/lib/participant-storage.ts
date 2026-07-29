const STORAGE_PREFIX = "upnext_participant_";

export function participantStorageKey(publicJoinId: string): string {
  return `${STORAGE_PREFIX}${publicJoinId}`;
}

export function getStoredParticipantId(publicJoinId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(participantStorageKey(publicJoinId));
}

export function setStoredParticipantId(
  publicJoinId: string,
  participantId: string,
): void {
  localStorage.setItem(participantStorageKey(publicJoinId), participantId);
}
