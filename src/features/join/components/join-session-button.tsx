"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { joinSessionAction } from "../actions";
import { setStoredParticipantId } from "../lib/participant-storage";

type JoinSessionButtonProps = {
  sessionId: string;
};

export function JoinSessionButton({ sessionId }: JoinSessionButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleJoin() {
    setError(null);

    startTransition(async () => {
      const result = await joinSessionAction(sessionId);

      if (result.error || !result.participantId) {
        setError(result.error ?? "Could not join session.");
        return;
      }

      setStoredParticipantId(sessionId, result.participantId);
      router.push(`/join/${sessionId}/request`);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        onClick={handleJoin}
        disabled={isPending}
        className="w-full"
        size="lg"
      >
        {isPending ? "Joining…" : "Join session"}
      </Button>
    </div>
  );
}
