"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/stores/auth";

type AuthCheckProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
};

/**
 * Protects routes that require authentication
 * Also checks email verification status
 * Note: checkAuth() is called by SeedBootstrap in layout, not here
 * This component only handles redirect logic
 *
 * Important: We wait for hasCheckedAuth to be true before making redirect decisions
 * This prevents race conditions where AuthCheck redirects before SeedBootstrap completes checkAuth()
 */
export function AuthCheck({ children, requireAuth = true }: AuthCheckProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, hasCheckedAuth, user } = useAuth();

  // Redirect if auth required but not authenticated, or email not verified
  useEffect(() => {
    // Wait until checkAuth() has completed before making decisions
    if (!hasCheckedAuth) {
      return;
    }

    // After checkAuth() completes, redirect if needed
    if (requireAuth && !isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    // Check email verification - if authenticated but unverified, redirect to verify page
    if (requireAuth && isAuthenticated && user && !user.email_verified) {
      if (!pathname.startsWith('/verify-email')) {
        router.push('/verify-email');
      }
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedAuth, isAuthenticated, user?.email_verified, pathname, requireAuth]);

  // If auth validation not complete yet, show nothing (let child component handle loading)
  if (!hasCheckedAuth) {
    return null;
  }

  // If auth required but not authenticated, don't show content
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If email not verified, don't show content (except on verify-email page)
  if (requireAuth && isAuthenticated && user && !user.email_verified && !pathname.startsWith('/verify-email')) {
    return null;
  }

  return <>{children}</>;
}
