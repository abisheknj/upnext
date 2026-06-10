const STORAGE_PREFIX = "upnext_participant_";

export function participantStorageKey(sessionId: string): string {
  return `${STORAGE_PREFIX}${sessionId}`;
}

export function getStoredParticipantId(sessionId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(participantStorageKey(sessionId));
}

export function setStoredParticipantId(
  sessionId: string,
  participantId: string,
): void {
  localStorage.setItem(participantStorageKey(sessionId), participantId);
}
