"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";
import { DEMO_USER } from "@/lib/seed";
import { uid } from "@/lib/slug";

type AuthState = {
  user: User | null;
  signIn: (email: string) => void;
  signUp: (name: string, email: string) => void;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      signIn: (email) => {
        const existing = get().user;
        if (existing && existing.email.toLowerCase() === email.toLowerCase()) return;
        set({
          user: {
            ...DEMO_USER,
            email: email || DEMO_USER.email,
          },
        });
      },
      signUp: (name, email) => {
        set({
          user: {
            id: uid("user"),
            email,
            name: name || "New user",
            display_name: name?.split(" ")[0],
            created_at: new Date().toISOString(),
          },
        });
      },
      signOut: () => set({ user: null }),
      updateUser: (patch) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, ...patch } });
      },
    }),
    { name: "giivngo.auth" },
  ),
);
