import type { Metadata } from "next";
import Link from "next/link";
import { Radio } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AudienceRequestStatusList } from "@/features/join/components/audience-request-status-list";
import { JoinShell } from "@/features/join/components/join-shell";
import { cn } from "@/lib/utils";
import { getRequestById } from "@/services/requests";
import { getActiveSessionByPublicJoinId } from "@/services/sessions";
import { getUserByPublicJoinId } from "@/services/users";

type SuccessPageProps = {
  params: Promise<{ publicJoinId: string }>;
  searchParams: Promise<{ song?: string; artist?: string; requestId?: string }>;
};

export const metadata: Metadata = {
  title: "Request sent",
};

export default async function SuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { publicJoinId } = await params;
  const { song, artist, requestId } = await searchParams;
  const user = await getUserByPublicJoinId(publicJoinId);
  const session = await getActiveSessionByPublicJoinId(publicJoinId);

  if (!user || !session) {
    return <OfflineSuccessPage djName={user?.display_name} />;
  }

  const request = requestId
    ? await getRequestById(requestId, session.id)
    : null;

  return (
    <JoinShell title={session.title} description={session.description}>
      <Card>
        <CardHeader>
          <CardTitle>Request sent successfully</CardTitle>
          <CardDescription>
            Your song request has been submitted to the DJ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {song ? (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-muted-foreground text-sm">Song requested</p>
              <p className="font-medium">{song}</p>
              {artist ? (
                <p className="text-muted-foreground text-sm">{artist}</p>
              ) : null}
            </div>
          ) : null}

          <AudienceRequestStatusList
            publicJoinId={publicJoinId}
            initialRequests={request ? [request] : []}
            participantId={request?.participant_id}
          />

          <Link
            href={`/join/${publicJoinId}/request`}
            className={cn(buttonVariants(), "w-full")}
          >
            Back to request screen
          </Link>
        </CardContent>
      </Card>
    </JoinShell>
  );
}

function OfflineSuccessPage({ djName }: { djName?: string }) {
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
            The request page will become available again when the DJ starts the
            next live event.
          </p>
        </CardContent>
      </Card>
    </JoinShell>
  );
}
