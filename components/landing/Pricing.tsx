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
    <section id="pricing" className="py-24 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-zinc-100 leading-[1.08] tracking-tight mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-zinc-400 leading-relaxed">Start free. Upgrade when you're ready. Cancel anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {plans.map(({ name, price, description, features, cta, href, featured, badge }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className={cn(
                'relative rounded-xl p-6 flex flex-col',
                featured
                  ? 'gradient-border bg-zinc-900'
                  : 'border border-white/6 bg-zinc-900/50'
              )}
            >
              {badge && (
                <div className="absolute -top-3 left-5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-600 text-white">
                    {badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">{name}</h3>
                <p className="text-xs text-zinc-500">{description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold tracking-tight text-zinc-100">${price}</span>
                  <span className="text-sm text-zinc-500 mb-1">/mo</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className={cn('h-3.5 w-3.5 shrink-0', featured ? 'text-brand-400' : 'text-zinc-500')} />
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
          className="text-center text-xs text-zinc-600 mt-8"
        >
          All plans include Gemini 2.5 Flash · Secure payment via Stripe · No lock-in
        </motion.p>
      </div>
    </section>
  );
}
