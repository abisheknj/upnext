import { z } from "zod";

export const joinSessionSchema = z.object({
  publicJoinId: z.string().regex(/^bt_[A-Z2-9]{6}$/, "Invalid join link"),
});

export const songRequestSchema = z.object({
  publicJoinId: z.string().regex(/^bt_[A-Z2-9]{6}$/, "Invalid join link"),
  participantId: z.uuid("Invalid participant"),
  songId: z.string().trim().min(1, "Select a valid song").max(128),
  songTitle: z.string().trim().min(1, "Select a valid song").max(300),
  artistName: z.string().trim().min(1, "Select a valid song").max(300),
  artworkUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
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
    publicJoinId: formData.get("publicJoinId"),
    participantId: formData.get("participantId"),
    songId: formData.get("songId"),
    songTitle: formData.get("songTitle"),
    artistName: formData.get("artistName"),
    artworkUrl: formData.get("artworkUrl") ?? undefined,
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
