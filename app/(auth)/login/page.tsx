'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch {
      // error stored in context
    }
  };

  const spinner = (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0c0c12' }}>
      <div className="h-5 w-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );

  if (loading || user) return spinner;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: '#0c0c12' }}>
      {/* Glow */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-0 right-0 h-[50vh] bg-hero-glow opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(to bottom, #7c5cfc, #6b4ae8)',
              boxShadow: '0 0 0 1px rgba(124,92,252,0.4), 0 8px 32px rgba(124,92,252,0.25)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 10H11" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.5)',
          }}
        >
          <h1 className="font-serif text-2xl text-zinc-100 mb-2 tracking-[-0.02em]">
            Welcome to Recastly
          </h1>
          <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
            Turn YouTube videos into platform-ready content in seconds.
          </p>

          {error && (
            <div
              className="mb-6 px-3.5 py-3 rounded-xl text-xs text-red-400 text-left leading-relaxed"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
            >
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

          <p className="mt-6 text-[11px] text-zinc-700 leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-zinc-500 hover:text-zinc-300 underline transition-colors">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="text-zinc-500 hover:text-zinc-300 underline transition-colors">Privacy Policy</a>.
          </p>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-5 tracking-wide">
          No credit card required &nbsp;·&nbsp; Free plan available
        </p>
      </motion.div>
    </div>
  );
}
