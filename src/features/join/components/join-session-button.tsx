"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { joinSessionAction } from "../actions";
import { setStoredParticipantId } from "../lib/participant-storage";

type JoinSessionButtonProps = {
  publicJoinId: string;
};

export function JoinSessionButton({ publicJoinId }: JoinSessionButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleJoin() {
    setError(null);

    startTransition(async () => {
      const result = await joinSessionAction(publicJoinId);

      if (result.error || !result.participantId) {
        setError(result.error ?? "Could not join session.");
        return;
      }

      setStoredParticipantId(publicJoinId, result.participantId);
      router.push(`/join/${publicJoinId}/request`);
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
