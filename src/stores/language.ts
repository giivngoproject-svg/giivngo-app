"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getInitialLanguage } from "@/lib/detectLanguage";
import { MARKETS, type Dict, type Market } from "@/i18n/markets";

type LanguageState = {
  /** Diccionario de traducciones (translations.ts). Lo define el mercado seleccionado. */
  language: Dict;
  /** ISO 3166-1 alpha-2 del mercado seleccionado (AU, US, MX...). Filtra las notificaciones. */
  countryCode: string;
  /** Selecciona un mercado: fija país e idioma a la vez. */
  setMarket: (market: Market) => void;
};

/** Primer mercado que usa ese diccionario (en → AU, es → MX, pt-br → BR). */
function marketForDict(dict: Dict): Market {
  return MARKETS.find((m) => m.dict === dict) ?? MARKETS[0];
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => {
      const initial = marketForDict(getInitialLanguage());
      return {
        language: initial.dict,
        countryCode: initial.country,
        setMarket: (market: Market) => set({ language: market.dict, countryCode: market.country }),
      };
    },
    { name: "giivngo.language" }
  )
);
