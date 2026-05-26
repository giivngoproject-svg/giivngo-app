"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, User } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignUpPage() {
  const router = useRouter();
  const signUp = useAuth((s) => s.signUp);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    signUp(name, email);
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto px-5 py-12 sm:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="text-muted mt-1.5">Start your first campaign in two minutes</p>
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
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          prefix={<User size={16} />}
          required
        />
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
          hint="Min 8 characters — we won't actually check, this is a demo."
          required
        />
        <Button type="submit" size="lg" className="w-full">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </p>
      <p className="text-center text-xs text-muted mt-3">
        Demo · no verification email is actually sent.
      </p>
    </div>
  );
}

function SocialButton({ provider }: { provider: string }) {
  const router = useRouter();
  const signUp = useAuth((s) => s.signUp);
  return (
    <button
      onClick={() => {
        signUp(`New ${provider} user`, `${provider.toLowerCase()}@giivngo.app`);
        router.push("/dashboard");
      }}
      className="w-full h-11 px-5 rounded-2xl border border-border bg-background text-[15px] font-medium hover:bg-foreground/[.03] flex items-center justify-center gap-2"
    >
      <span className="w-4 h-4 rounded-full bg-foreground/10 inline-block" />
      Continue with {provider}
    </button>
  );
}
