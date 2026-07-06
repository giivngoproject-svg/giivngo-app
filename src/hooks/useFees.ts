'use client';

import { useEffect } from 'react';
import { useFees as useFeesStore } from '../stores/fees';
import { useLocale } from './useLocale';
import type { StripeCountryFees, CheckoutFeeResult } from '../stores/fees';

/**
 * Hook to work with Stripe fees in components
 *
 * Automatically loads fee configurations on first use
 * Provides access to fees based on current locale
 *
 * Usage in Client Components:
 * const fees = useFees();
 * const currentFees = fees.getFeeConfigForLocale(); // Get fees for current locale
 *
 * Or manually:
 * const feeConfig = fees.getFeeConfig('MX');
 */
export function useFees() {
  const localeConfig = useLocale();
  const store = useFeesStore();

  // Load supported countries on mount
  useEffect(() => {
    if (store.supportedCountries.length === 0 && !store.isLoading) {
      store.loadSupportedCountries();
    }
  }, [store]);

  /**
   * Get fee config for current locale (derived from URL)
   */
  const getFeeConfigForLocale = (): StripeCountryFees | null => {
    return store.getFeeConfig(localeConfig.countryCode);
  };

  /**
   * Get fee config for a specific country
   */
  const getFeeConfig = (countryCode: string): StripeCountryFees | null => {
    return store.getFeeConfig(countryCode);
  };

  /**
   * Get all supported countries
   */
  const getSupportedCountries = (): StripeCountryFees[] => {
    return store.getSupportedCountries();
  };

  /**
   * Check if a country is supported
   */
  const isCountrySupported = (countryCode: string): boolean => {
    return store.getFeeConfig(countryCode) !== null;
  };

  /**
   * Get currency for current locale
   */
  const getCurrencyForLocale = (): string => {
    return localeConfig.currency;
  };

  /**
   * Get country code for current locale
   */
  const getCountryCodeForLocale = (): string => {
    return localeConfig.countryCode;
  };

  return {
    // Store state
    isLoading: store.isLoading,
    error: store.error,
    supportedCountries: store.supportedCountries,

    // Locale-based methods
    getFeeConfigForLocale,
    getCurrencyForLocale,
    getCountryCodeForLocale,

    // Generic methods
    getFeeConfig,
    getSupportedCountries,
    isCountrySupported,

    // Store methods
    loadSupportedCountries: store.loadSupportedCountries,
    reset: store.reset,
  };
}
