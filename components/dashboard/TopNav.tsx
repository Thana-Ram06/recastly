'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, Zap, LayoutDashboard, History, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { useAuth } from '@/hooks/useAuth';

const mobileNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'History', href: '/history', icon: History },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function TopNav({ title }: { title?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-40">
      {/* Mobile logo */}
      <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-brand-500 flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-zinc-900 dark:text-zinc-100">Recastly</span>
      </Link>

      {/* Page title */}
      {title && (
        <h1 className="hidden lg:block text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 lg:hidden z-50"
          >
            <div className="space-y-1 mb-3">
              {mobileNav.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 h-9 px-3 rounded-lg text-sm',
                    pathname === href
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.displayName?.charAt(0) || '?'}
                  </div>
                )}
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{user?.displayName || user?.email}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
