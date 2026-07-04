"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslation } from "@/lib/useTranslation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const LANGUAGE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "en-au", label: "English" },
  { value: "es-419", label: "Español" },
  { value: "pt-br", label: "Português" },
];

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
  variant?: "outline" | "ghost" | "filled";
  isTop?: boolean; // true = dark background (white text), false = light background (slate text)
}

/**
 * Global language switcher component
 * Can be placed anywhere in the app (public site or dashboard)
 *
 * Usage:
 * <LanguageSwitcher />
 * <LanguageSwitcher compact showLabel={false} variant="ghost" />
 * <LanguageSwitcher showLabel variant="filled" />
 */
export function LanguageSwitcher({
  className = "",
  showLabel = true,
  compact = false,
  variant = "outline",
  isTop = false,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslation();

  // Cambiar idioma = navegar a la misma ruta bajo otro locale (cambia la URL).
  const changeLocale = (next: Locale) => {
    router.replace(pathname, { locale: next });
  };

  // Variant styles - adapt colors based on isTop
  const variantStyles = {
    outline: isTop
      ? "border border-white/30 bg-white/5 hover:bg-white/15 text-white"
      : "border border-border bg-background hover:bg-foreground/[.05] text-slate-800",
    ghost: isTop
      ? "bg-transparent hover:bg-white/10 text-white"
      : "bg-transparent hover:bg-foreground/10 text-slate-800",
    filled: isTop
      ? "bg-white/15 border border-white/30 hover:bg-white/25 text-white"
      : "bg-foreground/10 border border-foreground/20 hover:bg-foreground/15 text-slate-800",
  };

  // Label color
  const labelColor = isTop ? "text-white/80" : "text-slate-600";

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"} ${className}`}>
      {showLabel && (
        <label className={`whitespace-nowrap font-medium ${compact ? "text-xs" : "text-sm"} ${labelColor}`}>
          {t("settings.language")}
        </label>
      )}

      <div className="relative inline-block">
        <select
          value={locale}
          onChange={(e) => changeLocale(e.target.value as Locale)}
          className={`
            appearance-none cursor-pointer
            flex items-center gap-2
            font-medium transition-all
            focus-visible:outline-none focus-visible:ring-2 ${isTop ? "focus-visible:ring-white/40" : "focus-visible:ring-accent/40"}
            ${variantStyles[variant]}
            ${compact ? "h-9 px-2.5 text-sm rounded-xl pr-7" : "h-11 px-4 text-sm rounded-2xl pr-9"}
            bg-no-repeat
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundPosition: `right ${compact ? "0.5rem" : "0.75rem"} center`,
            backgroundSize: "1.2em 1.2em",
          }}
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
