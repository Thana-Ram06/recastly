'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-brand-200/60 dark:border-brand-800/40 bg-gradient-to-br from-brand-50 to-violet-50 dark:from-brand-950/60 dark:to-violet-950/40 p-12 sm:p-16 text-center overflow-hidden"
        >
          {/* Glow */}
          <div
            aria-hidden
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-400/20 dark:bg-brand-400/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-violet-400/20 dark:bg-violet-400/10 blur-3xl"
          />

          <div className="relative z-10">
            <h2 className="font-serif text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 mb-4 leading-tight">
              Start turning videos into content today
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
              Join thousands of creators who ship content faster with Recastly. Free plan available — no credit card needed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto group">
                  Get started for free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/#pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-brand-200 dark:border-brand-800">
                  View pricing
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              1 generation free &middot; No credit card &middot; Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
