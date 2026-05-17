'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const { user, loading, signInWithGoogle, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-4">
      {/* Glow */}
      <div aria-hidden className="fixed inset-0 bg-hero-glow dark:bg-hero-glow-dark pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-soft-lg p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-2xl bg-brand-500 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>

          <h1 className="font-serif text-2xl text-zinc-900 dark:text-zinc-100 mb-2">
            Welcome to Recastly
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
            Sign in to start turning YouTube videos into platform-ready content.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Button
            onClick={handleLogin}
            variant="outline"
            size="lg"
            className="w-full gap-3"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-500">
            By signing in, you agree to our{' '}
            <a href="/terms" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">Terms</a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">Privacy Policy</a>.
          </p>
        </div>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-5">
          New? No credit card required — start free.
        </p>
      </motion.div>
    </div>
  );
}
