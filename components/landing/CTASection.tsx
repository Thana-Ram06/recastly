'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="py-24 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-white/8 bg-gradient-to-br from-zinc-900 to-zinc-950 overflow-hidden p-12 text-center"
        >
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-48 bg-hero-glow-sm opacity-60"
          />

          <div className="relative z-10">
            <h2 className="font-serif text-4xl sm:text-5xl text-zinc-100 leading-[1.08] tracking-tight mb-4">
              Start repurposing today.
            </h2>
            <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
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
