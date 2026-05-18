'use client';

import { motion } from 'framer-motion';
import { Mail, Zap, Clock, Shield, Sparkles } from 'lucide-react';
import { LinkedinIcon, XIcon, InstagramIcon } from '@/components/ui/BrandIcons';

const platforms = [
  {
    icon: LinkedinIcon,
    title: 'LinkedIn Posts',
    description: '3 distinct posts per video — story-driven, insight-driven, and contrarian angles. Strong hooks, algorithm-optimized.',
    tags: ['3 variations', 'Hook writing', 'Engagement focused'],
  },
  {
    icon: XIcon,
    title: 'X / Twitter Threads',
    description: '2 complete threads — one educational, one narrative. Each tweet crafted for retention and maximum reach.',
    tags: ['2 threads', '280 char', 'Thread format'],
  },
  {
    icon: Mail,
    title: 'Newsletter Edition',
    description: 'Full newsletter with subject line, story arc, key takeaways, and a P.S. line. Reads like a letter from a friend.',
    tags: ['Subject line', 'Full edition', 'Conversational'],
  },
  {
    icon: InstagramIcon,
    title: 'Instagram Captions',
    description: '5 captions across different styles — educational, motivational, hot take, BTS, and community engagement.',
    tags: ['5 styles', 'Hashtags', 'CTA included'],
  },
];

const extras = [
  { icon: Zap,      title: 'Instant generation',  description: 'All 4 platforms generated in parallel — under 30 seconds.' },
  { icon: Clock,    title: 'Full history',         description: 'Every generation saved. Access and copy anytime.' },
  { icon: Shield,   title: 'Privacy first',        description: 'Transcripts are never stored. Process and delete, every time.' },
  { icon: Sparkles, title: 'Human-sounding',       description: 'Prompts trained to avoid generic AI filler.' },
];

export function Features() {
  return (
    <section id="features" className="py-28 px-5 sm:px-6">
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
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.12em]">Platform outputs</p>
          </div>
          <h2 className="font-serif text-4xl sm:text-[52px] text-zinc-100 leading-[1.06] tracking-[-0.02em] mb-4">
            Built for every platform
          </h2>
          <p className="text-zinc-500 max-w-md leading-relaxed text-[15px]">
            One URL. Four complete content sets. Generated simultaneously.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {platforms.map(({ icon: Icon, title, description, tags }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="group rounded-2xl border border-zinc-800/80 bg-[#111118] p-6 hover:bg-[#141420] hover:border-zinc-700/80 transition-all duration-300 hover:shadow-card-hover cursor-default"
            >
              <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-700/50 flex items-center justify-center mb-5">
                <Icon className="text-zinc-400" style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2.5 tracking-[-0.01em]">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">{description}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-zinc-900/80 text-zinc-600 border border-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extras grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800/40 rounded-2xl overflow-hidden border border-zinc-800/60">
          {extras.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="bg-[#0c0c12] p-6 hover:bg-[#111118] transition-colors duration-200"
            >
              <div className="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-700/50 flex items-center justify-center mb-4">
                <Icon className="h-4 w-4 text-zinc-400" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-200 mb-1.5 tracking-[-0.01em]">{title}</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
