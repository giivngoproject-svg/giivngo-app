"use client";

import { useEffect, useState } from "react";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AnonymousAvatarSelector } from "@/components/anonymous-avatar-selector";
import { formatAUD } from "@/lib/money";
import { uid } from "@/lib/slug";
import { useCampaigns } from "@/stores/campaigns";
import { toast } from "@/stores/toast";
import type { CheckoutRequest, CheckoutResult } from "@/lib/mock/stripe";
import type { Contribution } from "@/lib/types";

type Detail = { request: CheckoutRequest; resolve: (r: CheckoutResult) => void };

export function MockStripeCheckout() {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [tab, setTab] = useState<"card" | "apple" | "google">("card");
  const [card, setCard] = useState({ number: "4242 4242 4242 4242", exp: "12/29", cvc: "123" });
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState<Contribution | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | undefined>();
  const addContribution = useCampaigns((s) => s.addContribution);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<Detail>;
      setDetail(ce.detail);
      setProcessing(false);
      setDone(null);
      setTab("card");
      setSelectedAvatarId(undefined);
    };
    window.addEventListener("giivngo:checkout:open", handler);
    return () => window.removeEventListener("giivngo:checkout:open", handler);
  }, []);

  const close = (result: CheckoutResult) => {
    detail?.resolve(result);
    setDetail(null);
  };

  const pay = () => {
    if (!detail) return;
    setProcessing(true);
    setTimeout(() => {
      const contribution: Contribution = {
        id: uid("contrib"),
        campaign_id: detail.request.campaignId,
        anonymous_avatar_id: detail.request.is_private ? selectedAvatarId : undefined,
        contributor_name: detail.request.is_private ? undefined : detail.request.contributor_name?.trim() || undefined,
        contributor_email: detail.request.is_private ? undefined : detail.request.contributor_email?.trim() || undefined,
        amount: detail.request.amount,
        fee_amount: feeAmount,
        tip_amount: detail.request.tip_amount || undefined,
        message: detail.request.message?.trim() || undefined,
        emoji: detail.request.emoji || undefined,
        photo_url: detail.request.photo_url,
        video_url: detail.request.video_url,
        selected_items: detail.request.items,
        is_private: detail.request.is_private,
        status: "succeeded",
        created_at: new Date().toISOString(),
      };
      addContribution(contribution);
      setDone(contribution);
      setProcessing(false);
      if (contribution.contributor_email) {
        toast.success(
          "Receipt emailed",
          `Sent to ${contribution.contributor_email} (mock)`,
        );
      } else if (contribution.is_private) {
        toast.success(
          "Contribution received",
          `You're contributing as ${selectedAvatarId ? '🎭 Anonymous' : 'Anonymous'} (mock)`,
        );
      }
    }, 900);
  };

  if (!detail) return null;
  const { request } = detail;

  // Calculate platform fee (2.5% on contribution amount only, not tip)
  const feeAmount = Math.round(request.amount * 0.025 * 100) / 100;
  const tip = request.tip_amount || 0;
  const total = request.amount + feeAmount + tip;

  if (done) {
    return (
      <Modal open onClose={() => close({ status: "succeeded", contribution: done })} hideClose>
        <div className="text-center py-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <CheckCircle2 className="text-emerald-600" size={26} />
          </div>
          <h3 className="text-lg font-semibold">Payment successful</h3>
          <p className="text-sm text-muted mt-1">
            {done.selected_items && done.selected_items.length > 0
              ? `Contributed ${done.selected_items.map((i) => i.label).join(" + ")}`
              : `${formatAUD(request.amount)} contributed`}
            {tip > 0 ? ` + ${formatAUD(tip)} tip` : ""}. Receipt sent to your email.
          </p>
          <Button
            onClick={() => close({ status: "succeeded", contribution: done })}
            className="mt-6 w-full"
          >
            Done
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => close({ status: "cancelled" })} hideClose>
      <div className="-mx-5 -mt-5 px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Lock size={12} />
          <span>Stripe checkout · simulated</span>
        </div>
        {request.items && request.items.length > 0 ? (
          <div className="mt-3 space-y-1.5 text-sm">
            {request.items.map((item) => (
              <div key={item.item_id} className="flex justify-between">
                <span>{item.label}</span>
                <span className="font-medium">{formatAUD(item.amount)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-1.5 space-y-1.5">
              {feeAmount > 0 && (
                <div className="flex justify-between text-muted text-xs">
                  <span>Platform fee (2.5%)</span>
                  <span>{formatAUD(feeAmount)}</span>
                </div>
              )}
              {tip > 0 && (
                <div className="flex justify-between text-muted text-xs">
                  <span>+ Tip</span>
                  <span>{formatAUD(tip)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Total to pay</span>
                <span>{formatAUD(total, { withCents: true })}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-2xl font-semibold mt-2">{formatAUD(total, { withCents: true })}</p>
            <div className="text-sm text-muted space-y-1 mt-1">
              <div className="flex justify-between">
                <span>Contribution:</span>
                <span>{formatAUD(request.amount)}</span>
              </div>
              {feeAmount > 0 && (
                <div className="flex justify-between">
                  <span>Platform fee (2.5%):</span>
                  <span>{formatAUD(feeAmount)}</span>
                </div>
              )}
              {tip > 0 && (
                <div className="flex justify-between">
                  <span>Tip:</span>
                  <span>{formatAUD(tip)}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {request.is_private && (
        <div className="mt-5 p-4 rounded-lg bg-purple-50 border border-purple-200 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">🎭 Stay Anonymous</h3>
            <p className="text-sm text-gray-600">
              Choose a fun identity to hide your real name from other contributors
            </p>
          </div>
          <AnonymousAvatarSelector
            value={selectedAvatarId}
            onChange={setSelectedAvatarId}
            disabled={processing}
          />
        </div>
      )}

      <div className="flex gap-2 mt-5">
        <TabPill active={tab === "card"} onClick={() => setTab("card")}>
          Card
        </TabPill>
        <TabPill active={tab === "apple"} onClick={() => setTab("apple")}>
          Apple Pay
        </TabPill>
        <TabPill active={tab === "google"} onClick={() => setTab("google")}>
          Google Pay
        </TabPill>
      </div>

      {tab === "card" ? (
        <div className="mt-4 space-y-3">
          <Field label="Card number">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-muted" />
              <input
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
                className="flex-1 bg-transparent outline-none text-[15px]"
              />
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry">
              <input
                value={card.exp}
                onChange={(e) => setCard({ ...card, exp: e.target.value })}
                className="w-full bg-transparent outline-none text-[15px]"
              />
            </Field>
            <Field label="CVC">
              <input
                value={card.cvc}
                onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                className="w-full bg-transparent outline-none text-[15px]"
              />
            </Field>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-border p-6 text-center text-sm text-muted">
          {tab === "apple" ? "Confirm with Touch ID / Face ID" : "Confirm with your Google account"}
          <p className="text-xs mt-1">(mock — just click Pay)</p>
        </div>
      )}

      <Button onClick={pay} loading={processing} className="mt-5 w-full" size="lg">
        {processing ? "Processing…" : `Pay ${formatAUD(total, { withCents: true })}`}
      </Button>
      <button
        onClick={() => close({ status: "cancelled" })}
        className="mt-2 w-full text-sm text-muted hover:text-foreground py-2"
      >
        Cancel
      </button>

      <p className="text-[11px] text-muted text-center mt-4">
        No real card is charged. This is a frontend demo.
      </p>
    </Modal>
  );
}

function TabPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-9 rounded-xl text-sm font-medium transition-colors ${
        active ? "bg-foreground text-background" : "bg-foreground/5 hover:bg-foreground/10"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted mb-1">{label}</p>
      <div className="h-11 px-3.5 rounded-2xl border border-border bg-background flex items-center">
        {children}
      </div>
    </div>
  );
}
