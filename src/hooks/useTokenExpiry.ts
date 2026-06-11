"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/auth";

/**
 * Hook that monitors JWT expiry and redirects to sign-in when token expires
 * Checks every minute if the token has expired
 */
export function useTokenExpiry() {
  const router = useRouter();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isTokenExpired = useAuth((s) => s.isTokenExpired);
  const signOut = useAuth((s) => s.signOut);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check immediately
    if (isTokenExpired()) {
      signOut();
      router.push("/sign-in?expired=true");
      return;
    }

    // Check every 60 seconds
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        signOut();
        router.push("/sign-in?expired=true");
        clearInterval(interval);
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, router]);
}
