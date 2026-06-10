import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateSessionForm } from "@/features/sessions/components/create-session-form";
import { DashboardShell } from "@/features/sessions/components/dashboard-shell";
import { requireAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create session",
};

export default async function NewSessionPage() {
  await requireAuth();

  return (
    <DashboardShell
      title="Create session"
      description="Start a new live session for your audience."
      showBack
    >
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Session details</CardTitle>
          <CardDescription>
            Sessions are created as live immediately so guests can join right
            away.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateSessionForm />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
