import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize tracking-tight transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground border-border",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
        warning:
          "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-300",
        danger:
          "border-transparent bg-rose-500/15 text-rose-700 dark:text-rose-300",
        live: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
        muted: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
