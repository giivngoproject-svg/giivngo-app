import { getIntlLocale } from './locale';

/**
 * Format amount as currency using dynamic locale
 *
 * @param amount Amount to format
 * @param currency Currency code (MXN, BRL, AUD)
 * @param locale Intl locale string (es-MX, pt-BR, en-AU)
 * @returns Formatted currency string
 *
 * Usage:
 * formatCurrency(100, 'MXN', 'es-MX') → "M$100.00"
 * formatCurrency(100, 'BRL', 'pt-BR') → "R$ 100,00"
 * formatCurrency(100, 'AUD', 'en-AU') → "A$100.00"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'AUD',
  locale: string = 'en-AU'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if locale not supported
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format AUD (backward compatibility)
 * DEPRECATED: Use formatCurrency() instead
 */
export function formatAUD(amount: number, opts?: { withCents?: boolean }): string {
  const withCents = opts?.withCents ?? true;
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  }).format(amount);
}

/**
 * Round amount to 2 decimal places (currency precision)
 */
export function roundAmount(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * DEPRECATED: calcFee and calculateCheckoutTotal
 *
 * The backend now authoritatively calculates ALL fees.
 * DO NOT use client-side fee calculation.
 *
 * Fees are returned from API endpoints:
 * - POST /campaigns/:slug/checkout → CheckoutResponseDto with server-calculated fees
 * - GET /stripe-fees → StripeCountryFees with fee configuration
 *
 * Use these returned values, never pre-calculate on frontend.
 */
export const PLATFORM_FEE_RATE = 0.025;

export function calcFee(amount: number): { fee: number; net: number } {
  console.warn(
    'DEPRECATED: calcFee() should not be used. Backend calculates fees authoritatively.'
  );
  const fee = Math.round(amount * PLATFORM_FEE_RATE * 100) / 100;
  return { fee, net: amount - fee };
}

export function calculateCheckoutTotal(montoNeto: number): {
  checkoutTotal: number;
  stripeFee: number;
  fixedFee: number;
  totalFees: number;
  neto: number;
  netAmount: number;
} {
  console.warn(
    'DEPRECATED: calculateCheckoutTotal() should not be used. Use backend-calculated fees from checkout API.'
  );
  const FIXED_FEE = 0.60;
  const STRIPE_FACTOR = 0.962;

  const checkoutTotal = Math.round(((montoNeto + FIXED_FEE) / STRIPE_FACTOR) * 100) / 100;
  const totalFees = Math.round((checkoutTotal - montoNeto) * 100) / 100;
  const stripeFee = Math.round((totalFees - FIXED_FEE) * 100) / 100;

  return {
    checkoutTotal,
    stripeFee,
    fixedFee: FIXED_FEE,
    totalFees,
    neto: montoNeto,
    netAmount: montoNeto,
  };
}
