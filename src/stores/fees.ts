'use client';

import { create } from 'zustand';

export interface StripeCountryFees {
  countryCode: string;
  countryName: string;
  locale: string;
  currency: string;
  paymentDomesticPct: number;
  paymentDomesticFlatAmount: number;
  payoutFlatAmount: number;
  payoutBasePct: number;
  payoutCrossBorderPct: number;
  stripeConnectSupported: boolean;
  payoutsEnabled: boolean;
}

export interface FeeBreakdown {
  stripeDomesticPct: number;
  stripeDomesticFlat: number;
  stripeIntlCardPct: number;
  stripeConversionPct: number;
  platformFeePct: number;
  total: number;
}

export interface CheckoutFeeResult {
  amount: number;
  stripeFee: number;
  platformFee: number;
  totalFees: number;
  checkoutTotal: number;
  breakdown: FeeBreakdown;
}

type FeesState = {
  feesByCountry: Map<string, StripeCountryFees>;
  supportedCountries: StripeCountryFees[];
  isLoading: boolean;
  error: string | null;

  // Fetch supported countries and their fee configurations
  loadSupportedCountries: () => Promise<void>;

  // Get fee config for a specific country
  getFeeConfig: (countryCode: string) => StripeCountryFees | null;

  // Get all supported countries
  getSupportedCountries: () => StripeCountryFees[];

  // Reset store
  reset: () => void;
};

export const useFees = create<FeesState>()((set, get) => ({
  feesByCountry: new Map(),
  supportedCountries: [],
  isLoading: false,
  error: null,

  loadSupportedCountries: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch from API endpoint: GET /stripe-fees
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/stripe-fees`);

      if (!response.ok) {
        throw new Error(`Failed to fetch stripe fees: ${response.statusText}`);
      }

      const countries = (await response.json()) as StripeCountryFees[];

      // Build map for quick lookup
      const feeMap = new Map<string, StripeCountryFees>();
      countries.forEach((country) => {
        feeMap.set(country.countryCode, country);
      });

      set({
        feesByCountry: feeMap,
        supportedCountries: countries,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = (error as any).message || 'Failed to load stripe fees';
      set({ error: message, isLoading: false });
    }
  },

  getFeeConfig: (countryCode: string) => {
    const feeMap = get().feesByCountry;
    return feeMap.get(countryCode) || null;
  },

  getSupportedCountries: () => {
    return get().supportedCountries;
  },

  reset: () => {
    set({
      feesByCountry: new Map(),
      supportedCountries: [],
      isLoading: false,
      error: null,
    });
  },
}));
