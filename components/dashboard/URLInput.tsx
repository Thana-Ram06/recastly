'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { YoutubeIcon } from '@/components/ui/BrandIcons';
import { Button } from '@/components/ui/Button';
import { isValidYouTubeUrl } from '@/utils/helpers';

interface URLInputProps {
  onGenerate: (url: string) => Promise<void>;
  isGenerating: boolean;
  hasReachedLimit: boolean;
}

export function URLInput({ onGenerate, isGenerating, hasReachedLimit }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) { setError('Please enter a YouTube URL.'); return; }
    if (!isValidYouTubeUrl(url.trim())) {
      setError("That doesn't look like a valid YouTube URL.");
      return;
    }
    try {
      await onGenerate(url.trim());
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate. Please try again.');
    }
  };

  const stateStyles = error
    ? 'border-red-500/35 bg-red-500/[0.05] focus-within:border-red-500/50'
    : hasReachedLimit
    ? 'border-amber-500/35 bg-amber-500/[0.05]'
    : 'border-white/[0.09] bg-[#17171f] focus-within:border-brand-500/45 focus-within:bg-[#1a1a28]';

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-250 ${stateStyles}`}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
        >
          <YoutubeIcon className="h-4 w-4 text-red-400 shrink-0" />

          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            placeholder="Paste a YouTube URL…"
            disabled={isGenerating || hasReachedLimit}
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none tracking-[-0.01em]"
            aria-label="YouTube URL"
          />

          <Button
            type="submit"
            loading={isGenerating}
            disabled={isGenerating || hasReachedLimit || !url.trim()}
            size="sm"
            className="shrink-0"
          >
            {isGenerating ? 'Generating…' : (
              <>Generate <ArrowRight className="h-3.5 w-3.5" /></>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 mt-2.5 text-xs text-red-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </motion.p>
          )}
          {hasReachedLimit && !error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 mt-2.5 text-xs text-amber-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Monthly limit reached.{' '}
              <a href="/settings" className="underline hover:text-amber-300 transition-colors">Upgrade your plan</a>
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div
              className="rounded-xl px-4 py-3.5 flex items-center gap-3"
              style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.2)' }}
            >
              <div className="flex gap-1 shrink-0">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-brand-400"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <p className="text-xs text-zinc-400 tracking-[-0.01em]">
                Extracting transcript and generating content across all 4 platforms…
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
