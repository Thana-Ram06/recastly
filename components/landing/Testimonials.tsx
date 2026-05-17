'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder & Content Creator',
    avatar: 'SC',
    avatarBg: 'bg-blue-500',
    content:
      'Recastly is insane. I made a 20-minute YouTube video and had fully polished LinkedIn posts and a newsletter ready in literally 45 seconds. My LinkedIn engagement went up 3x.',
    stars: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'SaaS Founder, 82K followers on X',
    avatar: 'MW',
    avatarBg: 'bg-violet-500',
    content:
      "I was spending 4+ hours repurposing content manually. Now I paste a URL and it's done. The Twitter threads it generates actually sound like me — not some robot.",
    stars: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Newsletter creator, 15K subscribers',
    avatar: 'PN',
    avatarBg: 'bg-pink-500',
    content:
      "The newsletter output is genuinely impressive. It captures the right tone and always has a killer subject line. I still edit it, but it saves me 2 hours every single week.",
    stars: 5,
  },
  {
    name: 'Jake Torres',
    role: 'Marketing Agency Owner',
    avatar: 'JT',
    avatarBg: 'bg-emerald-500',
    content:
      "We use Recastly for all our clients. 1 video → 11 pieces of content. The ROI is unreal. We went from 1 creator able to do this to our whole team doing it.",
    stars: 5,
  },
  {
    name: 'Ava Mills',
    role: 'Instagram Creator, 200K followers',
    avatar: 'AM',
    avatarBg: 'bg-amber-500',
    content:
      'The Instagram captions are legitimately better than what I write myself sometimes. 5 different styles automatically — educational, hot take, story. Chef\'s kiss.',
    stars: 5,
  },
  {
    name: 'David Osei',
    role: 'B2B Content Strategist',
    avatar: 'DO',
    avatarBg: 'bg-sky-500',
    content:
      "This is the first AI tool I've used where the output doesn't sound obviously AI-generated. My LinkedIn comments went from 3 per post to 40+. The difference is wild.",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-zinc-50/80 dark:bg-zinc-900/40 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3">
            What people say
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 mb-4">
            Loved by creators worldwide
          </h2>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map(({ name, role, avatar, avatarBg, content, stars }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="break-inside-avoid rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-card"
            >
              <Stars count={stars} />
              <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                &ldquo;{content}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full ${avatarBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
