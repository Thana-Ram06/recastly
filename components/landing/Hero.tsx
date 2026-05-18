'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LinkedinIcon, XIcon, InstagramIcon } from '@/components/ui/BrandIcons';
import { Mail } from 'lucide-react';

const platforms = [
  { icon: LinkedinIcon, label: 'LinkedIn',   color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/15' },
  { icon: XIcon,        label: 'X',          color: 'text-zinc-300',   bg: 'bg-zinc-500/10',   border: 'border-zinc-500/15' },
  { icon: Mail,         label: 'Newsletter', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/15' },
  { icon: InstagramIcon,label: 'Instagram',  color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/15' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
      {/* Background glow blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-[70vh] bg-hero-glow"
      />
      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-dot-grid opacity-100"
      />
      {/* Subtle radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, transparent 60%, rgba(12,12,18,0.8) 100%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center">

        {/* Launch badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex justify-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20 tracking-wide">
            <Sparkles className="h-3 w-3 text-brand-400" />
            AI-powered content repurposing
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.07 }}
          className="font-serif text-5xl sm:text-6xl md:text-[80px] leading-[1.03] tracking-[-0.025em] text-zinc-100 mb-7"
        >
          Turn any YouTube video
          <br />
          <span className="text-gradient">into content that converts.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="text-lg sm:text-xl text-zinc-500 leading-relaxed max-w-lg mx-auto mb-12 tracking-[-0.01em]"
        >
          Paste a URL. Get LinkedIn posts, X threads, newsletters, and Instagram captions — all in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <Link href="/login">
            <Button size="lg" className="group w-full sm:w-auto min-w-[160px]">
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto text-zinc-500 hover:text-zinc-200">
              See how it works
            </Button>
          </Link>
        </motion.div>

        {/* Platform badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="flex items-center justify-center gap-2 flex-wrap"
        >
          {platforms.map(({ icon: Icon, label, color, bg, border }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl ${bg} border ${border} text-xs text-zinc-400 font-medium`}
            >
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              {label}
            </span>
          ))}
          <span className="text-xs text-zinc-600 ml-1 font-medium">→ all at once</span>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-xs text-zinc-700 tracking-wide"
        >
          No credit card required &nbsp;&middot;&nbsp; Free plan available &nbsp;&middot;&nbsp; Powered by Claude AI
        </motion.p>
      </div>
    </section>
  );
}
