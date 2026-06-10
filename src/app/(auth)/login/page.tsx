import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to manage your sessions and requests."
    >
      <LoginForm />
    </AuthShell>
  );
}
