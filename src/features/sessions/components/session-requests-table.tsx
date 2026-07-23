import { Check, Clock3, Disc3, ListMusic, Play, User, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  RequestStatus,
  SongRequestWithParticipant,
} from "@/lib/types/database";

import {
  acceptRequestAction,
  markPlayedAction,
  rejectRequestAction,
} from "../actions";

type SessionRequestsSectionsProps = {
  requests: SongRequestWithParticipant[];
  sessionId: string;
};

type MvpRequestStatus = "submitted" | "accepted" | "played" | "rejected";

const VISIBLE_STATUSES: MvpRequestStatus[] = [
  "submitted",
  "accepted",
  "played",
  "rejected",
];

const STATUS_PRIORITY: Record<MvpRequestStatus, number> = {
  submitted: 0,
  accepted: 1,
  played: 2,
  rejected: 3,
};

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function RequestActions({
  request,
  sessionId,
}: {
  request: SongRequestWithParticipant;
  sessionId: string;
}) {
  if (request.status === "submitted") {
    return (
      <div className="flex flex-wrap gap-2">
        <form action={acceptRequestAction}>
          <input type="hidden" name="requestId" value={request.id} />
          <input type="hidden" name="sessionId" value={sessionId} />
          <Button type="submit" size="sm" variant="success">
            <Check className="size-3.5" aria-hidden="true" />
            Accept
          </Button>
        </form>
        <form action={rejectRequestAction}>
          <input type="hidden" name="requestId" value={request.id} />
          <input type="hidden" name="sessionId" value={sessionId} />
          <Button type="submit" size="sm" variant="outline">
            <X className="size-3.5" aria-hidden="true" />
            Reject
          </Button>
        </form>
      </div>
    );
  }

  if (request.status === "accepted") {
    return (
      <form action={markPlayedAction}>
        <input type="hidden" name="requestId" value={request.id} />
        <input type="hidden" name="sessionId" value={sessionId} />
        <Button type="submit" size="sm" variant="secondary">
          <Play className="size-3.5" aria-hidden="true" />
          Mark played
        </Button>
      </form>
    );
  }

  return null;
}

function isVisibleStatus(status: RequestStatus): status is MvpRequestStatus {
  return VISIBLE_STATUSES.includes(status as MvpRequestStatus);
}

function sortSmartRequests(
  requests: SongRequestWithParticipant[],
): SongRequestWithParticipant[] {
  return [...requests].sort((a, b) => {
    if (isVisibleStatus(a.status) && isVisibleStatus(b.status)) {
      const statusSort = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];

      if (statusSort !== 0) {
        return statusSort;
      }
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function RequestsSummary({
  requests,
}: {
  requests: SongRequestWithParticipant[];
}) {
  const submitted = requests.filter(
    (request) => request.status === "submitted",
  ).length;
  const accepted = requests.filter(
    (request) => request.status === "accepted",
  ).length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">{requests.length} total</Badge>
      {submitted > 0 ? <Badge variant="warning">{submitted} new</Badge> : null}
      {accepted > 0 ? (
        <Badge variant="success">{accepted} accepted</Badge>
      ) : null}
    </div>
  );
}

function RequestList({
  requests,
  sessionId,
}: {
  requests: SongRequestWithParticipant[];
  sessionId: string;
}) {
  return (
    <Card variant="section" className="bg-white/[0.04]">
      <CardHeader className="border-b">
        <SectionHeader
          title="Live Requests"
          description="One smart queue with every request, its status, and the actions available now."
          action={<RequestsSummary requests={requests} />}
        />
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="border-border/80 bg-background/30 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center">
            <div className="bg-secondary text-muted-foreground flex size-12 items-center justify-center rounded-2xl">
              <ListMusic className="size-5" aria-hidden="true" />
            </div>
            <div className="max-w-sm space-y-1">
              <p className="font-semibold tracking-tight">Nothing here yet</p>
              <p className="text-muted-foreground text-sm leading-6">
                Requests will appear here automatically as the crowd interacts
                with the session.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                sessionId={sessionId}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RequestCard({
  request,
  sessionId,
}: {
  request: SongRequestWithParticipant;
  sessionId: string;
}) {
  return (
    <article className="group/request border-border/70 bg-background/45 hover:border-primary/35 hover:bg-background/70 hover:shadow-card grid gap-4 rounded-2xl border p-3 transition-all duration-200 ease-out md:grid-cols-[4.5rem_minmax(0,1fr)_auto_auto] md:items-center">
      <div
        className="bg-secondary text-muted-foreground flex aspect-square size-16 items-center justify-center overflow-hidden rounded-2xl bg-cover bg-center shadow-sm sm:size-[4.5rem]"
        style={
          request.artwork_url
            ? { backgroundImage: `url(${request.artwork_url})` }
            : undefined
        }
        aria-label={
          request.artwork_url
            ? `Album artwork for ${request.song_title}`
            : "Album artwork unavailable"
        }
        role="img"
      >
        {request.artwork_url ? null : (
          <Disc3 className="size-6" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:block">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight">
              {request.song_title}
            </h3>
            <p className="text-muted-foreground truncate text-sm">
              {request.artist_name}
            </p>
          </div>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <User className="size-3.5" aria-hidden="true" />
            {request.participant?.nickname ?? "Unknown"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {formatTime(request.submitted_at)}
          </span>
          {request.message ? (
            <span className="text-foreground/80 line-clamp-1">
              &ldquo;{request.message}&rdquo;
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center md:justify-center">
        <StatusBadge status={request.status} />
      </div>

      <div className="flex justify-start md:justify-end">
        <RequestActions request={request} sessionId={sessionId} />
      </div>
    </article>
  );
}

export function SessionRequestsSections({
  requests,
  sessionId,
}: SessionRequestsSectionsProps) {
  const mvpRequests = requests.filter((request) =>
    isVisibleStatus(request.status),
  );

  return (
    <RequestList
      sessionId={sessionId}
      requests={sortSmartRequests(mvpRequests)}
    />
  );
}
