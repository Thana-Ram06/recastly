import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    brand: 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    outline: 'border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
