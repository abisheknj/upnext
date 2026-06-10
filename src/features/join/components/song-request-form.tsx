"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/features/auth/components/field-error";
import { FormMessage } from "@/features/auth/components/form-message";

import { submitSongRequestAction } from "../actions";
import { MOCK_SONGS } from "../data/mock-songs";
import { getStoredParticipantId } from "../lib/participant-storage";
import type { SongRequestActionState } from "../validators";

const initialState: SongRequestActionState = {};

type SongRequestFormProps = {
  sessionId: string;
  isLive: boolean;
};

export function SongRequestForm({ sessionId, isLive }: SongRequestFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    submitSongRequestAction,
    initialState,
  );
  const [search, setSearch] = useState("");
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = getStoredParticipantId(sessionId);
    if (!storedId) {
      router.replace(`/join/${sessionId}`);
      return;
    }
    setParticipantId(storedId);
  }, [sessionId, router]);

  const filteredSongs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MOCK_SONGS;

    return MOCK_SONGS.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query),
    );
  }, [search]);

  if (!participantId) {
    return (
      <p className="text-muted-foreground text-sm">Loading your session…</p>
    );
  }

  if (!isLive) {
    return (
      <p className="text-muted-foreground text-sm" role="status">
        Session is not accepting requests.
      </p>
    );
  }

  const disabled = isPending || !isLive;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="sessionId" value={sessionId} />
      <input type="hidden" name="participantId" value={participantId} />
      <input type="hidden" name="songId" value={selectedSongId ?? ""} />

      <FormMessage message={state?.error} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="search">Search songs</Label>
        <Input
          id="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title or artist"
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Select a song</Label>
        <div className="flex flex-col gap-2">
          {filteredSongs.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No songs match your search.
            </p>
          ) : (
            filteredSongs.map((song) => {
              const isSelected = selectedSongId === song.id;

              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => setSelectedSongId(song.id)}
                  disabled={disabled}
                  className={`border-border ring-foreground/10 rounded-lg border px-4 py-3 text-left ring-1 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <p className="font-medium">{song.title}</p>
                  <p className="text-muted-foreground text-sm">{song.artist}</p>
                </button>
              );
            })
          )}
        </div>
        <FieldError messages={state?.fieldErrors?.songId} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message (optional)</Label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Shout-out or dedication…"
          disabled={disabled}
          className="border-input bg-background ring-foreground/10 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 w-full rounded-lg border px-3 py-2 text-sm ring-1 outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={!!state?.fieldErrors?.message}
        />
        <FieldError messages={state?.fieldErrors?.message} />
      </div>

      <Button
        type="submit"
        disabled={disabled || !selectedSongId}
        className="w-full"
      >
        {isPending ? "Submitting…" : "Request song"}
      </Button>
    </form>
  );
}
