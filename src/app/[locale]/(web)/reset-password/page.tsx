"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase-client";
import { useTranslation } from "@/lib/useTranslation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Phase = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordPage() {
  const t = useTranslation();
  const [phase, setPhase] = useState<Phase>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // The reset link carries a recovery session in the URL; Supabase exchanges it automatically
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setPhase("ready");
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setPhase("ready");
    });
    // No recovery session after a short wait: the link is invalid or already used
    const timer = window.setTimeout(() => {
      setPhase((p) => (p === "checking" ? "invalid" : p));
    }, 4000);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError(t("auth.reset.too_short"));
      return;
    }
    if (password !== confirm) {
      setError(t("auth.reset.mismatch"));
      return;
    }
    setIsSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    // Close the recovery session: the user signs in with the new password
    await supabase.auth.signOut();
    setPhase("done");
  };

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{t("auth.reset.title")}</h1>

      {phase === "checking" && <p className="mt-6 text-sm text-muted">…</p>}

      {phase === "invalid" && (
        <div className="mt-6 space-y-4">
          <p className="rounded-2xl border border-border bg-background p-5 text-sm">{t("auth.reset.invalid")}</p>
          <Link href="/forgot-password" className="text-accent hover:underline text-sm">
            {t("auth.forgot.link")}
          </Link>
        </div>
      )}

      {phase === "ready" && (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <p className="text-sm text-muted">{t("auth.reset.description")}</p>
          <Input
            label={t("auth.reset.new_label")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSaving}
          />
          <Input
            label={t("auth.reset.confirm_label")}
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={isSaving}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
            {isSaving ? t("auth.reset.saving") : t("auth.reset.submit")}
          </Button>
        </form>
      )}

      {phase === "done" && (
        <div className="mt-6 space-y-4">
          <p className="rounded-2xl border border-border bg-background p-5 text-sm">{t("auth.reset.success")}</p>
          <Link href="/sign-in" className="text-accent hover:underline text-sm">
            {t("auth.back_to_signin")}
          </Link>
        </div>
      )}
    </div>
  );
}
