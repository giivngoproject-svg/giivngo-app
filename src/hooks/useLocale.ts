'use client';

import { useParams } from 'next/navigation';
import { getLocaleConfig, LocaleConfig, DEFAULT_LOCALE } from '../lib/locale';

/**
 * Hook to get current locale from URL
 * Returns locale config with currency, country code, etc.
 *
 * Usage in Client Components:
 * const localeConfig = useLocale();
 * console.log(localeConfig.currency); // "MXN", "BRL", or "AUD"
 */
export function useLocale(): LocaleConfig {
  const params = useParams();
  const locale = (params?.locale as string | undefined) || 'en-au';

  return getLocaleConfig(locale);
}
