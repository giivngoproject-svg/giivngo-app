export const PLATFORM_FEE_RATE = 0.025;

export function formatAUD(amount: number, opts?: { withCents?: boolean }): string {
  const withCents = opts?.withCents ?? false;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  }).format(amount);
}

export function calcFee(amount: number): { fee: number; net: number } {
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
  const FIXED_FEE = 0.60;
  const STRIPE_FACTOR = 0.962; // 3.8% Stripe fee

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
