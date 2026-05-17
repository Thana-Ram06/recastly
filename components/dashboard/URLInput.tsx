'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
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

    if (!url.trim()) {
      setError('Please enter a YouTube URL.');
      return;
    }
    if (!isValidYouTubeUrl(url.trim())) {
      setError('Please enter a valid YouTube URL (e.g. youtube.com/watch?v=...)');
      return;
    }

    try {
      await onGenerate(url.trim());
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <div className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
          error
            ? 'border-red-400 bg-red-50 dark:bg-red-950/30'
            : hasReachedLimit
            ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30'
            : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-within:border-brand-400 dark:focus-within:border-brand-600'
        }`}>
          <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center">
            <YoutubeIcon className="h-5 w-5 text-red-500" />
          </div>

          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            placeholder="Paste a YouTube URL (e.g. youtube.com/watch?v=...)"
            disabled={isGenerating || hasReachedLimit}
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
            aria-label="YouTube URL"
          />

          <Button
            type="submit"
            loading={isGenerating}
            disabled={isGenerating || hasReachedLimit || !url.trim()}
            className="flex-shrink-0"
          >
            {isGenerating ? 'Generating…' : 'Generate'}
            {!isGenerating && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {hasReachedLimit && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2 text-sm text-amber-600 dark:text-amber-400"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            You&apos;ve reached your monthly limit.{' '}
            <a href="/settings" className="font-medium underline">Upgrade your plan</a> for more generations.
          </motion.div>
        )}
      </motion.form>

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/40 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-brand-500"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <p className="text-sm text-brand-700 dark:text-brand-300">
              Extracting transcript and generating content for all 4 platforms…
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
