"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";
import { authApi } from "@/lib/api";
import { supabase } from "@/lib/supabase-client";

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  tokenExpiry: number | null;
  hasCheckedAuth: boolean; // Flag to indicate checkAuth() has been called

  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string, countryCode?: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
  isTokenExpired: () => boolean;
};

/**
 * Decode JWT payload without verification (client-side only, for UI state)
 */
function decodeJwt(token: string): { exp?: number; [key: string]: any } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      tokenExpiry: null,
      hasCheckedAuth: false,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { access_token, user } = await authApi.signIn(email, password);

          // Decode token to get expiry
          const payload = decodeJwt(access_token);
          const expiryTime = payload?.exp ? payload.exp * 1000 : null;

          // Store token in localStorage (for persistence across page reloads)
          if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", access_token);
          }

          set({
            user,
            token: access_token,
            tokenExpiry: expiryTime,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error: any) {
          const message = error.response?.data?.message || "Sign in failed";
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
          });
          return false;
        }
      },

      signUp: async (email: string, password: string, name: string, countryCode?: string) => {
        set({ isLoading: true, error: null });
        try {
          const { access_token, user } = await authApi.signUp(
            email,
            password,
            name,
            name.split(" ")[0],
            countryCode || 'AU'
          );

          // Decode token to get expiry
          const payload = decodeJwt(access_token);
          const expiryTime = payload?.exp ? payload.exp * 1000 : null;

          // Store token in localStorage (consistent with signIn)
          if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", access_token);
          }

          set({
            user,
            token: access_token,
            tokenExpiry: expiryTime,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error: any) {
          const message = error.response?.data?.message || "Sign up failed";
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
          });
          return false;
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
              skipBrowserRedirect: false,
            },
          });

          if (error) {
            throw error;
          }
          // Note: Supabase will handle the redirect automatically
        } catch (error: any) {
          const message = error.message || "Google sign in failed";
          // console.error("[Auth] Google sign in error:", message);
          set({
            error: message,
            isLoading: false,
          });
        }
      },

      signOut: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
        set({
          user: null,
          token: null,
          tokenExpiry: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        set({ isLoading: true, hasCheckedAuth: false });

        // First try to get Supabase session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Fall back to localStorage token
        const token =
          session?.access_token ||
          (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

        if (!token) {
          // console.log("[Auth] No token found");
          set({ isAuthenticated: false, user: null, token: null, isLoading: false, hasCheckedAuth: true });
          return;
        }

        // Save token to localStorage FIRST (before calling API)
        // This is critical for Google OAuth callback flow
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
        }

        // Check if token is expired
        const payload = decodeJwt(token);
        const expiryTime = payload?.exp ? payload.exp * 1000 : null;
        const isExpired = expiryTime && expiryTime < Date.now();

        // console.log("[Auth] Token check:", {
        //   hasToken: !!token,
        //   tokenLength: token.length,
        //   expiresAt: expiryTime ? new Date(expiryTime).toISOString() : "unknown",
        //   isExpired,
        //   nowMs: Date.now(),
        // });

        if (isExpired) {
          // console.log("[Auth] Token expired, signing out");
          get().signOut();
          set({ isLoading: false, hasCheckedAuth: true });
          return;
        }

        // Token exists and is not expired, assume session is active
        // console.log("[Auth] Token is valid, session is active");

        try {
          // console.log("[Auth] Fetching user data from server...");
          const user = await authApi.getMe();
          // console.log("[Auth] User data fetched successfully", { userId: user.id, email: user.email });

          set({
            user,
            token,
            tokenExpiry: expiryTime,
            isAuthenticated: true,
            isLoading: false,
            hasCheckedAuth: true,
          });
        } catch (error: any) {
          // console.error("[Auth] Failed to fetch user data from server:", {
          //   status: error.response?.status,
          //   message: error.response?.data?.message || error.message,
          // });

          // Server error but token is valid → keep user authenticated
          // This allows the app to work even if the backend is temporarily unavailable
          // console.log("[Auth] Keeping session active despite server error");
          set({
            token,
            tokenExpiry: expiryTime,
            isAuthenticated: true,
            isLoading: false,
            hasCheckedAuth: true,
            // user stays as is from localStorage/sessionStorage persistence
          });
        }
      },

      updateUser: (patch) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, ...patch } });
      },

      isTokenExpired: () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return true;
        return tokenExpiry < Date.now();
      },
    }),
    { name: "giivngo.auth" },
  ),
);
