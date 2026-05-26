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
