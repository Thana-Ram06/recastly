'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LinkedinIcon, XIcon, InstagramIcon } from '@/components/ui/BrandIcons';
import { Mail } from 'lucide-react';

const platforms = [
  { icon: LinkedinIcon, label: 'LinkedIn',   color: 'text-blue-400' },
  { icon: XIcon,        label: 'X',          color: 'text-zinc-300' },
  { icon: Mail,         label: 'Newsletter', color: 'text-violet-400' },
  { icon: InstagramIcon,label: 'Instagram',  color: 'text-pink-400' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Glow blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-[65vh] bg-hero-glow"
      />
      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-dot-grid opacity-100"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20 tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
            AI-powered content repurposing
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="font-serif text-5xl sm:text-6xl md:text-[76px] leading-[1.04] tracking-[-0.02em] text-zinc-100 mb-6"
        >
          Turn any YouTube video
          <br />
          <span className="text-gradient">into content that converts.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto mb-10"
        >
          Paste a URL. Get LinkedIn posts, X threads, newsletters, and Instagram captions — all in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <Link href="/login">
            <Button size="lg" className="group w-full sm:w-auto">
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto text-zinc-400">
              See how it works
            </Button>
          </Link>
        </motion.div>

        {/* Platform badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="flex items-center justify-center gap-1 flex-wrap"
        >
          {platforms.map(({ icon: Icon, label, color }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/4 border border-white/6 text-xs text-zinc-400"
            >
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              {label}
            </span>
          ))}
          <span className="text-xs text-zinc-600 ml-1">→ all at once</span>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-xs text-zinc-600"
        >
          No credit card required &middot; Free plan available &middot; Powered by Gemini 2.5
        </motion.p>
      </div>
    </section>
  );
}
