'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-40 select-none shrink-0';

    const variants = {
      primary:
        'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-button-primary hover:shadow-button-primary-hover hover:from-brand-400 hover:to-brand-500 active:from-brand-600 active:to-brand-700',
      secondary:
        'bg-[#17171f] text-zinc-200 border border-white/[0.08] hover:bg-[#1e1e2c] hover:border-white/[0.12] active:bg-[#111118] dark:bg-[#17171f] dark:text-zinc-200',
      ghost:
        'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-white/[0.07] active:bg-white/[0.03]',
      danger:
        'bg-red-500/90 text-white hover:bg-red-500 active:bg-red-600 shadow-[0_1px_0_rgba(255,255,255,0.1)_inset]',
      outline:
        'border border-white/[0.1] dark:border-white/[0.09] text-zinc-700 dark:text-zinc-300 hover:bg-white/[0.04] dark:hover:bg-white/[0.06] hover:border-white/[0.16] dark:hover:border-white/[0.14]',
    };

    const sizes = {
      sm:   'h-8 px-3.5 text-xs gap-1.5',
      md:   'h-9 px-4 text-sm gap-2',
      lg:   'h-11 px-6 text-sm gap-2',
      icon: 'h-9 w-9 text-sm',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
