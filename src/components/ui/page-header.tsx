import * as React from "react";

import { cn } from "@/lib/utils";

function PageHeader({
  title,
  description,
  eyebrow,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl space-y-2">
        {eyebrow ? (
          <p className="text-muted-foreground text-sm font-medium">{eyebrow}</p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground text-sm leading-6 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export { PageHeader, SectionHeader };
