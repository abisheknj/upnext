import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Disc3, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyStateCard } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { DashboardShell } from "@/features/sessions/components/dashboard-shell";
import {
  DashboardHero,
  MetricCard,
} from "@/features/sessions/components/dashboard-ui";
import { getProfile, requireAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getActiveSessionByDj } from "@/services/sessions";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) {
    notFound();
  }

  const session = await getActiveSessionByDj(profile.id);

  // if (session) {
  //   redirect(`/dashboard/sessions/${session.id}`);
  // }

  return (
    <DashboardShell
      title="Here's what's happening"
      description={`Welcome back, ${profile.display_name}`}
      action={
        <Link
          href="/dashboard/sessions/new"
          className={cn(buttonVariants({ size: "lg" }))}
        >
          <Plus className="size-4" aria-hidden="true" />
          New session
        </Link>
      }
    >
      <div className="grid gap-6">
        <DashboardHero
          title={session?.title ?? "Build tonight's request queue"}
          description={
            session
              ? "Your current session is ready for crowd requests. Open it to manage the queue, share the join link, and keep the room moving."
              : "Create a polished request session for the crowd, then share the join link when you are ready to go live."
          }
          action={
            session ? (
              <Link
                href={`/dashboard/sessions/${session.id}`}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Open session
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href="/dashboard/sessions/new"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                <Plus className="size-4" aria-hidden="true" />
                Create session
              </Link>
            )
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Account"
            value={profile.display_name}
            icon={<Disc3 aria-hidden="true" />}
            hint={<span>{profile.email}</span>}
            className="md:col-span-2"
          />
          <MetricCard
            label="Current session"
            value={session ? session.status : "None"}
            hint={
              session ? (
                <StatusBadge status={session.status} />
              ) : (
                <span>Draft needed</span>
              )
            }
          />
        </div>

        {session ? (
          <Card variant="interactive">
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
              <CardDescription>
                {session.description ??
                  "No description yet. You can still share and manage this session."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <StatusBadge status={session.status} />
              <Link
                href={`/dashboard/sessions/${session.id}`}
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                Manage requests
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          <EmptyStateCard
            icon={<Disc3 className="size-5" aria-hidden="true" />}
            title="No session yet"
            description="Create your session to start accepting song requests from the crowd."
            action={
              <Link
                href="/dashboard/sessions/new"
                className={cn(buttonVariants())}
              >
                <Plus className="size-4" aria-hidden="true" />
                Create session
              </Link>
            }
          />
        )}
      </div>
    </DashboardShell>
  );
}
