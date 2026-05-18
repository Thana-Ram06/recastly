'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder & Content Creator',
    avatar: 'SC',
    avatarColor: 'from-blue-500 to-blue-600',
    content:
      'Recastly is insane. I made a 20-minute YouTube video and had fully polished LinkedIn posts and a newsletter ready in literally 45 seconds. My LinkedIn engagement went up 3x.',
    stars: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'SaaS Founder, 82K followers on X',
    avatar: 'MW',
    avatarColor: 'from-zinc-700 to-zinc-800',
    content:
      "I was spending 4+ hours repurposing content manually. Now I paste a URL and it's done. The Twitter threads it generates actually sound like me — not some robot.",
    stars: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Newsletter creator, 15K subscribers',
    avatar: 'PN',
    avatarColor: 'from-pink-500 to-pink-600',
    content:
      "The newsletter output is genuinely impressive. It captures the right tone and always has a killer subject line. I still edit it, but it saves me 2 hours every single week.",
    stars: 5,
  },
  {
    name: 'Jake Torres',
    role: 'Marketing Agency Owner',
    avatar: 'JT',
    avatarColor: 'from-emerald-500 to-emerald-600',
    content:
      "We use Recastly for all our clients. 1 video → 11 pieces of content. The ROI is unreal. We went from 1 creator able to do this to our whole team doing it.",
    stars: 5,
  },
  {
    name: 'Ava Mills',
    role: 'Instagram Creator, 200K followers',
    avatar: 'AM',
    avatarColor: 'from-amber-500 to-orange-500',
    content:
      "The Instagram captions are legitimately better than what I write myself sometimes. 5 different styles automatically — educational, hot take, story. Chef's kiss.",
    stars: 5,
  },
  {
    name: 'David Osei',
    role: 'B2B Content Strategist',
    avatar: 'DO',
    avatarColor: 'from-sky-500 to-sky-600',
    content:
      "This is the first AI tool I've used where the output doesn't sound obviously AI-generated. My LinkedIn comments went from 3 per post to 40+. The difference is wild.",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse-slow" />
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.12em]">Testimonials</p>
          </div>
          <h2 className="font-serif text-4xl sm:text-[52px] text-zinc-100 tracking-[-0.02em] leading-[1.06]">
            Loved by creators
          </h2>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-3 space-y-3">
          {testimonials.map(({ name, role, avatar, avatarColor, content, stars }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              className="break-inside-avoid rounded-2xl border border-white/[0.07] bg-[#111118] p-5 hover:border-white/[0.11] hover:bg-[#141420] transition-all duration-300"
            >
              <Stars count={stars} />
              <p className="mt-3.5 text-sm text-zinc-400 leading-relaxed">
                &ldquo;{content}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-b ${avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-200 tracking-[-0.01em]">{name}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
