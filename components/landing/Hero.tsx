'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-hero-glow dark:bg-hero-glow-dark"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/5 dark:bg-brand-500/10 blur-3xl"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Pill badge */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.0 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-200 dark:border-brand-800/60 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered content repurposing
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-zinc-900 dark:text-zinc-50 leading-[1.05] tracking-tight mb-6"
        >
          One video.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-violet-500 to-brand-600">
            Every platform.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Paste a YouTube URL and get LinkedIn posts, Twitter threads, newsletters, and Instagram captions — all generated in seconds by Claude AI.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.36 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto group">
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              See how it works
            </Button>
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.48 }}
          className="mt-8 text-sm text-zinc-400 dark:text-zinc-500"
        >
          No credit card required &middot; Free plan available &middot; Setup in 30 seconds
        </motion.p>
      </div>
    </section>
  );
}
