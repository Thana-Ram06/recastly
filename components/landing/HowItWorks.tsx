'use client';

import { motion } from 'framer-motion';
import { Link2, Sparkles, Download } from 'lucide-react';

const steps = [
  {
    n: '01',
    icon: Link2,
    title: 'Paste a YouTube URL',
    description: 'Any public YouTube video with captions. From a 5-minute clip to a 3-hour podcast.',
  },
  {
    n: '02',
    icon: Sparkles,
    title: 'AI does the work',
    description: 'We extract the transcript and run it through Gemini 2.5 — generating all four content sets in parallel.',
  },
  {
    n: '03',
    icon: Download,
    title: 'Copy and publish',
    description: 'Review, pick your favorite variant, copy with one click, and publish directly to each platform.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-zinc-100 leading-[1.08] tracking-tight">
            Three steps. Thirty seconds.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
          {steps.map(({ n, icon: Icon, title, description }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="bg-zinc-950 p-7"
            >
              <div className="font-mono text-[11px] text-zinc-700 mb-5 tracking-wider">{n}</div>
              <div className="h-9 w-9 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5">
                <Icon className="h-4 w-4 text-brand-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
