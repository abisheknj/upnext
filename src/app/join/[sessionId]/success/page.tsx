import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
import { getSessionById } from "@/services/sessions";

type SuccessPageProps = {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ song?: string; artist?: string; requestId?: string }>;
};

export const metadata: Metadata = {
  title: "Request sent",
};

export default async function SuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { sessionId } = await params;
  const { song, artist, requestId } = await searchParams;
  const session = await getSessionById(sessionId);

  if (!session) {
    notFound();
  }

  const request = requestId ? await getRequestById(requestId, sessionId) : null;

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
            sessionId={sessionId}
            initialRequests={request ? [request] : []}
            participantId={request?.participant_id}
          />

          <Link
            href={`/join/${sessionId}/request`}
            className={cn(buttonVariants(), "w-full")}
          >
            Back to request screen
          </Link>
        </CardContent>
      </Card>
    </JoinShell>
  );
}
