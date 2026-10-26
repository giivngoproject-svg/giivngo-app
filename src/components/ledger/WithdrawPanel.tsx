"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ledgerApi, type WithdrawalStatus } from "@/lib/api";
import { useTranslation } from "@/lib/useTranslation";
import { Button } from "@/components/ui/Button";

/**
 * Withdraw card for the organizer's campaign management page.
 * Shows the net balance and, when not yet possible, the reasons why.
 */
export function WithdrawPanel({ slug }: { slug: string }) {
  const t = useTranslation();
  const [data, setData] = useState<WithdrawalStatus | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    ledgerApi.withdrawalStatus(slug).then(setData).catch(() => setData(null));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!data) return null;

  const withdraw = async () => {
    setBusy(true);
    try {
      await ledgerApi.withdraw(slug);
      await Swal.fire({ title: t("ledger.withdraw.done"), icon: "success", confirmButtonColor: "#1E1B4B" });
    } catch {
      await Swal.fire({ title: t("ledger.withdraw.failed"), icon: "error", confirmButtonColor: "#1E1B4B" });
    } finally {
      setBusy(false);
      load();
    }
  };

  return (
    <section className="mb-8 space-y-3 rounded-3xl border border-border bg-background p-5">
      <h2 className="font-semibold">{t("ledger.withdraw.title")}</h2>
      <p className="text-2xl font-bold tabular-nums">
        {data.currency} {data.amount.toFixed(2)}
      </p>

      {data.canWithdraw ? (
        <Button onClick={withdraw} loading={busy}>
          {t("ledger.withdraw.cta")}
        </Button>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
          {data.blockers.map((b) => (
            <li key={b}>
              {t(`ledger.blocker.${b}` as any)}
              {b === "payout_date_pending" && data.payoutDate
                ? ` ${new Date(data.payoutDate).toLocaleDateString()}`
                : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
