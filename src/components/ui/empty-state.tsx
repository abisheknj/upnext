import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function EmptyStateCard({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card variant="section" className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        {icon ? (
          <div className="bg-secondary text-muted-foreground flex size-12 items-center justify-center rounded-2xl">
            {icon}
          </div>
        ) : null}
        <div className="max-w-sm space-y-1">
          <h3 className="font-semibold tracking-tight">{title}</h3>
          {description ? (
            <p className="text-muted-foreground text-sm leading-6">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </CardContent>
    </Card>
  );
}

export { EmptyStateCard };
