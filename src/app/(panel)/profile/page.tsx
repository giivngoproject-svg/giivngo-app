"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { CheckCircle2, Building2, Banknote, Clock } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { useCampaigns } from "@/stores/campaigns";
import { AuthCheck } from "@/components/AuthCheck";
import { storageApi, profileApi } from "@/lib/api";
import { formatAUD } from "@/lib/money";
import { toast } from "@/stores/toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/nav/TopNav";
import { StatusBadge } from "@/components/ui/Badge";

function ProfilePageInner() {
  const user = useAuth((s) => s.user);
  const updateUser = useAuth((s) => s.updateUser);
  const campaigns = useCampaigns((s) => s.campaigns);
  const contributions = useCampaigns((s) => s.contributions);

  const [tab, setTab] = useState<"created" | "contributed">("created");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<{
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    status?: string;
  } | null>(null);

  // Refresh profile on mount to get latest data from server
  useEffect(() => {
    const refreshProfile = async () => {
      try {
        console.log("[Profile] Refreshing profile from server");
        const profile = await profileApi.get();
        console.log("[Profile] Updated profile:", {
          stripe_account_id: profile.stripe_account_id,
          email: profile.email,
        });
        updateUser({
          name: profile.name,
          email: profile.email,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          phone: profile.phone,
          stripe_account_id: profile.stripe_account_id,
          email_verified: profile.email_verified,
          created_at: profile.created_at,
        });
      } catch (err) {
        console.error("Failed to refresh profile", err);
      }
    };

    refreshProfile();
  }, [updateUser]);

  // Fetch stripe status on mount if connected
  useEffect(() => {
    console.log("[Profile] User stripe_account_id:", user?.stripe_account_id);
    if (user?.stripe_account_id) {
      profileApi.getStripeStatus()
        .then((status) => {
          console.log("[Profile] Stripe status:", status);
          setStripeStatus(status);
        })
        .catch((err) => {
          console.error("Failed to fetch Stripe status", err);
        });
    }
  }, [user?.stripe_account_id]);

  const mine = useMemo(
    () => (user ? campaigns.filter((c) => c.user_id === user.id) : []),
    [campaigns, user],
  );
  const myContributions = useMemo(
    () => (user ? Object.values(contributions).flat().filter((c) => c.contributor_email === user?.email) : []),
    [contributions, user],
  );

  if (!user) return null;

  const handleAvatar = async (file: File) => {
    setIsUpdating(true);
    try {
      const { url } = await storageApi.uploadAvatar(file);
      updateUser({ avatar_url: url });

      // Auto-save avatar URL to backend
      await profileApi.update({
        name: user.name,
        displayName: user.display_name,
        phone: user.phone,
        avatarUrl: url,
      });

      toast.success("Avatar updated");
    } catch (error: any) {
      toast.error("Upload failed", error.response?.data?.message || "Could not upload avatar");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    try {
      await profileApi.update({
        name: user.name,
        displayName: user.display_name,
        phone: user.phone,
        avatarUrl: user.avatar_url,
      });
      toast.success("Profile saved");
    } catch (error: any) {
      toast.error("Save failed", error.response?.data?.message || "Could not save profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConnectStripe = async () => {
    setIsConnecting(true);
    try {
      const { accountLink } = await profileApi.connectStripe();
      window.location.href = accountLink;
    } catch (error: any) {
      toast.error("Setup failed", error.response?.data?.message || "Could not initiate Stripe Connect");
      setIsConnecting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your profile</h1>
        <Button onClick={handleSaveProfile} disabled={isUpdating} size="sm">
          {isUpdating ? "Saving..." : "Save changes"}
        </Button>
      </div>

      {/* Profile card */}
      <div className="rounded-3xl border border-border bg-background p-6">
        <div className="flex items-center gap-4">
          <label className="cursor-pointer relative group">
            <Avatar name={user.name} url={user.avatar_url} size={64} />
            <span className="absolute inset-0 rounded-full bg-black/40 text-white text-[10px] font-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              Change
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleAvatar(f);
                e.target.value = "";
              }}
            />
          </label>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <Input
            label="Full name"
            value={user.name}
            onChange={(e) => updateUser({ name: e.target.value })}
          />
          <Input
            label="Display name"
            value={user.display_name || ""}
            onChange={(e) => updateUser({ display_name: e.target.value })}
            hint="Shown on the public campaign pages."
          />
          <Input
            label="Email"
            type="email"
            value={user.email}
            onChange={(e) => updateUser({ email: e.target.value })}
          />
          <Input
            label="Mobile"
            type="tel"
            value={user.phone || ""}
            onChange={(e) => updateUser({ phone: e.target.value })}
          />
        </div>
      </div>

      {/* Bank account */}
      <div className="rounded-3xl border border-border bg-background p-6 mt-5">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <Banknote size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Bank account for payouts</p>

            {/* Status indicator */}
            {user.stripe_account_id ? (
              <>
                <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    ✓ Vinculado a Stripe Connect
                  </p>
                  <p className="text-xs text-blue-700 font-mono mb-2">{user.stripe_account_id}</p>
                  {stripeStatus?.chargesEnabled ? (
                    <p className="text-xs text-emerald-700 font-medium">
                      ✓ Listo para recibir pagos
                    </p>
                  ) : (
                    <p className="text-xs text-amber-700 font-medium">
                      ⏳ En proceso de verificación (puede tomar unos minutos)
                    </p>
                  )}
                </div>

                <p className="text-xs text-muted mt-3">
                  Tu cuenta está vinculada. Los fondos se depositarán en la cuenta bancaria asociada.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted mt-0.5">
                  No tienes una cuenta de Stripe vinculada. Conecta una para recibir pagos cuando tus campañas terminen.
                </p>
                <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-800">
                    ⚠️ Sin vinculación = sin recibir fondos
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Action button */}
          <div className="shrink-0">
            {user.stripe_account_id ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnectStripe}
                disabled={isConnecting}
              >
                {isConnecting ? "Updating..." : "Update account"}
              </Button>
            ) : (
              <Button
                onClick={handleConnectStripe}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Link Stripe"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="mt-8">
        <div className="border-b border-border flex">
          <TabBtn active={tab === "created"} onClick={() => setTab("created")}>
            Campaigns ({mine.length})
          </TabBtn>
          <TabBtn active={tab === "contributed"} onClick={() => setTab("contributed")}>
            Contributions ({myContributions.length})
          </TabBtn>
        </div>

        <div className="mt-5">
          {tab === "created" ? (
            mine.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">No campaigns yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {mine.map((c) => (
                  <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                    <Link
                      href={`/manage/${c.slug}`}
                      className="font-medium hover:underline truncate"
                    >
                      {c.title}
                    </Link>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm tabular-nums">{formatAUD(c.raised_amount)}</span>
                      <StatusBadge status={c.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : myContributions.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">
              No contributions yet. When you contribute with your email on a public page, it&apos;ll show here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {myContributions.map((c) => {
                const camp = campaigns.find((x) => x.id === c.campaign_id);
                return (
                  <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                    <Link
                      href={camp ? `/campaign/${camp.slug}` : "#"}
                      className="font-medium hover:underline truncate"
                    >
                      {camp?.title || "Unknown campaign"}
                    </Link>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm tabular-nums">{formatAUD(c.amount)}</span>
                      <span className="text-xs text-muted">
                        {formatDistanceToNowStrict(new Date(c.created_at))} ago
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${active ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
        }`}
    >
      {children}
    </button>
  );
}


export default function ProfilePage() {
  return (
    <AuthCheck requireAuth={true}>
      <ProfilePageInner />
    </AuthCheck>
  );
}
