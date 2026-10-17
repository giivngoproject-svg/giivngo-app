"use client";

import { useMemo, useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { formatDistanceToNowStrict } from "date-fns";
import { Users, Heart, Lock, Camera as CameraIcon, Gift, EyeOff, CheckCircle2, Image as ImageIcon, Video as VideoIcon, Flag } from "lucide-react";
import { useCampaigns } from "@/stores/campaigns";
import { useTranslation } from "@/lib/useTranslation";
import { contributionsApi, storageApi, campaignsApi, type FeeQuote } from "@/lib/api";
import { formatCurrency, roundAmount } from "@/lib/money";
import { getIntlLocale } from "@/lib/locale";
import { useLocale } from "@/hooks/useLocale";
import { useFees } from "@/hooks/useFees";
import { useCheckout } from "@/hooks/useCheckout";
import { FeeBreakdownComponent } from "@/components/checkout/FeeBreakdownComponent";
import { IdentityPicker, type IdentityValue } from "@/components/campaign/IdentityPicker";
import { ChevronDown } from "lucide-react";
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
import { EmojiPicker } from "@/components/campaign/EmojiPicker";
import { MediaAttach } from "@/components/campaign/MediaAttach";

const QUICK_AMOUNTS = [20, 50, 100, 200];
const TIP_OPTIONS = [5, 10, 20];

// Stable empty-array reference so the Zustand selector below doesn't return a
// brand-new array each render (which triggers "getServerSnapshot should be
// cached" and an infinite re-render loop via useSyncExternalStore).
const EMPTY_CONTRIBUTIONS: never[] = [];

type VoucherParams = {
  campaignTitle: string;
  amount: number;
  tipAmount: number;
  total: number;
  eventCostAmount?: number;
  feeAmount?: number;
  feePercent?: number;
  feeFlat?: number;
  currency?: string;
  contributorName?: string;
  paymentIntentId?: string;
  date?: string;
};

function buildCheckoutVoucherHtml(params: VoucherParams): string {
  const { campaignTitle, amount, tipAmount, total, eventCostAmount, feeAmount, feePercent, feeFlat, contributorName, paymentIntentId, date } = params;
  const displayName = contributorName || 'Anonymous';
  const money = (n: number) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: params.currency || 'AUD' }).format(n);
  const row = (label: string, value: string) => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px;">
            <span style="color: #666;">${label}</span>
            <strong>${value}</strong>
          </div>`;
  const feeLabel = feePercent !== undefined && feeFlat !== undefined
    ? `Service fee (${feePercent}% + ${money(feeFlat)})`
    : 'Service fee';
  const today = date || new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">✓ Payment Confirmed</h2>
      </div>

      <div style="background: white; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <p style="margin-top: 0; font-size: 16px;">Thank you for your generous contribution!</p>

        <div style="background: #f9fafb; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px;">
            <span style="color: #666;">Campaign</span>
            <strong>${campaignTitle}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px;">
            <span style="color: #666;">From</span>
            <strong>${displayName}</strong>
          </div>
          ${eventCostAmount && eventCostAmount > 0 ? row('Event cost', money(eventCostAmount)) : ''}
          ${row('Gift', money(amount))}
          ${tipAmount > 0 ? row('Tip', money(tipAmount)) : ''}
          ${feeAmount && feeAmount > 0 ? row(feeLabel, money(feeAmount)) : ''}
          <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; justify-content: space-between; font-size: 16px;">
            <span style="color: #1e1b4b;">Total</span>
            <strong style="color: #4f46e5; font-size: 18px;">${money(total)}</strong>
          </div>
        </div>

        <div style="background: #f3f4f6; padding: 12px; border-radius: 4px; font-size: 13px; color: #666;">
          <p style="margin: 0;"><strong>Date:</strong> ${today}</p>
          ${paymentIntentId ? `<p style="margin: 4px 0 0 0;"><strong>Confirmation ID:</strong> ${paymentIntentId.substring(0, 8).toUpperCase()}...</p>` : ''}
        </div>

        <p style="margin: 16px 0 0 0; font-size: 13px; color: #666; text-align: center;">A receipt has been sent to your email (if provided)</p>
      </div>
    </div>
  `;
}

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

        // Try to read voucher data from sessionStorage
        const voucherData = sessionStorage.getItem('checkout_voucher');
        sessionStorage.removeItem('checkout_voucher');

        if (voucherData) {
          try {
            const data = JSON.parse(voucherData);
            const voucherHtml = buildCheckoutVoucherHtml({
              campaignTitle: data.campaignTitle,
              amount: data.amount,
              tipAmount: data.tipAmount,
              total: data.total,
              eventCostAmount: data.eventCostAmount,
              feeAmount: data.feeAmount,
              feePercent: data.feePercent,
              feeFlat: data.feeFlat,
              currency: data.currency,
              contributorName: data.contributorName,
              date: data.date,
            });

            Swal.fire({
              html: voucherHtml,
              icon: "success",
              confirmButtonColor: "#1E1B4B",
            });
          } catch (err) {
            Swal.fire({
              title: 'Payment received! 🎉',
              text: 'Your contribution has been recorded.',
              icon: "success",
              confirmButtonColor: "#1E1B4B",
            });
          }
        } else {
          Swal.fire({
            title: 'Payment received! 🎉',
            text: 'Your contribution has been recorded.',
            icon: "success",
            confirmButtonColor: "#1E1B4B",
          });
        }
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [reportingSubmitting, setReportingSubmitting] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [identity, setIdentity] = useState<IdentityValue>({ mode: "name", nickname: "" });
  const [includeEvent, setIncludeEvent] = useState(true);
  const [mediaTab, setMediaTab] = useState<"photo" | "video">("photo");

  // Fee quote for the summary, refreshed when the amounts change (same calculation as checkout)
  const [quote, setQuote] = useState<FeeQuote | null>(null);
  useEffect(() => {
    if (!campaign) return;
    const items = campaign.contribution_items ?? [];
    const newPricing = !!campaign.event_cost_enabled || !!campaign.gift_enabled;
    const itemsSum = items.filter((i) => selectedItemIds.has(i.id)).reduce((sum, i) => sum + i.amount, 0);
    const legacyItems = items.length > 0 && !newPricing;
    const giftOrAmount = Number(amount) || 0;
    const baseAmount = legacyItems ? itemsSum : giftOrAmount + (newPricing ? itemsSum : 0);
    const includeEventCost = newPricing && !!campaign.event_cost_enabled && includeEvent;
    const eventCost = includeEventCost ? campaign.event_cost_amount ?? 0 : 0;
    if (baseAmount + eventCost + (Number(tip) || 0) <= 0) {
      setQuote(null);
      return;
    }
    const timer = setTimeout(() => {
      contributionsApi
        .quote(slug, {
          amount: baseAmount,
          tipAmount: Number(tip) || undefined,
          includeEventCost: includeEventCost || undefined,
        })
        .then(setQuote)
        .catch(() => setQuote(null));
    }, 300);
    return () => clearTimeout(timer);
  }, [campaign, slug, amount, tip, includeEvent, selectedItemIds]);

  // Show loading skeleton while fetching
  if (storeIsLoading && !campaign) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
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
  const msLeft = Math.max(0, end.getTime() - Date.now());
  const hoursLeft = Math.floor(msLeft / 3600000);
  const timeLeftLabel = hoursLeft >= 24
    ? t("campaign.time.days", { d: Math.floor(hoursLeft / 24), h: hoursLeft % 24 })
    : t("campaign.time.hours", { h: hoursLeft, m: Math.floor((msLeft % 3600000) / 60000) });
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
  // New create-flow pricing (event cost and/or gift). Legacy campaigns keep the old amount/items UI.
  const usesNewPricing = !tiered && (!!campaign.event_cost_enabled || !!campaign.gift_enabled);
  const giftName = recipient || campaign.organiser_name;
  const usesBirthday = campaign.type === "birthday";
  const eventCostAmount = campaign.event_cost_amount ?? 0;
  const eventTotal = usesNewPricing && campaign.event_cost_enabled && includeEvent ? eventCostAmount : 0;
  const giftSuggested = campaign.gift_suggested_amounts ?? [];
  const giftAmount = usesNewPricing && campaign.gift_enabled ? Number(amount) || 0 : 0;
  const itemsTotal = usesNewPricing
    ? items.filter((i) => selectedItemIds.has(i.id)).reduce((sum, i) => sum + i.amount, 0)
    : 0;
  const grandTotal = eventTotal + giftAmount + itemsTotal + (Number(tip) || 0);
  const fmt = (n: number) => formatCurrency(n, campaign.currency || "AUD", getIntlLocale(localeConfig.locale));

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

  const handleReport = async () => {
    if (!reportReason.trim()) {
      await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
      return;
    }

    setReportingSubmitting(true);
    try {
      await campaignsApi.reportCampaign(slug, {
        reasonCategory: reportReason,
        message: reportMessage || undefined,
        reporterEmail: reportEmail || undefined,
      });

      await Swal.fire({ title: t("campaign.report_submitted"), icon: "success", confirmButtonColor: "#1E1B4B" });
      setShowReportModal(false);
      setReportReason("");
      setReportMessage("");
      setReportEmail("");
    } catch (error) {
      await Swal.fire({ title: t("campaign.report_error"), icon: "error", confirmButtonColor: "#1E1B4B" });
    } finally {
      setReportingSubmitting(false);
    }
  };

  const contribute = async () => {
    let amt: number;
    let selectedItems: Array<{ itemId: string; amount: number }> = [];

    if (hasItems && !usesNewPricing) {
      if (selectedItemIds.size === 0) {
        await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
        return;
      }
      const filtered = items.filter((i) => selectedItemIds.has(i.id));
      selectedItems = filtered.map((i) => ({ itemId: i.id, amount: i.amount }));
      amt = selectedItems.reduce((sum, i) => sum + i.amount, 0);
    } else if (usesNewPricing) {
      selectedItems = items.filter((i) => selectedItemIds.has(i.id)).map((i) => ({ itemId: i.id, amount: i.amount }));
      amt = giftAmount + itemsTotal;
      if (amt < 0 || (amt === 0 && !(campaign.event_cost_enabled && includeEvent))) {
        await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
        return;
      }
    } else {
      amt = Number(amount);
      if (!amt || amt <= 0) {
        await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
        return;
      }
      if (!tiered) {
        if (min && amt < min) {
          await Swal.fire({ title: `Minimum contribution is ${campaign.currency || 'AUD'} $${min}`, icon: "error", confirmButtonColor: "#1E1B4B" });
          return;
        }
        if (max && amt > max) {
          await Swal.fire({ title: `Maximum contribution is ${campaign.currency || 'AUD'} $${max}`, icon: "error", confirmButtonColor: "#1E1B4B" });
          return;
        }
      }
    }

    if (identity.mode === "nickname" && !identity.nickname.trim()) {
      await Swal.fire({ title: t("campaign.identity.nickname_required"), icon: "error", confirmButtonColor: "#1E1B4B" });
      setSubmitting(false);
      return;
    }

    // Validate email (required)
    if (!email.trim()) {
      await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
      setSubmitting(false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      await Swal.fire({ title: t("common.error"), icon: "error", confirmButtonColor: "#1E1B4B" });
      setSubmitting(false);
      return;
    }

    // Validate date format if provided (optional)
    if (dateOfBirth.trim()) {
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
        dateOfBirth: dateOfBirth.trim() || undefined,
        message: message.trim() || undefined,
        emoji,
        photoUrl: photo,
        videoUrl: video,
        selectedItems: selectedItems,
        isPrivate: identity.mode !== "name",
        contributorNickname: identity.mode === "nickname" ? identity.nickname.trim() : undefined,
        anonymousAvatarId: identity.mode === "nickname" ? identity.avatarId : undefined,
        includeEventCost: usesNewPricing && !!campaign.event_cost_enabled && includeEvent ? true : undefined,
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
      const totalFormatted = formatCurrency(response.checkoutTotal, response.currency, intlLocale);
      const contributionFormatted = formatCurrency(amt, response.currency, intlLocale);
      const tipFormatted = response.tipAmount ? formatCurrency(response.tipAmount, response.currency, intlLocale) : null;

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

            <!-- Fee Breakdown: SERVER-CALCULATED -->
            <div style="background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #333;">${t("campaign.breakdown_title")}</h3>
              <div style="space-y: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                  <span style="color: #666;">${t("campaign.breakdown_contribution")}</span>
                  <span style="font-weight: 500;">${contributionFormatted}</span>
                </div>
                ${tipFormatted ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                  <span style="color: #666;">${t("campaign.breakdown_tip")}</span>
                  <span style="font-weight: 500;">${tipFormatted}</span>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                  <span style="color: #666;">${t("campaign.breakdown_stripe_fee")}</span>
                  <span style="font-weight: 500;">${stripeFeeFormatted}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 8px; font-size: 14px; font-weight: 600;">
                  <span style="color: #333;">${t("campaign.breakdown_total")}</span>
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

        // Save voucher data to sessionStorage before confirmPayment (for redirect path)
        const voucherData = {
          campaignTitle: campaign.title,
          amount: amt,
          tipAmount: tipAmount || 0,
          total: response.checkoutTotal,
          eventCostAmount: eventTotal,
          feeAmount: response.stripeFee,
          feePercent: quote?.feePercent,
          feeFlat: quote?.feeFlat,
          currency: campaign.currency || 'AUD',
          contributorName: name.trim() || undefined,
          date: new Date().toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        };
        sessionStorage.setItem('checkout_voucher', JSON.stringify(voucherData));

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
          // Stripe payment errors (card declined, etc.) - show to user
          const stripeErrorMessage = error.message || 'Pago rechazado. Por favor, intenta de nuevo.';
          await Swal.fire({
            title: t("campaign.checkout_failed"),
            text: stripeErrorMessage,
            icon: "error",
            confirmButtonColor: "#1E1B4B"
          });
          submitBtn.disabled = false;
          submitBtn.textContent = `${t("campaign.pay_button", { amount: totalAmount })}`;
        } else if (paymentIntent?.status === 'succeeded') {
          console.log('✅ [Payment] Payment succeeded:', paymentIntent.id);
          modal.remove();
          paymentElement.destroy();

          // Show voucher with payment details
          const voucherHtml = buildCheckoutVoucherHtml({
            campaignTitle: campaign.title,
            amount: amt,
            tipAmount: tipAmount || 0,
            total: response.checkoutTotal,
            eventCostAmount: eventTotal,
            feeAmount: response.stripeFee,
            feePercent: quote?.feePercent,
            feeFlat: quote?.feeFlat,
            currency: campaign.currency || 'AUD',
            contributorName: name.trim() || undefined,
            paymentIntentId: paymentIntent.id,
            date: new Date().toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
          });

          await Swal.fire({
            html: voucherHtml,
            icon: "success",
            confirmButtonColor: "#1E1B4B",
          });

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
          setIdentity({ mode: "name", nickname: "" });
          setIncludeEvent(true);
          setSubmitting(false);

          // Refresh campaign data to show updated raised amount
          await refreshCampaign(slug);
        }
      });
    } catch (error: any) {
      console.error("Checkout error:", error);

      // Parse error from axios
      // Key: isNetworkError is true ONLY if there's no response from server
      // (i.e., timeout, connection refused, etc.)
      const hasResponse = !!error?.response;
      const statusCode = error?.response?.status || 0;
      const errorMessage = error?.response?.data?.message || error?.message || t("common.error");
      const isNetworkError = !hasResponse; // No response = network error
      const isValidationError = statusCode === 400;
      const isServerError = statusCode >= 500;

      let displayTitle = t("campaign.checkout_failed");
      let displayMessage = errorMessage;

      // Determine what to show based on error type
      if (isNetworkError) {
        displayTitle = t("common.error");
        displayMessage = "Comprueba tu conexión a internet e intenta de nuevo";
        console.warn("Network error during checkout:", error);
      } else if (isValidationError) {
        // 400 errors: show the exact message from server (validación o negocio)
        displayTitle = t("common.error");
        displayMessage = errorMessage;
      } else if (isServerError) {
        // 5xx errors: show generic message to avoid exposing server details
        displayTitle = t("common.error");
        displayMessage = "Algo salió mal. Por favor, intenta de nuevo.";
        console.error("Server error during checkout:", error);
      }

      await Swal.fire({
        title: displayTitle,
        text: displayMessage,
        icon: "error",
        confirmButtonColor: "#1E1B4B",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12">


      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        {/* Left: info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero - Media Tabs */}
          <div className="rounded-3xl overflow-hidden bg-background border border-border shadow-soft">
            {campaign.cover_photo_url && campaign.cover_video_url ? (
              <>
                {/* Tabs */}
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setMediaTab("photo")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                      mediaTab === "photo"
                        ? "border-accent text-accent"
                        : "border-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    <ImageIcon size={18} />
                    Photo
                  </button>
                  <button
                    onClick={() => setMediaTab("video")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                      mediaTab === "video"
                        ? "border-accent text-accent"
                        : "border-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    <VideoIcon size={18} />
                    Video
                  </button>
                </div>

                {/* Content */}
                {mediaTab === "photo" && (
                  <div className="aspect-[16/9] bg-foreground/5 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={campaign.cover_photo_url}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {mediaTab === "video" && (
                  <div className="aspect-[16/9] bg-black overflow-hidden">
                    <video
                      src={campaign.cover_video_url}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </>
            ) : campaign.cover_photo_url ? (
              /* Only photo */
              <div className="aspect-[16/9] bg-foreground/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={campaign.cover_photo_url}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : campaign.cover_video_url ? (
              /* Only video */
              <div className="aspect-[16/9] bg-black">
                <video
                  src={campaign.cover_video_url}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              /* No media */
              <div className="aspect-[16/9] bg-gradient-to-br from-accent/20 to-sky-200/40" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <StatusBadge status={campaign.status} />
              {mode !== "standard" && <Badge tone="accent">{POOL_MODE_LABELS[mode]}</Badge>}
              <span className="text-sm text-muted">by {campaign.organiser_name}</span>
            </div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance flex-1">
                {campaign.title}
              </h1>
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
                title={t('campaign.report_button')}
              >
                <Flag size={16} />
                <span className="hidden sm:inline">{t('campaign.report_button')}</span>
              </button>
            </div>
            {recipient && recipient !== campaign.organiser_name && <p className="mt-1 text-muted">for {recipient}</p>}
            <p className="mt-5 text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {campaign.description}
            </p>

            {/* Key facts: raised, contributors and time left in one strip */}
            <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-border">
              <div className="p-3 text-center">
                <p className="font-bold tabular-nums">{goalHidden ? "—" : fmt(campaign.raised_amount)}</p>
                <p className="text-xs text-muted">{t("campaign.stats.raised")}</p>
              </div>
              <div className="border-l border-border p-3 text-center">
                <p className="font-bold tabular-nums">{contributorsHidden ? "—" : contributions.length}</p>
                <p className="text-xs text-muted">{t("campaign.stats.contributors")}</p>
              </div>
              <div className="border-l border-border p-3 text-center">
                <p className="font-bold tabular-nums">{closed ? t("campaign.closed") : timeLeftLabel}</p>
                <p className="text-xs text-muted">{t("campaign.stats.time_left")}</p>
              </div>
            </div>
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
        <aside className="lg:col-span-3 lg:sticky lg:top-20 self-start space-y-4">
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
              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <h2 className="text-xl font-bold md:col-span-2">{t("campaign.form.chip_in", { name: giftName })}</h2>

                <div className="space-y-5">

                <StepHeading n={1} title={t("campaign.identity.title")} />
                <IdentityPicker value={identity} onChange={setIdentity} />

                <Input
                  label={t("campaign.identity.real_name")}
                  placeholder={t("campaign.identity.real_name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  hint={t("campaign.identity.real_name_help")}
                />

                <Input
                  label={t("campaign.identity.email_label")}
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                    {campaign.event_cost_enabled && (
                      <div className="space-y-3">
                        <StepHeading n={2} title={t("campaign.event_cost.title")} />
                        <div className="space-y-3 rounded-2xl border border-border p-4">
                          <label className="flex cursor-pointer items-start gap-3">
                            <input
                              type="checkbox"
                              checked={includeEvent}
                              onChange={(e) => setIncludeEvent(e.target.checked)}
                              className="mt-1 h-5 w-5 flex-none accent-accent"
                            />
                            <span className="text-sm font-medium">{t("campaign.event_cost.include")}</span>
                          </label>
                          <p className="text-sm text-muted">
                            {t("campaign.event_cost.set_by", {
                              name: campaign.organiser_name,
                              label: campaign.event_cost_label || t("campaign.event_cost.default_label"),
                              amount: fmt(eventCostAmount),
                            })}
                          </p>
                          <div className="flex items-center justify-between gap-3 rounded-xl bg-foreground/5 px-3.5 py-3 text-sm">
                            <span className="font-medium">{t("campaign.event_cost.fixed_charge")}</span>
                            <span className="font-semibold tabular-nums">
                              {fmt(eventCostAmount)}{" "}
                              <span className="font-normal text-muted">{t("campaign.event_cost.per_person")}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                {usesNewPricing ? (
                  <div className="space-y-4">
                    {campaign.gift_enabled && (
                      <div className="space-y-3">
                        <StepHeading
                          n={3}
                          title={usesBirthday ? t("campaign.gift.title_birthday", { name: giftName }) : t("campaign.gift.title", { name: giftName })}
                          optional
                        />
                        <p className="text-sm text-muted">{t("campaign.gift.help", { name: giftName })}</p>
                        <div className="grid grid-cols-4 gap-2">
                          {[0, ...giftSuggested].map((q) => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => setAmount(q)}
                              className={`h-11 rounded-xl text-sm font-semibold transition-colors ${giftAmount === q
                                  ? "bg-foreground text-background"
                                  : "bg-foreground/5 hover:bg-foreground/10"
                                }`}
                            >
                              {q === 0 ? t("campaign.gift.none") : fmt(q)}
                            </button>
                          ))}
                        </div>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          placeholder={t("campaign.gift.custom")}
                          prefix={campaign.currency || "AUD"}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                        />
                      </div>
                    )}
                {hasItems && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">{t("campaign.contribution_options")}</p>
                    {items.map((item) => {
                      const active = selectedItemIds.has(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            const next = new Set(selectedItemIds);
                            if (next.has(item.id)) next.delete(item.id);
                            else next.add(item.id);
                            setSelectedItemIds(next);
                          }}
                          className={`flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 text-sm font-medium transition-colors ${active ? "bg-foreground text-background" : "bg-foreground/5 hover:bg-foreground/10"}`}
                        >
                          <span>{item.label}</span>
                          <span>{fmt(item.amount)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* Tip the recipient */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {recipient ? t("campaign.add_tip", { name: recipient }) : t("campaign.add_tip", { name: "the recipient" })} {t("campaign.tip_optional")}
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
                    placeholder={t("campaign.tip.custom_placeholder")}
                    prefix="A$"
                    value={tip}
                    onChange={(e) => setTip(e.target.value ? Number(e.target.value) : "")}
                    hint={t("campaign.tip.hint")}
                  />
                </div>

                  </div>
                ) : (
                <div className="space-y-3">
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
                        placeholder={t("campaign.amount.other_placeholder")}
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

                </div>
                )}

                {/* Tip the recipient */}
                {!usesNewPricing && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {recipient ? t("campaign.add_tip", { name: recipient }) : t("campaign.add_tip", { name: "the recipient" })} {t("campaign.tip_optional")}
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
                    placeholder={t("campaign.tip.custom_placeholder")}
                    prefix="A$"
                    value={tip}
                    onChange={(e) => setTip(e.target.value ? Number(e.target.value) : "")}
                    hint={t("campaign.tip.hint")}
                  />
                </div>

                )}
                </div>

                <div className="space-y-5">
                <StepHeading n={usesNewPricing ? 4 : undefined} title={t("campaign.message.title")} optional />
                <Textarea
                  label={t("campaign.message.label")}
                  placeholder={usesBirthday ? t("campaign.message.placeholder_birthday") : t("campaign.message.placeholder")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={200}
                  rows={2}
                />

                <Input
                  label={t("campaign.dob.label")}
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  hint={t("campaign.dob.hint")}
                />

                <EmojiPicker value={emoji} onChange={setEmoji} />

                <MediaAttach
                  photo={photo}
                  video={video}
                  onPhotoFile={handlePhoto}
                  onPhotoRemove={() => setPhoto(undefined)}
                  onVideoChange={setVideo}
                />


                {usesNewPricing && (
                  <div className="space-y-2 border-t border-border pt-4 text-sm tabular-nums">
                    {eventTotal > 0 && (
                      <div className="flex justify-between gap-3">
                        <span className="text-muted">{t("campaign.summary.event")}</span>
                        <span>{fmt(eventTotal)}</span>
                      </div>
                    )}
                    {itemsTotal > 0 && (
                      <div className="flex justify-between gap-3">
                        <span className="text-muted">{t("campaign.summary.items")}</span>
                        <span>{fmt(itemsTotal)}</span>
                      </div>
                    )}
                    {giftAmount > 0 && (
                      <div className="flex justify-between gap-3">
                        <span className="text-muted">{t("campaign.summary.gift")}</span>
                        <span>{fmt(giftAmount)}</span>
                      </div>
                    )}
                    {(Number(tip) || 0) > 0 && (
                      <div className="flex justify-between gap-3">
                        <span className="text-muted">{t("campaign.summary.tip")}</span>
                        <span>{fmt(Number(tip))}</span>
                      </div>
                    )}
                    {quote && quote.feeAmount > 0 && (
                      <div className="flex justify-between gap-3">
                        <span className="text-muted">
                          {t("campaign.summary.fee", { pct: quote.feePercent, flat: fmt(quote.feeFlat) })}
                        </span>
                        <span>{fmt(quote.feeAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-3 pt-1 text-base font-semibold">
                      <span>{t("campaign.summary.total")}</span>
                      <span>{fmt(quote ? quote.checkoutTotal : grandTotal)}</span>
                    </div>
                  </div>
                )}

                <Button onClick={contribute} loading={submitting} className="w-full" size="lg" disabled={usesNewPricing && grandTotal <= 0}>
                  <Heart size={16} />
                  {usesNewPricing ? (grandTotal > 0 ? t("campaign.pay_amount", { amount: fmt(quote ? quote.checkoutTotal : grandTotal) }) : t("campaign.pay_select")) : hasItems
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
                  <Lock size={11} /> {t('campaign.secure_checkout')}
                </p>
              </div>
              </div>
            )}
          </div>


          <p className="text-xs text-muted text-center px-4 inline-flex items-center gap-1 justify-center w-full">
            {goalHidden && <EyeOff size={11} />}
            Funds are held in Stripe escrow and released to the organiser on the end date.
          </p>
        </aside>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-3xl max-w-md w-full p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-2">{t('campaign.report_title')}</h2>
            <p className="text-sm text-muted mb-4">{t('campaign.report_subtitle')}</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('campaign.report_reason')}</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full mt-2 px-3.5 py-2.5 rounded-2xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value="">{t('campaign.report_reason')}</option>
                  <option value="inappropriate">{t('campaign.report_reason_inappropriate')}</option>
                  <option value="spam">{t('campaign.report_reason_spam')}</option>
                  <option value="fraud">{t('campaign.report_reason_fraud')}</option>
                  <option value="abuse">{t('campaign.report_reason_abuse')}</option>
                  <option value="other">{t('campaign.report_reason_other')}</option>
                </select>
              </div>

              <Textarea
                label={t('campaign.report_message')}
                placeholder="Tell us more about this issue..."
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                rows={3}
              />

              <Input
                label={t('campaign.report_email')}
                type="email"
                placeholder="your@email.com"
                value={reportEmail}
                onChange={(e) => setReportEmail(e.target.value)}
                hint={t('campaign.report_email_hint')}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                disabled={reportingSubmitting}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-border hover:bg-foreground/5 text-sm font-medium disabled:opacity-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleReport}
                disabled={reportingSubmitting || !reportReason.trim()}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50"
              >
                {reportingSubmitting ? t('common.loading') + '...' : t('campaign.report_submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepHeading({ n, title, optional }: { n?: number; title: string; optional?: boolean }) {
  const t = useTranslation();
  return (
    <div className="flex items-center gap-2.5">
      {n !== undefined && (
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
          {n}
        </span>
      )}
      <h3 className="text-base font-semibold">
        {title}
        {optional && <span className="ml-1 font-normal text-muted">{t("campaign.optional")}</span>}
      </h3>
    </div>
  );
}
