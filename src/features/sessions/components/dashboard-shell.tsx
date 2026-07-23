import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  CreditCard,
  Headphones,
  LayoutDashboard,
  ListMusic,
  MapPin,
  Music2,
  Settings,
  Trophy,
  Tv,
} from "lucide-react";

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
  hideHeader?: boolean;
};

export function DashboardShell({
  title,
  description,
  children,
  showBack = false,
  action,
  hideHeader = false,
}: DashboardShellProps) {
  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    { label: "Events", href: "/dashboard/sessions/new", icon: CalendarDays },
    { label: "Live Sessions", href: "/dashboard/sessions/new", icon: Tv },
    { label: "Requests", href: "/dashboard", icon: ListMusic },
    { label: "Leaderboard", href: "/dashboard", icon: Trophy },
    { label: "Analytics", href: "/dashboard", icon: BarChart3 },
    { label: "Payments", href: "/dashboard", icon: CreditCard },
  ];

  return (
    <main className="dark text-foreground min-h-dvh bg-[#050611] p-2">
      <div className="bg-background shadow-elevated mx-auto grid min-h-[calc(100dvh-1rem)] w-full max-w-[95rem] overflow-hidden rounded-[1.75rem] border border-white/10 lg:grid-cols-[17rem_1fr]">
        <aside className="border-sidebar-border bg-sidebar/80 sticky top-0 hidden h-[calc(100dvh-1rem)] flex-col border-r p-5 lg:flex">
          <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-1">
            <span className="from-primary to-chart-2 shadow-card flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white">
              <Music2 className="size-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">DJ</span> App
            </span>
          </Link>

          <nav className="space-y-2" aria-label="Dashboard navigation">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                    item.active
                      ? "bg-primary/30 text-white shadow-[inset_0_0_0_1px_oklch(1_0_0/0.08),0_12px_28px_oklch(0.56_0.22_292/0.18)]"
                      : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-5">
            <div className="space-y-2 border-t border-white/10 pt-5">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-colors"
              >
                <Settings className="size-5" aria-hidden="true" />
                Settings
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-4">
                  <Headphones className="size-5" aria-hidden="true" />
                  Support
                </span>
                <span className="bg-primary size-2.5 rounded-full" />
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="grid size-14 place-items-center rounded-2xl bg-[radial-gradient(circle_at_35%_25%,oklch(0.72_0.18_250),oklch(0.2_0.08_292)_72%)] text-lg font-bold text-white">
                    R
                  </div>
                  <span className="border-card absolute -right-1 -bottom-1 size-4 rounded-full border-2 bg-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">DJ Rahul</p>
                  <p className="text-primary truncate text-xs">Resident DJ</p>
                  <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                    <MapPin className="size-3" aria-hidden="true" />
                    Bangalore
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <LogoutButton />
              </div>
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

          <div className="flex w-full flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-8">
            {showBack ? (
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to dashboard
              </Link>
            ) : null}
            {hideHeader ? null : (
              <PageHeader
                title={title}
                description={description}
                action={action}
              />
            )}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
