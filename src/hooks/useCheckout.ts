'use client';

import { useState } from 'react';
import type { CheckoutFeeResult } from '@/stores/fees';

export interface CheckoutRequest {
  amount: number;
  tipAmount?: number;
  contributorName?: string;
  contributorEmail?: string;
  dateOfBirth: string;
  message?: string;
  emoji?: string;
  photoUrl?: string;
  videoUrl?: string;
  isPrivate?: boolean;
  selectedItems?: Array<{ itemId: string; amount: number }>;
  anonymousAvatarId?: string;
  contributorCountryCode?: string; // For international card surcharge
  contributorCurrency?: string; // For currency conversion fee
}

export interface CheckoutResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  stripeFee: number;
  platformFee: number;
  totalFees: number;
  checkoutTotal: number;
  currency: string;
  campaignId: string;
  feeBreakdown: {
    stripeDomesticPct: number;
    stripeDomesticFlat: number;
    stripeIntlCardPct: number;
    stripeConversionPct: number;
    platformFeePct: number;
    total: number;
  };
}

interface UseCheckoutState {
  isLoading: boolean;
  error: string | null;
  feeResult: CheckoutResponse | null;
}

/**
 * Hook to handle checkout flow with server-calculated fees
 *
 * Key differences from previous implementation:
 * - NO client-side fee pre-calculation
 * - ALL fees calculated by backend authoritatively
 * - Client receives fees from API and displays them
 * - Only after user confirms, proceed to Stripe.js payment
 *
 * Usage:
 * const checkout = useCheckout();
 *
 * // Request checkout (get fees from server)
 * const feeResult = await checkout.requestCheckout(campaignSlug, {
 *   amount: 100,
 *   contributorEmail: 'user@example.com',
 *   dateOfBirth: '1990-01-01',
 * });
 *
 * // Display fees to user via FeeBreakdownComponent
 * if (feeResult) {
 *   return <FeeBreakdownComponent feeResult={feeResult} currency="MXN" />;
 * }
 */
export function useCheckout() {
  const [state, setState] = useState<UseCheckoutState>({
    isLoading: false,
    error: null,
    feeResult: null,
  });

  /**
   * Request checkout from backend
   * Returns fee breakdown WITHOUT charging yet
   * User reviews fees and confirms before proceeding to payment
   */
  const requestCheckout = async (
    campaignSlug: string,
    request: CheckoutRequest
  ): Promise<CheckoutResponse | null> => {
    setState({ isLoading: true, error: null, feeResult: null });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/campaigns/${campaignSlug}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Checkout request failed: ${response.statusText}`);
      }

      const feeResult = (await response.json()) as CheckoutResponse;

      setState({
        isLoading: false,
        error: null,
        feeResult,
      });

      return feeResult;
    } catch (error: unknown) {
      const message = (error as any).message || 'Failed to process checkout';
      setState({
        isLoading: false,
        error: message,
        feeResult: null,
      });
      return null;
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  /**
   * Reset checkout state
   */
  const reset = () => {
    setState({
      isLoading: false,
      error: null,
      feeResult: null,
    });
  };

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    feeResult: state.feeResult,

    // Methods
    requestCheckout,
    clearError,
    reset,
  };
}
