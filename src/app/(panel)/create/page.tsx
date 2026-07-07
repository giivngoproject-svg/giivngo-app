"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAuth } from "@/stores/auth";
import { useTranslation } from "@/lib/useTranslation";
import { AuthCheck } from "@/components/AuthCheck";
import { useWizard } from "@/stores/wizard";
import { useCampaigns } from "@/stores/campaigns";
import { formatAUD } from "@/lib/money";
import { usePoolModes } from "@/lib/usePoolModes";
import {
  CAMPAIGN_TYPE_LABELS,
  type CampaignType,
  type PoolMode,
} from "@/lib/types";
import { POOL_MODES } from "@/lib/pool";
import { cn } from "@/lib/cn";
import { WizardShell } from "@/components/wizard/WizardShell";
import { PhotoUpload } from "@/components/wizard/PhotoUpload";
import { TierEditor } from "@/components/wizard/TierEditor";
import { ItemEditor } from "@/components/wizard/ItemEditor";
import { CountrySelector } from "@/components/wizard/CountrySelector";
import { deleteImage } from "@/lib/mock/storage";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { ChevronLeft, ChevronRight, Sparkles, EyeOff, Lock, Layers, Eye, ChevronDown } from "lucide-react";

function CreatePageInner() {
  const t = useTranslation();
  const user = useAuth((s) => s.user);
  const router = useRouter();
  const { step, data, setStep, patch, reset } = useWizard();
  const createCampaign = useCampaigns((s) => s.createCampaign);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    return () => {
      // wizard state is session-only; keep across navigations within the wizard.
    };
  }, []);

  if (!user) return null;

  const goNext = () => setStep((Math.min(3, step + 1) as 1 | 2 | 3));
  const goBack = () => setStep((Math.max(1, step - 1) as 1 | 2 | 3));

  const publish = async () => {
    // Validate Stripe Connect
    if (!user.stripe_account_id) {
      const result = await Swal.fire({
        title: "Stripe Connect Required",
        text: "You need to link your Stripe account to create campaigns and receive payments.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Profile",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#1E1B4B",
      });

      if (result.isConfirmed) {
        router.push("/profile");
      }
      return;
    }

    setIsPublishing(true);
    try {
      const tiered = data.pool_mode === "tiers";
      const tiers = tiered
        ? data.tiers.filter((t) => t > 0).sort((a, b) => a - b)
        : undefined;

      const campaign = await createCampaign({
        title: data.title.trim(),
        description: data.description.trim(),
        type: data.type,
        goalAmount: data.goal_amount || undefined,
        coverPhotoUrl: data.cover_photo_url,
        endDate: new Date(data.end_date).toISOString(),
        minContribution: tiered ? undefined : data.min_contribution,
        maxContribution: tiered ? undefined : data.max_contribution,
        recipientName: data.recipient_name?.trim() || undefined,
        poolMode: data.pool_mode,
        tiers,
        contributionItems: data.contribution_items.length > 0
          ? data.contribution_items.map(({ label, amount }) => ({ label, amount }))
          : undefined,
        organiserName: user.name,
        showOnSearch: data.show_on_search,
        hideUntilBirthday: data.hide_until_birthday || undefined,
        country_code: data.country_code,
        currency: data.currency,
      });

      if (campaign) {
        await Swal.fire({
          title: "Campaign published! 🎉",
          text: `Share /campaign/${campaign.slug}`,
          icon: "success",
          confirmButtonColor: "#1E1B4B",
        });
        reset();
        router.push(`/manage/${campaign.slug}`);
      } else {
        await Swal.fire({
          title: "Failed to publish",
          text: "Could not create campaign",
          icon: "error",
          confirmButtonColor: "#1E1B4B",
        });
        // Delete uploaded image if campaign creation failed
        if (data.cover_photo_url) {
          try {
            await deleteImage(data.cover_photo_url);
          } catch (err) {
            console.error("Could not delete uploaded image:", err);
          }
        }
      }
    } catch (error: any) {
      await Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Could not create campaign",
        icon: "error",
        confirmButtonColor: "#1E1B4B",
      });
      // Delete uploaded image if campaign creation failed
      if (data.cover_photo_url) {
        try {
          await deleteImage(data.cover_photo_url);
        } catch (err) {
          console.error("Could not delete uploaded image:", err);
        }
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <WizardShell step={step}>
      {step === 1 && (
        <Step1
          t={t}
          data={data}
          patch={patch}
          onNext={goNext}
          onCancel={() => {
            reset();
            router.push("/dashboard");
          }}
        />
      )}
      {step === 2 && <Step2 t={t} data={data} patch={patch} onNext={goNext} onBack={goBack} />}
      {step === 3 && (
        <Step3
          t={t}
          data={data}
          patch={patch}
          organiserName={user.name}
          onBack={goBack}
          onPublish={publish}
          isPublishing={isPublishing}
        />
      )}
    </WizardShell>
  );
}

