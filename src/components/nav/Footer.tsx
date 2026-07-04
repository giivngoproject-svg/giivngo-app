"use client";

import { useTranslation } from "@/lib/useTranslation";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <p>{t("landing.footer.copyright")}</p>
        <div className="flex items-center gap-6">
          <Link href="/terms" className="hover:text-gray-900">
            {t("landing.footer.terms")}
          </Link>
          <Link href="/privacy" className="hover:text-gray-900">
            {t("landing.footer.privacy")}
          </Link>
          <Link href="/cookies" className="hover:text-gray-900">
            {t("landing.footer.cookies")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
