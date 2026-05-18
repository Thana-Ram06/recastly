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
  activeBg: string;
  activeBorder: string;
  getContents: (g: Generation) => string[];
}[] = [
  {
    key: 'linkedin',
    title: 'LinkedIn',
    icon: LinkedinIcon,
    iconColor: 'text-blue-400',
    activeBg: 'bg-blue-500/10',
    activeBorder: 'border-blue-500/20',
    getContents: (g) => g.linkedinPosts,
  },
  {
    key: 'twitter',
    title: 'X / Twitter',
    icon: XIcon,
    iconColor: 'text-zinc-300',
    activeBg: 'bg-zinc-500/10',
    activeBorder: 'border-zinc-500/15',
    getContents: (g) => g.twitterThreads.map((t) => t.join('\n\n')),
  },
  {
    key: 'newsletter',
    title: 'Newsletter',
    icon: Mail,
    iconColor: 'text-violet-400',
    activeBg: 'bg-violet-500/10',
    activeBorder: 'border-violet-500/20',
    getContents: (g) => [g.newsletter],
  },
  {
    key: 'instagram',
    title: 'Instagram',
    icon: InstagramIcon,
    iconColor: 'text-pink-400',
    activeBg: 'bg-pink-500/10',
    activeBorder: 'border-pink-500/20',
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

      <main className="flex-1 px-4 sm:px-6 py-7 max-w-3xl w-full mx-auto space-y-5">
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
              className="rounded-xl px-4 py-3 text-xs text-red-400"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}
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
              <div className="mb-4">
                <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-[0.1em]">
                  {isGenerating ? 'Generating…' : (generation?.videoTitle || 'Generated content')}
                </h2>
              </div>

              {/* Platform tabs */}
              {!isGenerating && (
                <div className="flex items-center gap-1 mb-4">
                  {tabs.map(({ key, title, icon: Icon, iconColor, activeBg, activeBorder }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200',
                        activeTab === key
                          ? `${activeBg} ${activeBorder} text-zinc-100`
                          : 'border-transparent text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05]'
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
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <YoutubeIcon className="h-6 w-6 text-zinc-700" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-2 tracking-[-0.01em]">No content yet</h3>
            <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">
              Paste a YouTube URL above to generate LinkedIn posts, X threads, a newsletter, and Instagram captions.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
