'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Try it out. No credit card required.',
    features: [
      '1 generation per month',
      'All 4 platforms',
      'LinkedIn, X, Newsletter, Instagram',
      'Copy to clipboard',
    ],
    cta: 'Get started free',
    href: '/login',
    featured: false,
  },
  {
    name: 'Starter',
    price: 9,
    description: 'For consistent creators building their audience.',
    features: [
      '10 generations per month',
      'All 4 platforms',
      'Generation history',
      'Priority support',
      'Regenerate any output',
    ],
    cta: 'Start with Starter',
    href: '/login',
    featured: true,
    badge: 'Most popular',
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For power creators and agencies.',
    features: [
      'Unlimited generations',
      'All 4 platforms',
      'Full generation history',
      'Priority support',
      'Early access to new features',
      'Team-ready',
    ],
    cta: 'Go Pro',
    href: '/login',
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Start free. Upgrade when you're ready. No lock-in.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map(({ name, price, description, features, cta, href, featured, badge }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                'relative rounded-2xl p-6 flex flex-col',
                featured
                  ? 'border-2 border-brand-500 bg-white dark:bg-zinc-900 shadow-brand'
                  : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-card'
              )}
            >
              {badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-semibold">
                    <Zap className="h-3 w-3" />
                    {badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{name}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">${price}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={cn('h-4 w-4 mt-0.5 flex-shrink-0', featured ? 'text-brand-500' : 'text-emerald-500')} />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{f}</span>
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
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-zinc-400 dark:text-zinc-500 mt-8"
        >
          All plans include access to Claude AI &middot; Cancel anytime &middot; Secure payment via Stripe
        </motion.p>
      </div>
    </section>
  );
}
