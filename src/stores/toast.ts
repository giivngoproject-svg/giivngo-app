"use client";

import { create } from "zustand";
import { uid } from "@/lib/slug";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
};

type ToastState = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = uid("tst");
    set({ toasts: [...get().toasts, { id, ...t }] });
    setTimeout(() => {
      set({ toasts: get().toasts.filter((x) => x.id !== id) });
    }, 4500);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const toast = {
  show: (title: string, description?: string) =>
    useToast.getState().push({ title, description, variant: "default" }),
  success: (title: string, description?: string) =>
    useToast.getState().push({ title, description, variant: "success" }),
  error: (title: string, description?: string) =>
    useToast.getState().push({ title, description, variant: "error" }),
};
