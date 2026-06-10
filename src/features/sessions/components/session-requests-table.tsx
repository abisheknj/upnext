import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RequestStatus, SongRequestWithParticipant } from "@/lib/types/database";

type SessionRequestsTableProps = {
  requests: SongRequestWithParticipant[];
};

function requestStatusVariant(
  status: RequestStatus,
): "default" | "secondary" | "outline" | "success" | "warning" | "muted" {
  switch (status) {
    case "submitted":
      return "secondary";
    case "accepted":
    case "playing":
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

export function SessionRequestsTable({
  requests,
}: SessionRequestsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Song requests</CardTitle>
        <CardDescription>
          {requests.length === 0
            ? "No requests yet. Share the join link with your audience."
            : `${requests.length} request${requests.length === 1 ? "" : "s"}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-muted-foreground text-sm">Waiting for requests…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-border text-muted-foreground border-b">
                  <th className="pb-3 pr-4 font-medium">Song</th>
                  <th className="pb-3 pr-4 font-medium">Artist</th>
                  <th className="pb-3 pr-4 font-medium">Requester</th>
                  <th className="pb-3 pr-4 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
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
                    <td className="py-3">
                      <Badge variant={requestStatusVariant(request.status)}>
                        {request.status}
                      </Badge>
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
