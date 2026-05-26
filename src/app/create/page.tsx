"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/mock/auth";
import { useWizard } from "@/stores/wizard";
import { useCampaigns } from "@/stores/campaigns";
import { uid, uniqueSlug } from "@/lib/slug";
import { formatAUD } from "@/lib/money";
import {
  CAMPAIGN_TYPE_LABELS,
  type CampaignType,
  type PoolMode,
} from "@/lib/types";
import { POOL_MODE_LABELS, POOL_MODE_DESCRIPTIONS, POOL_MODES } from "@/lib/pool";
import { cn } from "@/lib/cn";
import { toast } from "@/stores/toast";
import { WizardShell } from "@/components/wizard/WizardShell";
import { PhotoUpload } from "@/components/wizard/PhotoUpload";
import { TierEditor } from "@/components/wizard/TierEditor";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { ChevronLeft, ChevronRight, Sparkles, EyeOff, Lock, Layers, Eye } from "lucide-react";

export default function CreatePage() {
  const user = useRequireAuth();
  const router = useRouter();
  const { step, data, setStep, patch, reset } = useWizard();
  const addCampaign = useCampaigns((s) => s.addCampaign);
  const campaigns = useCampaigns((s) => s.campaigns);

  useEffect(() => {
    return () => {
      // wizard state is session-only; keep across navigations within the wizard.
    };
  }, []);

  if (!user) return null;

  const goNext = () => setStep((Math.min(3, step + 1) as 1 | 2 | 3));
  const goBack = () => setStep((Math.max(1, step - 1) as 1 | 2 | 3));

  const publish = () => {
    const slug = uniqueSlug(
      data.title,
      campaigns.map((c) => c.slug),
    );
    const id = uid("camp");
    const tiered = data.pool_mode === "tiers";
    const tiers = tiered
      ? data.tiers.filter((t) => t > 0).sort((a, b) => a - b)
      : undefined;
    addCampaign({
      id,
      user_id: user.id,
      title: data.title.trim(),
      description: data.description.trim(),
      type: data.type,
      goal_amount: data.goal_amount || undefined,
      raised_amount: 0,
      cover_photo_url: data.cover_photo_url,
      end_date: new Date(data.end_date).toISOString(),
      status: "active",
      slug,
      // Tiers replace freeform min/max amounts.
      min_contribution: tiered ? undefined : data.min_contribution,
      max_contribution: tiered ? undefined : data.max_contribution,
      recipient_name: data.recipient_name?.trim() || undefined,
      pool_mode: data.pool_mode,
      tiers,
      organiser_name: user.name,
      created_at: new Date().toISOString(),
    });
    toast.success("Campaign published", `Share /campaign/${slug}`);
    reset();
    router.push(`/manage/${slug}`);
  };

  return (
    <WizardShell step={step}>
      {step === 1 && (
        <Step1
          data={data}
          patch={patch}
          onNext={goNext}
          onCancel={() => {
            reset();
            router.push("/dashboard");
          }}
        />
      )}
      {step === 2 && <Step2 data={data} patch={patch} onNext={goNext} onBack={goBack} />}
      {step === 3 && (
        <Step3 data={data} organiserName={user.name} onBack={goBack} onPublish={publish} />
      )}
    </WizardShell>
  );
}

// ──────────────────────────────────────────────────────────
// Step 1: Basics
// ──────────────────────────────────────────────────────────

