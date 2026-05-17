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
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-40 select-none shrink-0';

    const variants = {
      primary:
        'bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700 shadow-button',
      secondary:
        'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-600',
      ghost:
        'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-white/6',
      danger:
        'bg-red-500 text-white hover:bg-red-400 active:bg-red-600',
      outline:
        'border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 hover:border-zinc-300 dark:hover:border-zinc-600',
    };

    const sizes = {
      sm:   'h-8 px-3 text-xs gap-1.5',
      md:   'h-9 px-4 text-sm gap-2',
      lg:   'h-11 px-5 text-sm gap-2',
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
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
