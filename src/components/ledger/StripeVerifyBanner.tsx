"use client";

import { useEffect, useState } from "react";
import { ledgerApi, profileApi, type LedgerStatus } from "@/lib/api";
import { useTranslation } from "@/lib/useTranslation";
import { useAuth } from "@/stores/auth";

/**
 * Dashboard banner for organizers who have money raised but cannot withdraw yet.
 * - No Stripe account: soft prompt ("You've raised $X! Verify now...").
 * - Account started but not verified: "Finish verifying to withdraw".
 * The button requests a fresh Account Link (the backend reuses the existing account).
 */
export function StripeVerifyBanner() {
  const t = useTranslation();
  const user = useAuth((s) => s.user);
  const [status, setStatus] = useState<LedgerStatus | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    ledgerApi.status().then(setStatus).catch(() => setStatus(null));
  }, [user?.id]);

  if (!status?.needsVerification) return null;

  const amount = `${status.currency} ${status.totalRaised.toFixed(2)}`;
  const linked = !!user?.stripe_account_id;

  const verify = async () => {
    setBusy(true);
    try {
      const res = await profileApi.connectStripe();
      window.location.href = res.accountLink;
    } catch {
      setBusy(false);
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">
          {linked ? t("ledger.banner.finish_title") : t("ledger.banner.raised_title", { amount })}
        </p>
        <p className="mt-1 text-sm text-gray-700">{t("ledger.banner.body")}</p>
      </div>
      <button
        type="button"
        onClick={verify}
        disabled={busy}
        className="shrink-0 rounded-full bg-[#1E1B4B] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {t("ledger.banner.cta")}
      </button>
    </div>
  );
}
