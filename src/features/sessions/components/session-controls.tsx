import { Radio, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Session } from "@/lib/types/database";

import { endSessionAction, startSessionAction } from "../actions";
import { CopyJoinLinkButton } from "./copy-join-link-button";

type SessionControlsProps = {
  session: Session;
  joinUrl?: string | null;
};

export function SessionControls({ session, joinUrl }: SessionControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {session.status === "draft" ? (
        <form action={startSessionAction}>
          <input type="hidden" name="sessionId" value={session.id} />
          <Button type="submit" className="w-full sm:w-auto">
            <Radio className="size-4" aria-hidden="true" />
            Start session
          </Button>
        </form>
      ) : null}

      {session.status === "live" ? (
        <form action={endSessionAction}>
          <input type="hidden" name="sessionId" value={session.id} />
          <Button
            type="submit"
            variant="destructive"
            className="w-full sm:w-auto"
          >
            <Square className="size-4" aria-hidden="true" />
            End session
          </Button>
        </form>
      ) : null}

      {joinUrl ? <CopyJoinLinkButton joinUrl={joinUrl} /> : null}
    </div>
  );
}
