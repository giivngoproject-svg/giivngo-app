"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/stores/auth";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuth((s) => s.user);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user === null) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/sign-in?next=${next}`);
    }
  }, [user, pathname, router]);

  return user;
}
