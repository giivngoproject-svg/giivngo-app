"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const EMPTY_CONTRIBUTIONS: any[] = [];
import {
  Banknote,
  Calendar,
  Users,
  TrendingUp,
  ExternalLink,
  Pencil,
  XCircle,
  CalendarPlus,
  Wallet,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { useAuth } from "@/stores/auth";
import { AuthCheck } from "@/components/AuthCheck";
import { useCampaigns } from "@/stores/campaigns";
import { formatAUD, calcFee } from "@/lib/money";
import { poolMode, tipTotal, POOL_MODE_LABELS } from "@/lib/pool";
import { toast } from "@/stores/toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { InvitePanel } from "@/components/campaign/InvitePanel";
import { HighlightReel } from "@/components/campaign/HighlightReel";
import { ItemEditor } from "@/components/wizard/ItemEditor";

function ManagePageInner() {
  const user = useAuth((s) => s.user);
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const campaign = useCampaigns((s) => s.campaigns.find((c) => c.slug === slug));
  const isLoading = useCampaigns((s) => s.isLoading);

  const updateCampaignAPI = useCampaigns((s) => s.updateCampaign);
  const closeCampaignAPI = useCampaigns((s) => s.closeCampaign);
  const reactivateCampaignAPI = useCampaigns((s) => s.reactivateCampaign);

  const allContributions = useCampaigns((s) => s.contributions[slug] || EMPTY_CONTRIBUTIONS);
  const [editOpen, setEditOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load campaign and contributions on mount - use inline callbacks to avoid dependency issues
  useEffect(() => {
    if (slug) {
      const { loadCampaign, loadContributions } = useCampaigns.getState();
      loadCampaign(slug).catch(console.error);
      loadContributions(slug).catch(console.error);
    }
  }, [slug]);

  const contributions = useMemo(
    () =>
      allContributions
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [allContributions],
  );

  if (!user) return null;

  // Show loading skeleton while fetching campaign
  if (isLoading || !campaign) {
    if (isLoading && !campaign) {
      return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <div className="mb-2">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-12 w-2/3 mb-3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="flex gap-2 shrink-0">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-border bg-background">
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-border bg-background p-5">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="rounded-3xl border border-border bg-background p-5 h-64">
                <Skeleton className="h-full" />
              </div>
            </div>
            <div>
              <div className="rounded-3xl border border-border bg-background p-5 h-64">
                <Skeleton className="h-full" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Campaign not found after loading
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">Campaign not found</h1>
        <p className="text-muted mt-2">It may have been deleted.</p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-6">
            Back to dashboard
          </Button>
        </Link>
      </div>
    );
  }

  if (campaign.user_id !== user.id) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">Not your campaign</h1>
        <p className="text-muted mt-2">You can only manage campaigns you created.</p>
        <Link href={`/campaign/${campaign.slug}`}>
          <Button variant="outline" className="mt-6">
            View public page
          </Button>
        </Link>
      </div>
    );
  }

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/campaign/${campaign.slug}` : "";

  const end = new Date(campaign.end_date);
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const fee = calcFee(campaign.raised_amount);
  const tips = tipTotal(contributions);
  const mode = poolMode(campaign);
  const recipient = campaign.recipient_name?.trim();

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      {/* Header */}
      <div className="mb-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft size={14} />
          All campaigns
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={campaign.status} />
            {mode !== "standard" && <Badge tone="accent">{POOL_MODE_LABELS[mode]}</Badge>}
            <span className="text-sm text-muted">/campaign/{campaign.slug}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-3 break-words">{campaign.title}</h1>
          {recipient && <p className="text-sm text-muted mt-1">for {recipient}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/campaign/${campaign.slug}`} target="_blank">
            <Button variant="outline">
              View public page
              <ExternalLink size={14} />
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => setEditOpen(true)}>
            <Pencil size={14} />
            Edit
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Stat
          icon={<TrendingUp size={16} />}
          label="Total raised"
          value={formatAUD(campaign.raised_amount)}
          hint={tips > 0 ? `+ ${formatAUD(tips)} tips for ${recipient || "recipient"}` : undefined}
        />
        <Stat
          icon={<Banknote size={16} />}
          label="Net payout"
          value={formatAUD(fee.net)}
          hint={`After 2.5% fee (${formatAUD(fee.fee, { withCents: true })})`}
        />
        <Stat icon={<Users size={16} />} label="Contributors" value={String(contributions.length)} />
        <Stat
          icon={<Calendar size={16} />}
          label={campaign.status === "active" ? "Days left" : "Status"}
          value={
            campaign.status === "active"
              ? String(daysLeft)
              : campaign.status === "ended"
                ? "Awaiting payout"
                : "Paid out"
          }
        />
      </div>

      {/* Goal progress */}
      {campaign.goal_amount ? (
        <div className="mb-8 p-5 rounded-3xl border border-border bg-background">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-sm text-muted">Progress towards goal</p>
            <p className="text-sm font-medium">
              {Math.round((campaign.raised_amount / campaign.goal_amount) * 100)}%
            </p>
          </div>
          <Progress value={campaign.raised_amount} max={campaign.goal_amount} />
          <p className="text-xs text-muted mt-2">
            {formatAUD(campaign.raised_amount)} of {formatAUD(campaign.goal_amount)}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: highlight reel + contributor table */}
        <div className="lg:col-span-2 space-y-6">
          <HighlightReel contributions={contributions} />

          <div className="rounded-3xl border border-border bg-background overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base">Contributions</h3>
              <p className="text-sm text-muted">{contributions.length} total</p>
            </div>
          </div>

          {contributions.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted">
              No contributions yet — invite some friends.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted border-b border-border">
                    <th className="font-medium px-5 py-2">Name</th>
                    <th className="font-medium px-5 py-2 text-right">Amount</th>
                    <th className="font-medium px-5 py-2">Date</th>
                    <th className="font-medium px-5 py-2">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {c.photo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={c.photo_url}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <span className="w-7 h-7 rounded-full bg-foreground/10" />
                          )}
                          <span>{c.contributor_name || "Anonymous"}</span>
                          {c.emoji && <span>{c.emoji}</span>}
                          {c.video_url && <span title="Left a video">🎬</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">
                        {formatAUD(c.amount)}
                        {c.tip_amount ? (
                          <span className="block text-[11px] font-normal text-accent">
                            +{formatAUD(c.tip_amount)} tip
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {formatDistanceToNowStrict(new Date(c.created_at))} ago
                      </td>
                      <td className="px-5 py-3 text-muted max-w-[20ch] truncate">
                        {c.message || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>

          {campaign.status !== "active" && contributions.length > 0 && (
            <div className="rounded-3xl border border-border bg-background overflow-hidden mt-6">
              <div className="p-5 border-b border-border">
                <h3 className="font-semibold text-base">Contributor breakdown</h3>
                <p className="text-sm text-muted mt-0.5">Private — only you can see this</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted border-b border-border">
                      <th className="font-medium px-5 py-2">Name</th>
                      <th className="font-medium px-5 py-2">Items</th>
                      <th className="font-medium px-5 py-2 text-right">Amount</th>
                      <th className="font-medium px-5 py-2 text-right">Tip</th>
                      <th className="font-medium px-5 py-2">Date</th>
                      <th className="font-medium px-5 py-2 text-center">Private</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contributions.map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-foreground/[.02]">
                        <td className="px-5 py-3 font-medium">
                          {c.contributor_name || "Anonymous"}
                        </td>
                        <td className="px-5 py-3 text-muted text-xs max-w-[20ch] truncate">
                          {c.selected_items && c.selected_items.length > 0
                            ? c.selected_items.map((i) => i.label).join(", ")
                            : "—"}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold tabular-nums">
                          {formatAUD(c.amount)}
                        </td>
                        <td className="px-5 py-3 text-right text-muted text-xs">
                          {c.tip_amount ? formatAUD(c.tip_amount) : "—"}
                        </td>
                        <td className="px-5 py-3 text-muted text-xs">
                          {new Date(c.created_at).toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3 text-center">
                          {c.is_private && <span title="Private contribution">🔒</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <InvitePanel
            campaignId={campaign.id}
            shareUrl={shareUrl}
            campaignTitle={campaign.title}
          />

          <div className="rounded-3xl border border-border bg-background p-5 space-y-2">
            <h3 className="font-semibold text-base">Manage campaign</h3>
            <p className="text-sm text-muted">Quick actions you might need.</p>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setExtendOpen(true)}
                disabled={campaign.status !== "active"}
                className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-2xl hover:bg-foreground/5 disabled:opacity-50"
              >
                <CalendarPlus size={14} /> Extend end date
              </button>
              <button
                onClick={() => setCloseOpen(true)}
                disabled={campaign.status !== "active"}
                className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-2xl hover:bg-foreground/5 disabled:opacity-50 text-red-600"
              >
                <XCircle size={14} /> Close campaign early
              </button>
              {campaign.status === "ended" && (
                <button
                  onClick={() => setPayoutOpen(true)}
                  className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-2xl bg-accent text-accent-foreground hover:brightness-95"
                >
                  <Wallet size={14} /> Trigger payout
                </button>
              )}
              {campaign.status !== "active" && (
                <button
                  onClick={() => setReactivateOpen(true)}
                  className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-2xl hover:bg-foreground/5"
                >
                  <RotateCcw size={14} /> Reactivate (clone)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        campaign={campaign}
        onSave={async (patch) => {
          setIsUpdating(true);
          try {
            await updateCampaignAPI(campaign.slug, patch);
            toast.success("Campaign updated");
          } catch (error: any) {
            toast.error("Update failed", error.response?.data?.message);
          } finally {
            setIsUpdating(false);
            setEditOpen(false);
          }
        }}
      />

      <ExtendModal
        open={extendOpen}
        onClose={() => setExtendOpen(false)}
        currentEnd={campaign.end_date}
        onSave={async (endDate) => {
          try {
            await updateCampaignAPI(campaign.slug, { endDate: new Date(endDate).toISOString() });
            toast.success("End date extended");
          } catch (error: any) {
            toast.error("Update failed", error.response?.data?.message);
          } finally {
            setExtendOpen(false);
          }
        }}
      />

      <Modal open={closeOpen} onClose={() => setCloseOpen(false)} title="Close campaign early?">
        <p className="text-sm text-muted">
          Contributors won&apos;t be able to add new contributions. You can trigger payout right after.
        </p>
        <div className="flex gap-2 mt-5 justify-end">
          <Button variant="ghost" onClick={() => setCloseOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              setIsUpdating(true);
              try {
                await closeCampaignAPI(campaign.slug);
                toast.success("Campaign closed");
              } catch (error: any) {
                toast.error("Close failed", error.response?.data?.message);
              } finally {
                setIsUpdating(false);
                setCloseOpen(false);
              }
            }}
          >
            Close campaign
          </Button>
        </div>
      </Modal>

      <Modal open={payoutOpen} onClose={() => setPayoutOpen(false)} title="Trigger payout">
        <p className="text-sm text-muted">
          {user.stripe_account_id
            ? `Funds will be transferred to your connected bank account. Net after 2.5% fee: ${formatAUD(fee.net, { withCents: true })}.`
            : "You don't have a bank account connected yet. Connect one from your profile first."}
        </p>
        <div className="flex gap-2 mt-5 justify-end">
          <Button variant="ghost" onClick={() => setPayoutOpen(false)}>
            Cancel
          </Button>
          {user.stripe_account_id ? (
            <Button
              onClick={() => {
                toast.success("Payout initiated", `${formatAUD(fee.net)} on its way to your bank (mock)`);
                setPayoutOpen(false);
              }}
            >
              <Wallet size={14} />
              Send payout
            </Button>
          ) : (
            <Button
              onClick={() => {
                setPayoutOpen(false);
                router.push("/profile");
              }}
            >
              Go to profile
            </Button>
          )}
        </div>
      </Modal>

      <ReactivateModal
        open={reactivateOpen}
        onClose={() => setReactivateOpen(false)}
        title={campaign.title}
        onConfirm={async (endDate) => {
          setIsUpdating(true);
          try {
            const clone = await reactivateCampaignAPI(campaign.slug, endDate);
            if (clone) {
              toast.success("Pool reactivated", "Same details, fresh dates and totals.");
              router.push(`/manage/${clone.slug}`);
            }
          } catch (error: any) {
            toast.error("Reactivate failed", error.response?.data?.message);
          } finally {
            setIsUpdating(false);
            setReactivateOpen(false);
          }
        }}
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-background">
      <p className="text-xs text-muted flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-2xl font-semibold mt-1 tabular-nums">{value}</p>
      {hint && <p className="text-[11px] text-muted mt-0.5">{hint}</p>}
    </div>
  );
}

function EditModal({
  open,
  onClose,
  campaign,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  campaign: {
    title: string;
    description: string;
    goal_amount?: number;
    contribution_items?: Array<{ label: string; amount: number }>;
    type: string;
    hide_until_birthday?: boolean;
  };
  onSave: (patch: {
    title: string;
    description: string;
    goalAmount?: number;
    contributionItems?: Array<{ label: string; amount: number }>;
    hideUntilBirthday?: boolean;
  }) => void;
}) {
  const [title, setTitle] = useState(campaign.title);
  const [description, setDescription] = useState(campaign.description);
  const [goal, setGoal] = useState(campaign.goal_amount?.toString() ?? "");
  const [items, setItems] = useState(campaign.contribution_items ?? []);
  const [hideUntilBirthday, setHideUntilBirthday] = useState(campaign.hide_until_birthday ?? false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setTitle(campaign.title);
      setDescription(campaign.description);
      setGoal(campaign.goal_amount?.toString() ?? "");
      setItems(campaign.contribution_items ?? []);
      setHideUntilBirthday(campaign.hide_until_birthday ?? false);
    }
  }, [open, campaign]);

  return (
    <Modal open={open} onClose={onClose} title="Edit campaign" size="lg">
      <div className="space-y-5">
        <div className="space-y-3">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <Input
            label="Goal (optional)"
            type="number"
            min={0}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            prefix="A$"
          />
        </div>

        <div className="border-t pt-4">
          <ItemEditor
            items={items}
            onChange={setItems}
            label="Gift ideas / Contribution items (optional)"
          />
        </div>

        {campaign.type === "birthday" && (
          <div className="border-t pt-4">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-border hover:bg-foreground/5 cursor-pointer">
              <input
                type="checkbox"
                checked={hideUntilBirthday}
                onChange={(e) => setHideUntilBirthday(e.target.checked)}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium">Hide contributions until the end date</p>
                <p className="text-xs text-muted mt-0.5">
                  Keep the gift wall, names, photos and messages hidden until the event
                </p>
              </div>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSave({
              title: title.trim() || campaign.title,
              description: description.trim(),
              goalAmount: goal ? Number(goal) : undefined,
              contributionItems: items.length > 0
                ? items.map(({ label, amount }) => ({ label, amount }))
                : undefined,
              hideUntilBirthday: campaign.type === "birthday" ? hideUntilBirthday : undefined,
            })
          }
        >
          Save changes
        </Button>
      </div>
    </Modal>
  );
}


function ExtendModal({
  open,
  onClose,
  currentEnd,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  currentEnd: string;
  onSave: (newEnd: string) => void;
}) {
  const [date, setDate] = useState(currentEnd.slice(0, 10));
  return (
    <Modal open={open} onClose={onClose} title="Extend end date">
      <Input label="New end date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <div className="flex justify-end gap-2 mt-5">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSave(date)}>Update date</Button>
      </div>
    </Modal>
  );
}

function ReactivateModal({
  open,
  onClose,
  title,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  onConfirm: (endDate: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const twoWeeks = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  };
  const [date, setDate] = useState(twoWeeks());

  return (
    <Modal open={open} onClose={onClose} title="Reactivate pool">
      <p className="text-sm text-muted">
        We&apos;ll clone <span className="font-medium text-foreground">{title}</span> into a fresh
        active pool — same description, recipient, mode and tiers — with a new link and a reset
        total.
      </p>
      <div className="mt-4">
        <Input
          label="New end date"
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onConfirm(date)} disabled={!date}>
          <RotateCcw size={14} />
          Reactivate
        </Button>
      </div>
    </Modal>
  );
}


export default function ManagePage() {
  return (
    <AuthCheck requireAuth={true}>
      <ManagePageInner />
    </AuthCheck>
  );
}
