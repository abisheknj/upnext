import Link from "next/link";

import { LogoutButton } from "@/features/auth/components/logout-button";
type DashboardShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  showBack?: boolean;
};

export function DashboardShell({
  title,
  description,
  children,
  showBack = false,
}: DashboardShellProps) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-8 px-4 py-12">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {showBack ? (
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground mb-2 inline-flex text-sm transition-colors"
            >
              ← Back to dashboard
            </Link>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
        <LogoutButton />
      </div>
      {children}
    </main>
  );
}
