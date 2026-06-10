import { z } from "zod";

import type { AppUserRole } from "@/lib/types/database";

export const signupSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(100, "Display name is too long"),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  role: z.enum(["dj", "venue_admin"] satisfies [AppUserRole, AppUserRole], {
    message: "Select a valid role",
  }),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type AuthActionState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof SignupInput | keyof LoginInput, string[]>>;
};

function fieldErrorsFromZod(error: z.ZodError): AuthActionState["fieldErrors"] {
  const fieldErrors: NonNullable<AuthActionState["fieldErrors"]> = {};

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

export function parseSignupFormData(
  formData: FormData,
):
  | { success: true; data: SignupInput }
  | { success: false; state: AuthActionState } {
  const result = signupSchema.safeParse({
    display_name: formData.get("display_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
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

export function parseLoginFormData(
  formData: FormData,
):
  | { success: true; data: LoginInput }
  | { success: false; state: AuthActionState } {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
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