function Step1({
  data,
  patch,
  onNext,
  onCancel,
}: {
  data: ReturnType<typeof useWizard.getState>["data"];
  patch: (p: Partial<typeof data>) => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  const canNext = data.title.trim().length >= 3 && data.description.trim().length >= 10;

  return (
    <div className="space-y-5">
      <PhotoUpload
        value={data.cover_photo_url}
        onChange={(url) => patch({ cover_photo_url: url })}
      />

      <Input
        label="Campaign title"
        placeholder="Sarah's 30th birthday Bali fund"
        value={data.title}
        onChange={(e) => patch({ title: e.target.value })}
        hint="Keep it short and warm — this is the first thing contributors see."
      />

      <Input
        label="Who's it for? (optional)"
        placeholder="Sarah"
        value={data.recipient_name ?? ""}
        onChange={(e) => patch({ recipient_name: e.target.value })}
        hint="The recipient — used for tipping and their video highlight reel."
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Type</label>
        <select
          value={data.type}
          onChange={(e) => patch({ type: e.target.value as CampaignType })}
          className="w-full h-11 px-3.5 rounded-2xl border border-border bg-background text-[15px] outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50"
        >
          {Object.entries(CAMPAIGN_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <Textarea
        label="What's it for?"
        placeholder="A few lines on what you're collecting for, and why it matters."
        value={data.description}
        onChange={(e) => patch({ description: e.target.value })}
        rows={5}
        hint="Markdown not supported — keep it plain text."
      />

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onNext} disabled={!canNext}>
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Step 2: Goal & timing
// ──────────────────────────────────────────────────────────

const MODE_ICONS: Record<PoolMode, React.ReactNode> = {
  standard: <Eye size={16} />,
  mystery: <EyeOff size={16} />,
  blind: <Lock size={16} />,
  tiers: <Layers size={16} />,
};

function Step2({
  data,
  patch,
  onNext,
  onBack,
}: {
  data: ReturnType<typeof useWizard.getState>["data"];
  patch: (p: Partial<typeof data>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const isTiers = data.pool_mode === "tiers";
  const validTiers = data.tiers.filter((t) => t > 0);
  const canNext = !!data.end_date && (!isTiers || validTiers.length >= 1);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pool mode</label>
        <div className="grid grid-cols-2 gap-2">
          {POOL_MODES.map((mode) => {
            const active = data.pool_mode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => patch({ pool_mode: mode })}
                className={cn(
                  "text-left rounded-2xl border p-3 transition-all",
                  active
                    ? "border-accent/60 bg-accent/5 ring-2 ring-accent/30"
                    : "border-border hover:bg-foreground/[.02]",
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm font-medium",
                    active ? "text-accent" : "text-foreground",
                  )}
                >
                  {MODE_ICONS[mode]}
                  {POOL_MODE_LABELS[mode]}
                </span>
                <p className="text-xs text-muted mt-1 leading-snug">
                  {POOL_MODE_DESCRIPTIONS[mode]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <Input
        label={data.pool_mode === "mystery" ? "Goal amount (hidden from contributors)" : "Goal amount (optional)"}
        type="number"
        min={0}
        step={50}
        value={data.goal_amount ?? ""}
        onChange={(e) =>
          patch({ goal_amount: e.target.value ? Number(e.target.value) : undefined })
        }
        prefix="A$"
        placeholder="2000"
        hint={
          data.pool_mode === "mystery"
            ? "Only you'll see this — contributors see just the occasion."
            : "Skip this to run an open-ended pool."
        }
      />

      <Input
        label="End date"
        type="date"
        min={today}
        value={data.end_date}
        onChange={(e) => patch({ end_date: e.target.value })}
        hint="When this date hits, funds are released to your bank."
      />

      {isTiers ? (
        <TierEditor tiers={data.tiers} onChange={(tiers) => patch({ tiers })} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min contribution"
            type="number"
            min={0}
            step={5}
            value={data.min_contribution ?? ""}
            onChange={(e) =>
              patch({ min_contribution: e.target.value ? Number(e.target.value) : undefined })
            }
            prefix="A$"
            placeholder="—"
          />
          <Input
            label="Max contribution"
            type="number"
            min={0}
            step={5}
            value={data.max_contribution ?? ""}
            onChange={(e) =>
              patch({ max_contribution: e.target.value ? Number(e.target.value) : undefined })
            }
            prefix="A$"
            placeholder="—"
          />
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft size={16} /> Back
        </Button>
        <Button onClick={onNext} disabled={!canNext}>
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Step 3: Preview & publish
// ──────────────────────────────────────────────────────────

function Step3({
  data,
  organiserName,
  onBack,
  onPublish,
}: {
  data: ReturnType<typeof useWizard.getState>["data"];
  organiserName: string;
  onBack: () => void;
  onPublish: () => void;
}) {
  return (
    <div>
      <p className="text-sm text-muted mb-4">
        Have a final look. You can edit any of this after publishing.
      </p>

      <div className="rounded-3xl border border-border overflow-hidden bg-background shadow-soft">
        {data.cover_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.cover_photo_url}
            alt={data.title}
            className="w-full aspect-[16/9] object-cover"
          />
        ) : (
          <div className="w-full aspect-[16/9] bg-gradient-to-br from-accent/20 to-sky-200/40" />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{data.title || "Untitled"}</h2>
            <StatusBadge status="active" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted">by {organiserName}</p>
            {data.pool_mode !== "standard" && (
              <Badge tone="accent">{POOL_MODE_LABELS[data.pool_mode]}</Badge>
            )}
          </div>
          {data.recipient_name?.trim() && (
            <p className="text-sm text-muted mt-0.5">for {data.recipient_name.trim()}</p>
          )}
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">
            {data.description || "No description yet."}
          </p>

          {data.pool_mode === "mystery" ? (
            <div className="mt-6 rounded-2xl bg-foreground/5 p-4 text-sm text-muted">
              <EyeOff size={15} className="inline mr-1.5 -mt-0.5" />
              Goal stays a mystery — contributors see only the occasion.
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <p className="text-xl font-semibold">{formatAUD(0)}</p>
                {data.goal_amount ? (
                  <p className="text-sm text-muted">of {formatAUD(data.goal_amount)}</p>
                ) : (
                  <p className="text-sm text-muted">no goal set</p>
                )}
              </div>
              <Progress value={0} max={data.goal_amount || 100} className="mt-2" />
            </div>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-muted">Type</dt>
            <dd className="text-right capitalize">{data.type.replace("_", " ")}</dd>
            <dt className="text-muted">Pool mode</dt>
            <dd className="text-right">{POOL_MODE_LABELS[data.pool_mode]}</dd>
            <dt className="text-muted">Ends</dt>
            <dd className="text-right">
              {new Date(data.end_date).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </dd>
            {data.pool_mode === "tiers" ? (
              <>
                <dt className="text-muted">Tiers</dt>
                <dd className="text-right">
                  {data.tiers
                    .filter((t) => t > 0)
                    .map((t) => formatAUD(t))
                    .join(" · ") || "—"}
                </dd>
              </>
            ) : (
              <>
                {data.min_contribution ? (
                  <>
                    <dt className="text-muted">Min contribution</dt>
                    <dd className="text-right">{formatAUD(data.min_contribution)}</dd>
                  </>
                ) : null}
                {data.max_contribution ? (
                  <>
                    <dt className="text-muted">Max contribution</dt>
                    <dd className="text-right">{formatAUD(data.max_contribution)}</dd>
                  </>
                ) : null}
              </>
            )}
          </dl>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft size={16} /> Back
        </Button>
        <Button onClick={onPublish} size="lg">
          <Sparkles size={16} />
          Publish campaign
        </Button>
      </div>
    </div>
  );
}
