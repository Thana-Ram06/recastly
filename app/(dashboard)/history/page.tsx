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
    { icon: LinkedinIcon, label: 'LinkedIn', color: 'text-blue-400' },
    { icon: XIcon, label: 'X', color: 'text-zinc-300' },
    { icon: Mail, label: 'Newsletter', color: 'text-violet-400' },
    { icon: InstagramIcon, label: 'Instagram', color: 'text-pink-400' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="History" />

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-3xl w-full mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-sm font-semibold text-zinc-300">Generation History</h1>
          {!loading && (
            <span className="text-xs text-zinc-600">{generations.length} generations</span>
          )}
        </div>

        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl shimmer" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }} />
            ))}
          </div>
        ) : generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Clock className="h-6 w-6 text-zinc-700" />
            </div>
            <h3 className="text-sm font-medium text-zinc-400 mb-1">No history yet</h3>
            <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">
              Generate content from a YouTube URL to see your history here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {generations.map((gen, i) => (
              <motion.div
                key={gen.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(selected?.id === gen.id ? null : gen)}
                className="rounded-xl p-4 cursor-pointer transition-all duration-200"
                style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-red-950/40 border border-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <YoutubeIcon className="h-3.5 w-3.5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-200 truncate">
                      {gen.videoTitle || truncateText(gen.youtubeUrl, 60)}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex gap-2">
                        {platforms.map(({ icon: Icon, label, color }) => (
                          <Icon key={label} className={`h-3 w-3 ${color}`} />
                        ))}
                      </div>
                      <span className="text-[11px] text-zinc-600">
                        {formatRelativeTime(gen.createdAt)}
                      </span>
                    </div>
                  </div>
                  <a
                    href={gen.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="h-6 w-6 flex items-center justify-center rounded text-zinc-700 hover:text-zinc-400 hover:bg-white/5 transition-all shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {selected?.id === gen.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                  >
                    {gen.linkedinPosts[0] && (
                      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] font-semibold text-blue-400 mb-1.5 uppercase tracking-[0.1em]">LinkedIn</p>
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-4">
                          {gen.linkedinPosts[0]}
                        </p>
                      </div>
                    )}
                    {gen.newsletter && (
                      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] font-semibold text-violet-400 mb-1.5 uppercase tracking-[0.1em]">Newsletter</p>
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-4">
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
