"use client";

import { useEffect } from "react";
import { useAuth } from "@/stores/auth";

/**
 * SeedBootstrap: Initialize auth state on app load
 * Only checks authentication, does NOT preload data
 * Individual pages are responsible for loading their own data
 */
export function SeedBootstrap() {
  const checkAuth = useAuth((s) => s.checkAuth);

  useEffect(() => {
    // Check authentication on app load (only once)
    checkAuth().catch(console.error);
    // Empty dependency array: run only once on mount
  }, []);

  return null;
}
