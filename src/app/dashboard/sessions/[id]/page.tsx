import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hash, Link2, Music2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DashboardShell } from "@/features/sessions/components/dashboard-shell";
import { DashboardStats } from "@/features/sessions/components/dashboard-ui";
import { SessionControls } from "@/features/sessions/components/session-controls";
import { SessionRequestsRealtime } from "@/features/sessions/components/session-requests-realtime";
import { getProfile, requireAuth } from "@/lib/auth";
import { listSongRequestsBySession } from "@/services/requests";
import { getSessionById } from "@/services/sessions";

type SessionDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
};

export async function generateMetadata({
  params,
}: SessionDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await getSessionById(id);

  return {
    title: session?.title ?? "Session",
  };
}

export default async function SessionDetailPage({
  params,
  searchParams,
}: SessionDetailPageProps) {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) {
    notFound();
  }

  const { id } = await params;
  const { notice } = await searchParams;
  const session = await getSessionById(id);

  if (!session || session.created_by !== profile.id) {
    notFound();
  }

  const requests = await listSongRequestsBySession(id);
  const joinUrl = `/join/${session.id}`;
  const newRequests = requests.filter(
    (request) => request.status === "submitted",
  ).length;
  const acceptedRequests = requests.filter(
    (request) => request.status === "accepted",
  ).length;
  const playedRequests = requests.filter(
    (request) => request.status === "played",
  ).length;

  return (
    <DashboardShell
      title={session.title}
      description={
        session.description ??
        "Manage the public join link and keep incoming requests moving."
      }
      showBack
      action={<StatusBadge status={session.status} />}
    >
      <div className="grid gap-6">
        {notice === "already_have_session" ? (
          <p
            className="border-border bg-muted/60 text-foreground rounded-2xl border px-4 py-3 text-sm shadow-sm"
            role="status"
          >
            You already have a session.
          </p>
        ) : null}

        <Card variant="elevated">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">Session control room</CardTitle>
              {session.description ? (
                <CardDescription>{session.description}</CardDescription>
              ) : (
                <CardDescription>No description provided.</CardDescription>
              )}
            </div>
            <StatusBadge status={session.status} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="bg-secondary/50 flex gap-3 rounded-2xl p-4">
                <div className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <Hash className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Session ID
                  </p>
                  <p className="mt-1 truncate font-mono text-xs">
                    {session.id}
                  </p>
                </div>
              </div>
              <div className="bg-secondary/50 flex gap-3 rounded-2xl p-4">
                <div className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <Link2 className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Public join URL
                  </p>
                  <p className="mt-1 truncate font-mono text-xs">{joinUrl}</p>
                </div>
              </div>
            </div>
            <div className="border-border bg-background/40 rounded-2xl border border-dashed p-4">
              <div className="flex items-center gap-3">
                <div className="bg-muted flex size-10 items-center justify-center rounded-xl">
                  <Music2
                    className="text-muted-foreground size-4"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  {session.status === "live"
                    ? "Share this link with your audience so they can join and request songs."
                    : "Start the session to begin accepting song requests."}
                </p>
              </div>
            </div>
            <SessionControls session={session} joinUrl={joinUrl} />
          </CardContent>
        </Card>

        <DashboardStats
          totalRequests={requests.length}
          newRequests={newRequests}
          acceptedRequests={acceptedRequests}
          playedRequests={playedRequests}
        />

        <SessionRequestsRealtime initialRequests={requests} sessionId={id} />
      </div>
    </DashboardShell>
  );
}
