'use client';

import { motion } from 'framer-motion';
import { Mail, Zap, Clock, Shield, Sparkles } from 'lucide-react';
import { LinkedinIcon, XIcon, InstagramIcon } from '@/components/ui/BrandIcons';

const platforms = [
  {
    icon: LinkedinIcon,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    border: 'border-blue-100 dark:border-blue-900/50',
    title: 'LinkedIn Posts',
    description: '3 distinct posts per video — story-driven, insight-driven, and contrarian angles. Optimized for LinkedIn\'s algorithm with strong hooks.',
    tags: ['Hook writing', 'Engagement focused', '3 variations'],
  },
  {
    icon: XIcon,
    color: 'text-zinc-800 dark:text-zinc-200',
    bg: 'bg-zinc-100 dark:bg-zinc-800/60',
    border: 'border-zinc-200 dark:border-zinc-700/60',
    title: 'X / Twitter Threads',
    description: '2 complete threads — one educational, one narrative. Each tweet crafted for maximum retention and retweets.',
    tags: ['Thread format', '280 char', '2 threads'],
  },
  {
    icon: Mail,
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-950/50',
    border: 'border-violet-100 dark:border-violet-900/50',
    title: 'Newsletter Edition',
    description: 'A full newsletter with compelling subject line, story arc, key takeaways, and a memorable P.S. line. Reads like a letter from a friend.',
    tags: ['Subject line', 'Full edition', 'Conversational'],
  },
  {
    icon: InstagramIcon,
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-950/50',
    border: 'border-pink-100 dark:border-pink-900/50',
    title: 'Instagram Captions',
    description: '5 captions in different styles — educational, motivational, behind-the-scenes, hot take, and community engagement.',
    tags: ['5 styles', 'Hashtags', 'CTA included'],
  },
];

const extras = [
  { icon: Zap, title: 'Instant generation', description: 'All content generated in parallel — get everything in under 30 seconds.' },
  { icon: Clock, title: 'Full history', description: 'Every generation saved. Go back and copy any piece of content anytime.' },
  { icon: Shield, title: 'Privacy first', description: 'We never store your transcripts. Process and delete, every time.' },
  { icon: Sparkles, title: 'Human-sounding AI', description: 'Prompts trained to produce engaging copy — not generic AI filler.' },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3">Platform outputs</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 mb-4">Built for every platform</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            One YouTube URL generates polished content across all four major platforms simultaneously.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {platforms.map(({ icon: Icon, color, bg, border, title, description, tags }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-2xl border ${border} bg-white dark:bg-zinc-900 p-6 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{description}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {extras.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="text-center"
            >
              <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
