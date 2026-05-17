'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { cn } from '@/utils/helpers';

const navLinks = [
  { label: 'Features',    href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing',     href: '/#pricing' },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative h-7 w-7 rounded-lg overflow-hidden bg-brand-600 flex items-center justify-center shadow-glow-sm">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 10H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Recastly
      </span>
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass bg-white/75 dark:bg-zinc-950/80 border-b border-zinc-200/50 dark:border-white/5'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <Logo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100/60 dark:hover:bg-white/5 transition-all"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/8 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/50 dark:border-white/5"
          >
            <div className="px-5 py-4 space-y-0.5">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center py-2.5 px-3 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-3 flex gap-2">
                {user ? (
                  <Link href="/dashboard" className="flex-1">
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link href="/login" className="flex-1">
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
