"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Campaign, Contribution, Invite } from "@/lib/types";
import { SEED_CAMPAIGNS, SEED_CONTRIBUTIONS } from "@/lib/seed";
import { uid, uniqueSlug } from "@/lib/slug";

type CampaignsState = {
  campaigns: Campaign[];
  contributions: Contribution[];
  invites: Invite[];
  _hydrated: boolean;

  hydrate: () => void;
  reset: () => void;

  addCampaign: (c: Campaign) => void;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  closeCampaign: (id: string) => void;
  payoutCampaign: (id: string) => void;
  /** Clone a past pool into a fresh active one. Returns the new campaign. */
  reactivateCampaign: (id: string, endDate: string) => Campaign | undefined;

  addContribution: (c: Contribution) => void;
  addInvite: (i: Invite) => void;
};

export const useCampaigns = create<CampaignsState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      contributions: [],
      invites: [],
      _hydrated: false,

      hydrate: () => {
        if (get()._hydrated) return;
        if (get().campaigns.length === 0) {
          set({
            campaigns: SEED_CAMPAIGNS,
            contributions: SEED_CONTRIBUTIONS,
            _hydrated: true,
          });
        } else {
          set({ _hydrated: true });
        }
      },

      reset: () => {
        set({
          campaigns: SEED_CAMPAIGNS,
          contributions: SEED_CONTRIBUTIONS,
          invites: [],
          _hydrated: true,
        });
      },

      addCampaign: (c) => set({ campaigns: [c, ...get().campaigns] }),

      updateCampaign: (id, patch) =>
        set({
          campaigns: get().campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }),

      closeCampaign: (id) =>
        set({
          campaigns: get().campaigns.map((c) =>
            c.id === id ? { ...c, status: "ended", end_date: new Date().toISOString() } : c,
          ),
        }),

      payoutCampaign: (id) =>
        set({
          campaigns: get().campaigns.map((c) => (c.id === id ? { ...c, status: "paid_out" } : c)),
        }),

      reactivateCampaign: (id, endDate) => {
        const source = get().campaigns.find((c) => c.id === id);
        if (!source) return undefined;
        const slug = uniqueSlug(
          source.title,
          get().campaigns.map((c) => c.slug),
        );
        const clone: Campaign = {
          ...source,
          id: uid("camp"),
          slug,
          status: "active",
          raised_amount: 0,
          end_date: new Date(endDate).toISOString(),
          created_at: new Date().toISOString(),
        };
        set({ campaigns: [clone, ...get().campaigns] });
        return clone;
      },

      addContribution: (c) => {
        const next = [c, ...get().contributions];
        const campaigns = get().campaigns.map((camp) =>
          camp.id === c.campaign_id
            ? { ...camp, raised_amount: camp.raised_amount + c.amount }
            : camp,
        );
        set({ contributions: next, campaigns });
      },

      addInvite: (i) => set({ invites: [i, ...get().invites] }),
    }),
    { name: "giivngo.campaigns" },
  ),
);

export function makeInvite(
  campaignId: string,
  channel: Invite["channel"],
  recipient: string,
): Invite {
  return {
    id: uid("inv"),
    campaign_id: campaignId,
    channel,
    recipient,
    sent_at: new Date().toISOString(),
    status: "sent",
  };
}
