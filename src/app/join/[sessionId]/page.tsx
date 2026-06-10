import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JoinSessionButton } from "@/features/join/components/join-session-button";
import { JoinShell } from "@/features/join/components/join-shell";
import { getSessionById } from "@/services/sessions";

type JoinPageProps = {
  params: Promise<{ sessionId: string }>;
};

export async function generateMetadata({
  params,
}: JoinPageProps): Promise<Metadata> {
  const { sessionId } = await params;
  const session = await getSessionById(sessionId);

  return {
    title: session ? `Join ${session.title}` : "Join session",
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { sessionId } = await params;
  const session = await getSessionById(sessionId);

  if (!session) {
    notFound();
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
          <JoinSessionButton sessionId={sessionId} />
        </CardContent>
      </Card>
    </JoinShell>
  );
}
