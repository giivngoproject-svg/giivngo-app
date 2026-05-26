export type CampaignType =
  | "birthday"
  | "footy_tipping"
  | "office_lotto"
  | "farewell"
  | "event_entry"
  | "custom";

export type CampaignStatus = "active" | "ended" | "paid_out";

// Creator picks exactly ONE mode per pool. "standard" is the default for any
// campaign created before pool modes existed (persisted state may omit it).
export type PoolMode = "standard" | "mystery" | "blind" | "tiers";

export type User = {
  id: string;
  email: string;
  name: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  stripe_account_id?: string;
  created_at: string;
};

export type Campaign = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: CampaignType;
  goal_amount?: number;
  raised_amount: number;
  cover_photo_url?: string;
  end_date: string;
  status: CampaignStatus;
  slug: string;
  min_contribution?: number;
  max_contribution?: number;
  organiser_name: string;
  // Who the pool is for (e.g. "Sarah"). Optional — drives tipping copy and the
  // recipient's highlight reel.
  recipient_name?: string;
  pool_mode?: PoolMode;
  // Locked contribution amounts when pool_mode === "tiers".
  tiers?: number[];
  created_at: string;
};

export type Contribution = {
  id: string;
  campaign_id: string;
  contributor_name?: string;
  contributor_email?: string;
  amount: number;
  // Optional gratuity for the recipient, charged on top of `amount` but kept out
  // of the pool's raised total / goal progress.
  tip_amount?: number;
  message?: string;
  emoji?: string;
  photo_url?: string;
  // Short video drop (data URL in this mock) shown in the recipient's reel.
  video_url?: string;
  status: "succeeded" | "pending" | "failed";
  created_at: string;
};

export type Invite = {
  id: string;
  campaign_id: string;
  channel: "email" | "sms" | "whatsapp";
  recipient: string;
  sent_at: string;
  status: "sent" | "failed";
};

export type Payout = {
  id: string;
  campaign_id: string;
  amount: number;
  fee_amount: number;
  net_amount: number;
  stripe_transfer_id: string;
  status: "pending" | "completed";
  processed_at?: string;
};

export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  birthday: "Birthday fund",
  footy_tipping: "Footy tipping syndicate",
  office_lotto: "Office lotto syndicate",
  farewell: "Farewell collection",
  event_entry: "Group event entry",
  custom: "Custom",
};
