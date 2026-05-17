'use client';

import { Zap, Crown, TrendingUp } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';
import { cn } from '@/utils/helpers';

export function UsageStats() {
  const { plan, usageCount, usageLimit, loading } = useSubscription();

  const pct = usageLimit ? Math.min((usageCount / usageLimit) * 100, 100) : 0;
  const isNearLimit = usageLimit ? usageCount >= usageLimit * 0.8 : false;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Plan */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Current plan</span>
        </div>
        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 capitalize">{plan}</p>
        {plan !== 'pro' && (
          <Link href="/settings" className="mt-1 text-xs text-brand-600 dark:text-brand-400 hover:underline">
            Upgrade →
          </Link>
        )}
      </div>

      {/* Usage */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-brand-500" />
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">This month</span>
        </div>
        {loading ? (
          <div className="h-6 w-16 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        ) : (
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {usageCount}
            <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500 ml-1">
              {usageLimit ? `/ ${usageLimit}` : '/ unlimited'}
            </span>
          </p>
        )}
        {usageLimit && (
          <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isNearLimit ? 'bg-amber-500' : 'bg-brand-500'
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* All-time */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Generations left</span>
        </div>
        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {usageLimit === null ? '∞' : Math.max(0, (usageLimit || 0) - usageCount)}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Resets monthly</p>
      </div>
    </div>
  );
}
