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

async function verifyAdmin() {
  const headersList = await headers();
  const authHeader = headersList.get('authorization') || '';
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim());

  try {
    const token = authHeader.replace('Bearer ', '');
    if (!token) return false;
    const decoded = await adminAuth.verifyIdToken(token);
    return adminEmails.includes(decoded.email || '');
  } catch {
    return false;
  }
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { label: 'Total Generations', value: stats.totalGenerations, icon: Zap, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-950/40' },
    { label: 'Active Subscriptions', value: stats.activeSubscriptions, icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Paying Users %', value: stats.totalUsers > 0 ? `${Math.round((stats.activeSubscriptions / stats.totalUsers) * 100)}%` : '0%', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/40' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-9 w-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-card">
              <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent generations */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Recent Generations</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {stats.recent.length === 0 && (
              <p className="px-5 py-6 text-sm text-zinc-400">No generations yet.</p>
            )}
            {stats.recent.map((gen: Record<string, unknown>, i: number) => (
              <div key={String(gen.id || i)} className="px-5 py-3 flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3.5 w-3.5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {String(gen.youtubeUrl || '')}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    uid: {String(gen.uid || '').slice(0, 8)}…
                  </p>
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
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
