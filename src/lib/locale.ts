/**
 * Locale to currency mapping
 * Maps locale strings (from URL) to currency codes and country codes
 */

export interface LocaleConfig {
  locale: string;
  countryCode: string;
  currency: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
  'es-mx': {
    locale: 'es-mx',
    countryCode: 'MX',
    currency: 'MXN',
    name: 'Español (México)',
    flag: '🇲🇽',
  },
  'pt-br': {
    locale: 'pt-br',
    countryCode: 'BR',
    currency: 'BRL',
    name: 'Português (Brasil)',
    flag: '🇧🇷',
  },
  'en-au': {
    locale: 'en-au',
    countryCode: 'AU',
    currency: 'AUD',
    name: 'English (Australia)',
    flag: '🇦🇺',
  },
};

export const DEFAULT_LOCALE: LocaleConfig = SUPPORTED_LOCALES['en-au'];

/**
 * Get locale config from locale string (from URL)
 */
export function getLocaleConfig(locale: string): LocaleConfig {
  const normalized = locale?.toLowerCase() || '';
  return SUPPORTED_LOCALES[normalized] || DEFAULT_LOCALE;
}

/**
 * Get currency from locale
 */
export function getCurrencyFromLocale(locale: string): string {
  return getLocaleConfig(locale).currency;
}

/**
 * Get country code from locale
 */
export function getCountryCodeFromLocale(locale: string): string {
  return getLocaleConfig(locale).countryCode;
}

/**
 * Get Intl.NumberFormat locale from our locale string
 * Maps es-mx → es-MX, pt-br → pt-BR, en-au → en-AU
 */
export function getIntlLocale(locale: string): string {
  const config = getLocaleConfig(locale);
  const parts = config.locale.split('-');
  if (parts.length === 2) {
    return `${parts[0]}-${parts[1].toUpperCase()}`;
  }
  return config.locale;
}

/**
 * Check if locale is supported
 */
export function isSupportedLocale(locale: string): boolean {
  return !!SUPPORTED_LOCALES[locale?.toLowerCase() || ''];
}

/**
 * List all supported locales
 */
export function listSupportedLocales(): LocaleConfig[] {
  return Object.values(SUPPORTED_LOCALES);
}
