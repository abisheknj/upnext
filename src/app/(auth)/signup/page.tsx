import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignupPage() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <AuthShell
      title="Create your account"
      description="Join upNext as a DJ or venue admin."
    >
      <SignupForm />
    </AuthShell>
  );
}
