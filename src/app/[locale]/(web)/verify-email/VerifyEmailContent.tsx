"use client";

import { Suspense, useEffect, useState } from "react";
// router y el link a /dashboard van al PANEL (sin prefijo de locale) → next/navigation
// y next/link crudos. Los links públicos (/sign-in, /verify-email) usan el localizado.
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import { Mail, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";

type State = "checking" | "verify-prompt" | "success" | "error" | "resend-sent";

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { user, isAuthenticated, hasCheckedAuth, updateUser } = useAuth();
  const [state, setState] = useState<State>("checking");
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  // If token is provided, verify it
  useEffect(() => {
    if (!token) {
      // No token - show "check your inbox" prompt
      if (hasCheckedAuth) {
        setState("verify-prompt");
      }
      return;
    }

    // Token provided - verify it
    const verify = async () => {
      setState("checking");
      try {
        const result = await authApi.verifyEmail(token);
        if (result.success) {
          // Update user in store
          updateUser({ email_verified: true });
          setState("success");

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Failed to verify email. Please try again.";
        setError(message);
        setState("error");
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    try {
      const result = await authApi.resendVerification();
      if (result.success) {
        setState("resend-sent");
        setTimeout(() => {
          setState("verify-prompt");
        }, 3000);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to resend verification email.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  if (!hasCheckedAuth) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-[#4f46e5] mx-auto mb-4" />
          <p className="text-gray-600">Checking your account...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Checking state */}
        {state === "checking" && (
          <div className="text-center">
            <Loader size={48} className="animate-spin text-[#4f46e5] mx-auto mb-4" />
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}

        {/* Verify prompt - no token provided */}
        {state === "verify-prompt" && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <Mail size={48} className="mx-auto text-[#4f46e5] mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h1>
              <p className="text-gray-600">
                We've sent a verification link to <strong>{user?.email}</strong>
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Click the link in the email to verify your account. The link expires in 24 hours.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-sm">
                <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleResend}
                variant="secondary"
                className="w-full"
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>

              <div className="text-center">
                <Link
                  href="/sign-in"
                  className="text-sm text-[#4f46e5] hover:underline font-medium"
                >
                  Sign in with a different account
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Success state */}
        {state === "success" && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email verified!</h1>
            <p className="text-gray-600 mb-6">
              Your account is all set. Redirecting to your dashboard...
            </p>
            <NextLink href="/dashboard" className="inline-block">
              <Button>Go to Dashboard</Button>
            </NextLink>
          </div>
        )}

        {/* Error state */}
        {state === "error" && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification failed</h1>
              <p className="text-gray-600">{error}</p>
            </div>

            <div className="space-y-4">
              <Link href="/verify-email" className="block">
                <Button className="w-full">Back to verification</Button>
              </Link>
              <Link href="/sign-in" className="block">
                <Button variant="secondary" className="w-full">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Resend sent state */}
        {state === "resend-sent" && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Email sent!</h1>
            <p className="text-gray-600">Check your inbox for the verification link.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-[#4f46e5] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </section>
    }>
      <VerifyEmailInner />
    </Suspense>
  );
}
