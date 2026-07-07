"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslation } from "@/lib/useTranslation";
import { MARKETS, getMarket, type Locale } from "@/i18n/markets";

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
  variant?: "outline" | "ghost" | "filled";
  isTop?: boolean; // true = dark background (white text), false = light background (slate text)
}

/**
 * Selector de mercado (país + idioma) del sitio público. Siempre visible:
 * coexiste con la detección por IP (la IP se equivoca —VPN, viajeros— y no
 * expresa preferencia de idioma), y es la vía por la que el usuario CORRIGE
 * la detección.
 *
 * SEO: las opciones son <a href> REALES a la página actual en cada mercado y
 * están SIEMPRE en el HTML (ocultas por CSS cuando el menú está cerrado).
 * Googlebot rastrea desde IPs de EE. UU.: estos enlaces son parte de cómo
 * descubre las 5 variantes. No convertir esto en un <select> ni renderizar
 * la lista condicionalmente.
 *
 * Usage:
 * <LanguageSwitcher />
 * <LanguageSwitcher compact showLabel={false} variant="ghost" />
 */
export function LanguageSwitcher({
  className = "",
  showLabel = true,
  compact = false,
  variant = "outline",
  isTop = false,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = getMarket(locale);

  // Cerrar por click-fuera y por Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Elección EXPLÍCITA del usuario: se persiste en la cookie NEXT_LOCALE, que el
  // middleware lee con PRIORIDAD sobre la detección por IP en visitas siguientes.
  // (La detección por país solo decide la primera visita, sin preferencia previa.)
  const rememberChoice = (next: Locale) => {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
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
    <div
      ref={rootRef}
      className={`relative flex items-center ${compact ? "gap-2" : "gap-3"} ${className}`}
    >
      {showLabel && (
        <label className={`whitespace-nowrap font-medium ${compact ? "text-xs" : "text-sm"} ${labelColor}`}>
          {t("settings.language")}
        </label>
      )}

      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`
          flex cursor-pointer items-center gap-2
          font-medium transition-all
          focus-visible:outline-none focus-visible:ring-2 ${isTop ? "focus-visible:ring-white/40" : "focus-visible:ring-accent/40"}
          ${variantStyles[variant]}
          ${compact ? "h-9 rounded-xl px-2.5 text-sm" : "h-11 rounded-2xl px-4 text-sm"}
        `}
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{compact ? current.country : current.countryName}</span>
        <svg
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Lista SIEMPRE en el DOM (oculta por CSS al cerrar): enlaces rastreables. */}
      <ul
        className={`${open ? "block" : "hidden"} absolute right-0 top-full z-50 mt-2 w-max min-w-[13rem] rounded-2xl border border-border bg-background py-1 shadow-lg`}
      >
        {MARKETS.map((m) => {
          const isCurrent = m.locale === current.locale;
          return (
            <li key={m.locale}>
              <Link
                href={pathname}
                locale={m.locale}
                hrefLang={m.hreflang}
                lang={m.hreflang}
                onClick={() => rememberChoice(m.locale)}
                aria-current={isCurrent ? "true" : undefined}
                className={`flex items-center gap-2 px-4 py-2 text-sm text-slate-800 transition-colors hover:bg-foreground/[.05] ${
                  isCurrent ? "font-semibold" : "font-normal"
                }`}
              >
                <span aria-hidden="true">{m.flag}</span>
                <span className="whitespace-nowrap">
                  {m.countryName} · {m.languageLabel}
                </span>
                {isCurrent && (
                  <svg
                    aria-hidden="true"
                    className="ml-auto h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
