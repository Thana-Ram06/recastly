'use client';

import { Zap, Crown, Layers } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';
import { cn } from '@/utils/helpers';

export function UsageStats() {
  const { plan, usageCount, usageLimit, loading } = useSubscription();

  const pct = usageLimit ? Math.min((usageCount / usageLimit) * 100, 100) : 0;
  const isNearLimit = usageLimit ? usageCount >= usageLimit * 0.8 : false;
  const remaining = usageLimit === null ? null : Math.max(0, (usageLimit || 0) - usageCount);

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Plan */}
      <div className="rounded-xl border border-white/6 bg-zinc-900/60 p-3.5">
        <div className="flex items-center gap-1.5 mb-2">
          <Crown className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">Plan</span>
        </div>
        <p className="text-base font-semibold text-zinc-200 capitalize">{plan}</p>
        {plan !== 'pro' && (
          <Link href="/settings" className="mt-0.5 text-[11px] text-brand-400 hover:text-brand-300 transition-colors">
            Upgrade →
          </Link>
        )}
      </div>

      {/* Usage */}
      <div className="rounded-xl border border-white/6 bg-zinc-900/60 p-3.5">
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="h-3.5 w-3.5 text-brand-400 shrink-0" />
          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">This month</span>
        </div>
        {loading ? (
          <div className="h-5 w-12 rounded bg-white/5 shimmer" />
        ) : (
          <p className="text-base font-semibold text-zinc-200">
            {usageCount}
            {usageLimit && (
              <span className="text-xs font-normal text-zinc-600 ml-1">/ {usageLimit}</span>
            )}
          </p>
        )}
        {usageLimit && !loading && (
          <div className="mt-2 h-1 w-full rounded-full bg-white/6 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isNearLimit ? 'bg-amber-400' : 'bg-brand-500'
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* Remaining */}
      <div className="rounded-xl border border-white/6 bg-zinc-900/60 p-3.5">
        <div className="flex items-center gap-1.5 mb-2">
          <Layers className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">Remaining</span>
        </div>
        <p className="text-base font-semibold text-zinc-200">
          {remaining === null ? '∞' : remaining}
        </p>
        <p className="text-[11px] text-zinc-600 mt-0.5">Resets monthly</p>
      </div>
    </div>
  );
}
