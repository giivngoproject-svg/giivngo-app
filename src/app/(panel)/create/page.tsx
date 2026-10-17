"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Swal from "sweetalert2";
import { useAuth } from "@/stores/auth";
import { useTranslation } from "@/lib/useTranslation";
import { AuthCheck } from "@/components/AuthCheck";
import { useWizard, type WizardData } from "@/stores/wizard";
import { useCampaigns } from "@/stores/campaigns";
import { formatAUD } from "@/lib/money";
import { slugify } from "@/lib/slug";
import type { CampaignType } from "@/lib/types";
import type { TranslationKey } from "@/lib/translations";
import { LOCALE_TO_HREFLANG, type Locale } from "@/i18n/markets";
import { cn } from "@/lib/cn";
import { WizardShell } from "@/components/wizard/WizardShell";
import { CoverMediaTabs } from "@/components/wizard/CoverMediaTabs";
import { ItemEditor } from "@/components/wizard/ItemEditor";
import { CountrySelector } from "@/components/wizard/CountrySelector";
import { deleteImage } from "@/lib/mock/storage";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  Baby,
  Briefcase,
  Cake,
  ChevronLeft,
  ChevronRight,
  Hand,
  Heart,
  PartyPopper,
  Plane,
  Sparkles,
  ChevronDown,
} from "lucide-react";

// The eight occasions offered in the create flow, in display order.
// Legacy campaign types (footy_tipping, office_lotto, event_entry, custom) stay in the API.
const OCCASIONS: { value: CampaignType; icon: typeof Cake }[] = [
  { value: "birthday", icon: Cake },
  { value: "hens_bucks", icon: PartyPopper },
  { value: "wedding", icon: Heart },
  { value: "work_party", icon: Briefcase },
  { value: "farewell", icon: Hand },
  { value: "baby_shower", icon: Baby },
  { value: "trip", icon: Plane },
  { value: "something_else", icon: Sparkles },
];

type WizardT = ReturnType<typeof useTranslation>;
type WizardPatch = (p: Partial<WizardData>) => void;

const PAYOUT_DELAY_DAYS = 3; // Scheduler pays out 3 days after the campaign ends (Stripe balance settles first)

