"use client";

import { create } from "zustand";
import type { Campaign, Contribution, Invite } from "@/lib/types";
import { campaignsApi, contributionsApi } from "@/lib/api";

type CampaignsState = {
  campaigns: Campaign[];
  contributions: { [slug: string]: Contribution[] };
  isLoading: boolean;
  error: string | null;

  // Campaign operations (API-backed)
  loadCampaigns: () => Promise<void>;
  createCampaign: (data: any) => Promise<Campaign | null>;
  loadCampaign: (slug: string) => Promise<Campaign | null>;
  refreshCampaign: (slug: string) => Promise<void>;
  updateCampaign: (slug: string, data: any) => Promise<Campaign | null>;
  closeCampaign: (slug: string) => Promise<Campaign | null>;
  reactivateCampaign: (slug: string, endDate: string) => Promise<Campaign | null>;

  // Contribution operations (API-backed)
  loadContributions: (slug: string) => Promise<Contribution[]>;
  addContribution: (contribution: Contribution) => void;

  // Invite operations
  addInvite: (invite: Invite) => void;

  // Reset store
  reset: () => void;
};

export const useCampaigns = create<CampaignsState>()(
  (set, get) => ({
      campaigns: [],
      contributions: {},
      isLoading: false,
      error: null,

      loadCampaigns: async () => {
        set({ isLoading: true, error: null });
        try {
          const campaigns = await campaignsApi.getAll();
          set({ campaigns, isLoading: false });
        } catch (error: unknown) {
          const message = (error as any).response?.data?.message || "Failed to load campaigns";
          set({ error: message, isLoading: false });
        }
      },

      createCampaign: async (data: Partial<Campaign>) => {
        set({ isLoading: true, error: null });
        try {
          const campaign = await campaignsApi.create(data);
          set((state) => ({
            campaigns: [campaign, ...state.campaigns],
            isLoading: false,
          }));
          return campaign;
        } catch (error: unknown) {
          const message = (error as any).response?.data?.message || "Failed to create campaign";
          set({ error: message, isLoading: false });
          return null;
        }
      },

      loadCampaign: async (slug: string) => {
        set({ isLoading: true, error: null });
        try {
          const campaign = await campaignsApi.getBySlug(slug);
          set((state) => {
            // If campaign exists in array, update it; otherwise add it
            const exists = state.campaigns.some((c) => c.slug === slug);
            return {
              campaigns: exists
                ? state.campaigns.map((c) => (c.slug === slug ? campaign : c))
                : [...state.campaigns, campaign],
              isLoading: false,
            };
          });
          return campaign;
        } catch (error: unknown) {
          const message = (error as any).response?.data?.message || "Failed to load campaign";
          set({ error: message, isLoading: false });
          return null;
        }
      },

      refreshCampaign: async (slug: string) => {
        try {
          // Reload campaign data and contributions
          await get().loadCampaign(slug);
          await get().loadContributions(slug);
        } catch (error: unknown) {
          const message = (error as any).response?.data?.message || "Failed to refresh campaign";
          set({ error: message });
        }
      },

      updateCampaign: async (slug: string, data: any) => {
        set({ isLoading: true, error: null });
        try {
          const campaign = await campaignsApi.update(slug, data);
          set((state) => ({
            campaigns: state.campaigns.map((c) => (c.slug === slug ? campaign : c)),
            isLoading: false,
          }));
          return campaign;
        } catch (error: unknown) {
          const message = (error as any).response?.data?.message || "Failed to update campaign";
          set({ error: message, isLoading: false });
          return null;
        }
      },

      closeCampaign: async (slug: string) => {
        set({ isLoading: true, error: null });
        try {
          const campaign = await campaignsApi.close(slug);
          set((state) => ({
            campaigns: state.campaigns.map((c) => (c.slug === slug ? campaign : c)),
            isLoading: false,
          }));
          return campaign;
        } catch (error: unknown) {
          const message = (error as any).response?.data?.message || "Failed to close campaign";
          set({ error: message, isLoading: false });
          return null;
        }
      },

      reactivateCampaign: async (slug: string, endDate: string) => {
        set({ isLoading: true, error: null });
        try {
          const campaign = await campaignsApi.reactivate(slug, endDate);
          set((state) => ({
            campaigns: [campaign, ...state.campaigns],
            isLoading: false,
          }));
          return campaign;
        } catch (error: unknown) {
          const message = (error as any).response?.data?.message || "Failed to reactivate campaign";
          set({ error: message, isLoading: false });
          return null;
        }
      },

      loadContributions: async (slug: string) => {
        set({ isLoading: true, error: null });
        try {
          const contributions = await contributionsApi.getList(slug);
          set((state) => ({
            contributions: { ...state.contributions, [slug]: contributions },
            isLoading: false,
          }));
          return contributions;
        } catch (error: unknown) {
          const message = (error as any).response?.data?.message || "Failed to load contributions";
          set({ error: message, isLoading: false });
          return [];
        }
      },

      addContribution: (contribution: Contribution) => {
        set((state) => {
          const campaignId = contribution.campaign_id;
          const existingContributions = state.contributions[campaignId] || [];
          return {
            contributions: {
              ...state.contributions,
              [campaignId]: [...existingContributions, contribution],
            },
          };
        });
      },

      addInvite: () => {
        // Mock implementation - invites are not persisted in local state
      },

      reset: () => {
        set({
          campaigns: [],
          contributions: {},
          isLoading: false,
          error: null,
        });
      },
    }),
);

export function makeInvite(
  campaignId: string,
  channel: Invite["channel"],
  recipient: string,
): Invite {
  return {
    id: `inv_${Date.now()}`,
    campaign_id: campaignId,
    channel,
    recipient,
    sent_at: new Date().toISOString(),
    status: "sent",
  };
}
