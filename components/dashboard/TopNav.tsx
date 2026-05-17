'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, History, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { useAuth } from '@/hooks/useAuth';

const mobileNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'History',   href: '/history',   icon: History },
  { label: 'Settings',  href: '/settings',  icon: Settings },
];

export function TopNav({ title }: { title?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="h-14 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-40">
      {/* Mobile logo */}
      <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
        <div className="h-5 w-5 rounded bg-brand-600 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 10H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-sm font-semibold text-zinc-100">Recastly</span>
      </Link>

      {title && (
        <h1 className="hidden lg:block text-sm font-semibold text-zinc-300">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/6 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 bg-zinc-950 border-b border-white/5 px-4 py-3 lg:hidden z-50"
          >
            <div className="space-y-0.5 mb-3">
              {mobileNav.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm transition-all',
                    pathname === href
                      ? 'bg-white/8 text-zinc-100 font-medium'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="border-t border-white/5 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-brand-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {user?.displayName?.charAt(0) || '?'}
                  </div>
                )}
                <span className="text-xs text-zinc-400">{user?.displayName || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
