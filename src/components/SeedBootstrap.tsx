"use client";

import { useEffect } from "react";
import { useAuth } from "@/stores/auth";
import { useCampaigns } from "@/stores/campaigns";

export function SeedBootstrap() {
  const checkAuth = useAuth((s) => s.checkAuth);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const loadCampaigns = useCampaigns((s) => s.loadCampaigns);

  useEffect(() => {
    // Check authentication on app load
    checkAuth().catch(console.error);
  }, [checkAuth]);

  // Load campaigns only if user is authenticated
  // (GET /campaigns requires auth, so skip on public pages)
  useEffect(() => {
    if (isAuthenticated) {
      loadCampaigns().catch(console.error);
    }
  }, [isAuthenticated, loadCampaigns]);

  return null;
}
