'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder & Content Creator',
    avatar: 'SC',
    avatarColor: 'bg-blue-500',
    content:
      'Recastly is insane. I made a 20-minute YouTube video and had fully polished LinkedIn posts and a newsletter ready in literally 45 seconds. My LinkedIn engagement went up 3x.',
    stars: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'SaaS Founder, 82K followers on X',
    avatar: 'MW',
    avatarColor: 'bg-violet-500',
    content:
      "I was spending 4+ hours repurposing content manually. Now I paste a URL and it's done. The Twitter threads it generates actually sound like me — not some robot.",
    stars: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Newsletter creator, 15K subscribers',
    avatar: 'PN',
    avatarColor: 'bg-pink-500',
    content:
      "The newsletter output is genuinely impressive. It captures the right tone and always has a killer subject line. I still edit it, but it saves me 2 hours every single week.",
    stars: 5,
  },
  {
    name: 'Jake Torres',
    role: 'Marketing Agency Owner',
    avatar: 'JT',
    avatarColor: 'bg-emerald-500',
    content:
      "We use Recastly for all our clients. 1 video → 11 pieces of content. The ROI is unreal. We went from 1 creator able to do this to our whole team doing it.",
    stars: 5,
  },
  {
    name: 'Ava Mills',
    role: 'Instagram Creator, 200K followers',
    avatar: 'AM',
    avatarColor: 'bg-amber-500',
    content:
      "The Instagram captions are legitimately better than what I write myself sometimes. 5 different styles automatically — educational, hot take, story. Chef's kiss.",
    stars: 5,
  },
  {
    name: 'David Osei',
    role: 'B2B Content Strategist',
    avatar: 'DO',
    avatarColor: 'bg-sky-500',
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
    <section className="py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-4">
            What people say
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-zinc-100 tracking-tight">
            Loved by creators
          </h2>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map(({ name, role, avatar, avatarColor, content, stars }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              className="break-inside-avoid rounded-xl border border-white/6 bg-zinc-900/60 p-5"
            >
              <Stars count={stars} />
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                &ldquo;{content}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <div className={`h-8 w-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-200">{name}</p>
                  <p className="text-[11px] text-zinc-500">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
