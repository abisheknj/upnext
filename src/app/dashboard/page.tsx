import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardShell } from "@/features/sessions/components/dashboard-shell";
import { DashboardHome } from "@/features/sessions/components/dashboard-ui";
import { getProfile, requireAuth } from "@/lib/auth";
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
      hideHeader
    >
      <DashboardHome
        djName={profile.display_name}
        sessionTitle={session?.title ?? "Saturday Night"}
        sessionHref={session ? `/dashboard/sessions/${session.id}` : undefined}
        isLive={session?.status === "live"}
      />
    </DashboardShell>
  );
}
