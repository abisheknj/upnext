"use client";

import { useEffect, useState } from "react";
import type {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import type {
  SongRequest,
  SongRequestWithParticipant,
} from "@/lib/types/database";

import { SessionRequestsSections } from "./session-requests-table";

type SessionRequestsRealtimeProps = {
  initialRequests: SongRequestWithParticipant[];
  sessionId: string;
};

function sortRequests(
  requests: SongRequestWithParticipant[],
): SongRequestWithParticipant[] {
  return [...requests].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

function upsertRequest(
  requests: SongRequestWithParticipant[],
  request: SongRequestWithParticipant,
): SongRequestWithParticipant[] {
  const exists = requests.some((item) => item.id === request.id);

  if (!exists) {
    return sortRequests([request, ...requests]);
  }

  return sortRequests(
    requests.map((item) => (item.id === request.id ? request : item)),
  );
}

function mergeRequestUpdate(
  requests: SongRequestWithParticipant[],
  updatedRequest: SongRequest,
): SongRequestWithParticipant[] {
  return sortRequests(
    requests.map((request) =>
      request.id === updatedRequest.id
        ? { ...request, ...updatedRequest }
        : request,
    ),
  );
}

export function SessionRequestsRealtime({
  initialRequests,
  sessionId,
}: SessionRequestsRealtimeProps) {
  const [requests, setRequests] =
    useState<SongRequestWithParticipant[]>(initialRequests);

  useEffect(() => {
    const supabase = createClient();

    async function fetchRequestWithParticipant(requestId: string) {
      const { data, error } = await supabase
        .from("song_requests")
        .select(
          `
          *,
          participant:participants (
            nickname
          )
        `,
        )
        .eq("id", requestId)
        .eq("session_id", sessionId)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setRequests((current) =>
          upsertRequest(current, data as SongRequestWithParticipant),
        );
      }
    }

    const channel = supabase
      .channel(`song-requests:session:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "song_requests",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: RealtimePostgresInsertPayload<SongRequest>) => {
          void fetchRequestWithParticipant(payload.new.id);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "song_requests",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: RealtimePostgresUpdatePayload<SongRequest>) => {
          setRequests((current) => mergeRequestUpdate(current, payload.new));
        },
      )
      .subscribe((status, error) => {
        if (error) {
          console.error(error);
        }

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error(`Request realtime subscription ${status}.`);
        }
      });

    return () => {
      void channel.unsubscribe();
    };
  }, [sessionId]);

  return <SessionRequestsSections requests={requests} sessionId={sessionId} />;
}
