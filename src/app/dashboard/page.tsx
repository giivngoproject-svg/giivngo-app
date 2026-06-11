"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { useCampaigns } from "@/stores/campaigns";
import { AuthCheck } from "@/components/AuthCheck";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CampaignCard } from "@/components/campaign/CampaignCard";

function DashboardInner() {
  const user = useAuth((s) => s.user);
  const campaigns = useCampaigns((s) => s.campaigns);
  const contributions = useCampaigns((s) => s.contributions);
  const isLoading = useCampaigns((s) => s.isLoading);
  const loadCampaigns = useCampaigns((s) => s.loadCampaigns);

  useEffect(() => {
    loadCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return null;

  const mine = campaigns.filter((c) => c.user_id === user.id);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted">Hi {user.display_name || user.name.split(" ")[0]} 👋</p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">Your campaigns</h1>
        </div>
        <Link href="/create">
          <Button size="lg" disabled={isLoading}>
            <Plus size={16} />
            Create campaign
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted">Loading your campaigns...</p>
        </div>
      ) : mine.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={32} />}
          title="No campaigns yet"
          description="Start your first one and share the link with your group. Birthday trip, footy tipping, farewell — anything goes."
          action={
            <Link href="/create">
              <Button size="lg">Create your first campaign</Button>
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

export default function DashboardPage() {
  return (
    <AuthCheck requireAuth={true}>
      <DashboardInner />
    </AuthCheck>
  );
}
