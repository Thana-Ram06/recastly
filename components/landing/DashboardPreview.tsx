'use client';

import { motion } from 'framer-motion';
import { Mail, Copy, RefreshCw, CheckCircle } from 'lucide-react';
import { LinkedinIcon, XIcon, InstagramIcon } from '@/components/ui/BrandIcons';

const platforms = [
  { icon: LinkedinIcon, label: 'LinkedIn Post', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  { icon: XIcon, label: 'X Thread', color: 'text-zinc-800 dark:text-zinc-200', bg: 'bg-zinc-100 dark:bg-zinc-800/60' },
  { icon: Mail, label: 'Newsletter', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
  { icon: InstagramIcon, label: 'Instagram', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/40' },
];

const previewContent = [
  'The best creators don\'t just make content — they build systems. Here\'s what I learned after 3 years of building in public...',
  '1/ Most people think going viral is luck.\n\nIt\'s not. Here\'s the exact framework that took my account from 0 to 50K in 8 months:',
  'Subject: The content strategy that changed everything\n\nHey reader,\n\nLast Tuesday, I almost quit. Three years of daily posting...',
  'Stop waiting for the "right moment" to start ✨\n\nThe perfect moment doesn\'t exist. Here\'s what does...',
];

export function DashboardPreview() {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative"
        >
          {/* Fake browser chrome */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-soft-lg overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4 h-6 rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center px-3">
                <span className="text-xs text-zinc-400">app.recastly.com/dashboard</span>
              </div>
            </div>

            {/* URL input area */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-brand-500/30 bg-brand-50/50 dark:bg-brand-950/30">
                <div className="h-5 w-5 text-brand-500">▶</div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                  youtube.com/watch?v=dQw4w9WgXcQ
                </span>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle className="h-3.5 w-3.5" /> Valid URL
                </div>
              </div>
            </div>

            {/* Generated cards grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {platforms.map(({ icon: Icon, label, color, bg }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`h-7 w-7 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon className={`h-3.5 w-3.5 ${color}`} />
                    </div>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
                    <div className="ml-auto flex gap-1.5">
                      <button className="h-6 w-6 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                        <Copy className="h-3 w-3" />
                      </button>
                      <button className="h-6 w-6 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                        <RefreshCw className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {previewContent[i]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Glow behind preview */}
          <div
            aria-hidden
            className="absolute -inset-4 -z-10 bg-brand-500/5 blur-3xl rounded-3xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
