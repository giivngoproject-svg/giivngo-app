"use client";

import { useEffect } from "react";
import { useCampaigns } from "@/stores/campaigns";

export function SeedBootstrap() {
  const hydrate = useCampaigns((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}
