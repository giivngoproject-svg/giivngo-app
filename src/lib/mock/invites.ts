"use client";

import { toast } from "@/stores/toast";
import { useCampaigns, makeInvite } from "@/stores/campaigns";

export function sendEmailInvites(campaignId: string, recipients: string[], message?: string) {
  const store = useCampaigns.getState();
  recipients.forEach((r) => store.addInvite(makeInvite(campaignId, "email", r)));
  toast.success(
    `Sent ${recipients.length} email invite${recipients.length === 1 ? "" : "s"}`,
    `Via Resend (mock)${message ? ` · "${message.slice(0, 40)}${message.length > 40 ? "…" : ""}"` : ""}`,
  );
}

export function sendSmsInvites(campaignId: string, recipients: string[]) {
  const store = useCampaigns.getState();
  recipients.forEach((r) => store.addInvite(makeInvite(campaignId, "sms", r)));
  toast.success(
    `Sent ${recipients.length} SMS invite${recipients.length === 1 ? "" : "s"}`,
    "Via Twilio (mock)",
  );
}

export function openWhatsApp(link: string, message: string) {
  const text = encodeURIComponent(`${message} ${link}`);
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Link copied", text);
  } catch {
    toast.error("Could not copy", "Please copy the link manually");
  }
}
