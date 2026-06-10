"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/features/auth/components/field-error";
import { FormMessage } from "@/features/auth/components/form-message";

import { createSessionAction } from "../actions";
import type { SessionActionState } from "../validators";

const initialState: SessionActionState = {};

export function CreateSessionForm() {
  const [state, formAction, isPending] = useActionState(
    createSessionAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state?.error} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Session title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Friday Night Vibes"
          required
          disabled={isPending}
          aria-invalid={!!state?.fieldErrors?.title}
        />
        <FieldError messages={state?.fieldErrors?.title} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description (optional)</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Tell the crowd what kind of night this is…"
          disabled={isPending}
          className="border-input bg-background ring-foreground/10 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 w-full rounded-lg border px-3 py-2 text-sm ring-1 outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={!!state?.fieldErrors?.description}
        />
        <FieldError messages={state?.fieldErrors?.description} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create session"}
      </Button>
    </form>
  );
}
