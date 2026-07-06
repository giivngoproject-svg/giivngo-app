"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { formatDistanceToNowStrict } from "date-fns";
import { Users, Heart, Lock, Camera as CameraIcon, Gift, EyeOff, CheckCircle2 } from "lucide-react";
import { useCampaigns } from "@/stores/campaigns";
import { useTranslation } from "@/lib/useTranslation";
import { contributionsApi, storageApi } from "@/lib/api";
import { formatCurrency, roundAmount } from "@/lib/money";
import { getIntlLocale } from "@/lib/locale";
import { useLocale } from "@/hooks/useLocale";
import { useFees } from "@/hooks/useFees";
import { useCheckout } from "@/hooks/useCheckout";
import { FeeBreakdownComponent } from "@/components/checkout/FeeBreakdownComponent";
import { AnonymousAvatarSelector } from "@/components/anonymous-avatar-selector";
import {
  isGoalHidden,
  isContributorsHidden,
  isTiered,
  isBirthdayHidden,
  poolMode,
  tipTotal,
  POOL_MODE_LABELS,
} from "@/lib/pool";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { GiftWall } from "@/components/campaign/GiftWall";
import { Countdown } from "@/components/campaign/Countdown";
import { ActivityFeed } from "@/components/campaign/ActivityFeed";
import { EmojiPicker } from "@/components/campaign/EmojiPicker";
import { VideoDrop } from "@/components/campaign/VideoDrop";

const QUICK_AMOUNTS = [20, 50, 100, 200];
const TIP_OPTIONS = [5, 10, 20];

// Stable empty-array reference so the Zustand selector below doesn't return a
// brand-new array each render (which triggers "getServerSnapshot should be
// cached" and an infinite re-render loop via useSyncExternalStore).
const EMPTY_CONTRIBUTIONS: never[] = [];

