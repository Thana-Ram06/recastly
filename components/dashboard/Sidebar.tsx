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
    <aside className="hidden lg:flex flex-col w-56 border-r border-white/5 bg-zinc-950 min-h-screen fixed top-0 left-0 z-40">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-white/5">
        <div className="h-6 w-6 rounded bg-brand-600 flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 10H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-sm font-semibold text-zinc-100 tracking-tight">Recastly</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 h-8 px-2.5 rounded-lg text-xs font-medium transition-all',
                active
                  ? 'bg-white/8 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              )}
            >
              <Icon className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-brand-400' : '')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Usage card */}
      <div className="px-2 pb-2">
        <div className="rounded-lg border border-white/5 bg-white/3 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-zinc-600">Generations</span>
            <span className={cn(
              'inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded',
              plan === 'pro'     ? 'bg-brand-500/15 text-brand-400' :
              plan === 'starter' ? 'bg-emerald-500/15 text-emerald-400' :
                                   'bg-zinc-800 text-zinc-500'
            )}>
              {plan === 'pro' && <Crown className="h-2.5 w-2.5" />}
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </span>
          </div>
          <p className="text-xs font-medium text-zinc-300 mb-2">
            {usageCount}{usageLimit ? ` / ${usageLimit}` : ' / ∞'}
          </p>
          {usageLimit && (
            <div className="h-1 w-full rounded-full bg-white/6 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  usagePct > 80 ? 'bg-amber-500' : 'bg-brand-500'
                )}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          )}
          {plan === 'free' && (
            <Link href="/settings" className="mt-2.5 text-[11px] font-medium text-brand-400 hover:text-brand-300 block transition-colors">
              Upgrade plan →
            </Link>
          )}
        </div>
      </div>

      {/* User */}
      <div className="px-2 pb-3 border-t border-white/5 pt-2">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/4 transition-all group">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full object-cover shrink-0" />
          ) : (
            <div className="h-6 w-6 rounded-full bg-brand-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              {user?.displayName?.charAt(0) || '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-300 truncate leading-none mb-0.5">
              {user?.displayName || 'User'}
            </p>
            <p className="text-[10px] text-zinc-600 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="h-6 w-6 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-white/8 opacity-0 group-hover:opacity-100 transition-all shrink-0"
            title="Sign out"
          >
            <LogOut className="h-3 w-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}
