"use client";

import { useEffect, useState } from "react";
import type {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";

import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { RequestStatus, SongRequest } from "@/lib/types/database";

import { getStoredParticipantId } from "../lib/participant-storage";

type AudienceRequestStatusListProps = {
  publicJoinId: string;
  initialRequests?: SongRequest[];
  participantId?: string;
};

const VISIBLE_STATUSES: RequestStatus[] = [
  "submitted",
  "accepted",
  "rejected",
  "played",
];

function requestStatusLabel(status: RequestStatus): string {
  switch (status) {
    case "submitted":
      return "Requested";
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "played":
      return "Played";
    default:
      return status;
  }
}

function requestStatusVariant(
  status: RequestStatus,
): "default" | "secondary" | "outline" | "success" | "warning" | "muted" {
  switch (status) {
    case "submitted":
      return "secondary";
    case "accepted":
      return "success";
    case "rejected":
      return "warning";
    case "played":
      return "muted";
    default:
      return "outline";
  }
}

function sortRequests(requests: SongRequest[]): SongRequest[] {
  return [...requests].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

function upsertRequest(requests: SongRequest[], request: SongRequest) {
  const exists = requests.some((item) => item.id === request.id);

  if (!exists) {
    return sortRequests([request, ...requests]);
  }

  return sortRequests(
    requests.map((item) => (item.id === request.id ? request : item)),
  );
}

export function AudienceRequestStatusList({
  publicJoinId,
  initialRequests = [],
  participantId: initialParticipantId,
}: AudienceRequestStatusListProps) {
  const [participantId] = useState<string | null>(
    () => initialParticipantId ?? getStoredParticipantId(publicJoinId),
  );
  const [requests, setRequests] = useState<SongRequest[]>(
    sortRequests(initialRequests),
  );

  useEffect(() => {
    if (!participantId) {
      return;
    }

    const supabase = createClient();

    async function fetchInitialParticipantRequests() {
      if (initialRequests.length > 0) {
        return;
      }

      const { data, error } = await supabase
        .from("song_requests")
        .select()
        .eq("participant_id", participantId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setRequests(sortRequests((data ?? []) as SongRequest[]));
    }

    void fetchInitialParticipantRequests();

    const channel = supabase
      .channel(`song-requests:participant:${participantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "song_requests",
          filter: `participant_id=eq.${participantId}`,
        },
        (payload: RealtimePostgresInsertPayload<SongRequest>) => {
          setRequests((current) => upsertRequest(current, payload.new));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "song_requests",
          filter: `participant_id=eq.${participantId}`,
        },
        (payload: RealtimePostgresUpdatePayload<SongRequest>) => {
          setRequests((current) => upsertRequest(current, payload.new));
        },
      )
      .subscribe((status, error) => {
        if (error) {
          console.error(error);
        }

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error(`Audience request realtime subscription ${status}.`);
        }
      });

    return () => {
      void channel.unsubscribe();
    };
  }, [initialRequests.length, participantId]);

  const visibleRequests = requests.filter((request) =>
    VISIBLE_STATUSES.includes(request.status),
  );

  if (!participantId || visibleRequests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-medium">Your requests</h2>
        <p className="text-muted-foreground text-sm">
          Status updates appear here automatically.
        </p>
      </div>
      <div className="space-y-2">
        {visibleRequests.map((request) => (
          <div
            key={request.id}
            className="border-border bg-muted/30 flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{request.song_title}</p>
              <p className="text-muted-foreground truncate text-sm">
                {request.artist_name}
              </p>
            </div>
            <Badge
              variant={requestStatusVariant(request.status)}
              className="shrink-0"
            >
              {requestStatusLabel(request.status)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
