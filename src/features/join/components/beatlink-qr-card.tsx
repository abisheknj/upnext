import { Download, Link2, QrCode } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyJoinLinkButton } from "@/features/sessions/components/copy-join-link-button";
import { cn } from "@/lib/utils";
import { getQrImageUrl } from "@/lib/public-join";

type BeatLinkQrCardProps = {
  publicJoinUrl: string;
  title?: string;
  description?: string;
};

export function BeatLinkQrCard({
  publicJoinUrl,
  title = "Your BeatLink QR",
  description = "This permanent QR resolves to your currently live session automatically.",
}: BeatLinkQrCardProps) {
  const qrUrl = getQrImageUrl(publicJoinUrl);

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="bg-primary/15 text-primary mb-2 flex size-12 items-center justify-center rounded-2xl">
          <QrCode className="size-5" aria-hidden="true" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[18rem_1fr] lg:items-center">
        <div className="border-border shadow-card rounded-3xl border bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="Permanent BeatLink QR code"
            className="aspect-square w-full rounded-2xl"
          />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="border-border bg-secondary/40 rounded-2xl border p-4">
            <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
              <Link2 className="size-3.5" aria-hidden="true" />
              Public Link
            </p>
            <p className="mt-2 font-mono text-sm break-all">{publicJoinUrl}</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <CopyJoinLinkButton joinUrl={publicJoinUrl} />
            <a
              href={qrUrl}
              target="_blank"
              download="beatlink-qr.svg"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Download className="size-4" aria-hidden="true" />
              Download QR
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