function CreatePageInner() {
  const t = useTranslation();
  const locale = useLocale();
  const dateLocale = LOCALE_TO_HREFLANG[locale as Locale] ?? "en-AU";
  const user = useAuth((s) => s.user);
  const router = useRouter();
  const { step, data, setStep, patch, reset } = useWizard();
  const createCampaign = useCampaigns((s) => s.createCampaign);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    // Validate Stripe Connect on page load
    if (user && !user.stripe_account_id) {
      Swal.fire({
        title: "Stripe Connect Required",
        text: "You need to link your Stripe account to create campaigns and receive payments.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Profile",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#1E1B4B",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/profile");
        } else {
          router.push("/dashboard");
        }
      });
    }

    return () => {
      // wizard state is session-only; keep across navigations within the wizard.
    };
  }, [user, router]);

  if (!user) return null;

  const goNext = () => setStep((Math.min(3, step + 1) as 1 | 2 | 3));
  const goBack = () => setStep((Math.max(1, step - 1) as 1 | 2 | 3));

  const publish = async () => {
    setIsPublishing(true);
    try {
      const giftAmounts = data.gift_suggested_amounts.filter((a) => a > 0);

      const campaign = await createCampaign({
        title: data.title.trim(),
        description: data.description.trim(),
        type: data.type,
        goalAmount: data.goal_amount || undefined,
        coverPhotoUrl: data.cover_photo_url,
        coverVideoUrl: data.cover_video_url,
        endDate: new Date(data.end_date).toISOString(),
        recipientName: data.recipient_is_me ? user.name : data.recipient_name.trim() || undefined,
        maxContributions: data.max_contributions || undefined,
        poolMode: data.keep_private ? "blind" : "standard",
        contributionItems: data.contribution_items.length > 0
          ? data.contribution_items.map(({ label, amount }) => ({ label, amount }))
          : undefined,
        organiserName: user.name,
        showOnSearch: data.show_on_search,
        hideUntilBirthday: (data.type === "birthday" && data.hide_until_birthday) || undefined,
        countryCode: data.country_code,
        currency: data.currency,
        eventCostEnabled: data.event_cost_enabled,
        eventCostAmount: data.event_cost_enabled ? data.event_cost_amount : undefined,
        eventCostLabel: data.event_cost_enabled ? data.event_cost_label.trim() || undefined : undefined,
        giftEnabled: data.gift_enabled,
        giftSuggestedAmounts: data.gift_enabled ? giftAmounts : [],
        hideGoal: data.hide_goal,
      });

      if (campaign) {
        const campaignUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/campaign/${campaign.slug}`;
        let copied = false;

        await Swal.fire({
          title: t("create.published.title"),
          html: `
            <p style="color: rgba(0,0,0,0.7); margin: 16px 0 24px;">
              ${t("create.published.subtitle")}
            </p>
            <div style="display: flex; gap: 8px; align-items: center; margin: 16px 0; padding: 12px; background: rgba(0,0,0,0.05); border-radius: 12px;">
              <input
                type="text"
                id="campaign-url"
                value="${campaignUrl}"
                readonly
                style="flex: 1; padding: 8px 12px; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; font-family: monospace; font-size: 12px; cursor: text;"
              />
              <button
                id="copy-btn"
                style="padding: 8px 16px; background: #1E1B4B; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s;"
              >
                ${t("create.published.copy_button")}
              </button>
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#1E1B4B",
          confirmButtonText: "OK",
          didOpen: () => {
            const btn = Swal.getPopup()?.querySelector("#copy-btn") as HTMLButtonElement;
            if (btn) {
              btn.addEventListener("click", async () => {
                try {
                  await navigator.clipboard.writeText(campaignUrl);
                  copied = true;
                  btn.textContent = t("create.published.link_copied");
                  btn.style.background = "#059669";
                  setTimeout(() => {
                    btn.textContent = t("create.published.copy_button");
                    btn.style.background = "#1E1B4B";
                  }, 2000);
                } catch (err) {
                  console.error("Failed to copy:", err);
                }
              });
            }
          }
        });
        reset();
        router.push(`/manage/${campaign.slug}`);
      } else {
        await Swal.fire({
          title: t("create.publish_error.title"),
          text: t("create.publish_error.message"),
          icon: "error",
          confirmButtonColor: "#1E1B4B",
        });
        // Delete uploaded media if campaign creation failed
        if (data.cover_photo_url) {
          try {
            await deleteImage(data.cover_photo_url);
          } catch (err) {
            console.error("Could not delete uploaded image:", err);
          }
        }
        if (data.cover_video_url) {
          try {
            await deleteImage(data.cover_video_url);
          } catch (err) {
            console.error("Could not delete uploaded video:", err);
          }
        }
      }
    } catch (error: any) {
      await Swal.fire({
        title: t("create.generic_error.title"),
        text: error.response?.data?.message || t("create.generic_error.message"),
        icon: "error",
        confirmButtonColor: "#1E1B4B",
      });
      // Delete uploaded media if campaign creation failed
      if (data.cover_photo_url) {
        try {
          await deleteImage(data.cover_photo_url);
        } catch (err) {
          console.error("Could not delete uploaded image:", err);
        }
      }
      if (data.cover_video_url) {
        try {
          await deleteImage(data.cover_video_url);
        } catch (err) {
          console.error("Could not delete uploaded video:", err);
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
          userName={user.name}
          onNext={goNext}
          onCancel={() => {
            reset();
            router.push("/dashboard");
          }}
        />
      )}
      {step === 2 && (
        <Step2
          t={t}
          data={data}
          patch={patch}
          userName={user.name}
          dateLocale={dateLocale}
          onNext={goNext}
          onBack={goBack}
        />
      )}
      {step === 3 && (
        <Step3
          t={t}
          data={data}
          organiserName={user.name}
          dateLocale={dateLocale}
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
// Helpers
// ──────────────────────────────────────────────────────────

function recipientFor(data: WizardData, userName: string) {
  return data.recipient_is_me ? userName : data.recipient_name.trim();
}

function formatDate(value: string, dateLocale: string, options: Intl.DateTimeFormatOptions) {
  return new Date(value + "T12:00:00").toLocaleDateString(dateLocale, options);
}

function payoutDate(endDate: string, dateLocale: string) {
  const d = new Date(endDate + "T12:00:00");
  d.setDate(d.getDate() + PAYOUT_DELAY_DAYS);
  return d.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "long" });
}

function Switch({
  checked,
  onChange,
  title,
  help,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  help: string;
}) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted mt-0.5">{help}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 accent-accent flex-none"
      />
    </label>
  );
}

// ──────────────────────────────────────────────────────────
// Step 1: Occasion & details
// ──────────────────────────────────────────────────────────

