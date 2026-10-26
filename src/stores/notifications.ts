"use client";

import { create } from "zustand";
import type { UserNotification } from "@/lib/types";
import { notificationsApi } from "@/lib/api";
import { useLanguage } from "@/stores/language";

type LoadOptions = { limit?: number; unreadOnly?: boolean };

type NotificationsState = {
  items: UserNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  load: (options?: LoadOptions) => Promise<boolean>;
  refreshCount: () => Promise<void>;
  setRead: (id: string, read: boolean) => Promise<boolean>;
};

export const useNotifications = create<NotificationsState>()((set, get) => ({
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Loads the list shown by the caller (and the unread count)
  load: async (options) => {
    set({ isLoading: true, error: null });
    try {
      const countryCode = useLanguage.getState().countryCode;
      const { items, unreadCount } = await notificationsApi.list({ ...options, countryCode });
      set({ items, unreadCount, isLoading: false });
      return true;
    } catch (error: unknown) {
      const message = (error as any).response?.data?.message || "Failed to load notifications";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  // Only the badge number: does not touch the list another view may be showing
  refreshCount: async () => {
    try {
      const countryCode = useLanguage.getState().countryCode;
      const { unreadCount } = await notificationsApi.list({ limit: 1, countryCode });
      set({ unreadCount });
    } catch {
      // Badge keeps its last value; the next refresh retries
    }
  },

  setRead: async (id, read) => {
    const current = get().items.find((n) => n.id === id);
    // General notifications have no read state
    if (current && !current.is_direct) return false;
    try {
      const updated = await notificationsApi.setRead(id, read);
      if (!current) {
        await get().refreshCount();
        return true;
      }
      // Adjust the badge only when the state really changed
      const delta = current.read === updated.read ? 0 : updated.read ? -1 : 1;
      set((state) => ({
        items: state.items.map((n) => (n.id === id ? updated : n)),
        unreadCount: Math.max(0, state.unreadCount + delta),
      }));
      return true;
    } catch (error: unknown) {
      const message = (error as any).response?.data?.message || "Failed to update notification";
      set({ error: message });
      return false;
    }
  },
}));
