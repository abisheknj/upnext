import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  Clock,
  Headphones,
  IndianRupee,
  MapPin,
  MoreVertical,
  Music2,
  Play,
  Radio,
  Search,
  Users,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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

type DashboardHomeProps = {
  djName: string;
  sessionTitle: string;
  sessionHref?: string;
  isLive: boolean;
};

const TRENDING_REQUESTS = [
  {
    rank: 1,
    title: "Believer",
    artist: "Imagine Dragons",
    votes: 127,
    artwork: "from-slate-950 via-cyan-500 to-amber-300",
  },
  {
    rank: 2,
    title: "Heat Waves",
    artist: "Glass Animals",
    votes: 102,
    artwork: "from-fuchsia-500 via-violet-500 to-pink-300",
  },
  {
    rank: 3,
    title: "Shape of You",
    artist: "Ed Sheeran",
    votes: 98,
    artwork: "from-cyan-400 via-sky-600 to-teal-950",
  },
  {
    rank: 4,
    title: "Brown Munde",
    artist: "AP Dhillon",
    votes: 91,
    artwork: "from-stone-950 via-stone-700 to-amber-500",
  },
  {
    rank: 5,
    title: "Sunflower",
    artist: "Post Malone",
    votes: 76,
    artwork: "from-black via-rose-950 to-red-500",
  },
];

const QUEUE = [
  {
    index: "01",
    title: "Believer",
    artist: "Imagine Dragons",
    requester: "Arjun",
    votes: 127,
  },
  {
    index: "02",
    title: "Heat Waves",
    artist: "Glass Animals",
    requester: "Priya",
    votes: 102,
  },
  {
    index: "03",
    title: "Shape of You",
    artist: "Ed Sheeran",
    requester: "Rohan",
    votes: 98,
  },
  {
    index: "04",
    title: "Brown Munde",
    artist: "AP Dhillon",
    requester: "Karan",
    votes: 91,
  },
];

const TOP_FANS = [
  { rank: 1, name: "Arjun", votes: 452 },
  { rank: 2, name: "Priya", votes: 381 },
  { rank: 3, name: "Rahul", votes: 340 },
];

const GENRES = [
  { name: "Bollywood", value: "42%", color: "bg-violet-500" },
  { name: "EDM", value: "28%", color: "bg-blue-500" },
  { name: "Hip Hop", value: "18%", color: "bg-fuchsia-500" },
  { name: "Punjabi", value: "12%", color: "bg-amber-400" },
];

function DashboardHome({
  djName,
  sessionTitle,
  sessionHref,
  isLive,
}: DashboardHomeProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Welcome back, {djName} <span aria-hidden="true">👋</span>
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Here&apos;s what&apos;s happening
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <IconCircle label="Search">
              <Search className="size-5" aria-hidden="true" />
            </IconCircle>
            <IconCircle label="Notifications" badge="3">
              <Bell className="size-5" aria-hidden="true" />
            </IconCircle>
            <IconCircle label="Calendar">
              <CalendarDays className="size-5" aria-hidden="true" />
            </IconCircle>
          </div>
        </div>

        <EventSpotlight
          title={sessionTitle}
          isLive={isLive}
          href={sessionHref}
        />

        <TrendingRequests />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.95fr)]">
          <CurrentQueue />
          <LiveAnalytics />
        </div>
      </div>

      <aside className="space-y-4 xl:pt-10">
        <LiveEventStatus isLive={isLive} />
        <TopFans />
        <GenreBreakdown />
        <EarningsCard />
      </aside>
    </div>
  );
}

