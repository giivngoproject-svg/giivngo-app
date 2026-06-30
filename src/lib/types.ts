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

export type ContributionItem = {
  id: string;
  label: string;
  amount: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  stripe_account_id?: string;
  email_verified: boolean;
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
  // Named contribution options (e.g. "Gift Fund $50") when using multi-item contributions.
  contribution_items?: ContributionItem[];
  // When true, hides gift wall, activity feed, and highlight reel until campaign ends.
  hide_until_birthday?: boolean;
  show_on_search?: boolean;
  creator_stripe_account_id?: string; // Stripe Connect account ID of campaign creator
  created_at: string;
};

// Backend API response (camelCase)
export type CampaignResponseDto = {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  slug: string;
  organiserName: string;
  recipientName?: string;
  goalAmount?: number;
  raisedAmount: number;
  coverPhotoUrl?: string;
  endDate: string;
  minContribution?: number;
  maxContribution?: number;
  poolMode?: PoolMode;
  tiers?: number[];
  hideUntilBirthday?: boolean;
  showOnSearch?: boolean;
  creatorStripeAccountId?: string;
  contributionItems?: Array<{
    id: string;
    label: string;
    amount: number;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type AnonymousAvatar = {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  color: string;
};

export type Contribution = {
  id: string;
  campaign_id: string;
  anonymous_avatar_id?: string;
  anonymous_avatar?: AnonymousAvatar;
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
  // Selected items from a multi-item campaign (cart snapshot).
  selected_items?: Array<{ item_id: string; label: string; amount: number }>;
  // When true, contributor name is hidden publicly.
  is_private?: boolean;
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
