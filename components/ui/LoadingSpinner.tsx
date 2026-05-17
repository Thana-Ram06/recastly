import { cn } from '@/utils/helpers';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

  return (
    <svg
      className={cn('animate-spin text-brand-500', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800/60" />
        <div className="h-3 w-4/5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
        <div className="h-3 w-3/5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
      </div>
    </div>
  );
}