function Step1({
  t,
  data,
  patch,
  userName,
  onNext,
  onCancel,
}: {
  t: WizardT;
  data: WizardData;
  patch: WizardPatch;
  userName: string;
  onNext: () => void;
  onCancel: () => void;
}) {
  const recipient = recipientFor(data, userName);
  const canNext =
    data.title.trim().length >= 3 && (data.recipient_is_me || data.recipient_name.trim().length > 0);

  // The pool name follows the occasion and recipient until the organiser edits it.
  useEffect(() => {
    if (data.title_edited) return;
    const suggested = recipient ? t(`create.name.${data.type}` as TranslationKey, { name: recipient }) : "";
    if (suggested !== data.title) patch({ title: suggested });
  }, [data.type, data.title_edited, data.title, recipient, patch, t]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{t("create.s1.heading")}</h2>
        <p className="text-sm text-muted">{t("create.s1.sub")}</p>
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium">{t("create.s1.occasion_label")}</span>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t("create.s1.occasion_label")}>
          {OCCASIONS.map(({ value, icon: Icon }) => {
            const active = data.type === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => patch({ type: value })}
                className={cn(
                  "flex items-center gap-2.5 min-h-[52px] rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition-all",
                  active
                    ? "border-accent/60 bg-accent/5 ring-2 ring-accent/30 text-accent"
                    : "border-border hover:bg-foreground/[.02]",
                )}
              >
                <Icon size={18} className={active ? "text-accent" : "text-muted"} />
                {t(`create.occasion.${value}` as TranslationKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium">{t("create.s1.who")}</span>
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-foreground/[.04] p-1" role="group" aria-label={t("create.s1.who")}>
          {[
            { me: true, label: t("create.s1.who_me") },
            { me: false, label: t("create.s1.who_other") },
          ].map((option) => (
            <button
              key={String(option.me)}
              type="button"
              aria-pressed={data.recipient_is_me === option.me}
              onClick={() => patch({ recipient_is_me: option.me })}
              className={cn(
                "min-h-[40px] rounded-xl text-sm font-medium transition-all",
                data.recipient_is_me === option.me ? "bg-background shadow-soft text-foreground" : "text-muted",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        {!data.recipient_is_me && (
          <Input
            aria-label={t("create.s1.who_other")}
            placeholder={t("create.s1.recipient_placeholder")}
            value={data.recipient_name}
            onChange={(e) => patch({ recipient_name: e.target.value })}
          />
        )}
      </div>

      <Input
        label={t("create.s1.name_label")}
        value={data.title}
        onChange={(e) => patch({ title: e.target.value, title_edited: true })}
        hint={t("create.s1.name_help")}
      />

      <div className="space-y-1.5">
        <span className="block text-sm font-medium">
          {t("create.s1.media_label")} <span className="text-muted font-normal">{t("create.optional")}</span>
        </span>
        <CoverMediaTabs
          photoUrl={data.cover_photo_url}
          videoUrl={data.cover_video_url}
          onPhotoChange={(url) => patch({ cover_photo_url: url })}
          onVideoChange={(url) => patch({ cover_video_url: url })}
        />
      </div>

      <Textarea
        label={t("create.s1.desc_label")}
        placeholder={t(`create.example.${data.type}` as TranslationKey)}
        value={data.description}
        onChange={(e) => patch({ description: e.target.value })}
        rows={4}
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
// Step 2: Event cost & gift
// ──────────────────────────────────────────────────────────

function Step2({
  t,
  data,
  patch,
  userName,
  dateLocale,
  onNext,
  onBack,
}: {
  t: WizardT;
  data: WizardData;
  patch: WizardPatch;
  userName: string;
  dateLocale: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const [attempted, setAttempted] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const anyPrice = data.event_cost_enabled || data.gift_enabled;
  const eventAmountMissing = data.event_cost_enabled && !((data.event_cost_amount ?? 0) > 0);

  const setGiftAmount = (index: number, value: string) => {
    const next = [...data.gift_suggested_amounts];
    next[index] = Number(value) || 0;
    patch({ gift_suggested_amounts: next });
  };

  const handleNext = () => {
    setAttempted(true);
    if (!anyPrice || eventAmountMissing) return;
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{t("create.s2.heading")}</h2>
        <p className="text-sm text-muted">{t("create.s2.sub")}</p>
      </div>

      {/* Event cost */}
      <div className={cn("rounded-2xl border p-4 space-y-4", data.event_cost_enabled ? "border-ink/60" : "border-border")}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.event_cost_enabled}
            onChange={(e) => patch({ event_cost_enabled: e.target.checked })}
            className="mt-1 h-5 w-5 accent-accent flex-none"
          />
          <span>
            <span className="block font-semibold">{t("create.s2.event_title")}</span>
            <span className="block text-sm text-muted">{t("create.s2.event_help")}</span>
          </span>
        </label>
        {data.event_cost_enabled && (
          <div className="space-y-3 pl-8">
            <Input
              label={t("create.s2.cost_per_person")}
              type="number"
              min={1}
              step={1}
              prefix="A$"
              value={data.event_cost_amount ?? ""}
              onChange={(e) =>
                patch({ event_cost_amount: e.target.value ? Number(e.target.value) : undefined })
              }
              error={attempted && eventAmountMissing ? t("create.s2.event_amount_required") : undefined}
            />
            <Input
              label={t("create.s2.covers")}
              placeholder={t("create.s2.covers_placeholder")}
              value={data.event_cost_label}
              onChange={(e) => patch({ event_cost_label: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Gift */}
      <div className={cn("rounded-2xl border p-4 space-y-4", data.gift_enabled ? "border-ink/60" : "border-border")}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.gift_enabled}
            onChange={(e) => patch({ gift_enabled: e.target.checked })}
            className="mt-1 h-5 w-5 accent-accent flex-none"
          />
          <span>
            <span className="block font-semibold">{t("create.s2.gift_title", { name: recipientFor(data, userName) })}</span>
            <span className="block text-sm text-muted">{t("create.s2.gift_help")}</span>
          </span>
        </label>
        {data.gift_enabled && (
          <div className="space-y-2 pl-8">
            <span className="block text-sm font-medium">{t("create.s2.suggested")}</span>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((index) => (
                <Input
                  key={index}
                  type="number"
                  min={1}
                  step={1}
                  prefix="$"
                  aria-label={`${t("create.s2.suggested")} ${index + 1}`}
                  value={data.gift_suggested_amounts[index] || ""}
                  onChange={(e) => setGiftAmount(index, e.target.value)}
                />
              ))}
            </div>
            <p className="text-xs text-muted">{t("create.s2.suggested_help")}</p>
          </div>
        )}
      </div>

      {attempted && !anyPrice && <p className="text-sm font-semibold text-red-600">{t("create.s2.pick_one")}</p>}

      {/* Closing date and payout */}
      <div className="space-y-3">
        <Input
          label={t("create.s2.closes")}
          type="date"
          min={today}
          value={data.end_date}
          onChange={(e) => patch({ end_date: e.target.value })}
        />
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
          {data.end_date
            ? t("create.s2.payout", { date: payoutDate(data.end_date, dateLocale) })
            : t("create.s2.payout_pick")}
        </div>
      </div>

      {/* More options */}
      <details className="rounded-2xl border border-border p-4 group">
        <summary className="flex cursor-pointer list-none items-center justify-between min-h-[44px] text-sm font-semibold">
          {t("create.s2.more")}
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-4 space-y-5">
          <Input
            label={t("create.s2.goal")}
            type="number"
            min={0}
            step={50}
            prefix="A$"
            placeholder="2000"
            value={data.goal_amount ?? ""}
            onChange={(e) =>
              patch({ goal_amount: e.target.value ? Number(e.target.value) : undefined })
            }
            hint={t("create.s2.goal_help")}
          />

          <Switch
            checked={data.hide_goal}
            onChange={(checked) => patch({ hide_goal: checked })}
            title={t("create.s2.hide_goal")}
            help={t("create.s2.hide_goal_help")}
          />
          <Switch
            checked={data.keep_private}
            onChange={(checked) => patch({ keep_private: checked })}
            title={t("create.s2.private")}
            help={t("create.s2.private_help")}
          />

          <Input
            label={t("create.s2.spots")}
            type="number"
            min={1}
            step={1}
            placeholder="20"
            value={data.max_contributions ?? ""}
            onChange={(e) =>
              patch({ max_contributions: e.target.value ? Number(e.target.value) : undefined })
            }
            hint={t("create.s2.spots_help")}
          />

          <div className="space-y-2">
            <span className="block text-sm font-medium">{t("create.add_items")}</span>
            <p className="text-xs text-muted">{t("create.add_items.description")}</p>
            <ItemEditor
              items={data.contribution_items}
              onChange={(items) => patch({ contribution_items: items })}
            />
          </div>

          {data.type === "birthday" && (
            <Switch
              checked={data.hide_until_birthday}
              onChange={(checked) => patch({ hide_until_birthday: checked })}
              title={t("create.hide_until_end")}
              help={t("create.hide_until_end.hint")}
            />
          )}

          <CountrySelector
            value={data.country_code}
            onChange={(countryCode, currency) => patch({ country_code: countryCode, currency })}
          />
        </div>
      </details>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft size={16} /> {t("create.button_prev")}
        </Button>
        <Button onClick={handleNext}>
          {t("create.button_next")}
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Step 3: Check & share
// ──────────────────────────────────────────────────────────

function Step3({
  t,
  data,
  organiserName,
  dateLocale,
  onBack,
  onPublish,
  isPublishing,
}: {
  t: WizardT;
  data: WizardData;
  organiserName: string;
  dateLocale: string;
  onBack: () => void;
  onPublish: () => Promise<void>;
  isPublishing: boolean;
}) {
  const recipient = recipientFor(data, organiserName);
  const occasionLabel = t(`create.occasion.${data.type}` as TranslationKey);
  const title = data.title.trim() || t(`create.name.${data.type}` as TranslationKey, { name: recipient });
  const giftAmounts = data.gift_suggested_amounts.filter((a) => a > 0);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const linkPreview = `${origin}/campaign/${slugify(title) || "your-campaign"}`;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{t("create.s3.heading")}</h2>
        <p className="text-sm text-muted">{t("create.s3.sub")}</p>
      </div>

      <div className="rounded-3xl border border-border overflow-hidden bg-background shadow-soft">
        {data.cover_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.cover_photo_url} alt={title} className="w-full aspect-[16/9] object-cover" />
        ) : (
          <div className="w-full aspect-[16/9] bg-gradient-to-br from-accent/20 to-sky-200/40" />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
            <StatusBadge status="active" />
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-sm text-muted">{occasionLabel}</p>
            {data.keep_private && <Badge tone="accent">{t("create.s3.private_badge")}</Badge>}
            {data.hide_goal && <Badge tone="accent">{t("create.s3.goal_hidden_badge")}</Badge>}
            {data.type === "birthday" && data.hide_until_birthday && (
              <Badge tone="accent">🎂 {t("create.s3.birthday_surprise")}</Badge>
            )}
          </div>
          {!data.recipient_is_me && recipient && (
            <p className="text-sm text-muted mt-0.5">{t("create.s3.for", { name: recipient })}</p>
          )}
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">
            {data.description.trim() || t(`create.example.${data.type}` as TranslationKey)}
          </p>

          <div className="mt-6 space-y-3 rounded-2xl bg-foreground/5 p-4 text-sm">
            {data.event_cost_enabled && (
              <div className="flex justify-between gap-3">
                <span className="text-muted">
                  {t("create.s3.event_row")}
                  {data.event_cost_label.trim() ? ` · ${data.event_cost_label.trim()}` : ""}
                </span>
                <span className="font-semibold text-right">
                  {formatAUD(data.event_cost_amount ?? 0)} <span className="font-normal text-muted">{t("create.s3.per_person")}</span>
                </span>
              </div>
            )}
            {data.gift_enabled && (
              <div className="flex justify-between gap-3">
                <span className="text-muted">{t("create.s2.gift_title", { name: recipient })}</span>
                <span className="font-semibold text-right">
                  {giftAmounts.length > 0
                    ? t("create.s3.gift_value", { amounts: giftAmounts.map((a) => formatAUD(a)).join(" / ") })
                    : t("create.s3.gift_any")}
                </span>
              </div>
            )}
            {data.goal_amount && !data.hide_goal && (
              <div className="flex justify-between gap-3">
                <span className="text-muted">{t("create.s2.goal")}</span>
                <span className="font-semibold">{formatAUD(data.goal_amount)}</span>
              </div>
            )}
            {data.goal_amount && data.hide_goal && (
              <div className="flex justify-between gap-3">
                <span className="text-muted">{t("create.s2.goal")}</span>
                <span className="font-semibold">{t("create.s3.goal_hidden_value")}</span>
              </div>
            )}
            {data.end_date && (
              <div className="flex justify-between gap-3">
                <span className="text-muted">{t("create.s3.closes")}</span>
                <span className="font-semibold">
                  {formatDate(data.end_date, dateLocale, { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            )}
            {data.keep_private && (
              <div className="flex justify-between gap-3">
                <span className="text-muted">{t("create.s3.privacy")}</span>
                <span className="font-semibold">{t("create.s3.privacy_value")}</span>
              </div>
            )}
          </div>

          {!data.hide_goal && (
            <div className="mt-5">
              <Progress value={0} max={data.goal_amount || 100} />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium">{t("create.s3.link")}</span>
        <div className="rounded-xl border border-border px-3.5 py-3 text-sm text-muted break-all">{linkPreview}</div>
        <p className="text-xs text-muted">{t("create.s3.link_help")}</p>
      </div>

      <p className="text-sm text-muted">{t("create.s3.review_note")}</p>

      <div className="flex justify-between pt-2">
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
