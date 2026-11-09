"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { authApi } from "@/lib/api";
import { useTranslation } from "@/lib/useTranslation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const t = useTranslation();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      // The backend always answers success, so the page never reveals whether the email has an account
      await authApi.forgotPassword(email.trim(), locale);
    } finally {
      setSent(true);
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{t("auth.forgot.title")}</h1>
      <p className="text-sm text-muted mt-2">{t("auth.forgot.description")}</p>

      {sent ? (
        <p className="mt-8 rounded-2xl border border-border bg-background p-5 text-sm">
          {t("auth.forgot.sent")}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSending}
            placeholder="your@email.com"
          />
          <Button type="submit" size="lg" className="w-full" disabled={isSending}>
            {isSending ? t("auth.forgot.sending") : t("auth.forgot.submit")}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link href="/sign-in" className="text-accent hover:underline">
          {t("auth.back_to_signin")}
        </Link>
      </p>
    </div>
  );
}
