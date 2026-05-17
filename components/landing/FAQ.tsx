'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'Which YouTube videos work best?',
    a: 'Any YouTube video with captions or auto-generated subtitles works. This includes interviews, tutorials, podcasts, talks, vlogs, and more. The longer and more content-rich the video, the better the output.',
  },
  {
    q: 'How long does generation take?',
    a: 'Usually under 30 seconds. We send all four platform requests to Gemini AI in parallel, so you get everything at once — not one at a time.',
  },
  {
    q: 'Does the output actually sound human?',
    a: "We've spent significant time prompt engineering specifically to avoid generic AI phrasing. The output uses platform-native formatting, strong hooks, and sounds like a real creator. You'll likely still edit it, but it's a great starting point.",
  },
  {
    q: 'What if a video has no transcript?',
    a: "Recastly requires a YouTube video with captions (auto-generated or manual). Videos without any captions can't be processed. Most YouTube videos have auto-captions enabled.",
  },
  {
    q: 'Can I regenerate specific outputs?',
    a: "Yes! Every content card has a regenerate button. You can regenerate any single piece of content without using another generation credit.",
  },
  {
    q: 'Is my data private?',
    a: "We don't permanently store video transcripts. After generation, only the generated content is saved to your history. We never train AI models on your data.",
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, absolutely. Cancel from your settings page anytime. Your plan stays active until the end of your billing period.',
  },
  {
    q: 'Do you offer refunds?',
    a: "We offer a 7-day money-back guarantee if you're not satisfied with the output quality. Contact us and we'll make it right.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-medium text-zinc-200">{q}</span>
        <div className="shrink-0 h-5 w-5 rounded-full border border-white/10 bg-white/4 flex items-center justify-center mt-0.5">
          {open ? (
            <Minus className="h-2.5 w-2.5 text-zinc-400" />
          ) : (
            <Plus className="h-2.5 w-2.5 text-zinc-400" />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-zinc-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-4">
            FAQ
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-zinc-100 tracking-tight">
            Questions answered
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="rounded-xl border border-white/6 bg-zinc-900/60 px-6"
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
