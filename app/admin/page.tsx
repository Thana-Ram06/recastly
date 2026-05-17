export const dynamic = 'force-dynamic';

import { adminDb, adminAuth } from '@/firebase/admin';
import { headers } from 'next/headers';
import { Users, Zap, CreditCard, TrendingUp, Activity } from 'lucide-react';

async function getAdminStats() {
  const [usersSnap, generationsSnap, subsSnap] = await Promise.all([
    adminDb.collection('users').count().get(),
    adminDb.collection('generations').count().get(),
    adminDb.collection('subscriptions').where('status', '==', 'active').count().get(),
  ]);

  const recentGenerations = await adminDb
    .collection('generations')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();

  return {
    totalUsers: usersSnap.data().count,
    totalGenerations: generationsSnap.data().count,
    activeSubscriptions: subsSnap.data().count,
    recent: recentGenerations.docs.map((d) => d.data()),
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
    { label: 'Generations', value: stats.totalGenerations, icon: Zap, color: 'text-brand-400' },
    { label: 'Active Subs', value: stats.activeSubscriptions, icon: CreditCard, color: 'text-emerald-400' },
    {
      label: 'Conversion',
      value: stats.totalUsers > 0 ? `${Math.round((stats.activeSubscriptions / stats.totalUsers) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'text-violet-400',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-zinc-100">Admin</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-white/6 bg-zinc-900/60 p-4">
              <Icon className={`h-4 w-4 ${color} mb-3`} />
              <p className="text-xl font-bold text-zinc-100">{value}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent generations */}
        <div className="rounded-xl border border-white/6 bg-zinc-900/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <h2 className="text-xs font-semibold text-zinc-400">Recent Generations</h2>
          </div>
          <div className="divide-y divide-white/4">
            {stats.recent.length === 0 && (
              <p className="px-4 py-6 text-xs text-zinc-600">No generations yet.</p>
            )}
            {stats.recent.map((gen: Record<string, unknown>, i: number) => (
              <div key={String(gen.id || i)} className="px-4 py-3 flex items-center gap-3">
                <div className="h-6 w-6 rounded bg-red-950/40 flex items-center justify-center shrink-0">
                  <Zap className="h-3 w-3 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 truncate">
                    {String(gen.youtubeUrl || '')}
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    uid: {String(gen.uid || '').slice(0, 8)}…
                  </p>
                </div>
                <span className="text-[11px] text-zinc-700 shrink-0">
                  {gen.createdAt ? new Date(Number(gen.createdAt)).toLocaleDateString() : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
