"use client";

import { useLanguage } from "@/stores/language";
import { useTranslation } from "@/lib/useTranslation";
import { Globe } from "lucide-react";

type Language = "en" | "es" | "pt-br";

const LANGUAGE_OPTIONS: { value: Language; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "pt-br", label: "Português", flag: "🇧🇷" },
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
  const language = useLanguage((s) => s.language);
  const setLanguage = useLanguage((s) => s.setLanguage);
  const t = useTranslation();

  const currentLang = LANGUAGE_OPTIONS.find((opt) => opt.value === language);

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

  // Icon color
  const iconColor = isTop ? "text-white/70" : "text-slate-500";

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"} ${className}`}>
      {showLabel && (
        <label className={`whitespace-nowrap font-medium ${compact ? "text-xs" : "text-sm"} ${labelColor}`}>
          {t("settings.language")}
        </label>
      )}

      <div className="relative inline-block">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
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
              {option.flag} {option.label}
            </option>
          ))}
        </select>

        {/* Globe icon */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none ${compact ? "ml-2" : "ml-3"}`}>
          <Globe size={compact ? 16 : 18} className={iconColor} />
        </div>
      </div>
    </div>
  );
}
