import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const SECTIONS: { key: MvpRequestStatus; title: string }[] = [
  { key: "submitted", title: "New requests" },
  { key: "accepted", title: "Accepted" },
  { key: "played", title: "Played" },
  { key: "rejected", title: "Rejected" },
];

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
          <Button type="submit" size="sm">
            Accept
          </Button>
        </form>
        <form action={rejectRequestAction}>
          <input type="hidden" name="requestId" value={request.id} />
          <input type="hidden" name="sessionId" value={sessionId} />
          <Button type="submit" size="sm" variant="outline">
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
          Mark played
        </Button>
      </form>
    );
  }

  return null;
}

function RequestSection({
  title,
  requests,
  sessionId,
}: {
  title: string;
  requests: SongRequestWithParticipant[];
  sessionId: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {requests.length === 0
            ? "No requests in this section."
            : `${requests.length} request${requests.length === 1 ? "" : "s"}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nothing here yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-border text-muted-foreground border-b">
                  <th className="pb-3 pr-4 font-medium">Song</th>
                  <th className="pb-3 pr-4 font-medium">Artist</th>
                  <th className="pb-3 pr-4 font-medium">Requester</th>
                  <th className="pb-3 pr-4 font-medium">Time</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-border/60 border-b last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium">
                      {request.song_title}
                    </td>
                    <td className="text-muted-foreground py-3 pr-4">
                      {request.artist_name}
                    </td>
                    <td className="py-3 pr-4">
                      {request.participant?.nickname ?? "Unknown"}
                    </td>
                    <td className="text-muted-foreground py-3 pr-4">
                      {formatTime(request.submitted_at)}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={requestStatusVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <RequestActions
                        request={request}
                        sessionId={sessionId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
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
          sessionId={sessionId}
          requests={mvpRequests.filter(
            (request) => request.status === section.key,
          )}
        />
      ))}
    </div>
  );
}
