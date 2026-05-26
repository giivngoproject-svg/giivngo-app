import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";
import type { CampaignStatus } from "@/lib/types";

type Tone = "neutral" | "success" | "warning" | "info" | "accent";

const tones: Record<Tone, string> = {
  neutral: "bg-foreground/5 text-foreground",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-800",
  info: "bg-sky-100 text-sky-700",
  accent: "bg-accent/10 text-accent",
};

export function Badge({
  tone = "neutral",
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}

export function StatusBadge({ status }: { status: CampaignStatus }) {
  if (status === "active") return <Badge tone="success">Active</Badge>;
  if (status === "ended") return <Badge tone="warning">Ended · awaiting payout</Badge>;
  return <Badge tone="info">Paid out</Badge>;
}
