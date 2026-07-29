import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function SearchInput({
  className,
  inputClassName,
  ...props
}: React.ComponentProps<typeof Input> & { inputClassName?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <Input className={cn("pl-9", inputClassName)} {...props} />
    </div>
  );
}

export { SearchInput };
