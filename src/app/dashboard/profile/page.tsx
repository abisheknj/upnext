import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BeatLinkQrCard } from "@/features/join/components/beatlink-qr-card";
import { DashboardShell } from "@/features/sessions/components/dashboard-shell";
import { getProfile, requireAuth } from "@/lib/auth";
import { getPublicJoinUrl } from "@/lib/public-join";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) {
    notFound();
  }

  const publicJoinUrl = profile.public_join_id
    ? await getPublicJoinUrl(profile.public_join_id)
    : null;

  return (
    <DashboardShell
      title="DJ Profile"
      description="Manage the public BeatLink your audience scans at every event."
      showBack
    >
      {publicJoinUrl ? (
        <BeatLinkQrCard publicJoinUrl={publicJoinUrl} />
      ) : (
        <Card variant="section">
          <CardHeader>
            <CardTitle>BeatLink QR unavailable</CardTitle>
            <CardDescription>
              Run the latest Supabase migration to add permanent public join IDs
              to DJ profiles.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </DashboardShell>
  );
}
