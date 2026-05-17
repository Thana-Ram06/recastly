'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
import { LinkedinIcon, XIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/BrandIcons';
import { TopNav } from '@/components/dashboard/TopNav';
import { URLInput } from '@/components/dashboard/URLInput';
import { ContentCard } from '@/components/dashboard/ContentCard';
import { UsageStats } from '@/components/dashboard/UsageStats';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import type { Generation } from '@/types';
import type { LucideIcon } from 'lucide-react';
import type { SVGProps } from 'react';
import { cn } from '@/utils/helpers';

type TabKey = 'linkedin' | 'twitter' | 'newsletter' | 'instagram';
type IconComponent = LucideIcon | ((props: SVGProps<SVGSVGElement>) => React.ReactElement);

const tabs: {
  key: TabKey;
  title: string;
  icon: IconComponent;
  iconColor: string;
  getContents: (g: Generation) => string[];
}[] = [
  {
    key: 'linkedin',
    title: 'LinkedIn',
    icon: LinkedinIcon,
    iconColor: 'text-blue-400',
    getContents: (g) => g.linkedinPosts,
  },
  {
    key: 'twitter',
    title: 'X / Twitter',
    icon: XIcon,
    iconColor: 'text-zinc-300',
    getContents: (g) => g.twitterThreads.map((t) => t.join('\n\n')),
  },
  {
    key: 'newsletter',
    title: 'Newsletter',
    icon: Mail,
    iconColor: 'text-violet-400',
    getContents: (g) => [g.newsletter],
  },
  {
    key: 'instagram',
    title: 'Instagram',
    icon: InstagramIcon,
    iconColor: 'text-pink-400',
    getContents: (g) => g.instagramCaptions,
  },
];

export default function DashboardPage() {
  const { getToken } = useAuth();
  const { hasReachedLimit, refetch } = useSubscription();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('linkedin');

  const handleGenerate = async (url: string) => {
    setIsGenerating(true);
    setError('');
    setGeneration(null);

    try {
      const token = await getToken();
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ youtubeUrl: url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate content.');
      setGeneration(data.generation);
      setActiveTab('linkedin');
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const activeTabConfig = tabs.find((t) => t.key === activeTab)!;

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Dashboard" />

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-3xl w-full mx-auto space-y-5">
        {/* Usage */}
        <UsageStats />

        {/* URL Input */}
        <URLInput
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          hasReachedLimit={hasReachedLimit}
        />

        {/* Error */}
        <AnimatePresence>
          {error && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content area */}
        <AnimatePresence>
          {(isGenerating || generation) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Section header */}
              <div className="mb-3">
                <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                  {isGenerating ? 'Generating…' : (generation?.videoTitle || 'Generated content')}
                </h2>
              </div>

              {/* Platform tabs */}
              {!isGenerating && (
                <div className="flex items-center gap-1 mb-4 border-b border-white/5 pb-0">
                  {tabs.map(({ key, title, icon: Icon, iconColor }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-all',
                        activeTab === key
                          ? 'border-brand-500 text-zinc-100'
                          : 'border-transparent text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
                      )}
                    >
                      <Icon className={cn('h-3 w-3', activeTab === key ? iconColor : '')} />
                      {title}
                    </button>
                  ))}
                </div>
              )}

              {/* Card */}
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {tabs.map(({ key, title, icon, iconColor }) => (
                      <ContentCard
                        key={key}
                        title={title}
                        icon={icon as LucideIcon}
                        iconColor={iconColor}
                        contents={[]}
                        isLoading
                      />
                    ))}
                  </motion.div>
                ) : generation ? (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ContentCard
                      title={activeTabConfig.title}
                      icon={activeTabConfig.icon as LucideIcon}
                      iconColor={activeTabConfig.iconColor}
                      contents={activeTabConfig.getContents(generation)}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!isGenerating && !generation && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="h-12 w-12 rounded-xl border border-white/6 bg-white/3 flex items-center justify-center mb-4">
              <YoutubeIcon className="h-5 w-5 text-zinc-700" />
            </div>
            <h3 className="text-sm font-medium text-zinc-400 mb-1">No content yet</h3>
            <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">
              Paste a YouTube URL above to generate LinkedIn posts, X threads, a newsletter, and Instagram captions.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
