"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction } from "../actions";
import type { AuthActionState } from "../validators";
import { FieldError } from "./field-error";
import { FormMessage } from "./form-message";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state?.error} />

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
          autoComplete="current-password"
          required
          disabled={isPending}
          aria-invalid={!!state?.fieldErrors?.password}
        />
        <FieldError messages={state?.fieldErrors?.password} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Signing in…" : "Log in"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        No account yet?{" "}
        <Link
          href="/signup"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
