"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/auth";

type AuthCheckProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
};

/**
 * Protects routes that require authentication
 * Note: checkAuth() is called by SeedBootstrap in layout, not here
 * This component only handles redirect logic
 *
 * Important: We wait for hasCheckedAuth to be true before making redirect decisions
 * This prevents race conditions where AuthCheck redirects before SeedBootstrap completes checkAuth()
 */
export function AuthCheck({ children, requireAuth = true }: AuthCheckProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasCheckedAuth } = useAuth();

  // Redirect if auth required but not authenticated (after checkAuth() completes)
  useEffect(() => {
    // Wait until checkAuth() has completed before making decisions
    if (!hasCheckedAuth) {
      return;
    }

    // After checkAuth() completes, redirect if needed
    if (requireAuth && !isAuthenticated) {
      router.push("/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedAuth, isAuthenticated, requireAuth]);

  // If auth validation not complete yet, show nothing (let child component handle loading)
  if (!hasCheckedAuth) {
    return null;
  }

  // If auth required but not authenticated, don't show content
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
