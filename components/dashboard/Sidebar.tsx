'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Settings, Zap, LogOut, Crown } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'History', href: '/history', icon: History },
  { label: 'Settings', href: '/settings', icon: Settings },
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

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 min-h-screen fixed top-0 left-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="h-7 w-7 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Recastly</span>
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
                'flex items-center gap-3 h-9 px-3 rounded-lg text-sm transition-all',
                active
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
              )}
            >
              <Icon className={cn('h-4 w-4', active ? 'text-brand-600 dark:text-brand-400' : '')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Usage */}
      <div className="px-3 pb-3">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Generations</span>
            <Badge variant={plan === 'pro' ? 'brand' : plan === 'starter' ? 'success' : 'default'}>
              {plan === 'pro' && <Crown className="h-3 w-3 mr-1" />}
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {usageCount} {usageLimit ? `/ ${usageLimit}` : '/ ∞'} used
          </p>
          {usageLimit && (
            <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${Math.min((usageCount / usageLimit) * 100, 100)}%` }}
              />
            </div>
          )}
          {plan === 'free' && (
            <Link
              href="/settings"
              className="mt-3 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline block"
            >
              Upgrade for more →
            </Link>
          )}
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all cursor-default">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
            title="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
