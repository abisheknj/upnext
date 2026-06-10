import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardShell } from "@/features/sessions/components/dashboard-shell";
import { getProfile, requireAuth } from "@/lib/auth";
import { getSessionByDj } from "@/services/sessions";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) {
    notFound();
  }

  const session = await getSessionByDj(profile.id);

  if (session) {
    redirect(`/dashboard/sessions/${session.id}`);
  }

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>No session yet</CardTitle>
          <CardDescription>
            Create your session to start accepting song requests from the
            crowd.
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
    </DashboardShell>
  );
}
