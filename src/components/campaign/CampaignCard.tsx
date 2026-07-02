"use client";

import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Users } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import type { Campaign, Contribution } from "@/lib/types";
import { formatAUD } from "@/lib/money";
import { poolMode, POOL_MODE_LABELS } from "@/lib/pool";
import { Progress } from "@/components/ui/Progress";
import { StatusBadge, Badge } from "@/components/ui/Badge";

export function CampaignCard({
  campaign,
  contributions,
  href,
}: {
  campaign: Campaign;
  contributions: Contribution[];
  href: string;
}) {
  const t = useTranslation();
  const cs = contributions;
  const ending = new Date(campaign.end_date);
  const isFuture = ending.getTime() > Date.now();
  const timeLabel = isFuture
    ? `${formatDistanceToNowStrict(ending)} ${t("campaign.days_left")}`
    : `${t("campaign.ended_ago", { time: formatDistanceToNowStrict(ending) })}`;

  return (
    <Link
      href={href}
      className="group block bg-background border border-border rounded-3xl overflow-hidden shadow-soft hover:shadow-lift transition-shadow"
    >
      <div className="aspect-[16/9] bg-foreground/5 relative overflow-hidden">
        {campaign.cover_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.cover_photo_url}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-sky-200/40" />
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base truncate flex-1">{campaign.title}</h3>
          {poolMode(campaign) !== "standard" && (
            <Badge tone="accent" className="text-xs shrink-0">
              {POOL_MODE_LABELS[poolMode(campaign)]}
            </Badge>
          )}
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-xl font-semibold">{formatAUD(campaign.raised_amount)}</p>
          {campaign.goal_amount ? (
            <p className="text-sm text-muted">{t("manage.of")} {formatAUD(campaign.goal_amount)}</p>
          ) : (
            <p className="text-sm text-muted">{t("create.form.no_goal")}</p>
          )}
        </div>

        <Progress
          value={campaign.raised_amount}
          max={campaign.goal_amount || campaign.raised_amount}
          className="mt-2"
        />

        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Users size={12} />
            {cs.length} {t("campaign.contributors")}
          </span>
          <span>{timeLabel}</span>
        </div>
      </div>
    </Link>
  );
}
