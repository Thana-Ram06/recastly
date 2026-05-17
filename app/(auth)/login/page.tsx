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

  // Redirect once Firebase confirms the user is authenticated.
  // This is the ONLY place we redirect — never call router.push inside handleLogin.
  useEffect(() => {
    if (!loading && user) {
      console.log('[Login] user confirmed — redirecting to /dashboard');
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      // Do NOT push here. onAuthStateChanged will fire → useEffect above redirects.
    } catch {
      // error is already stored in context and displayed below
    }
  };

  // Still checking auth state — avoid flash of login UI for returning users
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-5 w-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Already logged in — render nothing while useEffect redirect fires
  if (user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-5 w-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-0 right-0 h-[50vh] bg-hero-glow opacity-60" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 10H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-white/8 bg-zinc-900/80 backdrop-blur-sm p-7 text-center">
          <h1 className="font-serif text-2xl text-zinc-100 mb-2 tracking-tight">
            Welcome to Recastly
          </h1>
          <p className="text-sm text-zinc-500 mb-7 leading-relaxed">
            Turn YouTube videos into platform-ready content in seconds.
          </p>

          {error && (
            <div className="mb-5 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-left leading-relaxed">
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

        <p className="text-center text-xs text-zinc-700 mt-5">
          No credit card required · Free plan available
        </p>
      </motion.div>
    </div>
  );
}
