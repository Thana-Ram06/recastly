'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
import { LinkedinIcon, XIcon, InstagramIcon } from '@/components/ui/BrandIcons';
import { TopNav } from '@/components/dashboard/TopNav';
import { URLInput } from '@/components/dashboard/URLInput';
import { ContentCard } from '@/components/dashboard/ContentCard';
import { UsageStats } from '@/components/dashboard/UsageStats';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import type { Generation } from '@/types';
import type { LucideIcon } from 'lucide-react';
import type { SVGProps } from 'react';

type IconComponent = LucideIcon | ((props: SVGProps<SVGSVGElement>) => React.ReactElement);

const platformCards: {
  key: string;
  title: string;
  icon: IconComponent;
  iconColor: string;
  iconBg: string;
  getContents: (g: Generation) => string[];
}[] = [
  {
    key: 'linkedin',
    title: 'LinkedIn Posts',
    icon: LinkedinIcon,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    getContents: (g) => g.linkedinPosts,
  },
  {
    key: 'twitter',
    title: 'X / Twitter Threads',
    icon: XIcon,
    iconColor: 'text-zinc-800 dark:text-zinc-200',
    iconBg: 'bg-zinc-100 dark:bg-zinc-800/60',
    getContents: (g) => g.twitterThreads.map((thread) => thread.join('\n\n')),
  },
  {
    key: 'newsletter',
    title: 'Newsletter',
    icon: Mail,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50 dark:bg-violet-950/50',
    getContents: (g) => [g.newsletter],
  },
  {
    key: 'instagram',
    title: 'Instagram Captions',
    icon: InstagramIcon,
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-50 dark:bg-pink-950/50',
    getContents: (g) => g.instagramCaptions,
  },
];

export default function DashboardPage() {
  const { getToken } = useAuth();
  const { hasReachedLimit, refetch } = useSubscription();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (url: string) => {
    setIsGenerating(true);
    setError('');
    setGeneration(null);

    try {
      const token = await getToken();
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ youtubeUrl: url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content.');
      }

      setGeneration(data.generation);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Dashboard" />

      <main className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto space-y-6">
        <UsageStats />

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Generate content</h2>
          <URLInput
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            hasReachedLimit={hasReachedLimit}
          />
        </section>

        {error && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence>
          {(isGenerating || generation) && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                {isGenerating ? 'Generating your content…' : generation?.videoTitle || 'Generated content'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platformCards.map(({ key, title, icon: Icon, iconColor, iconBg, getContents }) => (
                  <ContentCard
                    key={key}
                    title={title}
                    icon={Icon as LucideIcon}
                    iconColor={iconColor}
                    iconBg={iconBg}
                    contents={generation ? getContents(generation) : []}
                    isLoading={isGenerating}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {!isGenerating && !generation && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <LinkedinIcon className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No content yet</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              Paste a YouTube URL above to generate LinkedIn posts, Twitter threads, a newsletter, and Instagram captions instantly.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