function IconCircle({
  label,
  badge,
  children,
}: {
  label: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="hover:border-primary/40 focus-visible:border-ring focus-visible:ring-ring/40 relative flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/90 transition-all hover:bg-white/[0.07] focus-visible:ring-3 focus-visible:outline-none"
      aria-label={label}
    >
      {children}
      {badge ? (
        <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[0.7rem] font-bold">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function EventSpotlight({
  title,
  isLive,
  href,
}: {
  title: string;
  isLive: boolean;
  href?: string;
}) {
  const action = href ?? "/dashboard/sessions/new";

  return (
    <section className="shadow-elevated relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(90deg,oklch(0.11_0.02_286/0.96),oklch(0.18_0.08_292/0.76)),radial-gradient(circle_at_70%_10%,oklch(0.55_0.24_292/0.72),transparent_32%),radial-gradient(circle_at_75%_75%,oklch(0.35_0.16_260/0.85),transparent_34%),linear-gradient(135deg,oklch(0.12_0.02_286),oklch(0.08_0.02_286))] p-5 sm:p-7">
      <div className="absolute inset-0 [background-image:linear-gradient(90deg,transparent_0_8%,oklch(1_0_0/0.06)_8%_8.4%,transparent_8.4%_16%),linear-gradient(0deg,transparent_0_92%,oklch(1_0_0/0.06)_92%_93%,transparent_93%_100%)] [background-size:80px_80px] opacity-45" />
      <div className="bg-primary/25 absolute right-8 bottom-0 hidden h-52 w-52 rounded-full blur-3xl md:block" />
      <div className="relative grid min-h-64 gap-6 lg:grid-cols-[1fr_15rem] lg:items-end">
        <div className="flex flex-col justify-between gap-12">
          <div className="space-y-5">
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              Tonight&apos;s event
            </Badge>
            <div className="space-y-2">
              <h2 className="max-w-xl text-4xl leading-tight font-semibold tracking-tight text-white sm:text-5xl">
                {title}
                <span className="text-primary block">Madness</span>
              </h2>
              <p className="flex items-center gap-2 text-sm text-white/75">
                <MapPin className="size-4" aria-hidden="true" />
                Sky Lounge, Bangalore
              </p>
            </div>
          </div>

          <div className="grid max-w-md gap-3 sm:grid-cols-2">
            <HeroMetric
              icon={<Users aria-hidden="true" />}
              value="845"
              label="Guests"
            />
            <HeroMetric
              icon={<Music2 aria-hidden="true" />}
              value="247"
              label="Requests"
            />
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-24 lg:items-end">
          <Badge
            variant={isLive ? "live" : "secondary"}
            className="w-fit self-start bg-emerald-500/15 text-emerald-300 lg:self-end"
          >
            {isLive ? "Live" : "Draft"}
          </Badge>
          <Link
            href={action}
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-primary min-w-48 text-white shadow-[0_20px_45px_oklch(0.56_0.22_292/0.38)]",
            )}
          >
            <Radio className="size-4" aria-hidden="true" />
            {isLive ? "Manage Live" : "Go Live"}
          </Link>
        </div>
      </div>
    </section>
  );
}

function HeroMetric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-primary/15 text-primary flex size-11 items-center justify-center rounded-2xl">
        {icon}
      </span>
      <span>
        <span className="block text-xl font-semibold text-white">{value}</span>
        <span className="block text-sm text-white/65">{label}</span>
      </span>
    </div>
  );
}

