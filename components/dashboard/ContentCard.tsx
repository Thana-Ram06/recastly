'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, copyToClipboard } from '@/utils/helpers';
import type { LucideIcon } from 'lucide-react';

interface ContentCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  contents: string[];
  isLoading?: boolean;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function ContentCard({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  contents,
  isLoading,
  onRegenerate,
  isRegenerating,
}: ContentCardProps) {
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentContent = contents[activeIndex] || '';

  const handleCopy = async () => {
    await copyToClipboard(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 animate-pulse">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-3 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-3 w-4/6 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-3 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shadow-card"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className={`h-7 w-7 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        </div>
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex-1">{title}</span>

        {/* Pagination for multi-content cards */}
        {contents.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="h-6 w-6 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 min-w-[32px] text-center">
              {activeIndex + 1}/{contents.length}
            </span>
            <button
              onClick={() => setActiveIndex(Math.min(contents.length - 1, activeIndex + 1))}
              disabled={activeIndex === contents.length - 1}
              className="h-6 w-6 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-1">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              title="Regenerate"
              className={cn(
                'h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all',
                isRegenerating && 'animate-spin'
              )}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={handleCopy}
            title="Copy"
            className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <motion.p
          key={activeIndex}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap"
        >
          {currentContent}
        </motion.p>
      </div>

      {/* Copy confirmation */}
      {copied && (
        <div className="px-5 pb-4">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Check className="h-3 w-3" />
            Copied to clipboard!
          </p>
        </div>
      )}
    </motion.div>
  );
}
