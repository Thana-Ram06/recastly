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
    <header
      className="h-16 flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-40 glass"
      style={{
        background: 'rgba(12,12,18,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Mobile logo */}
      <Link href="/dashboard" className="lg:hidden flex items-center gap-2.5">
        <div className="h-6 w-6 rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 flex items-center justify-center">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 10H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-sm font-semibold text-zinc-100 tracking-tight">Recastly</span>
      </Link>

      {title && (
        <h1 className="hidden lg:block text-sm font-semibold text-zinc-300 tracking-[-0.01em]">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          className="lg:hidden h-8 w-8 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.07] transition-all"
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
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 lg:hidden z-50 glass"
            style={{
              background: 'rgba(12,12,18,0.96)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="px-4 py-3 space-y-0.5">
              {mobileNav.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 h-9 px-3 rounded-xl text-sm transition-all',
                    pathname === href
                      ? 'bg-[#17171f] text-zinc-100 font-medium'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05]'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="px-4 pb-4 pt-2.5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2.5">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full ring-1 ring-white/10" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold">
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
