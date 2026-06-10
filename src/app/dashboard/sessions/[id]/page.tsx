import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardShell } from "@/features/sessions/components/dashboard-shell";
import { SessionRequestsTable } from "@/features/sessions/components/session-requests-table";
import { getProfile, requireAuth } from "@/lib/auth";
import { listSongRequestsBySession } from "@/services/requests";
import { getSessionById } from "@/services/sessions";

type SessionDetailPageProps = {
  params: Promise<{ id: string }>;
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
}: SessionDetailPageProps) {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) {
    notFound();
  }

  const { id } = await params;
  const session = await getSessionById(id);

  if (!session || session.created_by !== profile.id) {
    notFound();
  }

  const requests = await listSongRequestsBySession(id);
  const joinUrl = `/join/${session.id}`;

  return (
    <DashboardShell title={session.title} showBack>
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Session details</CardTitle>
              {session.description ? (
                <CardDescription>{session.description}</CardDescription>
              ) : (
                <CardDescription>No description provided.</CardDescription>
              )}
            </div>
            <Badge variant="secondary">{session.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="grid gap-3 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <dt className="text-muted-foreground">Session ID</dt>
                <dd className="font-mono text-xs break-all">{session.id}</dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <dt className="text-muted-foreground">Public join URL</dt>
                <dd className="font-mono text-xs break-all">{joinUrl}</dd>
              </div>
            </dl>
            <p className="text-muted-foreground text-sm">
              Share this link with your audience so they can join and request
              songs.
            </p>
          </CardContent>
        </Card>

        <SessionRequestsTable requests={requests} />
      </div>
    </DashboardShell>
  );
}
