'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Crown, CreditCard, Trash2, User, AlertTriangle } from 'lucide-react';
import { TopNav } from '@/components/dashboard/TopNav';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/utils/helpers';
import { deleteUser, getAuth } from 'firebase/auth';
import { getFirebaseApp } from '@/firebase/config';

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
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
    } catch (err) {
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Settings" />

      <main className="flex-1 p-4 sm:p-6 max-w-2xl w-full mx-auto space-y-5">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>

        {/* Profile */}
        <Card>
          <CardHeader>
            <User className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Profile</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <div className="h-14 w-14 rounded-full bg-brand-500 flex items-center justify-center text-white text-xl font-bold">
                  {user?.displayName?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{user?.displayName || 'User'}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{user?.email}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Signed in with Google</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <Sun className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Appearance</h2>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                    theme === value
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <Crown className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Billing & Plan</h2>
            <Badge variant={plan === 'pro' ? 'brand' : plan === 'starter' ? 'success' : 'default'} className="ml-auto capitalize">
              {plan}
            </Badge>
          </CardHeader>
          <CardContent>
            {plan === 'free' && (
              <div className="space-y-3">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Upgrade for more generations and features.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpgrade('starter')}
                    disabled={isUpgrading}
                    className="rounded-xl border-2 border-zinc-200 dark:border-zinc-800 p-4 text-left hover:border-brand-400 dark:hover:border-brand-600 transition-all"
                  >
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">Starter</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 my-1">$9<span className="text-sm font-normal text-zinc-400">/mo</span></p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">10 generations/month</p>
                  </button>
                  <button
                    onClick={() => handleUpgrade('pro')}
                    disabled={isUpgrading}
                    className="rounded-xl border-2 border-brand-400 dark:border-brand-600 bg-brand-50 dark:bg-brand-950/40 p-4 text-left hover:border-brand-500 transition-all"
                  >
                    <p className="font-semibold text-brand-700 dark:text-brand-300">Pro</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 my-1">$29<span className="text-sm font-normal text-zinc-400">/mo</span></p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Unlimited generations</p>
                  </button>
                </div>
              </div>
            )}
            {plan !== 'free' && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Manage your subscription, payment method, and invoices.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageBilling}
                  loading={isManagingBilling}
                >
                  <CreditCard className="h-4 w-4" />
                  Manage billing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-200 dark:border-red-900/60">
          <CardHeader>
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">Danger Zone</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Delete account</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Permanently delete your account and all data.</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete dialog */}
        {showDeleteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteDialog(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-soft-lg"
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Delete your account?</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                This will permanently delete your account, all your generations, and cancel any active subscription. This cannot be undone.
              </p>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Type <strong>DELETE</strong> to confirm:</p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:border-red-400 mb-4"
              />
              <div className="flex gap-3">
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
