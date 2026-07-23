import * as React from "react";
import { Activity, ArrowRight, Clock, Music2, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
};

function MetricCard({ label, value, icon, hint, className }: MetricCardProps) {
  return (
    <Card variant="analytics" size="sm" className={className}>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-sm">{label}</span>
          {icon ? (
            <span className="bg-primary/15 text-primary flex size-9 items-center justify-center rounded-xl">
              {icon}
            </span>
          ) : null}
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          {hint ? (
            <div className="text-muted-foreground text-xs">{hint}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardHero({
  title,
  description,
  action,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="shadow-elevated relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,oklch(0.44_0.18_292/0.5),transparent_38%),linear-gradient(135deg,oklch(0.2_0.03_286),oklch(0.13_0.018_286))] p-6 sm:p-8">
      <div className="from-primary/20 absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <span className="bg-primary/15 text-primary inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            Tonight&apos;s session
          </span>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h2>
            <p className="max-w-xl text-sm leading-6 text-white/70 sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {action ? <div className="relative shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}

function SessionPulse({
  label,
  count,
  icon,
}: {
  label: string;
  count: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="bg-primary/15 text-primary flex size-10 items-center justify-center rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-xl font-semibold text-white">{count}</p>
        <p className="text-xs text-white/60">{label}</p>
      </div>
    </div>
  );
}

function DashboardStats({
  totalRequests,
  newRequests,
  acceptedRequests,
  playedRequests,
}: {
  totalRequests: number;
  newRequests: number;
  acceptedRequests: number;
  playedRequests: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Total requests"
        value={totalRequests}
        icon={<Music2 aria-hidden="true" />}
        hint={<span>All time</span>}
      />
      <MetricCard
        label="New requests"
        value={newRequests}
        icon={<Activity aria-hidden="true" />}
        hint={<span>Needs review</span>}
      />
      <MetricCard
        label="Accepted"
        value={acceptedRequests}
        icon={<ArrowRight aria-hidden="true" />}
        hint={<span>Ready queue</span>}
      />
      <MetricCard
        label="Played"
        value={playedRequests}
        icon={<Clock aria-hidden="true" />}
        hint={<span>Completed</span>}
      />
    </div>
  );
}

function AudienceMetric({ className }: { className?: string }) {
  return (
    <SessionPulse
      label="Audience"
      count="Live"
      icon={<Users className={cn("size-4", className)} aria-hidden="true" />}
    />
  );
}

export { AudienceMetric, DashboardHero, DashboardStats, MetricCard };
