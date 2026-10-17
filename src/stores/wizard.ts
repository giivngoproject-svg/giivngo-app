"use client";

import { create } from "zustand";
import type { CampaignType, ContributionItem } from "@/lib/types";

export type WizardData = {
  title: string;
  // Once the organiser edits the pool name, occasion and recipient changes stop overwriting it.
  title_edited: boolean;
  type: CampaignType;
  description: string;
  // "Me" uses the organiser's account name as the recipient.
  recipient_is_me: boolean;
  recipient_name: string;
  cover_photo_url?: string;
  cover_video_url?: string;
  goal_amount?: number;
  end_date: string;
  max_contributions?: number; // Limited slots
  // Step 2: the two prices guests see.
  event_cost_enabled: boolean;
  event_cost_amount?: number; // Cost per person
  event_cost_label: string; // What the event cost covers
  gift_enabled: boolean;
  gift_suggested_amounts: number[];
  // More options
  hide_goal: boolean;
  keep_private: boolean; // Maps to poolMode "blind" on publish
  hide_until_birthday: boolean;
  show_on_search: boolean;
  contribution_items: ContributionItem[];
  country_code: string; // Country for Stripe fees (MX, BR, AU)
  currency: string; // Currency code (MXN, BRL, AUD)
};

type WizardState = {
  step: 1 | 2 | 3;
  data: WizardData;
  setStep: (step: 1 | 2 | 3) => void;
  patch: (patch: Partial<WizardData>) => void;
  reset: () => void;
};

const defaultEnd = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
};

const DEFAULTS: WizardData = {
  title: "",
  title_edited: false,
  type: "birthday",
  description: "",
  recipient_is_me: true,
  recipient_name: "",
  cover_photo_url: undefined,
  cover_video_url: undefined,
  goal_amount: undefined,
  end_date: defaultEnd(),
  max_contributions: undefined,
  event_cost_enabled: true,
  event_cost_amount: undefined,
  event_cost_label: "",
  gift_enabled: true,
  gift_suggested_amounts: [20, 50, 100],
  hide_goal: false,
  keep_private: false,
  hide_until_birthday: false,
  show_on_search: true,
  contribution_items: [],
  country_code: "AU",
  currency: "AUD",
};

export const useWizard = create<WizardState>((set) => ({
  step: 1,
  data: DEFAULTS,
  setStep: (step) => set({ step }),
  patch: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  reset: () => set({ step: 1, data: { ...DEFAULTS, end_date: defaultEnd() } }),
}));
