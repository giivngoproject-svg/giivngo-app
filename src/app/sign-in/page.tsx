"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const signIn = useAuth((s) => s.signIn);

  const [email, setEmail] = useState("demo@giivngo.app");
  const [password, setPassword] = useState("demo");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    signIn(email);
    router.push(next);
  };

  return (
    <div className="max-w-md mx-auto px-5 py-12 sm:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted mt-1.5">Sign in to manage your campaigns</p>
      </div>

      <div className="space-y-2.5">
        <SocialButton provider="Google" />
        <SocialButton provider="Apple" />
      </div>

      <div className="flex items-center gap-3 my-6 text-xs text-muted">
        <div className="flex-1 h-px bg-border" />
        <span>or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefix={<Mail size={16} />}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" size="lg" className="w-full">
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-accent font-medium hover:underline">
          Sign up
        </Link>
      </p>
      <p className="text-center text-xs text-muted mt-3">
        Demo · any email works. We pre-fill the demo organiser by default.
      </p>
    </div>
  );
}

function SocialButton({ provider }: { provider: string }) {
  const router = useRouter();
  const signIn = useAuth((s) => s.signIn);
  return (
    <button
      onClick={() => {
        signIn("demo@giivngo.app");
        router.push("/dashboard");
      }}
      className="w-full h-11 px-5 rounded-2xl border border-border bg-background text-[15px] font-medium hover:bg-foreground/[.03] flex items-center justify-center gap-2"
    >
      <span className="w-4 h-4 rounded-full bg-foreground/10 inline-block" />
      Continue with {provider}
    </button>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}
