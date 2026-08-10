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

interface CheckoutError {
  message: string;
  statusCode: number;
  code?: string;
  isValidationError?: boolean; // true si es 400 (validación o negocio)
  isNetworkError?: boolean;
}

interface UseCheckoutState {
  isLoading: boolean;
  error: CheckoutError | null;
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
   * Parse error from axios response
   * Extracts structured error info: message, statusCode, code
   */
  const parseCheckoutError = (error: any): CheckoutError => {
    // Axios error with response
    if (error?.response?.data) {
      return {
        message: error.response.data.message || error.response.statusText || 'Error desconocido',
        statusCode: error.response.status,
        code: error.response.data.code,
        isValidationError: error.response.status === 400,
      };
    }

    // Axios error without response (network error, timeout, etc.)
    if (error?.code) {
      return {
        message: 'Comprueba tu conexión a internet e intenta de nuevo',
        statusCode: 0,
        code: error.code,
        isNetworkError: true,
      };
    }

    // Generic error
    return {
      message: error?.message || 'Error desconocido',
      statusCode: 0,
      isNetworkError: true,
    };
  };

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
      // Use window.location to detect API URL at runtime
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
        const checkoutError: CheckoutError = {
          message: errorData.message || response.statusText || 'Error desconocido',
          statusCode: response.status,
          code: errorData.code,
          isValidationError: response.status === 400,
        };

        setState({
          isLoading: false,
          error: checkoutError,
          feeResult: null,
        });
        return null;
      }

      const feeResult = (await response.json()) as CheckoutResponse;

      setState({
        isLoading: false,
        error: null,
        feeResult,
      });

      return feeResult;
    } catch (error: unknown) {
      const checkoutError = parseCheckoutError(error);
      setState({
        isLoading: false,
        error: checkoutError,
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
