"use client";

import { useTranslation } from "@/lib/useTranslation";

export function Footer() {
  const t = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <p>{t("landing.footer.copyright")}</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-gray-900">
            {t("landing.footer.terms")}
          </a>
          <a href="#" className="hover:text-gray-900">
            {t("landing.footer.security")}
          </a>
        </div>
      </div>
    </footer>
  );
}
