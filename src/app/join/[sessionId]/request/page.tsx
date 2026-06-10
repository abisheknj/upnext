import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JoinShell } from "@/features/join/components/join-shell";
import { SongRequestForm } from "@/features/join/components/song-request-form";
import { getSessionById } from "@/services/sessions";

type RequestPageProps = {
  params: Promise<{ sessionId: string }>;
};

export async function generateMetadata({
  params,
}: RequestPageProps): Promise<Metadata> {
  const { sessionId } = await params;
  const session = await getSessionById(sessionId);

  return {
    title: session ? `Request a song — ${session.title}` : "Request a song",
  };
}

export default async function RequestPage({ params }: RequestPageProps) {
  const { sessionId } = await params;
  const session = await getSessionById(sessionId);

  if (!session) {
    notFound();
  }

  const isLive = session.status === "live";

  return (
    <JoinShell title={session.title} description={session.description}>
      <Card>
        <CardHeader>
          <CardTitle>Request a song</CardTitle>
          <CardDescription>
            {isLive
              ? "Search the catalog, pick a track, and send it to the DJ."
              : "Session is not accepting requests."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SongRequestForm sessionId={sessionId} isLive={isLive} />
        </CardContent>
      </Card>
    </JoinShell>
  );
}
