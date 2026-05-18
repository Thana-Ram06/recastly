'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="py-28 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #111118 0%, #0f0f1a 50%, #0c0c12 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Dot grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60"
          />

          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex justify-center mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-medium bg-zinc-800/70 text-zinc-400 border border-zinc-700/60 tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse-slow" />
                Start generating today
              </span>
            </motion.div>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-[56px] text-zinc-100 leading-[1.05] tracking-[-0.025em] mb-5">
              Start repurposing today.
            </h2>
            <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-[15px] leading-relaxed">
              One video. Every platform. Under 30 seconds. No credit card needed.
            </p>
            <Link href="/login">
              <Button size="lg" className="group">
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
