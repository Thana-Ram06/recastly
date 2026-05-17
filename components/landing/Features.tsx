'use client';

import { motion } from 'framer-motion';
import { Mail, Zap, Clock, Shield, Sparkles } from 'lucide-react';
import { LinkedinIcon, XIcon, InstagramIcon } from '@/components/ui/BrandIcons';

const platforms = [
  {
    icon: LinkedinIcon,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/15',
    title: 'LinkedIn Posts',
    description: '3 distinct posts per video — story-driven, insight-driven, and contrarian angles. Strong hooks, algorithm-optimized.',
    tags: ['3 variations', 'Hook writing', 'Engagement focused'],
  },
  {
    icon: XIcon,
    color: 'text-zinc-300',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/15',
    title: 'X / Twitter Threads',
    description: '2 complete threads — one educational, one narrative. Each tweet crafted for retention and maximum reach.',
    tags: ['2 threads', '280 char', 'Thread format'],
  },
  {
    icon: Mail,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/15',
    title: 'Newsletter Edition',
    description: 'Full newsletter with subject line, story arc, key takeaways, and a P.S. line. Reads like a letter from a friend.',
    tags: ['Subject line', 'Full edition', 'Conversational'],
  },
  {
    icon: InstagramIcon,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/15',
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
    <section id="features" className="py-24 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-3">Platform outputs</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-zinc-100 leading-[1.08] tracking-tight mb-4">
            Built for every platform
          </h2>
          <p className="text-zinc-400 max-w-md leading-relaxed">
            One URL. Four complete content sets. Generated simultaneously.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
          {platforms.map(({ icon: Icon, color, bg, border, title, description, tags }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className={`group rounded-xl border ${border} bg-zinc-900/60 p-5 hover:bg-zinc-900 transition-all duration-200 hover:shadow-card-hover cursor-default`}
            >
              <div className={`h-9 w-9 rounded-lg ${bg} border ${border} flex items-center justify-center mb-4`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">{description}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/5 text-zinc-500 border border-white/6">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
          {extras.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="bg-zinc-950 p-5"
            >
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                <Icon className="h-4 w-4 text-zinc-400" />
              </div>
              <h4 className="text-sm font-medium text-zinc-200 mb-1">{title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
