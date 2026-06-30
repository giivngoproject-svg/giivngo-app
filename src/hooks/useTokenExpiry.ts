"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/stores/auth";

/**
 * Hook that monitors JWT expiry and redirects to sign-in when token expires
 * Checks every 30 seconds if the token has expired
 * Only redirects from protected pages, not from public pages like /sign-in
 */
export function useTokenExpiry() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isTokenExpired = useAuth((s) => s.isTokenExpired);
  const signOut = useAuth((s) => s.signOut);

  // Public pages that don't require auth
  const publicPages = ["/sign-in", "/sign-up", "/", "/campaign/", "/verify-email"];
  const isPublicPage = publicPages.some((page) => pathname.startsWith(page));

  useEffect(() => {
    if (!isAuthenticated || isPublicPage) return;

    // Check immediately
    if (isTokenExpired()) {
      console.log("[TokenExpiry] Token expired, signing out and redirecting...");
      signOut();
      router.push("/sign-in?expired=true");
      return;
    }

    // Check every 30 seconds
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        console.log("[TokenExpiry] Token expired, signing out and redirecting...");
        signOut();
        router.push("/sign-in?expired=true");
        clearInterval(interval);
      }
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isPublicPage, isTokenExpired, pathname, router, signOut]);
}
