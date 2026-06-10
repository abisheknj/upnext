"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signupAction } from "../actions";
import type { AuthActionState } from "../validators";
import { FieldError } from "./field-error";
import { FormMessage } from "./form-message";

const initialState: AuthActionState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state?.error} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="display_name">Display name</Label>
        <Input
          id="display_name"
          name="display_name"
          type="text"
          autoComplete="name"
          required
          disabled={isPending}
          aria-invalid={!!state?.fieldErrors?.display_name}
        />
        <FieldError messages={state?.fieldErrors?.display_name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          aria-invalid={!!state?.fieldErrors?.email}
        />
        <FieldError messages={state?.fieldErrors?.email} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
          aria-invalid={!!state?.fieldErrors?.password}
        />
        <FieldError messages={state?.fieldErrors?.password} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          required
          disabled={isPending}
          aria-invalid={!!state?.fieldErrors?.role}
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 h-8 w-full rounded-lg border bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 disabled:opacity-50"
        >
          <option value="">Select a role</option>
          <option value="dj">DJ</option>
          <option value="venue_admin">Venue admin</option>
        </select>
        <FieldError messages={state?.fieldErrors?.role} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating account…" : "Sign up"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
