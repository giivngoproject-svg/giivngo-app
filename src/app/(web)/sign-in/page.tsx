"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, AlertCircle } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const expired = params.get("expired") === "true";
  const { signIn, isLoading, error, isAuthenticated, hasCheckedAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const success = await signIn(email, password);
    if (success) {
      router.push(next);
    }
  };

  // If user is already authenticated, redirect to dashboard
  // Wait for hasCheckedAuth to be true before making redirect decision
  useEffect(() => {
    if (hasCheckedAuth && isAuthenticated) {
      router.push(next);
    }
  }, [hasCheckedAuth, isAuthenticated, next, router]);

  // Show loading while checking auth status
  if (!hasCheckedAuth) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Don't show sign-in page if already authenticated
  if (isAuthenticated) {
    return null;
  }

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
        <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-blue-200 mt-1.5 font-bold bg-black/50 rounded-lg inline-block px-4 mx-auto">Sign in to manage your campaigns</p>
      </div>


    </section>

    <div className="max-w-md mx-auto px-5 py-12 sm:py-20 ">


      {expired && (
        <div className="mb-6 p-3 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-3 text-sm">
          <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-yellow-700">Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-sm">
          <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefix={<Mail size={16} />}
          required
          disabled={isLoading}
          placeholder="alex@demo.local"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-accent font-medium hover:underline">
          Sign up
        </Link>
      </p>


    </div>
  </>);
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}
