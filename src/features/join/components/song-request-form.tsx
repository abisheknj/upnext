"use client";

import { useRouter } from "next/navigation";
import { Music } from "lucide-react";
import { useEffect, useState } from "react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/features/auth/components/field-error";
import { FormMessage } from "@/features/auth/components/form-message";
import type { SpotifyTrack } from "@/services/spotify";

import { submitSongRequestAction } from "../actions";
import { getStoredParticipantId } from "../lib/participant-storage";
import type { SongRequestActionState } from "../validators";

const initialState: SongRequestActionState = {};
const MIN_SEARCH_QUERY_LENGTH = 2;

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
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [participantId] = useState<string | null>(() =>
    getStoredParticipantId(sessionId),
  );

  useEffect(() => {
    if (!participantId) {
      router.replace(`/join/${sessionId}`);
    }
  }, [participantId, sessionId, router]);

  useEffect(() => {
    const query = search.trim();

    if (query.length < MIN_SEARCH_QUERY_LENGTH) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await fetch(
          `/api/search-songs?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Search failed.");
        }

        const tracks = (await response.json()) as SpotifyTrack[];
        setResults(tracks);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setResults([]);
        setSearchError("Unable to search songs right now. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
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
      <input type="hidden" name="songId" value={selectedTrack?.id ?? ""} />
      <input
        type="hidden"
        name="songTitle"
        value={selectedTrack?.title ?? ""}
      />
      <input
        type="hidden"
        name="artistName"
        value={selectedTrack?.artist ?? ""}
      />
      <input
        type="hidden"
        name="artworkUrl"
        value={selectedTrack?.artworkUrl ?? ""}
      />

      <FormMessage message={state?.error} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="search">Search songs</Label>
        <Input
          id="search"
          value={search}
          onChange={(event) => {
            const value = event.target.value;
            setSearch(value);

            if (value.trim().length < MIN_SEARCH_QUERY_LENGTH) {
              setResults([]);
              setSearchError(null);
              setIsSearching(false);
            }
          }}
          placeholder="Search by title or artist"
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Search results</Label>
        {search.trim().length < MIN_SEARCH_QUERY_LENGTH ? (
          <p className="text-muted-foreground text-sm">
            Type at least 2 characters to search.
          </p>
        ) : searchError ? (
          <p className="text-destructive text-sm" role="status">
            {searchError}
          </p>
        ) : isSearching ? (
          <p className="text-muted-foreground text-sm" role="status">
            Searching Spotify…
          </p>
        ) : results.length === 0 ? (
          <p className="text-muted-foreground text-sm">No songs found.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {results.map((track) => (
              <TrackButton
                key={track.id}
                track={track}
                isSelected={selectedTrack?.id === track.id}
                disabled={disabled}
                onSelect={() => setSelectedTrack(track)}
              />
            ))}
          </div>
        )}
        <FieldError messages={state?.fieldErrors?.songId} />
      </div>

      {selectedTrack ? (
        <div className="flex flex-col gap-2">
          <Label>Selected song</Label>
          <div className="border-border bg-muted/30 ring-foreground/10 flex items-center gap-3 rounded-lg border p-3 ring-1">
            <TrackArtwork track={selectedTrack} />
            <div className="min-w-0">
              <p className="truncate font-medium">{selectedTrack.title}</p>
              <p className="text-muted-foreground truncate text-sm">
                {selectedTrack.artist}
              </p>
            </div>
          </div>
        </div>
      ) : null}

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
        disabled={disabled || !selectedTrack}
        className="w-full"
      >
        {isPending ? "Submitting…" : "Request song"}
      </Button>
    </form>
  );
}

function TrackButton({
  track,
  isSelected,
  disabled,
  onSelect,
}: {
  track: SpotifyTrack;
  isSelected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`border-border ring-foreground/10 flex items-center gap-3 rounded-lg border px-3 py-2 text-left ring-1 transition-colors ${
        isSelected ? "border-primary bg-primary/10" : "hover:bg-muted/50"
      }`}
    >
      <TrackArtwork track={track} />
      <div className="min-w-0">
        <p className="truncate font-medium">{track.title}</p>
        <p className="text-muted-foreground truncate text-sm">{track.artist}</p>
      </div>
    </button>
  );
}

function TrackArtwork({ track }: { track: SpotifyTrack }) {
  const [hasImageError, setHasImageError] = useState(false);

  if (!track.artworkUrl || hasImageError) {
    return (
      <div
        aria-hidden="true"
        className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-md"
      >
        <Music className="size-5" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={track.artworkUrl}
      alt=""
      onError={() => setHasImageError(true)}
      className="size-12 shrink-0 rounded-md object-cover"
    />
  );
}
