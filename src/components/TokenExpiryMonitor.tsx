"use client";

import { useTokenExpiry } from "@/hooks/useTokenExpiry";

/**
 * Component that monitors JWT expiry and handles automatic logout
 * Rendered at the root layout so it covers the entire app
 */
export function TokenExpiryMonitor() {
  useTokenExpiry();
  return null;
}
