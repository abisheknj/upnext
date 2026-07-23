import { Check, Clock3, Disc3, ListMusic, Play, User, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { SongRequestWithParticipant } from "@/lib/types/database";

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

const SECTIONS: {
  key: MvpRequestStatus;
  title: string;
  description: string;
}[] = [
  {
    key: "submitted",
    title: "New requests",
    description: "Fresh submissions waiting for your call.",
  },
  {
    key: "accepted",
    title: "Accepted",
    description: "Approved tracks ready for the set.",
  },
  {
    key: "played",
    title: "Played",
    description: "Completed requests from this session.",
  },
  {
    key: "rejected",
    title: "Rejected",
    description: "Requests that will not be played.",
  },
];

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

function RequestSection({
  title,
  description,
  requests,
  sessionId,
}: {
  title: string;
  description: string;
  requests: SongRequestWithParticipant[];
  sessionId: string;
}) {
  return (
    <Card variant="section">
      <CardHeader className="border-b">
        <SectionHeader
          title={title}
          description={description}
          action={
            <Badge variant="secondary">
              {requests.length} request{requests.length === 1 ? "" : "s"}
            </Badge>
          }
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
          <div className="grid gap-3">
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
    <article className="group/request border-border/70 bg-background/45 hover:border-primary/35 hover:bg-background/70 hover:shadow-card grid gap-4 rounded-2xl border p-3 transition-all duration-200 ease-out sm:grid-cols-[4.5rem_1fr_auto] sm:items-center">
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight">
              {request.song_title}
            </h3>
            <p className="text-muted-foreground truncate text-sm">
              {request.artist_name}
            </p>
          </div>
          <StatusBadge status={request.status} />
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

      <div className="flex justify-start sm:justify-end">
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
    SECTIONS.some((section) => section.key === request.status),
  );

  return (
    <div className="grid gap-6">
      {SECTIONS.map((section) => (
        <RequestSection
          key={section.key}
          title={section.title}
          description={section.description}
          sessionId={sessionId}
          requests={mvpRequests.filter(
            (request) => request.status === section.key,
          )}
        />
      ))}
    </div>
  );
}
