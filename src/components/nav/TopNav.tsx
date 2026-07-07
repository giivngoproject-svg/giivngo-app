"use client";

// Enlaces PÚBLICOS (rutas bajo [locale]/(web)) usan el Link/router localizado de
// @/i18n/navigation, que antepone el locale actual (/es-mx/sign-in). Los enlaces
// al PANEL (/dashboard, /profile) van SIN prefijo → next/link crudo (prop `panel`).
import NextLink from "next/link";
import Image from "next/image";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, LogOut, User as UserIcon, LayoutDashboard, RotateCcw, MenuIcon, LogIn, SignalIcon, UserPen, ToolCase, FolderTree, CircleDollarSign, Building2 } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { useCampaigns } from "@/stores/campaigns";
import { toast } from "@/stores/toast";
import { useTranslation } from "@/lib/useTranslation";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";


type DesktopLink = { href: string, labelKey: string, icon: React.ReactNode };

const desktopLinks: DesktopLink[] = [
  { href: "/#how-it-works", labelKey: "landing.nav.how_it_works", icon: <LayoutDashboard size={15} /> },
  { href: "/#use-cases", labelKey: "landing.nav.use_cases", icon: <ToolCase size={15} /> },
  // Hidden for now — re-enable once these pages/sections exist:
  // { href: "/features", labelKey: "landing.nav.features", icon: <FolderTree size={15} /> },
  { href: "/#pricing", labelKey: "landing.nav.pricing", icon: <CircleDollarSign size={15} /> },
  { href: "/search/all", labelKey: "nav.search_pool", icon: <CircleDollarSign size={15} /> },
  // { href: "/about", labelKey: "landing.nav.about", icon: <Building2 size={15} /> },
];

export function TopNav() {
  const t = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const reset = useCampaigns((s) => s.reset);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);

  // Only apply scroll effect on homepage.
  // usePathname localizado devuelve la ruta SIN prefijo de locale ("/" en la home).
  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 100);
    };

    if (isHomepage) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      // On other pages, always keep text black
      setIsTop(false);
    }
  }, [isHomepage]);


  return (
    <header className={`fixed w-full top-0 z-50  backdrop-blur bg-transparent ${isTop ? "bg-black/20  " : "bg-white text-black"}`}>
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-">
          <Logo />
          {/* <span className="hidden sm:inline text-xs text-muted px-1.5 py-0.5 rounded-md bg-foreground/5">
            V 1.0.0
          </span> */}
        </Link>
        <nav className="desktop-nav hidden sm:flex">
          {desktopLinks.map((link, index) => (
            <MenuLink key={index} href={link.href} icon={null} onClick={() => setSidebarOpen(!sidebarOpen)}  > <span className={`${isTop ? "text-white" : "text-black"} text-pretty`}>{t(link.labelKey as any)}</span> </MenuLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher
            compact
            showLabel={false}
            variant="ghost"
            isTop={isTop}
            className="hidden sm:flex"
          />

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
                    <MenuLink panel href="/dashboard" icon={<LayoutDashboard size={15} />} onClick={() => setMenuOpen(false)} > {t("nav.dashboard")} </MenuLink>
                    <MenuLink panel href="/profile" icon={<UserIcon size={15} />} onClick={() => setMenuOpen(false)}> {t("nav.profile")} </MenuLink>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                        router.push("/");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-foreground/5 border-t border-border text-foreground/80"
                    >
                      <LogOut size={15} />
                      {t("nav.logout")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-row items-center gap-1.5">
              <Link
                href="/sign-in"
                className="text-sm font-medium  py-1.5 rounded-full hover:bg-foreground/5"
              >
                <Button size="sm" variant="outline" className="flex flex-row gap-3 items-center"><LogIn size={14} className="inline-block md:hidden" /> <span className="hidden sm:inline">{t("landing.nav.login")}</span></Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm"><UserPen size={14} className="inline-block md:hidden" /> <span className="hidden sm:inline">{t("landing.nav.signup")}</span></Button>
              </Link>
            </div>

          )}
          {desktopLinks.length > 0 && (
            <Button
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
              }}
              variant="outline"
              size="sm"
              className="sm:hidden flex items-center bg-white hover:bg-slate-200"
              title={t("nav.menu_toggle")}
            >
              <MenuIcon size={14} />
            </Button>
          )}
        </div>
      </div>
      <div className={`sm:hidden absolute w-full top-[64px] left-1/2 -translate-x-1/2 bg-white border-b border-border transition-all duration-300 ease-in-out ${sidebarOpen ? "min-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
        {desktopLinks.map((link, index) => (
          <MenuLink key={index} href={link.href} icon={link.icon} onClick={() => setSidebarOpen(false)}  > <span className="py-3 text-pretty text-slate-900  w-full block font-bold">{t(link.labelKey as any)}</span> </MenuLink>
        ))}
        {/* Language Switcher Mobile */}
        <div className="px-4 py-4 border-t border-border">
          <LanguageSwitcher compact showLabel variant="outline" />
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
  panel = false,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  panel?: boolean; // true = ruta del panel (sin prefijo de locale) → next/link crudo
}) {
  const LinkComponent = panel ? NextLink : Link;
  return (
    <LinkComponent
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-foreground/5"
    >
      {icon}
      {children}
    </LinkComponent>
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

export function Logo() {
  return (
    <Image
      src="/logo.webp"
      alt="giivngo"
      width={1951}
      height={541}
      priority
      className="h-7 w-auto"
    />
  );
}
