import { z } from "zod";

export const createSessionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Session title is required")
    .max(200, "Title is too long"),
  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional()
    .transform((value) => value || undefined),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export type SessionActionState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof CreateSessionInput, string[]>>;
};

function fieldErrorsFromZod(
  error: z.ZodError,
): SessionActionState["fieldErrors"] {
  const fieldErrors: NonNullable<SessionActionState["fieldErrors"]> = {};

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

export function parseCreateSessionFormData(
  formData: FormData,
):
  | { success: true; data: CreateSessionInput }
  | { success: false; state: SessionActionState } {
  const result = createSessionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
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
