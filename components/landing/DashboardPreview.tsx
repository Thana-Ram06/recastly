'use client';

import { motion } from 'framer-motion';
import { Mail, Copy, CheckCircle2 } from 'lucide-react';
import { LinkedinIcon, XIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/BrandIcons';

const platforms = [
  {
    icon: LinkedinIcon,
    label: 'LinkedIn Post',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/15',
    content: "The best creators don't just make content — they build systems. Here's what I learned after 3 years of building in public...",
  },
  {
    icon: XIcon,
    label: 'X Thread',
    color: 'text-zinc-300',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/15',
    content: "1/ Most people think going viral is luck.\n\nIt's not. Here's the exact framework that took my account from 0 to 50K in 8 months:",
  },
  {
    icon: Mail,
    label: 'Newsletter',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/15',
    content: 'Subject: The content strategy that changed everything\n\nHey reader,\n\nLast Tuesday, I almost quit. Three years of daily posting...',
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/15',
    content: "Stop waiting for the 'right moment' to start ✨\n\nThe perfect moment doesn't exist. Here's what does...",
  },
];

export function DashboardPreview() {
  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Browser frame */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 48px 100px rgba(0,0,0,0.65), 0 24px 48px rgba(0,0,0,0.45)',
            }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]"
              style={{ background: 'rgba(12,12,18,0.7)' }}
            >
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
              </div>
              <div className="flex-1 mx-3 h-5 rounded-lg bg-[#17171f] border border-white/[0.06] flex items-center px-3">
                <span className="text-[11px] text-zinc-600">app.recastly.com/dashboard</span>
              </div>
            </div>

            {/* URL input row */}
            <div className="px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-zinc-700/40 bg-zinc-800/30">
                <YoutubeIcon className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="text-xs text-zinc-500 font-mono flex-1 tracking-[-0.01em]">
                  youtube.com/watch?v=dQw4w9WgXcQ
                </span>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                  Valid
                </div>
              </div>
            </div>

            {/* Generated content grid */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {platforms.map(({ icon: Icon, label, color, bg, border, content }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 + 0.2, duration: 0.4 }}
                  className="rounded-xl border border-white/[0.07] bg-[#17171f] overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.05]">
                    <div className={`h-5 w-5 rounded-md ${bg} border ${border} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-2.5 w-2.5 ${color}`} />
                    </div>
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
            className="absolute -inset-8 -z-10 rounded-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,92,252,0.08), transparent 70%)' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
