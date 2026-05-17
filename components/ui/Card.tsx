import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

function Card({ className, hover, glass, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80',
        hover && 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        glass && 'backdrop-blur-xl bg-white/80 dark:bg-zinc-900/60',
        'shadow-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-3 p-5 pb-0', className)} {...props}>
      {children}
    </div>
  );
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-5 py-4 border-t border-zinc-100 dark:border-zinc-800/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardContent, CardFooter };