export default function CreatePage() {
  return (
    <AuthCheck requireAuth={true}>
      <CreatePageInner />
    </AuthCheck>
  );
}

// ──────────────────────────────────────────────────────────
// Step 1: Basics
// ──────────────────────────────────────────────────────────

function Step1({
  t,
  data,
  patch,
  onNext,
  onCancel,
}: {
  t: ReturnType<typeof useTranslation>;
  data: ReturnType<typeof useWizard.getState>["data"];
  patch: (p: Partial<typeof data>) => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  const canNext = data.title.trim().length >= 3 && data.description.trim().length >= 100;

  return (
    <div className="space-y-5">
      <PhotoUpload
        value={data.cover_photo_url}
        onChange={(url) => patch({ cover_photo_url: url })}
      />

      <Input
        label={t("create.campaign_name")}
        placeholder={t("create.campaign_name.placeholder")}
        value={data.title}
        onChange={(e) => patch({ title: e.target.value })}
        hint="Keep it short and warm — this is the first thing contributors see."
      />

      <Input
        label={t("create.recipient_name")}
        placeholder="Sarah"
        value={data.recipient_name ?? ""}
        onChange={(e) => patch({ recipient_name: e.target.value })}
        hint="The recipient — used for tipping and their video highlight reel."
      />

      <Textarea
        label={t("create.description")}
        placeholder={t("create.description.placeholder")}
        value={data.description}
        onChange={(e) => patch({ description: e.target.value })}
        rows={5}
        hint={t("create.description.hint")}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">{t("create.campaign_type")}</label>
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

      <CountrySelector
        value={data.country_code}
        onChange={(countryCode, currency) => patch({ country_code: countryCode, currency })}
      />

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button onClick={onNext} disabled={!canNext}>
          {t("create.button_next")}
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
  t,
  data,
  patch,
  onNext,
  onBack,
}: {
  t: ReturnType<typeof useTranslation>;
  data: ReturnType<typeof useWizard.getState>["data"];
  patch: (p: Partial<typeof data>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { labels: poolModeLabels, descriptions: poolModeDescriptions } = usePoolModes();
  const today = new Date().toISOString().slice(0, 10);
  const isTiers = data.pool_mode === "tiers";
  const validTiers = data.tiers.filter((t) => t > 0);
  const hasItems = data.contribution_items.length > 0;
  const canNext = !!data.end_date && (!isTiers || validTiers.length >= 1);
  const [itemsExpanded, setItemsExpanded] = React.useState(false);

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
                  {poolModeLabels[mode]}
                </span>
                <p className="text-xs text-muted mt-1 leading-snug">
                  {poolModeDescriptions[mode]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <Input
        label={data.pool_mode === "mystery" ? t('create.goal_amount_mystery') : t('create.goal_amount')}
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
            ? t('create.goal_amount_mystery_hint')
            : t('create.goal_amount.hint')
        }
      />

      <Input
        label={t('create.end_date')}
        type="date"
        min={today}
        value={data.end_date}
        onChange={(e) => patch({ end_date: e.target.value })}
        hint={t('create.end_date.hint')}
      />

      {isTiers ? (
        <TierEditor tiers={data.tiers} onChange={(tiers) => patch({ tiers })} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('create.min_contribution')}
            type="number"
            min={0}
            step={5}
            value={data.min_contribution ?? ""}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              // If max is set and val is greater than max, don't allow it
              if (val !== undefined && data.max_contribution && val > data.max_contribution) {
                return;
              }
              patch({ min_contribution: val });
            }}
            prefix="A$"
            placeholder="—"
            hint={data.max_contribution ? `Max: A$${data.max_contribution}` : undefined}
          />
          <Input
            label={t('create.max_contribution')}
            type="number"
            min={0}
            step={5}
            value={data.max_contribution ?? ""}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : undefined;

              // If min is set and val is less than min, don't allow it
              if (val !== undefined && data.min_contribution && val < data.min_contribution) {
                return;
              }

              patch({ max_contribution: val });
            }}
            prefix="A$"
            placeholder="—"
            hint="Leave empty for no limit"
          />
        </div>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setItemsExpanded(!itemsExpanded)}
          className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl border border-border hover:bg-foreground/5 text-sm font-medium"
        >
          <span>{t('create.add_items')}</span>
          <ChevronDown
            size={16}
            className={cn("transition-transform", itemsExpanded && "rotate-180")}
          />
        </button>
        {itemsExpanded && (
          <div className="px-3.5 py-3 rounded-2xl border border-border bg-foreground/[.02]">
            <ItemEditor
              items={data.contribution_items}
              onChange={(items) => patch({ contribution_items: items })}
            />
            <p className="text-xs text-muted mt-3">
              {t('create.add_items.hint')}
            </p>
          </div>
        )}
      </div>

      {data.type === "birthday" && (
        <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-border hover:bg-foreground/5 cursor-pointer">
          <input
            type="checkbox"
            checked={data.hide_until_birthday}
            onChange={(e) => patch({ hide_until_birthday: e.target.checked })}
            className="mt-1"
          />
          <div>
            <p className="text-sm font-medium">{t('create.hide_until_end')}</p>
            <p className="text-xs text-muted mt-0.5">
              {t('create.hide_until_end.hint')}
            </p>
          </div>
        </label>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft size={16} /> {t("create.button_prev")}
        </Button>
        <Button onClick={onNext} disabled={!canNext}>
          {t("create.button_next")}
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
  t,
  data,
  patch,
  organiserName,
  onBack,
  onPublish,
  isPublishing,
}: {
  t: ReturnType<typeof useTranslation>;
  data: ReturnType<typeof useWizard.getState>["data"];
  patch: (p: Partial<typeof data>) => void;
  organiserName: string;
  onBack: () => void;
  onPublish: () => Promise<void>;
  isPublishing: boolean;
}) {
  const { labels: poolModeLabels } = usePoolModes();
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
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-sm text-muted">by {organiserName}</p>
            {data.pool_mode !== "standard" && (
              <Badge tone="accent">{poolModeLabels[data.pool_mode]}</Badge>
            )}
            {data.hide_until_birthday && (
              <Badge tone="accent">🎂 Birthday surprise</Badge>
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
            <dd className="text-right">{poolModeLabels[data.pool_mode]}</dd>
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
            {data.contribution_items.length > 0 ? (
              <>
                <dt className="text-muted">Items</dt>
                <dd className="text-right">
                  {data.contribution_items
                    .filter((i) => i.label.trim() && i.amount > 0)
                    .map((i) => `${i.label} (${formatAUD(i.amount)})`)
                    .join(" · ") || "—"}
                </dd>
              </>
            ) : null}
          </dl>
        </div>
      </div>

      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-border hover:bg-foreground/5 cursor-pointer mt-6">
        <input
          type="checkbox"
          checked={data.show_on_search}
          onChange={(e) => patch({ show_on_search: e.target.checked })}
          className="mt-1"
        />
        <div>
          <p className="text-sm font-medium">{t('create.show_search')}</p>
          <p className="text-xs text-muted mt-0.5">{t('create.show_search.hint')}</p>
        </div>
      </label>

      <div className="flex justify-between pt-6">
        <Button variant="ghost" onClick={onBack} disabled={isPublishing}>
          <ChevronLeft size={16} /> {t("create.button_prev")}
        </Button>
        <Button onClick={onPublish} size="lg" disabled={isPublishing}>
          <Sparkles size={16} />
          {isPublishing ? `${t("common.loading")}...` : t("create.button_publish")}
        </Button>
      </div>
    </div>
  );
}
