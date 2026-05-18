'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, History, Settings, LogOut, Crown, Zap } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'History',   href: '/history',   icon: History },
  { label: 'Settings',  href: '/settings',  icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { plan, usageCount, usageLimit } = useSubscription();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const usagePct = usageLimit ? Math.min((usageCount / usageLimit) * 100, 100) : 0;

  return (
    <aside
      className="hidden lg:flex flex-col w-56 min-h-screen fixed top-0 left-0 z-40"
      style={{
        background: '#0e0e15',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shrink-0">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 10H11" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-sm font-semibold text-zinc-100 tracking-tight">Recastly</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex items-center gap-2.5 h-9 px-3 rounded-xl text-xs font-medium transition-all duration-200',
                active
                  ? 'bg-zinc-800/60 text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05]'
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-sky-400/70" />
              )}
              <Icon className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-zinc-300' : '')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Usage card */}
      <div className="px-3 pb-3">
        <div
          className="rounded-xl p-3.5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-zinc-500 shrink-0" />
              <span className="text-[10px] text-zinc-600 font-medium">Generations</span>
            </div>
            <span className={cn(
              'inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-lg',
              plan === 'pro'     ? 'bg-sky-400/15 text-sky-400 border border-sky-400/20' :
              plan === 'starter' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                                   'bg-white/[0.05] text-zinc-600 border border-white/[0.07]'
            )}>
              {plan === 'pro' && <Crown className="h-2.5 w-2.5" />}
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </span>
          </div>
          <p className="text-xs font-semibold text-zinc-200 mb-2.5 tabular-nums">
            {usageCount}{usageLimit ? ` / ${usageLimit}` : ' / ∞'}
          </p>
          {usageLimit && (
            <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  usagePct > 80 ? 'bg-amber-500' : 'bg-zinc-400'
                )}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          )}
          {plan === 'free' && (
            <Link
              href="/settings"
              className="mt-3 text-[11px] font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              Upgrade plan →
            </Link>
          )}
        </div>
      </div>

      {/* User section */}
      <div
        className="px-3 pb-4 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/[0.04] transition-all group">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-white/10" />
          ) : (
            <div className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300 text-[10px] font-bold shrink-0">
              {user?.displayName?.charAt(0) || '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-300 truncate leading-none mb-0.5">
              {user?.displayName || 'User'}
            </p>
            <p className="text-[10px] text-zinc-700 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="h-6 w-6 flex items-center justify-center rounded-lg text-zinc-700 hover:text-zinc-300 hover:bg-white/[0.07] opacity-0 group-hover:opacity-100 transition-all shrink-0"
            title="Sign out"
          >
            <LogOut className="h-3 w-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}
