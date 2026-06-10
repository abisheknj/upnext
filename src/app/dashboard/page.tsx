import type { Metadata } from "next";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { getProfile, requireAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await requireAuth();
  const profile = await getProfile();

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            MVP placeholder — auth is wired and session is active.
          </p>
        </div>
        <LogoutButton />
      </div>

      <section className="border-border bg-card ring-foreground/10 rounded-xl border p-6 ring-1">
        <h2 className="text-muted-foreground mb-4 text-sm font-medium">
          Your account
        </h2>
        <dl className="grid gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{profile?.email ?? user.email}</dd>
          </div>
          {profile ? (
            <>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Display name</dt>
                <dd className="font-medium">{profile.display_name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium capitalize">
                  {profile.role.replace("_", " ")}
                </dd>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              Profile record not found. Complete onboarding or contact support.
            </p>
          )}
        </dl>
      </section>
    </main>
  );
}
