import { cn } from '@/utils/helpers';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-10 w-10' };
  return (
    <div
      className={cn(
        'rounded-full border-2 border-brand-500 border-t-transparent animate-spin',
        sizes[size],
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/6 bg-zinc-900/60 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-7 w-7 rounded-lg bg-white/5 shimmer" />
        <div className="h-3 w-28 rounded bg-white/5 shimmer" />
      </div>
      <div className="space-y-2.5">
        <div className="h-2.5 w-full rounded bg-white/5 shimmer" />
        <div className="h-2.5 w-4/5 rounded bg-white/5 shimmer" />
        <div className="h-2.5 w-3/5 rounded bg-white/5 shimmer" />
      </div>
    </div>
  );
}
