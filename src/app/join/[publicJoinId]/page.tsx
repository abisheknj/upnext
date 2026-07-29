import type { Metadata } from "next";
import { Radio } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JoinSessionButton } from "@/features/join/components/join-session-button";
import { JoinShell } from "@/features/join/components/join-shell";
import { getActiveSessionByPublicJoinId } from "@/services/sessions";
import { getUserByPublicJoinId } from "@/services/users";

type JoinPageProps = {
  params: Promise<{ publicJoinId: string }>;
};

export async function generateMetadata({
  params,
}: JoinPageProps): Promise<Metadata> {
  const { publicJoinId } = await params;
  const user = await getUserByPublicJoinId(publicJoinId);
  const session = await getActiveSessionByPublicJoinId(publicJoinId);

  return {
    title: session
      ? `Join ${session.title}`
      : user
        ? `${user.display_name} is offline`
        : "DJ is offline",
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { publicJoinId } = await params;
  const user = await getUserByPublicJoinId(publicJoinId);
  const session = await getActiveSessionByPublicJoinId(publicJoinId);

  if (!user || !session) {
    return <OfflineJoinPage djName={user?.display_name} />;
  }

  return (
    <JoinShell title={session.title} description={session.description}>
      <Card>
        <CardHeader>
          <CardTitle>Ready to request a song?</CardTitle>
          <CardDescription>
            Join this session to browse songs and send your request to the DJ.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JoinSessionButton publicJoinId={publicJoinId} />
        </CardContent>
      </Card>
    </JoinShell>
  );
}

function OfflineJoinPage({ djName }: { djName?: string }) {
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
          <div className="max-w-sm space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              No active event
            </h2>
            <p className="text-muted-foreground text-sm leading-6">
              This BeatLink is permanent. Once the DJ starts a live session, the
              same link and QR code will open the request flow.
            </p>
          </div>
        </CardContent>
      </Card>
    </JoinShell>
  );
}
