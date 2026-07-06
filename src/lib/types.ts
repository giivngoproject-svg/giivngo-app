export type CampaignType =
  | "birthday"
  | "baby_shower"
  | "xmas_party"
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
  country_code: string; // ISO 3166-1 alpha-2 (AU, MX, BR)
  stripe_account_id?: string;
  email_verified: boolean;
  created_at: string;
};

export type Country = {
  countryCode: string; // ISO 3166-1 alpha-2 (AU, MX, BR)
  countryName: string; // Australia, Mexico, Brazil
  currency: string; // AUD, MXN, BRL
  locale: string; // en-AU, es-MX, pt-BR
  stripeConnectSupported: boolean;
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
  country_code?: string; // Country code for Stripe fees (MX, BR, AU) - defaults to AU
  currency?: string; // Currency code (MXN, BRL, AUD) - defaults to AUD
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
  countryCode: string; // Country code for Stripe fees (MX, BR, AU)
  currency: string; // Currency code (MXN, BRL, AUD)
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
  date_of_birth?: string; // ISO 8601 date (YYYY-MM-DD)
  amount: number;
  // Platform fee (2.5%) charged at checkout, added to total charged.
  fee_amount?: number;
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
  baby_shower: "Baby shower fund",
  xmas_party: "Xmas work party",
  farewell: "Farewell collection",
  event_entry: "Group event entry",
  custom: "Custom",
};
