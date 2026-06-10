import { z } from "zod";

import { MOCK_SONGS } from "./data/mock-songs";

const mockSongIds = MOCK_SONGS.map((song) => song.id) as [string, ...string[]];

export const joinSessionSchema = z.object({
  sessionId: z.uuid("Invalid session"),
});

export const songRequestSchema = z.object({
  sessionId: z.uuid("Invalid session"),
  participantId: z.uuid("Invalid participant"),
  songId: z.enum(mockSongIds, { message: "Select a valid song" }),
  message: z
    .string()
    .trim()
    .max(500, "Message is too long")
    .optional()
    .transform((value) => value || undefined),
});

export type SongRequestInput = z.infer<typeof songRequestSchema>;

export type JoinActionState = {
  error?: string;
  participantId?: string;
};

export type SongRequestActionState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof SongRequestInput, string[]>>;
};

function fieldErrorsFromZod(
  error: z.ZodError,
): SongRequestActionState["fieldErrors"] {
  const fieldErrors: NonNullable<SongRequestActionState["fieldErrors"]> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      const existing = fieldErrors[key as keyof typeof fieldErrors] ?? [];
      fieldErrors[key as keyof typeof fieldErrors] = [
        ...existing,
        issue.message,
      ];
    }
  }

  return fieldErrors;
}

export function parseSongRequestFormData(
  formData: FormData,
):
  | { success: true; data: SongRequestInput }
  | { success: false; state: SongRequestActionState } {
  const result = songRequestSchema.safeParse({
    sessionId: formData.get("sessionId"),
    participantId: formData.get("participantId"),
    songId: formData.get("songId"),
    message: formData.get("message") ?? undefined,
  });

  if (!result.success) {
    return {
      success: false,
      state: {
        error: "Please fix the errors below.",
        fieldErrors: fieldErrorsFromZod(result.error),
      },
    };
  }

  return { success: true, data: result.data };
}
