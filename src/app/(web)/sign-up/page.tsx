"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoading, error } = useAuth();

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
        <h1 className="text-4xl font-bold tracking-tight">Create your account</h1>
        <p className="text-blue-200 mt-1.5 font-bold bg-black/50 rounded-lg inline-block px-4 mx-auto">Start your first campaign in two minutes</p>
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
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          prefix={<User size={16} />}
          required
          name="fullname_"
          disabled={isLoading}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefix={<Mail size={16} />}
          required
          name="email_"
          disabled={isLoading}
          placeholder="newuser@example.com"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          name="password_"
          disabled={isLoading}
          minLength={6}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  </>);
}
