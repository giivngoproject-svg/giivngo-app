"use client";

import { toast } from "@/stores/toast";
import { useCampaigns, makeInvite } from "@/stores/campaigns";
import { useAuth } from "@/stores/auth";

export async function sendEmailInvites(
  campaignId: string,
  recipients: string[],
  message?: string,
  campaignTitle?: string,
  shareUrl?: string
) {
  // Find the campaign slug from the store
  const store = useCampaigns.getState();
  const campaign = store.campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    toast.error("Campaign not found", "Could not send invites");
    return;
  }

  // Get token from auth store
  const authStore = useAuth.getState();
  const token = authStore.token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

  if (!token) {
    toast.error("Not authenticated", "Please sign in to send invites");
    return;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const response = await fetch(`${apiUrl}/campaigns/${campaign.slug}/invites/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipients,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error("Failed to send invites", errorData.message || "Server error");
      return;
    }

    const result = await response.json();

    if (result.sent > 0) {
      result.inviteIds.forEach((inviteId: string) =>
        store.addInvite({
          id: inviteId,
          campaign_id: campaignId,
          channel: "email" as const,
          recipient: "",
          sent_at: new Date().toISOString(),
          status: "sent" as const,
        })
      );
    }

    if (result.failed > 0) {
      toast.error(
        `Sent ${result.sent}, failed ${result.failed}`,
        result.errors?.map((e: any) => `${e.email}: ${e.reason}`).join(", ") || ""
      );
    } else if (result.sent > 0) {
      toast.success(
        `Sent ${result.sent} email invite${result.sent === 1 ? "" : "s"}`,
        `Via Resend`
      );
    }
  } catch (error: any) {
    toast.error("Error sending invites", error.message);
  }
}

export async function sendSmsInvites(campaignId: string, recipients: string[]) {
  // Find the campaign slug from the store
  const store = useCampaigns.getState();
  const campaign = store.campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    toast.error("Campaign not found", "Could not send SMS");
    return;
  }

  // Get token from auth store
  const authStore = useAuth.getState();
  const token = authStore.token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

  if (!token) {
    toast.error("Not authenticated", "Please sign in to send SMS");
    return;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const response = await fetch(`${apiUrl}/campaigns/${campaign.slug}/invites/sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipients,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error("Failed to send SMS", errorData.message || "Server error");
      return;
    }

    const result = await response.json();

    if (result.sent > 0) {
      result.inviteIds.forEach((inviteId: string) =>
        store.addInvite({
          id: inviteId,
          campaign_id: campaignId,
          channel: "sms" as const,
          recipient: "",
          sent_at: new Date().toISOString(),
          status: "sent" as const,
        })
      );
    }

    if (result.failed > 0) {
      toast.error(
        `Sent ${result.sent}, failed ${result.failed}`,
        result.errors?.map((e: any) => `${e.email}: ${e.reason}`).join(", ") || ""
      );
    } else if (result.sent > 0) {
      toast.success(
        `Sent ${result.sent} SMS${result.sent === 1 ? "" : "s"}`,
        `Via Twilio`
      );
    }
  } catch (error: any) {
    toast.error("Error sending SMS", error.message);
  }
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
