import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Music2, Plus, Radio } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  showBack?: boolean;
  action?: React.ReactNode;
};

export function DashboardShell({
  title,
  description,
  children,
  showBack = false,
  action,
}: DashboardShellProps) {
  return (
    <main className="dark bg-background text-foreground min-h-dvh">
      <div className="mx-auto grid min-h-dvh w-full max-w-7xl lg:grid-cols-[17rem_1fr]">
        <aside className="border-sidebar-border bg-sidebar/80 sticky top-0 hidden h-dvh flex-col border-r p-5 lg:flex">
          <Link href="/dashboard" className="mb-8 flex items-center gap-3">
            <span className="from-primary to-chart-2 shadow-card flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br text-white">
              <Music2 className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">DJ App</span>
          </Link>

          <nav className="space-y-2" aria-label="Dashboard navigation">
            <Link
              href="/dashboard"
              className="bg-sidebar-accent text-sidebar-accent-foreground flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium shadow-sm"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/sessions/new"
              className="text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <Plus className="size-4" aria-hidden="true" />
              Create Session
            </Link>
            <div className="text-muted-foreground flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium">
              <Radio className="size-4" aria-hidden="true" />
              Live Requests
            </div>
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm font-semibold">Resident DJ</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Manage sessions and requests.
            </p>
            <div className="mt-4">
              <LogoutButton />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="border-border/70 bg-background/90 sticky top-0 z-20 flex items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur lg:hidden">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <span className="bg-primary flex size-8 items-center justify-center rounded-xl text-white">
                <Music2 className="size-4" aria-hidden="true" />
              </span>
              DJ App
            </Link>
            <LogoutButton />
          </header>

          <div className="flex w-full flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {showBack ? (
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to dashboard
              </Link>
            ) : null}
            <PageHeader
              title={title}
              description={description}
              action={action}
            />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
