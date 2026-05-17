'use client';

import { motion } from 'framer-motion';
import { Link2, Cpu, Download } from 'lucide-react';

const steps = [
  {
    icon: Link2,
    step: '01',
    title: 'Paste your YouTube URL',
    description: 'Copy any YouTube video link and paste it into Recastly. We extract the full transcript automatically — no downloads needed.',
    color: 'text-brand-500',
    bg: 'bg-brand-50 dark:bg-brand-950/50',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'Claude AI works its magic',
    description: 'Our optimized prompts send the transcript to Claude AI, which generates platform-perfect content across LinkedIn, X, newsletters, and Instagram in parallel.',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/50',
  },
  {
    icon: Download,
    step: '03',
    title: 'Copy, post, and grow',
    description: 'Review your AI-generated content, copy with one click, and post directly to your platforms. Regenerate any piece instantly if you want a different angle.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-zinc-50/80 dark:bg-zinc-900/40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3">
            How it works
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 mb-4">
            From video to viral in 3 steps
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            The fastest way to repurpose your video content for every platform.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div
            aria-hidden
            className="hidden md:block absolute top-12 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ icon: Icon, step, title, description, color, bg }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className={`h-16 w-16 rounded-2xl ${bg} flex items-center justify-center shadow-soft`}>
                    <Icon className={`h-7 w-7 ${color}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-zinc-100 dark:text-zinc-900">{i + 1}</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-zinc-300 dark:text-zinc-600 mb-2 tracking-widest">
                  STEP {step}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">{title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
