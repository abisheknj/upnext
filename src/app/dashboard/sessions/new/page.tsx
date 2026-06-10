import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateSessionForm } from "@/features/sessions/components/create-session-form";
import { DashboardShell } from "@/features/sessions/components/dashboard-shell";
import { getProfile, requireAuth } from "@/lib/auth";
import { getSessionByDj } from "@/services/sessions";

export const metadata: Metadata = {
  title: "Create session",
};

export default async function NewSessionPage() {
  await requireAuth();
  const profile = await getProfile();

  if (profile) {
    const existing = await getSessionByDj(profile.id);
    if (existing) {
      redirect(
        `/dashboard/sessions/${existing.id}?notice=already_have_session`,
      );
    }
  }

  return (
    <DashboardShell
      title="Create session"
      description="Set up your session. It starts as a draft until you go live."
      showBack
    >
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Session details</CardTitle>
          <CardDescription>
            Sessions are created as drafts. Start the session when you are ready
            to accept requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateSessionForm />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
