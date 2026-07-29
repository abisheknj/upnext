import { Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { RequestStatus, SessionStatus } from "@/lib/types/database";

type AppStatus = RequestStatus | SessionStatus;

function getStatusVariant(status: AppStatus) {
  switch (status) {
    case "live":
    case "accepted":
    case "played":
      return "success" as const;
    case "submitted":
    case "draft":
    case "scheduled":
    case "paused":
      return "secondary" as const;
    case "rejected":
    case "expired":
    case "ended":
      return "muted" as const;
    case "playing":
      return "live" as const;
    default:
      return "outline" as const;
  }
}

function StatusBadge({ status }: { status: AppStatus }) {
  return (
    <Badge variant={getStatusVariant(status)}>
      <Circle className="size-1.5 fill-current" aria-hidden="true" />
      {status}
    </Badge>
  );
}

export { StatusBadge, getStatusVariant };
