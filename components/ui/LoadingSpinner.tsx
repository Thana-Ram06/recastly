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
        'rounded-full border-2 border-zinc-600 border-t-zinc-200 animate-spin',
        sizes[size],
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0c0c12' }}>
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl p-5" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-7 w-7 rounded-xl shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-3 w-28 rounded-lg shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
      <div className="space-y-2.5">
        <div className="h-2.5 w-full rounded-lg shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-2.5 w-4/5 rounded-lg shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-2.5 w-3/5 rounded-lg shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
    </div>
  );
}
