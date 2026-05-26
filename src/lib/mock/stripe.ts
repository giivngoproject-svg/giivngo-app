"use client";

import type { Contribution } from "@/lib/types";

export type CheckoutRequest = {
  campaignId: string;
  amount: number;
  tip_amount?: number;
  contributor_name?: string;
  contributor_email?: string;
  message?: string;
  emoji?: string;
  photo_url?: string;
  video_url?: string;
};

export type CheckoutResult =
  | { status: "succeeded"; contribution: Contribution }
  | { status: "cancelled" };

// Channel — the global MockStripeCheckout listens for "open" and replies with "result"
type OpenDetail = { request: CheckoutRequest; resolve: (r: CheckoutResult) => void };

export function openCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
  return new Promise((resolve) => {
    const event = new CustomEvent<OpenDetail>("giivngo:checkout:open", {
      detail: { request, resolve },
    });
    window.dispatchEvent(event);
  });
}

export type StripeOpenEvent = CustomEvent<OpenDetail>;
