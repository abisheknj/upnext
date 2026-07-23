"use client";

import { useRouter } from "next/navigation";
import { Music } from "lucide-react";
import { useEffect, useState } from "react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const [isResultsOpen, setIsResultsOpen] = useState(false);
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
        setIsResultsOpen(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setResults([]);
        setIsResultsOpen(true);
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

      <div className="relative flex flex-col gap-2">
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
              setIsResultsOpen(false);
            } else {
              setIsResultsOpen(true);
            }
          }}
          onFocus={() => {
            if (search.trim().length >= MIN_SEARCH_QUERY_LENGTH) {
              setIsResultsOpen(true);
            }
          }}
          placeholder="Search by title or artist"
          disabled={disabled}
          autoComplete="off"
          aria-expanded={isResultsOpen}
          aria-controls="song-search-results"
        />

        {search.trim().length < MIN_SEARCH_QUERY_LENGTH ? (
          <p className="text-muted-foreground text-sm">
            Type at least 2 characters to search.
          </p>
        ) : null}

        {isResultsOpen && search.trim().length >= MIN_SEARCH_QUERY_LENGTH ? (
          <div
            id="song-search-results"
            className="border-border/80 bg-popover/95 text-popover-foreground shadow-elevated absolute top-[calc(100%+0.5rem)] right-0 left-0 z-30 overflow-hidden rounded-2xl border backdrop-blur"
          >
            <div className="border-border/70 flex items-center justify-between border-b px-3 py-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Search results
              </p>
              {results.length > 0 ? (
                <p className="text-muted-foreground text-xs">
                  {results.length} songs
                </p>
              ) : null}
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {searchError ? (
                <p className="text-destructive px-3 py-4 text-sm" role="status">
                  {searchError}
                </p>
              ) : isSearching ? (
                <div className="space-y-2 px-1 py-1" role="status">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-xl px-2 py-2"
                    >
                      <div className="bg-muted size-12 animate-pulse rounded-xl" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="bg-muted h-3 w-2/3 animate-pulse rounded-full" />
                        <div className="bg-muted h-3 w-1/2 animate-pulse rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <p className="text-muted-foreground px-3 py-4 text-sm">
                  No songs found.
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {results.map((track) => (
                    <TrackButton
                      key={track.id}
                      track={track}
                      isSelected={selectedTrack?.id === track.id}
                      disabled={disabled}
                      onSelect={() => {
                        setSelectedTrack(track);
                        setIsResultsOpen(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

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
        <Textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Shout-out or dedication…"
          disabled={disabled}
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
      className={`focus-visible:ring-ring/40 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all focus-visible:ring-3 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        isSelected
          ? "bg-primary/15 text-foreground ring-primary/35 ring-1"
          : "hover:bg-muted/70"
      }`}
    >
      <TrackArtwork track={track} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{track.title}</p>
        <p className="text-muted-foreground truncate text-sm">{track.artist}</p>
      </div>
      {isSelected ? (
        <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-semibold">
          Selected
        </span>
      ) : null}
    </button>
  );
}

function TrackArtwork({ track }: { track: SpotifyTrack }) {
  const [hasImageError, setHasImageError] = useState(false);

  if (!track.artworkUrl || hasImageError) {
    return (
      <div
        aria-hidden="true"
        className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-xl"
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
      className="size-12 shrink-0 rounded-xl object-cover"
    />
  );
}