export default function PublicCampaignPage() {
  const t = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const localeConfig = useLocale();
  const campaign = useCampaigns((s) => s.campaigns.find((c) => c.slug === slug));
  const storeIsLoading = useCampaigns((s) => s.isLoading);
  const loadCampaign = useCampaigns((s) => s.loadCampaign);
  const loadContributions = useCampaigns((s) => s.loadContributions);
  const refreshCampaign = useCampaigns((s) => s.refreshCampaign);
  const allContributions = useCampaigns((s) => s.contributions[slug] ?? EMPTY_CONTRIBUTIONS);

  // Load campaign and contributions on mount
  useEffect(() => {
    if (slug) {
      loadCampaign(slug).catch(console.error);
      loadContributions(slug).catch(console.error);

      // Check if returning from Stripe checkout
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkout') === 'success') {
        // Reload contributions after small delay to ensure webhook processed
        setTimeout(() => {
          loadContributions(slug).catch(console.error);
        }, 2000);

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        Swal.fire({
          title: 'Payment received! 🎉',
          text: 'Your contribution has been recorded.',
          icon: "success",
          confirmButtonColor: "#1E1B4B",
        });
      }
    }
  }, [slug]);

  const contributions = useMemo(
    () => allContributions,
    [allContributions],
  );

  const [amount, setAmount] = useState<number | "">("");
  const [tip, setTip] = useState<number | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState<string | undefined>(undefined);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [video, setVideo] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | undefined>();

  // Show loading skeleton while fetching
  if (storeIsLoading && !campaign) {
    return (
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        {/* Hero skeleton */}
        <div className="rounded-3xl overflow-hidden bg-background border border-border shadow-soft mb-8 animate-pulse">
          <div className="aspect-[16/9] bg-foreground/10" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-4 mb-8 animate-pulse">
          <div className="h-8 bg-foreground/10 rounded-lg w-3/4" />
          <div className="h-4 bg-foreground/10 rounded-lg w-full" />
          <div className="h-4 bg-foreground/10 rounded-lg w-5/6" />
        </div>

        {/* Progress bar skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 bg-foreground/10 rounded-lg w-1/2" />
            <div className="h-8 bg-foreground/10 rounded-lg" />
          </div>
        </div>

        {/* Gift wall skeleton */}
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
              <div className="w-10 h-10 bg-foreground/10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-foreground/10 rounded-lg w-1/3" />
                <div className="h-3 bg-foreground/10 rounded-lg w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Only show "not found" after loading is complete and campaign doesn't exist
  if (!storeIsLoading && !campaign) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">{t("campaign.not_found")}</h1>
        <p className="text-muted mt-2">
          {t("campaign.not_found_description")}
        </p>
        <Link href="/">
          <Button variant="outline" className="mt-6">
            {t("campaign.back_home")}
          </Button>
        </Link>
      </div>
    );
  }

  // Type guard: campaign must exist at this point
  if (!campaign) return null;

  const end = new Date(campaign.end_date);
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const closed = campaign.status !== "active";
  const min = campaign.min_contribution;
  const max = campaign.max_contribution;

  const goalHidden = isGoalHidden(campaign);
  const contributorsHidden = isContributorsHidden(campaign);
  const tiered = isTiered(campaign);
  const hasItems = campaign.contribution_items?.length ?? 0 > 0;
  const items = campaign.contribution_items ?? [];
  const tiers = campaign.tiers ?? [];
  const mode = poolMode(campaign);
  const tips = tipTotal(contributions);
  const recipient = campaign.recipient_name?.trim();
  const birthdayHidden = isBirthdayHidden(campaign);

  const handlePhoto = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
      return;
    }
    try {
      const { url } = await storageApi.uploadImage(file);
      setPhoto(url);
      await Swal.fire({ title: t("common.success"), icon: "success", confirmButtonColor: "#1E1B4B" });
    } catch (error) {
      await Swal.fire({ title: t("campaign.checkout_failed"), icon: "error", confirmButtonColor: "#1E1B4B" });
    }
  };

  const contribute = async () => {
    let amt: number;
    let selectedItems: Array<{ itemId: string; amount: number }> = [];

    if (hasItems) {
      if (selectedItemIds.size === 0) {
        await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
        return;
      }
      const filtered = items.filter((i) => selectedItemIds.has(i.id));
      selectedItems = filtered.map((i) => ({ itemId: i.id, amount: i.amount }));
      amt = selectedItems.reduce((sum, i) => sum + i.amount, 0);
    } else {
      amt = Number(amount);
      if (!amt || amt <= 0) {
        await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
        return;
      }
      if (!tiered) {
        if (min && amt < min) {
          await Swal.fire({ title: `Minimum is ${formatCurrency(min, campaign.currency || 'AUD', getIntlLocale(localeConfig.locale))}`, icon: "error", confirmButtonColor: "#1E1B4B" });
          return;
        }
        if (max && amt > max) {
          await Swal.fire({ title: `Maximum is ${formatCurrency(max, campaign.currency || 'AUD', getIntlLocale(localeConfig.locale))}`, icon: "error", confirmButtonColor: "#1E1B4B" });
          return;
        }
      }
    }

    // Validate date of birth (required)
    if (!dateOfBirth.trim()) {
      await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
      setSubmitting(false);
      return;
    }

    // Validate date format (basic check)
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      await Swal.fire({ title: t("campaign.validation_failed"), icon: "error", confirmButtonColor: "#1E1B4B" });
      setSubmitting(false);
      return;
    }

    // Check if date is not in future
    if (dob > new Date()) {
      await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    try {
      const tipAmount = tip ? Number(tip) : 0;

      // CRITICAL: Do NOT pre-calculate fees on client
      // Backend will authoritatively calculate all fees based on country/currency
      const response = await contributionsApi.checkout(campaign.slug, {
        amount: amt,
        tipAmount: tipAmount || undefined,
        contributorName: name.trim() || undefined,
        contributorEmail: email.trim() || undefined,
        dateOfBirth: dateOfBirth.trim(),
        message: message.trim() || undefined,
        emoji,
        photoUrl: photo,
        videoUrl: video,
        selectedItems: selectedItems,
        isPrivate: isPrivate,
        anonymousAvatarId: isPrivate ? selectedAvatarId : undefined,
        creatorStripeAccountId: (campaign as any).creatorStripeAccountId || undefined,
      });

      // Verify clientSecret is valid
      if (!response.clientSecret) {
        await Swal.fire({ title: t("campaign.checkout_failed"), text: 'No payment secret received', icon: "error", confirmButtonColor: "#1E1B4B" });
        setSubmitting(false);
        return;
      }

      // Verify Stripe is loaded
      const StripeLib = (window as any).Stripe;
      if (!StripeLib) {
        await Swal.fire({ title: t("campaign.checkout_failed"), text: 'Payment system not loaded', icon: "error", confirmButtonColor: "#1E1B4B" });
        setSubmitting(false);
        return;
      }

      // Initialize Stripe
      const stripe = StripeLib(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        await Swal.fire({ title: t("campaign.checkout_failed"), text: 'Failed to initialize payment system', icon: "error", confirmButtonColor: "#1E1B4B" });
        setSubmitting(false);
        return;
      }

      const totalAmount = response.checkoutTotal.toFixed(2);
      const intlLocale = getIntlLocale(localeConfig.locale);

      // Create elements with clientSecret (backend-calculated)
      console.log('🔵 [Payment] Creating elements with clientSecret:', response.clientSecret.substring(0, 20) + '...');
      const elements = stripe.elements({
        clientSecret: response.clientSecret,
      });
      const paymentElement = elements.create('payment');

      if (!paymentElement) {
        throw new Error('Failed to create payment element');
      }

      // Create modal HTML with SERVER-CALCULATED fees
      const stripeFeeFormatted = formatCurrency(response.stripeFee, response.currency, intlLocale);
      const platformFeeFormatted = formatCurrency(response.platformFee, response.currency, intlLocale);
      const totalFormatted = formatCurrency(response.checkoutTotal, response.currency, intlLocale);
      const contributionFormatted = formatCurrency(amt, response.currency, intlLocale);

      const modalHTML = `
        <div id="payment-modal" style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow-y: auto;
          ">
            <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 700;">${t("campaign.checkout_title")}</h2>
            <p style="color: #999; margin: 0 0 24px; font-size: 14px;">${t("campaign.checkout_subtitle")}</p>

            <div style="background: #f0f7ff; border: 1px solid #cce5ff; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #666; font-weight: 500;">
                ${t("campaign.test_card")}
              </p>
              <p style="margin: 0; font-family: monospace; font-size: 16px; color: #222; font-weight: 600;">
                ${t("campaign.test_card_number")}
              </p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #666;">${t("campaign.test_card_hint")}</p>
            </div>

            <!-- Fee Breakdown: SERVER-CALCULATED -->
            <div style="background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #333;">Payment breakdown</h3>
              <div style="space-y: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                  <span style="color: #666;">Your contribution:</span>
                  <span style="font-weight: 500;">${contributionFormatted}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                  <span style="color: #666;">Stripe processing fee:</span>
                  <span style="font-weight: 500;">${stripeFeeFormatted}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                  <span style="color: #666;">Platform fee:</span>
                  <span style="font-weight: 500;">${platformFeeFormatted}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 8px; font-size: 14px; font-weight: 600;">
                  <span style="color: #333;">Total to charge:</span>
                  <span style="color: #0066cc;">${totalFormatted}</span>
                </div>
              </div>
            </div>

            <div id="payment-element" style="margin-bottom: 20px;"></div>

            <div style="display: flex; gap: 10px;">
              <button id="submit-btn" style="flex: 1; padding: 12px; background: #0066cc; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">${t("campaign.pay_button", { amount: totalAmount })}</button>
              <button id="cancel-btn" style="flex: 1; padding: 12px; background: #f0f0f0; color: #333; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">${t("common.cancel")}</button>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHTML);
      paymentElement.mount('#payment-element');

      const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
      const cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;
      const modal = document.getElementById('payment-modal')!;

      cancelBtn.addEventListener('click', () => {
        modal.remove();
        paymentElement.destroy();
        setSubmitting(false);
      });

      submitBtn.addEventListener('click', async () => {
        submitBtn.disabled = true;
        submitBtn.textContent = `${t("campaign.processing")}`;

        // Step 1: Submit the Payment Element form for validation
        console.log('🔵 [Payment] Submitting payment element for validation...');
        const submitError = await elements.submit();
        console.log('🔵 [Payment] elements.submit() result:', submitError);

        if (submitError && submitError.error) {
          const errorMsg = submitError.error.message || JSON.stringify(submitError.error);
          console.error('❌ [Payment] Validation error:', submitError.error);
          await Swal.fire({ title: t("campaign.validation_failed"), text: errorMsg, icon: "error", confirmButtonColor: "#1E1B4B" });
          submitBtn.disabled = false;
          submitBtn.textContent = `${t("campaign.pay_button", { amount: totalAmount })}`;
          return;
        }

        // Step 2: Confirm payment with Stripe
        console.log('🔵 [Payment] Confirming payment with Stripe...');
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          clientSecret: response.clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/campaign/${campaign.slug}?checkout=success`,
          },
        });

        console.log('🔵 [Payment] confirmPayment() result:', { error, paymentIntent });

        if (error) {
          console.error('❌ [Payment] Payment error:', error);
          await Swal.fire({ title: t("campaign.checkout_failed"), text: error.message, icon: "error", confirmButtonColor: "#1E1B4B" });
          submitBtn.disabled = false;
          submitBtn.textContent = `${t("campaign.pay_button", { amount: totalAmount })}`;
        } else if (paymentIntent?.status === 'succeeded') {
          console.log('✅ [Payment] Payment succeeded:', paymentIntent.id);
          modal.remove();
          paymentElement.destroy();
          await Swal.fire({ title: t("campaign.payment_successful"), icon: "success", confirmButtonColor: "#1E1B4B" });

          // Reset form
          setAmount('');
          setTip('');
          setName('');
          setEmail('');
          setDateOfBirth('');
          setMessage('');
          setEmoji(undefined);
          setPhoto(undefined);
          setVideo(undefined);
          setSelectedItemIds(new Set());
          setIsPrivate(false);
          setSelectedAvatarId(undefined);
          setSubmitting(false);

          // Refresh campaign data to show updated raised amount
          await refreshCampaign(slug);
        }
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      await Swal.fire({
        title: t("campaign.checkout_failed"),
        text: error.message || error.response?.data?.message || t("common.error"),
        icon: "error",
        confirmButtonColor: "#1E1B4B",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">


      {/* Live activity ticker (hidden if birthday surprise) */}
      {!closed && !birthdayHidden && (
        <div className="mt-4 flex justify-center">
          <ActivityFeed contributions={contributions} hideIdentities={contributorsHidden} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left: info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero */}
          <div className="rounded-3xl overflow-hidden bg-background border border-border shadow-soft">
            <div className="aspect-[16/9] bg-foreground/5">
              {campaign.cover_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={campaign.cover_photo_url}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-sky-200/40" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <StatusBadge status={campaign.status} />
              {mode !== "standard" && <Badge tone="accent">{POOL_MODE_LABELS[mode]}</Badge>}
              <span className="text-sm text-muted">by {campaign.organiser_name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              {campaign.title}
            </h1>
            {recipient && <p className="mt-1 text-muted">for {recipient}</p>}
            <p className="mt-5 text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {campaign.description}
            </p>
          </div>

          {/* Gift wall based on Pool Mode */}
          {/* Birthday Surprise: hide everything until end date */}
          {birthdayHidden ? (
            <div className="rounded-3xl border border-border bg-background p-6 text-center">
              <div className="mx-auto w-11 h-11 rounded-full bg-foreground/5 flex items-center justify-center mb-3">
                <span className="text-xl">🎂</span>
              </div>
              <h2 className="font-semibold">{t("campaign.surprise_hidden")}</h2>
              <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
                {t("campaign.surprise_description")}{" "}
                {new Date(campaign.end_date).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                })}
                .
              </p>
            </div>
          ) :
          /* Blind Pool: show progress only, hide names & amounts */
          contributorsHidden ? (
            <div className="rounded-3xl border border-border bg-background p-6 text-center">
              <div className="mx-auto w-11 h-11 rounded-full bg-foreground/5 flex items-center justify-center mb-3">
                <Lock size={18} className="text-muted" />
              </div>
              <h2 className="font-semibold">{t("campaign.blind_pool")}</h2>
              <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
                {t("campaign.blind_description")}
              </p>
            </div>
          ) :
          /* Mystery Mode: hide gift wall */
          goalHidden ? (
            <div className="rounded-3xl border border-border bg-background p-6 text-center">
              <div className="mx-auto w-11 h-11 rounded-full bg-foreground/5 flex items-center justify-center mb-3">
                <span className="text-2xl">🎁</span>
              </div>
              <h2 className="font-semibold">{t("campaign.mystery_pool")}</h2>
              <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
                {t("campaign.mystery_description")}
              </p>
            </div>
          ) :
          /* Standard: show public gift wall */
          (
            <div>
              <h2 className="font-semibold mb-2 inline-flex items-center gap-1.5">
                <Gift size={16} className="text-accent" />
                {t("campaign.gift_wall")} ({contributions.length})
              </h2>
              <GiftWall contributions={contributions} showAmounts={true} />
            </div>
          )}
        </div>

        {/* Right: contribute */}
        <aside className="lg:sticky lg:top-20 self-start space-y-4">
          <div className="rounded-3xl border border-border bg-background p-5">
            {/* Birthday Surprise: hide everything */}
            {birthdayHidden ? (
              <div className="text-center py-1">
                <p className="text-2xl">🎂</p>
                <p className="font-semibold mt-1">{t("campaign.surprise_hidden")}</p>
                <p className="text-sm text-muted mt-1">
                  {t("campaign.surprise_description")}{" "}
                  {new Date(campaign.end_date).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                  })}
                  .
                </p>
              </div>
            ) :
            /* Mystery Mode: hide goal */
            goalHidden ? (
              <div className="text-center py-1">
                <p className="text-2xl">🎁</p>
                <p className="font-semibold mt-1">{t("campaign.mystery_pool")}</p>
                <p className="text-sm text-muted mt-1">
                  {closed
                    ? `${t("campaign.mystery_description")}${recipient ? ` for ${recipient}` : ""}.`
                    : `${t("campaign.mystery_description")}${recipient ? ` for ${recipient}` : ""}.`}
                </p>
              </div>
            ) :
            /* Standard & Blind & Tiers: show goal & progress */
            (
              <>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">{formatCurrency(campaign.raised_amount)}</p>
                  {campaign.goal_amount ? (
                    <p className="text-sm text-muted">{t("manage.of")} {formatCurrency(campaign.goal_amount)}</p>
                  ) : (
                    <p className="text-sm text-muted">{t("create.form.no_goal")}</p>
                  )}
                </div>
                <Progress
                  value={campaign.raised_amount}
                  max={campaign.goal_amount || campaign.raised_amount || 1}
                  className="mt-2"
                />
                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Users size={12} /> {contributions.length} {t("campaign.contributors")}
                  </span>
                  {campaign.status === "active" ? (
                    <span>
                      {daysLeft} day{daysLeft === 1 ? "" : "s"} {t("campaign.days_left")}
                    </span>
                  ) : (
                    <span>{t("campaign.ended_ago", { time: formatDistanceToNowStrict(end) })}</span>
                  )}
                </div>
                {tips > 0 && (
                  <p className="mt-2 text-xs text-accent">
                    + {formatCurrency(tips)} in tips for {recipient || "the recipient"}
                  </p>
                )}
              </>
            )}

            {closed ? (
              <div className="mt-5 p-4 rounded-2xl bg-foreground/5 text-sm text-muted text-center">
                {t("campaign.closed")}
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {hasItems ? t("campaign.contribution_options") : t("campaign.fixed_amount")}
                  </label>
                  {hasItems ? (
                    <div className="space-y-2">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            const next = new Set(selectedItemIds);
                            if (next.has(item.id)) {
                              next.delete(item.id);
                            } else {
                              next.add(item.id);
                            }
                            setSelectedItemIds(next);
                          }}
                          className={`w-full h-11 rounded-xl text-sm font-medium transition-colors flex items-center justify-between px-3 ${selectedItemIds.has(item.id)
                              ? "bg-accent text-accent-foreground"
                              : "bg-foreground/5 hover:bg-foreground/10"
                            }`}
                        >
                          <span>{item.label}</span>
                          <span>{formatCurrency(item.amount)}</span>
                        </button>
                      ))}
                      {selectedItemIds.size > 0 && (
                        <div className="mt-2 p-3 rounded-2xl bg-accent/5 text-sm font-medium">
                          {t("campaign.selected")}{" "}
                          {Array.from(selectedItemIds)
                            .map((id) => items.find((i) => i.id === id)?.label)
                            .filter(Boolean)
                            .join(" + ")}{" "}
                          = {formatCurrency(
                            Array.from(selectedItemIds).reduce(
                              (sum, id) => sum + (items.find((i) => i.id === id)?.amount || 0),
                              0,
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  ) : tiered ? (
                    <div className="grid grid-cols-2 gap-2">
                      {tiers.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setAmount(t)}
                          className={`h-11 rounded-xl text-sm font-semibold transition-colors ${amount === t
                              ? "bg-foreground text-background"
                              : "bg-foreground/5 hover:bg-foreground/10"
                            }`}
                        >
                          {formatCurrency(t)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2 mb-2">
                        {QUICK_AMOUNTS.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setAmount(q)}
                            className={`flex-1 h-9 rounded-xl text-sm font-medium transition-colors ${amount === q
                                ? "bg-foreground text-background"
                                : "bg-foreground/5 hover:bg-foreground/10"
                              }`}
                          >
                            {formatCurrency(q)}
                          </button>
                        ))}
                      </div>
                      <Input
                        type="number"
                        min={min || 1}
                        max={max}
                        placeholder="Other amount"
                        prefix="A$"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                        hint={
                          min && max
                            ? `Between ${formatCurrency(min)} and ${formatCurrency(max)}`
                            : min
                              ? `Min ${formatCurrency(min)}`
                              : max
                                ? `Max ${formatCurrency(max)}`
                                : undefined
                        }
                      />
                    </>
                  )}
                </div>

                {/* Tip the recipient */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Add a tip{recipient ? ` for ${recipient}` : ""} (optional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    {TIP_OPTIONS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTip(tip === t ? "" : t)}
                        className={`flex-1 h-9 rounded-xl text-sm font-medium transition-colors ${tip === t
                            ? "bg-accent text-accent-foreground"
                            : "bg-foreground/5 hover:bg-foreground/10"
                          }`}
                      >
                        +{formatCurrency(t)}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    min={0}
                    step={5}
                    placeholder="Custom tip"
                    prefix="A$"
                    value={tip}
                    onChange={(e) => setTip(e.target.value ? Number(e.target.value) : "")}
                    hint="Goes straight to the recipient, on top of your contribution."
                  />
                </div>

                <Input
                  label="Name (optional)"
                  placeholder="Or leave blank for anonymous"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  label="Email for receipt (optional)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="Date of Birth (required)"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  hint="We need this to process your contribution"
                />

                <Textarea
                  label="Message (optional)"
                  placeholder="A note for the gift wall…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                />

                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-border hover:bg-foreground/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium">Make my contribution private</p>
                    <p className="text-xs text-muted mt-0.5">
                      Your name won't appear publicly — {campaign.organiser_name} can still see it.
                    </p>
                  </div>
                </label>

                {isPrivate && (
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">🎭 Choose Your Anonymous Identity</h3>
                    <AnonymousAvatarSelector
                      value={selectedAvatarId}
                      onChange={setSelectedAvatarId}
                    />
                  </div>
                )}

                <EmojiPicker value={emoji} onChange={setEmoji} />

                <PhotoPicker value={photo} onChange={setPhoto} onUpload={handlePhoto} />

                <VideoDrop value={video} onChange={setVideo} />

                <Button onClick={contribute} loading={submitting} className="w-full" size="lg">
                  <Heart size={16} />
                  {hasItems
                    ? selectedItemIds.size > 0
                      ? (() => {
                          const itemsTotal = Array.from(selectedItemIds).reduce(
                            (sum, id) => sum + (items.find((i) => i.id === id)?.amount || 0),
                            0,
                          );
                          const netAmount = itemsTotal + (Number(tip) || 0);
                          return `Contribute ${formatCurrency(netAmount, campaign.currency || 'AUD', getIntlLocale(localeConfig.locale))}`;
                        })()
                      : "Select items"
                    : amount
                      ? (() => {
                          const netAmount = Number(amount) + (Number(tip) || 0);
                          return `Contribute ${formatCurrency(netAmount, campaign.currency || 'AUD', getIntlLocale(localeConfig.locale))}`;
                        })()
                      : "Contribute"}
                </Button>
                <p className="text-xs text-muted text-center inline-flex items-center justify-center gap-1 w-full">
                  <Lock size={11} /> Secure checkout · Stripe (simulated)
                </p>
              </div>
            )}
          </div>

          {/* Countdown clock */}
          {!closed && <Countdown endDate={campaign.end_date} />}

          <p className="text-xs text-muted text-center px-4 inline-flex items-center gap-1 justify-center w-full">
            {goalHidden && <EyeOff size={11} />}
            Funds are held in Stripe escrow and released to the organiser on the end date.
          </p>
        </aside>
      </div>
    </div>
  );
}

function PhotoPicker({
  value,
  onChange,
  onUpload,
}: {
  value?: string;
  onChange: (v?: string) => void;
  onUpload: (f: File) => void | Promise<void>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">Add a photo (optional)</label>
      {value ? (
        <div className="flex items-center gap-3 p-2 rounded-2xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-12 h-12 rounded-xl object-cover" />
          <p className="text-sm text-muted flex-1">Attached</p>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-xs text-muted hover:text-foreground"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 h-11 px-3.5 rounded-2xl border border-dashed border-border text-sm text-muted hover:text-foreground hover:bg-foreground/[.02] cursor-pointer">
          <CameraIcon size={14} />
          Upload a photo
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onUpload(f);
              e.target.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}
