'use client';

import React from 'react';
import { formatCurrency } from '@/lib/money';
import { useLocale } from '@/hooks/useLocale';
import { getIntlLocale } from '@/lib/locale';
import type { CheckoutFeeResult } from '@/stores/fees';

interface FeeBreakdownComponentProps {
  feeResult: CheckoutFeeResult;
  currency: string;
  showDetails?: boolean; // Show breakdown details (percentages, flat fees)
}

/**
 * Display itemized fee breakdown for transparency
 *
 * Shows:
 * - Contribution amount
 * - Stripe processing fee (domestic + international + conversion)
 * - Platform fee (giivngo commission)
 * - Total amount to be charged
 *
 * Usage:
 * <FeeBreakdownComponent
 *   feeResult={checkoutResponse}
 *   currency="MXN"
 *   showDetails={true}
 * />
 */
export function FeeBreakdownComponent({
  feeResult,
  currency,
  showDetails = false,
}: FeeBreakdownComponentProps) {
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale.locale);

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
      {/* Contribution Amount */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 dark:text-gray-300">Your contribution:</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {formatCurrency(feeResult.amount, currency, intlLocale)}
        </span>
      </div>

      {/* Stripe Fee */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Stripe processing fee:</span>
        <span className="text-gray-700 dark:text-gray-300">
          {formatCurrency(feeResult.stripeFee, currency, intlLocale)}
        </span>
      </div>

      {/* Stripe Fee Breakdown (Optional) */}
      {showDetails && feeResult.breakdown && (
        <div className="ml-4 space-y-1 border-l-2 border-gray-300 py-2 pl-3 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Domestic rate ({feeResult.breakdown.stripeDomesticPct}%):</span>
            <span>
              {formatCurrency(
                (feeResult.amount * feeResult.breakdown.stripeDomesticPct) / 100,
                currency,
                intlLocale
              )}
            </span>
          </div>
          {feeResult.breakdown.stripeDomesticFlat > 0 && (
            <div className="flex justify-between">
              <span>Flat fee:</span>
              <span>{formatCurrency(feeResult.breakdown.stripeDomesticFlat, currency, intlLocale)}</span>
            </div>
          )}
          {feeResult.breakdown.stripeIntlCardPct > 0 && (
            <div className="flex justify-between">
              <span>International card surcharge ({feeResult.breakdown.stripeIntlCardPct}%):</span>
              <span>
                {formatCurrency(
                  (feeResult.amount * feeResult.breakdown.stripeIntlCardPct) / 100,
                  currency,
                  intlLocale
                )}
              </span>
            </div>
          )}
          {feeResult.breakdown.stripeConversionPct > 0 && (
            <div className="flex justify-between">
              <span>Currency conversion ({feeResult.breakdown.stripeConversionPct}%):</span>
              <span>
                {formatCurrency(
                  (feeResult.amount * feeResult.breakdown.stripeConversionPct) / 100,
                  currency,
                  intlLocale
                )}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Platform Fee */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Platform fee ({feeResult.breakdown.platformFeePct}%):</span>
        <span className="text-gray-700 dark:text-gray-300">
          {formatCurrency(feeResult.platformFee, currency, intlLocale)}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 dark:border-gray-600" />

      {/* Total Amount to Charge */}
      <div className="flex justify-between text-base font-semibold">
        <span className="text-gray-900 dark:text-gray-100">Total you'll be charged:</span>
        <span className="text-blue-600 dark:text-blue-400">
          {formatCurrency(feeResult.checkoutTotal, currency, intlLocale)}
        </span>
      </div>

      {/* Organizer Receives */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        ℹ️ The organizer receives{' '}
        <span className="font-medium">
          {formatCurrency(feeResult.amount, currency, intlLocale)}
        </span>{' '}
        after fees
      </p>
    </div>
  );
}
