'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Crown, CreditCard, Trash2, User, AlertTriangle } from 'lucide-react';
import { TopNav } from '@/components/dashboard/TopNav';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/utils/helpers';
import { deleteUser, getAuth } from 'firebase/auth';
import { getFirebaseApp } from '@/firebase/config';

export default function SettingsPage() {
  const { user, logout, getToken } = useAuth();
  const { plan } = useSubscription();
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isManagingBilling, setIsManagingBilling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpgrade = async (planKey: 'starter' | 'pro') => {
    setIsUpgrading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
    finally { setIsUpgrading(false); }
  };

  const handleManageBilling = async () => {
    setIsManagingBilling(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
    finally { setIsManagingBilling(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setIsDeleting(true);
    try {
      const token = await getToken();
      await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const firebaseAuth = getAuth(getFirebaseApp());
      if (firebaseAuth.currentUser) await deleteUser(firebaseAuth.currentUser);
      await logout();
      router.push('/');
    } catch {
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Settings" />

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-2xl w-full mx-auto space-y-4">
        <h1 className="text-sm font-semibold text-zinc-300 mb-5">Settings</h1>

        {/* Profile */}
        <section className="rounded-xl border border-white/6 bg-zinc-900/60 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <User className="h-3.5 w-3.5 text-zinc-600" />
            <h2 className="text-xs font-semibold text-zinc-400">Profile</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-4">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-brand-600 flex items-center justify-center text-white text-lg font-bold">
                  {user?.displayName?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-zinc-100">{user?.displayName || 'User'}</p>
                <p className="text-xs text-zinc-500">{user?.email}</p>
                <p className="text-[11px] text-zinc-700 mt-0.5">Signed in with Google</p>
              </div>
            </div>
          </div>
        </section>

        {/* Billing */}
        <section className="rounded-xl border border-white/6 bg-zinc-900/60 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <h2 className="text-xs font-semibold text-zinc-400">Billing & Plan</h2>
            <span className={cn(
              'ml-auto text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
              plan === 'pro'
                ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                : plan === 'starter'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-500 border border-white/5'
            )}>
              {plan}
            </span>
          </div>
          <div className="p-4">
            {plan === 'free' ? (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500">Upgrade for more generations and premium features.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpgrade('starter')}
                    disabled={isUpgrading}
                    className="rounded-lg border border-white/8 bg-white/3 p-4 text-left hover:border-white/14 hover:bg-white/5 transition-all"
                  >
                    <p className="text-xs font-semibold text-zinc-300">Starter</p>
                    <p className="text-xl font-bold text-zinc-100 my-1.5">$9<span className="text-xs font-normal text-zinc-600">/mo</span></p>
                    <p className="text-[11px] text-zinc-600">10 generations/month</p>
                  </button>
                  <button
                    onClick={() => handleUpgrade('pro')}
                    disabled={isUpgrading}
                    className="rounded-lg border border-brand-500/40 bg-brand-600/10 p-4 text-left hover:border-brand-500/60 hover:bg-brand-600/15 transition-all"
                  >
                    <p className="text-xs font-semibold text-brand-400">Pro</p>
                    <p className="text-xl font-bold text-zinc-100 my-1.5">$29<span className="text-xs font-normal text-zinc-600">/mo</span></p>
                    <p className="text-[11px] text-zinc-600">Unlimited generations</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Manage your subscription, payment method, and invoices.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageBilling}
                  loading={isManagingBilling}
                  className="shrink-0 ml-4"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Manage
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Danger zone */}
        <section className="rounded-xl border border-red-900/40 bg-red-950/10 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-red-900/30">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            <h2 className="text-xs font-semibold text-red-400">Danger Zone</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-300">Delete account</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">Permanently delete your account and all data.</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="shrink-0 ml-4"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </section>

        {/* Delete dialog */}
        {showDeleteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteDialog(false); }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-zinc-900 rounded-xl border border-white/8 p-6"
            >
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Delete your account?</h3>
              <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
                This will permanently delete your account, all your generations, and cancel any active subscription. This cannot be undone.
              </p>
              <p className="text-xs font-medium text-zinc-400 mb-2">Type <strong className="text-zinc-200">DELETE</strong> to confirm:</p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full h-9 px-3 rounded-lg border border-white/8 bg-white/4 text-zinc-100 text-sm outline-none focus:border-red-500/60 mb-4 placeholder:text-zinc-700"
              />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  disabled={deleteConfirm !== 'DELETE'}
                  loading={isDeleting}
                  onClick={handleDeleteAccount}
                >
                  Delete account
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
