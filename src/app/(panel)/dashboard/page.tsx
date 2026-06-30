"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { useCampaigns } from "@/stores/campaigns";
import { useTranslation } from "@/lib/useTranslation";
import { AuthCheck } from "@/components/AuthCheck";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

function DashboardInner() {
  const t = useTranslation();
  const user = useAuth((s) => s.user);
  const campaigns = useCampaigns((s) => s.campaigns);
  const contributions = useCampaigns((s) => s.contributions);
  const isLoading = useCampaigns((s) => s.isLoading);
  const loadCampaigns = useCampaigns((s) => s.loadCampaigns);
  const loadContributions = useCampaigns((s) => s.loadContributions);

  useEffect(() => {
    const fetchData = async () => {
      await loadCampaigns();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mine = campaigns.filter((c) => c.user_id === user?.id);

  useEffect(() => {
    mine.forEach((c) => {
      loadContributions(c.slug);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mine.length]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted">
            {t("dashboard.subtitle", {
              name: user.display_name || user.name.split(" ")[0],
            })}
          </p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">
            {t("dashboard.title")}
          </h1>
        </div>
        <Link href="/create">
          <Button size="lg">
            <Plus size={16} />
            {t("nav.create")}
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-border bg-background overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : mine.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={32} />}
          title={t("dashboard.empty.title")}
          description={t("dashboard.empty.description")}
          action={
            <Link href="/create">
              <Button size="lg">{t("dashboard.create_first")}</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mine.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              contributions={contributions[c.slug] || []}
              href={`/manage/${c.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div className="flex-1">
          <Skeleton className="h-5 w-48 mb-3" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-12 w-40 shrink-0" />
      </div>

      {/* Campaign cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-border bg-background overflow-hidden">
            {/* Image placeholder */}
            <Skeleton className="h-40 w-full" />

            {/* Content */}
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthCheck requireAuth={true}>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardInner />
      </Suspense>
    </AuthCheck>
  );
}
