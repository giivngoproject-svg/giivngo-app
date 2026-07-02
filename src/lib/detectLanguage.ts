/**
 * Detect user's preferred language based on browser/country
 * Prioritizes Spanish for Spanish-speaking countries
 */

type Language = "en" | "es" | "pt-br";

const SPANISH_LOCALES = [
  "es",      // Spain
  "es-ES",   // Spain (explicit)
  "es-MX",   // Mexico
  "es-AR",   // Argentina
  "es-CL",   // Chile
  "es-CO",   // Colombia
  "es-PE",   // Peru
  "es-VE",   // Venezuela
  "es-EC",   // Ecuador
  "es-BO",   // Bolivia
  "es-UY",   // Uruguay
  "es-PY",   // Paraguay
  "es-SV",   // El Salvador
  "es-GT",   // Guatemala
  "es-HN",   // Honduras
  "es-NI",   // Nicaragua
  "es-CR",   // Costa Rica
  "es-PA",   // Panama
  "es-CU",   // Cuba
  "es-DO",   // Dominican Republic
  "es-PR",   // Puerto Rico
];

const PORTUGUESE_BR_LOCALES = [
  "pt-BR",
  "pt-br",
  "pt",
];

/**
 * Detect language from browser navigator.language
 * Returns detected language or null if can't determine
 */
export function detectLanguageFromBrowser(): Language | null {
  if (typeof navigator === "undefined") return null;

  const userLanguage = navigator.language || navigator.languages?.[0];
  if (!userLanguage) return null;

  // Check for Spanish
  if (SPANISH_LOCALES.some((locale) => userLanguage.toLowerCase().startsWith(locale.toLowerCase()))) {
    return "es";
  }

  // Check for Portuguese (Brazil)
  if (PORTUGUESE_BR_LOCALES.some((locale) => userLanguage.toLowerCase().startsWith(locale.toLowerCase()))) {
    return "pt-br";
  }

  // Check for Portuguese (general)
  if (userLanguage.toLowerCase().startsWith("pt")) {
    return "pt-br";
  }

  return null;
}

/**
 * Get initial language preference:
 * 1. Check localStorage (user saved preference)
 * 2. Auto-detect from browser
 * 3. Default to English
 */
export function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";

  // Check localStorage first (user saved preference)
  const savedLanguage = localStorage.getItem("giivngo.language");
  if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es" || savedLanguage === "pt-br")) {
    try {
      const parsed = JSON.parse(savedLanguage);
      if (parsed.state?.language) {
        return parsed.state.language;
      }
    } catch (e) {
      // Fallback to auto-detect
    }
  }

  // Auto-detect from browser
  const detected = detectLanguageFromBrowser();
  if (detected) return detected;

  // Default to English
  return "en";
}
