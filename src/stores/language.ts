"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getInitialLanguage } from "@/lib/detectLanguage";

type Language = "en" | "es" | "pt-br";

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: getInitialLanguage(),
      setLanguage: (language: Language) => set({ language }),
    }),
    { name: "giivngo.language" }
  )
);
