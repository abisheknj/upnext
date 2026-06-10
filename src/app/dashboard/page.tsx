import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/features/sessions/components/dashboard-shell";
import { getProfile, requireAuth } from "@/lib/auth";
import { listSessionsByDj } from "@/services/sessions";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) {
    notFound();
  }

  const sessions = await listSessionsByDj(profile.id);

  return (
    <DashboardShell
      title="DJ Dashboard"
      description={`Welcome back, ${profile.display_name}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">Signed in as</p>
          <p className="font-medium">{profile.email}</p>
        </div>
        <Link
          href="/dashboard/sessions/new"
          className={cn(buttonVariants())}
        >
          Create session
        </Link>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Your sessions</h2>

        {sessions.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No sessions yet</CardTitle>
              <CardDescription>
                Create your first live session to start accepting song requests
                from the crowd.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/sessions/new"
                className={cn(buttonVariants())}
              >
                Create session
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle>{session.title}</CardTitle>
                    {session.description ? (
                      <CardDescription>{session.description}</CardDescription>
                    ) : null}
                  </div>
                  <Badge variant="secondary">{session.status}</Badge>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/dashboard/sessions/${session.id}`}
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    View session
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
