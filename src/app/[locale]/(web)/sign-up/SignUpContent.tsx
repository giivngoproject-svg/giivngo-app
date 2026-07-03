"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { useTranslation } from "@/lib/useTranslation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
    </svg>
  );
}

export default function SignUpPage() {
  const t = useTranslation();
  const router = useRouter();
  const { signUp, signInWithGoogle, isLoading, error } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) return;

    const success = await signUp(email, password, name);
    if (success) {
      router.push("/verify-email");
    }
  };

  return (<>
    <section
      className="relative pb-0 overflow-hidden min-h-[30vh]  flex items-center py-14"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

      <div className="w-full relative z-10 text-center mb-8 text-white">
        <h1 className="text-4xl font-bold tracking-tight">{t("auth.signup.title")}</h1>
        <p className="text-blue-200 mt-1.5 font-bold bg-black/50 rounded-lg inline-block px-4 mx-auto">{t("auth.signup.subtitle")}</p>
      </div>


    </section>


    <div className="max-w-md mx-auto px-5 py-12 sm:py-28">

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-sm">
          <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4" autoComplete="Off">
        <Input
          label={t("auth.signup.fullname_label")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          prefix={<User size={16} />}
          required
          name="fullname_"
          disabled={isLoading}
        />
        <Input
          label={t("auth.signup.email_label")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefix={<Mail size={16} />}
          required
          name="email_"
          disabled={isLoading}
          placeholder={t("auth.signup.email_placeholder")}
        />
        <Input
          label={t("auth.signup.password_label")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          name="password_"
          disabled={isLoading}
          minLength={6}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? t("auth.signup.creating_button") : t("auth.signup.create_button")}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted">{t("auth.signup.oauth")}</span>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        variant="outline"
        className="w-full"
        onClick={signInWithGoogle}
        disabled={isLoading}
      >
        <GoogleIcon />
        {t("auth.signup.google")}
      </Button>

      <p className="text-center text-sm text-muted mt-6">
        {t("auth.signup.have_account")}{" "}
        <Link href="/sign-in" className="text-accent font-medium hover:underline">
          {t("auth.signup.signin_link")}
        </Link>
      </p>
    </div>
  </>);
}