function TrendingRequests() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          Trending Requests
        </h2>
        <button className="text-primary text-sm font-medium" type="button">
          View All
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {TRENDING_REQUESTS.map((request) => (
          <article
            key={request.rank}
            className="group shadow-card hover:border-primary/35 rounded-2xl border border-white/10 bg-white/[0.045] p-2.5 transition-all hover:-translate-y-0.5 hover:bg-white/[0.07]"
          >
            <div
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br",
                request.artwork,
              )}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,oklch(1_0_0/0.42),transparent_22%),radial-gradient(circle_at_65%_70%,oklch(0_0_0/0.55),transparent_38%)]" />
              <span className="absolute top-1.5 left-1.5 flex size-6 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                {request.rank}
              </span>
            </div>
            <div className="mt-3 min-w-0">
              <h3 className="truncate text-sm font-semibold text-white">
                {request.title}
              </h3>
              <p className="text-primary text-sm">{request.votes} Votes</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CurrentQueue() {
  return (
    <Card variant="section" className="bg-white/[0.04]">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Current Queue
          </h2>
          <button type="button" className="text-primary text-sm font-medium">
            View Full Queue
          </button>
        </div>
        <div className="space-y-1">
          <div className="text-muted-foreground grid grid-cols-[2rem_minmax(0,1fr)_7rem_4rem_1.5rem] gap-3 px-2 pb-2 text-[0.65rem] font-medium tracking-wide uppercase">
            <span>#</span>
            <span>Song</span>
            <span>Requested by</span>
            <span>Votes</span>
            <span />
          </div>
          {QUEUE.map((track) => (
            <div
              key={track.index}
              className="grid grid-cols-[2rem_minmax(0,1fr)_7rem_4rem_1.5rem] items-center gap-3 rounded-xl border-t border-white/5 px-2 py-3 text-sm"
            >
              <span className="text-muted-foreground">{track.index}</span>
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white"
                  aria-label={`Preview ${track.title}`}
                >
                  <Play className="size-4 fill-current" aria-hidden="true" />
                </button>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">
                    {track.title}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {track.artist}
                  </p>
                </div>
              </div>
              <span className="truncate text-white">{track.requester}</span>
              <span className="bg-primary rounded-lg px-2 py-1 text-center text-xs font-bold text-white">
                {track.votes}
              </span>
              <button
                type="button"
                className="text-muted-foreground hover:text-white"
                aria-label={`More actions for ${track.title}`}
              >
                <MoreVertical className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LiveAnalytics() {
  return (
    <Card variant="section" className="bg-white/[0.04]">
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          Live Analytics
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <MiniStat
            icon={<Activity />}
            label="Requests Today"
            value="247"
            delta="18%"
          />
          <MiniStat
            icon={<Users />}
            label="Active Users"
            value="845"
            delta="24%"
          />
          <MiniStat
            icon={<IndianRupee />}
            label="Revenue"
            value="₹4,850"
            delta="16%"
          />
          <MiniStat
            icon={<Music2 />}
            label="Songs Played"
            value="74"
            delta="12%"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({
  icon,
  label,
  value,
  delta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <span className="bg-primary/20 text-primary mb-5 flex size-10 items-center justify-center rounded-2xl">
        {icon}
      </span>
      <p className="text-muted-foreground text-sm">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold tracking-tight text-white">
          {value}
        </p>
        <p className="text-primary text-xs font-medium">↑ {delta}</p>
      </div>
    </div>
  );
}

function LiveEventStatus({ isLive }: { isLive: boolean }) {
  return (
    <Card variant="section" className="bg-white/[0.04]">
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Live Event Status</h2>
          <Badge variant={isLive ? "live" : "secondary"}>
            {isLive ? "Live" : "Draft"}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="grid size-20 place-items-center rounded-full bg-[radial-gradient(circle,oklch(0.6_0.24_292),oklch(0.14_0.02_286)_68%)] ring-1 ring-white/10">
            <Headphones className="size-8 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xl font-semibold text-white">Sky Lounge</p>
            <p className="text-muted-foreground">Bangalore</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <HeroMetric icon={<Users />} value="845" label="Attendees" />
          <HeroMetric icon={<Music2 />} value="247" label="Requests" />
        </div>
        <MockBars />
      </CardContent>
    </Card>
  );
}

function MockBars() {
  const bars = [
    22, 42, 30, 58, 35, 64, 44, 72, 38, 46, 62, 80, 34, 28, 44, 48, 34, 52, 42,
    36, 66, 84,
  ];

  return (
    <div className="flex h-12 items-end gap-1" aria-hidden="true">
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="from-primary w-full rounded-full bg-gradient-to-t to-blue-500"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function TopFans() {
  return (
    <Card variant="section" className="bg-white/[0.04]">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Top Fans</h2>
          <button type="button" className="text-primary text-sm font-medium">
            View All
          </button>
        </div>
        {TOP_FANS.map((fan) => (
          <div key={fan.rank} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-xl text-xs font-bold text-black",
                fan.rank === 1
                  ? "bg-amber-300"
                  : fan.rank === 2
                    ? "bg-slate-300"
                    : "bg-orange-300",
              )}
            >
              {fan.rank}
            </span>
            <div className="bg-primary/20 flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white">
              {fan.name.charAt(0)}
            </div>
            <p className="flex-1 font-semibold text-white">{fan.name}</p>
            <p className="text-primary text-sm">{fan.votes} Votes</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function GenreBreakdown() {
  return (
    <Card variant="section" className="bg-white/[0.04]">
      <CardContent className="space-y-4">
        <h2 className="font-semibold text-white">Most Requested Genres</h2>
        <div className="flex items-center gap-5">
          <div className="size-24 rounded-full bg-[conic-gradient(oklch(0.58_0.23_292)_0_42%,oklch(0.62_0.17_246)_42%_70%,oklch(0.68_0.2_335)_70%_88%,oklch(0.78_0.17_80)_88%_100%)] p-4">
            <div className="bg-card size-full rounded-full" />
          </div>
          <div className="flex-1 space-y-3">
            {GENRES.map((genre) => (
              <div key={genre.name} className="flex items-center gap-2 text-sm">
                <span className={cn("size-2.5 rounded-full", genre.color)} />
                <span className="flex-1 text-white/85">{genre.name}</span>
                <span className="text-white">{genre.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EarningsCard() {
  return (
    <Card className="border-primary/30 overflow-hidden bg-[radial-gradient(circle_at_top_right,oklch(0.62_0.23_292/0.65),transparent_35%),linear-gradient(135deg,oklch(0.32_0.14_292),oklch(0.2_0.08_286))]">
      <CardContent className="relative space-y-6">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-white">Today&apos;s Earnings</p>
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white">
            <WalletCards className="size-5" aria-hidden="true" />
          </span>
        </div>
        <div>
          <p className="text-4xl font-semibold tracking-tight text-white">
            ₹4,850
          </p>
          <p className="mt-6 text-sm text-white/75">Premium Requests</p>
          <p className="text-2xl font-semibold text-white">124</p>
        </div>
        <svg
          className="text-primary absolute right-0 bottom-0 h-32 w-52"
          viewBox="0 0 220 120"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 118C29 100 45 84 68 78C91 72 101 44 124 55C147 66 155 28 174 37C193 46 197 29 220 0"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M0 118C29 100 45 84 68 78C91 72 101 44 124 55C147 66 155 28 174 37C193 46 197 29 220 0V120H0Z"
            fill="currentColor"
            opacity="0.16"
          />
        </svg>
      </CardContent>
    </Card>
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

export {
  AudienceMetric,
  DashboardHero,
  DashboardHome,
  DashboardStats,
  MetricCard,
};
