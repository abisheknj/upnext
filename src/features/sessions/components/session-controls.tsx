import { Button } from "@/components/ui/button";
import type { Session } from "@/lib/types/database";

import {
  endSessionAction,
  startSessionAction,
} from "../actions";

type SessionControlsProps = {
  session: Session;
};

export function SessionControls({ session }: SessionControlsProps) {
  if (session.status === "draft") {
    return (
      <form action={startSessionAction}>
        <input type="hidden" name="sessionId" value={session.id} />
        <Button type="submit">Start session</Button>
      </form>
    );
  }

  if (session.status === "live") {
    return (
      <form action={endSessionAction}>
        <input type="hidden" name="sessionId" value={session.id} />
        <Button type="submit" variant="destructive">
          End session
        </Button>
      </form>
    );
  }

  return null;
}
