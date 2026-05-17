'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Mail, ExternalLink } from 'lucide-react';
import { YoutubeIcon, LinkedinIcon, XIcon, InstagramIcon } from '@/components/ui/BrandIcons';
import { TopNav } from '@/components/dashboard/TopNav';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime, truncateText } from '@/utils/helpers';
import type { Generation } from '@/types';

export default function HistoryPage() {
  const { getToken } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Generation | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken();
        const res = await fetch('/api/user/usage?history=true', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setGenerations(data.generations || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [getToken]);

  const platforms = [
    { icon: LinkedinIcon, label: 'LinkedIn', color: 'text-blue-600' },
    { icon: XIcon, label: 'X', color: 'text-zinc-700 dark:text-zinc-300' },
    { icon: Mail, label: 'Newsletter', color: 'text-violet-600' },
    { icon: InstagramIcon, label: 'Instagram', color: 'text-pink-500' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="History" />

      <main className="flex-1 p-4 sm:p-6 max-w-4xl w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Generation History</h1>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{generations.length} generations</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <Clock className="h-7 w-7 text-zinc-400" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No history yet</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Generate content from a YouTube URL to see your history here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {generations.map((gen, i) => (
              <motion.div
                key={gen.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(selected?.id === gen.id ? null : gen)}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 transition-all shadow-card"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <YoutubeIcon className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {gen.videoTitle || truncateText(gen.youtubeUrl, 60)}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex gap-2">
                        {platforms.map(({ icon: Icon, label, color }) => (
                          <span key={label} title={label}>
                            <Icon className={`h-3.5 w-3.5 ${color}`} />
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {formatRelativeTime(gen.createdAt)}
                      </span>
                    </div>
                  </div>
                  <a
                    href={gen.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex-shrink-0"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {selected?.id === gen.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {gen.linkedinPosts[0] && (
                      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5">LinkedIn Post 1</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4">
                          {gen.linkedinPosts[0]}
                        </p>
                      </div>
                    )}
                    {gen.newsletter && (
                      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
                        <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1.5">Newsletter</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4">
                          {gen.newsletter}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
