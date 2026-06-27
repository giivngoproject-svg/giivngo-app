"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, AlertCircle, Loader } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { profileApi } from "@/lib/api";
import { AuthCheck } from "@/components/AuthCheck";
import { Button } from "@/components/ui/Button";

type PageState = "loading" | "success" | "pending" | "error";

function StripeSuccessInner() {
  const router = useRouter();
  const { updateUser } = useAuth();

  const [state, setPageState] = useState<PageState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const syncStripeAccount = async () => {
      try {
        // Fetch updated profile with stripeAccountId
        const profile = await profileApi.get();
        updateUser({
          name: profile.name,
          email: profile.email,
          display_name: profile.displayName,
          avatar_url: profile.avatarUrl,
          phone: profile.phone,
          stripe_account_id: profile.stripeAccountId,
          email_verified: profile.emailVerified,
          created_at: profile.createdAt,
        });

        // Fetch Stripe status to check if charges are enabled
        const status = await profileApi.getStripeStatus();

        if (status.chargesEnabled) {
          setPageState("success");
          // Auto-redirect to profile after 3 seconds
          setTimeout(() => {
            setRedirect(true);
          }, 3000);
        } else {
          setPageState("pending");
        }
      } catch (err: any) {
        console.error("Failed to sync Stripe account", err);
        setError(
          err.response?.data?.message ||
            "Failed to complete setup. Please try again.",
        );
        setPageState("error");
      }
    };

    syncStripeAccount();
  }, [updateUser]);

  if (redirect) {
    router.push("/profile");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Loading state */}
        {state === "loading" && (
          <div className="text-center">
            <Loader size={48} className="animate-spin text-[#4f46e5] mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Setting up your account...</p>
          </div>
        )}

        {/* Success state */}
        {state === "success" && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Account connected!
            </h1>
            <p className="text-gray-600 mb-6">
              Your payout account is all set. You can now receive funds from your
              campaigns.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your profile in a few seconds...
            </p>
          </div>
        )}

        {/* Pending state */}
        {state === "pending" && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <Clock size={48} className="mx-auto text-amber-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verification in progress
              </h1>
              <p className="text-gray-600">
                Stripe is verifying your details. This usually takes a few
                minutes.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                You don't need to do anything else. We'll notify you when your
                account is ready to receive payouts.
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={() => router.push("/profile")}>
                Return to profile
              </Button>
            </div>
          </div>
        )}

        {/* Error state */}
        {state === "error" && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Setup failed
              </h1>
              <p className="text-gray-600">{error}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push("/profile")}>
                Back to profile
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StripeSuccessPage() {
  return (
    <AuthCheck requireAuth={true}>
      <StripeSuccessInner />
    </AuthCheck>
  );
}
