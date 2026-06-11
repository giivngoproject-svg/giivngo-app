"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut, User as UserIcon, LayoutDashboard, RotateCcw } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { useCampaigns } from "@/stores/campaigns";
import { toast } from "@/stores/toast";
import { Button } from "@/components/ui/Button";

export function TopNav() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const reset = useCampaigns((s) => s.reset);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="hidden sm:inline text-xs text-muted px-1.5 py-0.5 rounded-md bg-foreground/5">
            V 1.0.0
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => {
              reset();
              toast.success("Demo reset", "Seed data restored");
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground px-2.5 py-1.5 rounded-full hover:bg-foreground/5"
            title="Reset demo data"
          >
            <RotateCcw size={14} />
            Reset
          </button> */}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full pl-1.5 pr-2.5 py-1.5 hover:bg-foreground/5"
              >
                <Avatar name={user.name} url={user.avatar_url} />
                <span className="text-sm font-medium hidden sm:inline">
                  {user.display_name || user.name.split(" ")[0]}
                </span>
                <ChevronDown size={14} className="text-muted" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-2xl shadow-lift overflow-hidden z-20">
                    <MenuLink
                      href="/dashboard"
                      icon={<LayoutDashboard size={15} />}
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </MenuLink>
                    <MenuLink
                      href="/profile"
                      icon={<UserIcon size={15} />}
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </MenuLink>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                        router.push("/");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-foreground/5 border-t border-border text-foreground/80"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium px-3 py-1.5 rounded-full hover:bg-foreground/5"
              >
                Log in
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-foreground/5"
    >
      {icon}
      {children}
    </Link>
  );
}

export function Avatar({ name, url, size = 28 }: { name: string; url?: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-accent/15 text-accent text-[11px] font-semibold"
      style={{ width: size, height: size }}
    >
      {initials || "?"}
    </span>
  );
}

function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="giivngo"
      width={1951}
      height={541}
      priority
      className="h-7 w-auto"
    />
  );
}
