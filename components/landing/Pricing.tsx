'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Try it out. No credit card.',
    features: ['1 generation / month', 'All 4 platforms', 'Copy to clipboard'],
    cta: 'Get started free',
    href: '/login',
    featured: false,
  },
  {
    name: 'Starter',
    price: 9,
    description: 'For consistent creators.',
    features: ['10 generations / month', 'All 4 platforms', 'Generation history', 'Priority support'],
    cta: 'Start with Starter',
    href: '/login',
    featured: true,
    badge: 'Most popular',
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For power creators and teams.',
    features: ['Unlimited generations', 'All 4 platforms', 'Full history', 'Priority support', 'Early access'],
    cta: 'Go Pro',
    href: '/login',
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse-slow" />
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.12em]">Pricing</p>
          </div>
          <h2 className="font-serif text-4xl sm:text-[52px] text-zinc-100 leading-[1.06] tracking-[-0.02em] mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-zinc-500 leading-relaxed text-[15px]">Start free. Upgrade when you're ready. Cancel anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {plans.map(({ name, price, description, features, cta, href, featured, badge }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className={cn(
                'relative rounded-2xl p-6 flex flex-col transition-all duration-300',
                featured
                  ? 'featured-border bg-[#111118]'
                  : 'border border-zinc-800/80 bg-[#111118] hover:border-zinc-700/80 hover:bg-[#141420]'
              )}
            >
              {badge && (
                <div className="absolute -top-3.5 left-5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-zinc-800 border border-zinc-700 text-zinc-200">
                    {badge}
                  </span>
                </div>
              )}

              <div className="mb-7">
                <h3 className="text-sm font-semibold text-zinc-200 mb-1 tracking-[-0.01em]">{name}</h3>
                <p className="text-xs text-zinc-600">{description}</p>
              </div>

              <div className="mb-7">
                <div className="flex items-end gap-1">
                  <span className="text-[42px] font-bold tracking-[-0.03em] text-zinc-100 leading-none">${price}</span>
                  <span className="text-sm text-zinc-600 mb-1 ml-0.5">/mo</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center shrink-0">
                      <Check className={cn('h-2.5 w-2.5 shrink-0', featured ? 'text-zinc-300' : 'text-zinc-500')} />
                    </div>
                    <span className="text-sm text-zinc-400">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={href}>
                <Button
                  className="w-full"
                  variant={featured ? 'primary' : 'outline'}
                >
                  {cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-zinc-700 mt-8 tracking-wide"
        >
          All plans include Gemini AI &nbsp;·&nbsp; Secure payment via Stripe &nbsp;·&nbsp; No lock-in
        </motion.p>
      </div>
    </section>
  );
}
