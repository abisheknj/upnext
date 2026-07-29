"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

function CopyJoinLinkButton({ joinUrl }: { joinUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = new URL(joinUrl, window.location.origin).toString();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleCopy}
      aria-label="Copy public join link"
    >
      {copied ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy join link"}
    </Button>
  );
}

export { CopyJoinLinkButton };
