"use client";

import { create } from "zustand";
import type { CampaignType, PoolMode, ContributionItem } from "@/lib/types";

export type WizardData = {
  title: string;
  type: CampaignType;
  description: string;
  recipient_name?: string;
  cover_photo_url?: string;
  goal_amount?: number;
  end_date: string;
  min_contribution?: number;
  max_contribution?: number;
  pool_mode: PoolMode;
  tiers: number[];
  contribution_items: ContributionItem[];
  hide_until_birthday: boolean;
  show_on_search: boolean;
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
  type: "birthday",
  description: "",
  recipient_name: undefined,
  cover_photo_url: undefined,
  goal_amount: undefined,
  end_date: defaultEnd(),
  min_contribution: undefined,
  max_contribution: undefined,
  pool_mode: "standard",
  tiers: [20, 50, 100],
  contribution_items: [],
  hide_until_birthday: false,
  show_on_search: true,
};

export const useWizard = create<WizardState>((set) => ({
  step: 1,
  data: DEFAULTS,
  setStep: (step) => set({ step }),
  patch: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  reset: () => set({ step: 1, data: { ...DEFAULTS, end_date: defaultEnd() } }),
}));
