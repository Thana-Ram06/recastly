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
    description: 'We extract the transcript and run it through Claude AI — generating all four content sets in parallel.',
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
    <section id="how-it-works" className="py-28 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse-slow" />
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.12em]">How it works</p>
          </div>
          <h2 className="font-serif text-4xl sm:text-[52px] text-zinc-100 leading-[1.06] tracking-[-0.02em]">
            Three steps. Thirty seconds.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map(({ n, icon: Icon, title, description }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative rounded-2xl border border-white/[0.07] bg-[#111118] p-7 hover:bg-[#141420] hover:border-white/[0.11] transition-all duration-300"
            >
              {/* Step number */}
              <div className="font-mono text-[10px] text-zinc-700 mb-6 tracking-[0.15em] font-medium">{n}</div>

              {/* Icon */}
              <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-700/50 flex items-center justify-center mb-5">
                <Icon className="h-[18px] w-[18px] text-zinc-400" />
              </div>

              <h3 className="text-sm font-semibold text-zinc-100 mb-2.5 tracking-[-0.01em]">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>

              {/* Connector dot — right side on desktop */}
              {i < 2 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 items-center gap-0.5 z-10">
                  <div className="h-1 w-1 rounded-full bg-zinc-700" />
                  <div className="h-1 w-1 rounded-full bg-zinc-800" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
