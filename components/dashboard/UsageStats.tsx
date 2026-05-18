'use client';

import { Zap, Crown, Layers } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';
import { cn } from '@/utils/helpers';

const cardStyle = {
  background: '#111118',
  border: '1px solid rgba(255,255,255,0.07)',
};

export function UsageStats() {
  const { plan, usageCount, usageLimit, loading } = useSubscription();

  const pct         = usageLimit ? Math.min((usageCount / usageLimit) * 100, 100) : 0;
  const isNearLimit = usageLimit ? usageCount >= usageLimit * 0.8 : false;
  const remaining   = usageLimit === null ? null : Math.max(0, (usageLimit || 0) - usageCount);

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {/* Plan */}
      <div className="rounded-xl p-4" style={cardStyle}>
        <div className="flex items-center gap-1.5 mb-3">
          <Crown className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.1em]">Plan</span>
        </div>
        <p className="text-base font-bold text-zinc-100 capitalize tracking-[-0.02em]">{plan}</p>
        {plan !== 'pro' && (
          <Link href="/settings" className="mt-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors font-medium">
            Upgrade →
          </Link>
        )}
      </div>

      {/* Usage */}
      <div className="rounded-xl p-4" style={cardStyle}>
        <div className="flex items-center gap-1.5 mb-3">
          <Zap className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
          <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.1em]">This month</span>
        </div>
        {loading ? (
          <div className="h-5 w-12 rounded-lg shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} />
        ) : (
          <p className="text-base font-bold text-zinc-100 tracking-[-0.02em]">
            {usageCount}
            {usageLimit && (
              <span className="text-xs font-normal text-zinc-600 ml-1 tracking-normal">/ {usageLimit}</span>
            )}
          </p>
        )}
        {usageLimit && !loading && (
          <div
            className="mt-2.5 h-1 w-full rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isNearLimit ? 'bg-amber-400' : 'bg-zinc-400'
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* Remaining */}
      <div className="rounded-xl p-4" style={cardStyle}>
        <div className="flex items-center gap-1.5 mb-3">
          <Layers className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.1em]">Remaining</span>
        </div>
        <p className="text-base font-bold text-zinc-100 tracking-[-0.02em]">
          {remaining === null ? '∞' : remaining}
        </p>
        <p className="text-[11px] text-zinc-600 mt-1">Resets monthly</p>
      </div>
    </div>
  );
}
