import type { Metadata } from "next";
import { Radio } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AudienceRequestStatusList } from "@/features/join/components/audience-request-status-list";
import { JoinShell } from "@/features/join/components/join-shell";
import { SongRequestForm } from "@/features/join/components/song-request-form";
import { getActiveSessionByPublicJoinId } from "@/services/sessions";
import { getUserByPublicJoinId } from "@/services/users";

type RequestPageProps = {
  params: Promise<{ publicJoinId: string }>;
};

export async function generateMetadata({
  params,
}: RequestPageProps): Promise<Metadata> {
  const { publicJoinId } = await params;
  const user = await getUserByPublicJoinId(publicJoinId);
  const session = await getActiveSessionByPublicJoinId(publicJoinId);

  return {
    title: session
      ? `Request a song — ${session.title}`
      : user
        ? `${user.display_name} is offline`
        : "DJ is offline",
  };
}

export default async function RequestPage({ params }: RequestPageProps) {
  const { publicJoinId } = await params;
  const user = await getUserByPublicJoinId(publicJoinId);
  const session = await getActiveSessionByPublicJoinId(publicJoinId);

  if (!user || !session) {
    return <OfflineRequestPage djName={user?.display_name} />;
  }

  return (
    <JoinShell title={session.title} description={session.description}>
      <Card>
        <CardHeader>
          <CardTitle>Request a song</CardTitle>
          <CardDescription>
            Search the catalog, pick a track, and send it to the DJ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SongRequestForm publicJoinId={publicJoinId} isLive />
          <AudienceRequestStatusList publicJoinId={publicJoinId} />
        </CardContent>
      </Card>
    </JoinShell>
  );
}

function OfflineRequestPage({ djName }: { djName?: string }) {
  return (
    <JoinShell
      title={
        djName ? `${djName} isn't live right now.` : "DJ isn't live right now."
      }
      description="No active event is currently running. Please check back later."
    >
      <Card variant="elevated">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="bg-primary/15 text-primary flex size-14 items-center justify-center rounded-3xl">
            <Radio className="size-6" aria-hidden="true" />
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-6">
            The permanent BeatLink is still valid. Requests reopen automatically
            when the DJ starts the next live session.
          </p>
        </CardContent>
      </Card>
    </JoinShell>
  );
}
