"use client";

import { useEffect } from "react";
import { useNotifications } from "@/stores/notifications";
import { useLanguage } from "@/stores/language";

const REFRESH_MS = 120_000;

/**
 * Keeps the unread badge fresh while a logged-in user is on the site:
 * on mount, every 2 minutes, when the window regains focus,
 * and when the selected country changes.
 */
export function useNotificationsSync(enabled: boolean) {
  const refreshCount = useNotifications((s) => s.refreshCount);
  const countryCode = useLanguage((s) => s.countryCode);

  useEffect(() => {
    if (!enabled) return;
    refreshCount();
    const intervalId = window.setInterval(refreshCount, REFRESH_MS);
    const onFocus = () => refreshCount();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [enabled, refreshCount, countryCode]);
}
