'use client';

import { motion } from 'framer-motion';
import { Mail, Copy, CheckCircle } from 'lucide-react';
import { LinkedinIcon, XIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/BrandIcons';

const platforms = [
  {
    icon: LinkedinIcon,
    label: 'LinkedIn Post',
    color: 'text-blue-400',
    content: "The best creators don't just make content — they build systems. Here's what I learned after 3 years of building in public...",
  },
  {
    icon: XIcon,
    label: 'X Thread',
    color: 'text-zinc-300',
    content: "1/ Most people think going viral is luck.\n\nIt's not. Here's the exact framework that took my account from 0 to 50K in 8 months:",
  },
  {
    icon: Mail,
    label: 'Newsletter',
    color: 'text-violet-400',
    content: 'Subject: The content strategy that changed everything\n\nHey reader,\n\nLast Tuesday, I almost quit. Three years of daily posting...',
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    color: 'text-pink-400',
    content: "Stop waiting for the 'right moment' to start ✨\n\nThe perfect moment doesn't exist. Here's what does...",
  },
];

export function DashboardPreview() {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative"
        >
          {/* Fake browser */}
          <div className="rounded-xl border border-white/8 bg-zinc-900 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-950/60">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>
              <div className="flex-1 mx-4 h-5 rounded bg-zinc-800 flex items-center px-2.5">
                <span className="text-[11px] text-zinc-600">app.recastly.com/dashboard</span>
              </div>
            </div>

            {/* URL input */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-brand-500/30 bg-brand-500/5">
                <YoutubeIcon className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="text-xs text-zinc-500 font-mono flex-1">
                  youtube.com/watch?v=dQw4w9WgXcQ
                </span>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium shrink-0">
                  <CheckCircle className="h-3 w-3" />
                  Valid
                </div>
              </div>
            </div>

            {/* Generated content grid */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {platforms.map(({ icon: Icon, label, color, content }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.2, duration: 0.4 }}
                  className="rounded-lg border border-white/6 bg-zinc-800/40"
                >
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5">
                    <Icon className={`h-3 w-3 shrink-0 ${color}`} />
                    <span className="text-[11px] font-semibold text-zinc-400 flex-1">{label}</span>
                    <button className="h-5 w-5 flex items-center justify-center rounded text-zinc-700 hover:text-zinc-400 transition-colors">
                      <Copy className="h-2.5 w-2.5" />
                    </button>
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                      {content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ambient glow */}
          <div
            aria-hidden
            className="absolute -inset-8 -z-10 bg-brand-600/8 blur-3xl rounded-3xl pointer-events-none"
          />
        </motion.div>
      </div>
    </section>
  );
}
