"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/auth";
import { supabase } from "@/lib/supabase-client";

/**
 * OAuth Callback Handler
 * - Syncs Supabase session with Zustand + localStorage
 * - Redirects to dashboard (or back to referrer)
 * - Simple and explicit flow
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("[OAuth Callback] Processing callback...");

        // Get the referrer (where user came from, or default to dashboard)
        const referrer = sessionStorage.getItem("oauth_referrer") || "/dashboard";
        sessionStorage.removeItem("oauth_referrer");

        // Get the current Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error("[OAuth Callback] No session found:", sessionError);
          router.push("/sign-in?error=no_session");
          return;
        }

        console.log("[OAuth Callback] Session found, syncing with backend...");

        // Sync with backend - this saves token and creates user
        try {
          await checkAuth();
          console.log("[OAuth Callback] Auth synced successfully");

          // Give Zustand state time to persist to localStorage
          await new Promise((resolve) => setTimeout(resolve, 100));

          console.log("[OAuth Callback] Redirecting to", referrer);
          router.push(referrer);
        } catch (checkAuthError) {
          console.error("[OAuth Callback] Auth sync failed:", checkAuthError);
          router.push("/sign-in?error=auth_sync_failed");
        }
      } catch (error) {
        console.error("[OAuth Callback] Callback error:", error);
        router.push("/sign-in?error=callback_error");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-3">
        <div className="inline-block w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Completando inicio de sesión...</p>
      </div>
    </div>
  );
}
