"use client";

import { useTranslation } from "@/lib/useTranslation";
import { useLanguage } from "@/stores/language";
import { AuthCheck } from "@/components/AuthCheck";
import { MARKETS } from "@/i18n/markets";

export default function SettingsPage() {
  const t = useTranslation();
  const { countryCode, setMarket } = useLanguage();

  return (
    <AuthCheck requireAuth={true}>
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("settings.title")}
          </h1>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Language Selection */}
          <section className="rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold mb-4">{t("settings.language")}</h2>
            <p className="text-sm text-muted mb-4">
              {t("settings.language.description")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MARKETS.map((market) => (
                <button
                  key={market.locale}
                  onClick={() => setMarket(market)}
                  className={`px-4 py-3 rounded-lg border-2 text-left transition-all ${countryCode === market.country
                      ? "border-accent bg-accent/10 font-semibold"
                      : "border-border bg-transparent hover:bg-foreground/5"
                    }`}
                >
                  <span className="block">{market.flag} {market.countryName}</span>
                  <span className="block text-xs text-muted font-normal">{market.languageLabel}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Theme (Placeholder) */}
          <section className="rounded-3xl border border-border bg-background p-6 opacity-50">
            <h2 className="text-lg font-semibold mb-4">{t("settings.theme")}</h2>
            <p className="text-sm text-muted mb-4">
              {t("settings.theme.description")}
            </p>
            <p className="text-sm font-medium text-accent">{t("common.coming_soon")}</p>
          </section>

          {/* Notifications (Placeholder) */}
          <section className="rounded-3xl border border-border bg-background p-6 opacity-50">
            <h2 className="text-lg font-semibold mb-4">
              {t("settings.notifications")}
            </h2>
            <p className="text-sm text-muted mb-4">
              {t("settings.notifications.description")}
            </p>
            <p className="text-sm font-medium text-accent">{t("common.coming_soon")}</p>
          </section>

          {/* Privacy & Security (Placeholder) */}
          <section className="rounded-3xl border border-border bg-background p-6 opacity-50">
            <h2 className="text-lg font-semibold mb-4">
              {t("settings.privacy")}
            </h2>
            <p className="text-sm text-muted mb-4">
              {t("settings.privacy.description")}
            </p>
            <p className="text-sm font-medium text-accent">{t("common.coming_soon")}</p>
          </section>
        </div>
      </div>
    </AuthCheck>
  );
}