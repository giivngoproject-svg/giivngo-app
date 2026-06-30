'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Plus, Settings, LogOut, ChevronDown, Menu, PersonStanding, CircleUserRound, Cog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/Toaster';
import { MockStripeCheckout } from '@/components/checkout/MockStripeCheckout';
import { Avatar, Logo } from '@/components/nav/TopNav';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/Button';

const SIDEBAR_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create', label: 'Create pool', icon: Plus },
  { href: '/profile', label: 'My account', icon: CircleUserRound },
  { href: '/settings', label: 'App settings', icon: Cog },
];

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const [menuOpen, setMenuOpen] = useState(false);
  const [asideOpen, setAsideOpen] = useState(false);


  const handleSignOut = () => {
    setMenuOpen(false);
    signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay - appears when sidebar is open on mobile */}
      {asideOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
          onClick={() => setAsideOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col ${asideOpen ? 'fixed top-0 bottom-0  left-0 z-40 sm:relative sm:block' : 'hidden'}`}>

        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        {/* User Section */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Avatar name={user?.name || 'User'} url={user?.avatar_url} size={36} />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.display_name || user?.name?.split(' ')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {/* <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={16} />
                    Profile Settings
                  </Link> */}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${isActive
                  ? 'bg-[#1E1B4B]/10 text-[#1E1B4B]'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-start gap-10">
            <Button variant='primary' size="sm" onClick={() => setAsideOpen(!asideOpen)}>
              <Menu size={13} />
            </Button>
            <div>
              {/* <h1 className="text-2xl font-bold text-gray-900">{pathname}</h1> */}
              <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.display_name || user?.name?.split(' ')[0] || 'User'}! 👋</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>

      <Toaster />
      <MockStripeCheckout />
    </div>
  );
}
