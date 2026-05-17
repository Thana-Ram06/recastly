'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { cn, copyToClipboard } from '@/utils/helpers';
import type { LucideIcon } from 'lucide-react';
import type { SVGProps } from 'react';

type IconComponent = LucideIcon | ((props: SVGProps<SVGSVGElement>) => React.ReactElement);

interface ContentCardProps {
  title: string;
  icon: IconComponent;
  iconColor: string;
  contents: string[];
  isLoading?: boolean;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

function SkeletonLine({ w }: { w: string }) {
  return (
    <div className={`h-3 ${w} rounded-md bg-white/5 shimmer`} />
  );
}

export function ContentCard({
  title,
  icon: Icon,
  iconColor,
  contents,
  isLoading,
  onRegenerate,
  isRegenerating,
}: ContentCardProps) {
  const [copied, setCopied]       = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const current = contents[activeIndex] || '';
  const charCount = current.length;

  const handleCopy = async () => {
    await copyToClipboard(current);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/6 bg-zinc-900/60 p-5 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 rounded bg-white/6" />
          <div className="h-3 w-24 rounded bg-white/6" />
        </div>
        <SkeletonLine w="w-full" />
        <SkeletonLine w="w-5/6" />
        <SkeletonLine w="w-4/5" />
        <SkeletonLine w="w-full" />
        <SkeletonLine w="w-3/4" />
        <SkeletonLine w="w-5/6" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-white/6 bg-zinc-900/60 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <Icon className={`h-3.5 w-3.5 shrink-0 ${iconColor}`} />
        <span className="text-xs font-semibold text-zinc-300 flex-1">{title}</span>

        {contents.length > 1 && (
          <div className="flex items-center gap-1 mr-1">
            <button
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="h-5 w-5 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-30 hover:bg-white/6 transition-all"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <span className="text-[10px] text-zinc-600 tabular-nums w-6 text-center">
              {activeIndex + 1}/{contents.length}
            </span>
            <button
              onClick={() => setActiveIndex(Math.min(contents.length - 1, activeIndex + 1))}
              disabled={activeIndex === contents.length - 1}
              className="h-5 w-5 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-30 hover:bg-white/6 transition-all"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-0.5">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              title="Regenerate"
              className={cn(
                'h-6 w-6 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-white/6 transition-all',
                isRegenerating && 'animate-spin'
              )}
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={handleCopy}
            title="Copy"
            className="h-6 w-6 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-white/6 transition-all"
          >
            {copied
              ? <Check className="h-3 w-3 text-emerald-400" />
              : <Copy className="h-3 w-3" />
            }
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 min-h-0">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIndex}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap"
          >
            {current}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-white/4 flex items-center justify-between">
        <span className="text-[10px] text-zinc-700 tabular-nums">
          {charCount.toLocaleString()} chars
        </span>
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-emerald-400 flex items-center gap-1"
            >
              <Check className="h-2.5 w-2.5" />
              Copied!
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
