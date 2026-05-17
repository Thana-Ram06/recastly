'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log('[DashboardLayout] no user — redirecting to /login');
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Waiting for Firebase to confirm auth state
  if (loading) return <PageLoader />;

  // Not authenticated — render nothing while middleware/useEffect redirect fires
  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="lg:pl-56">
        {children}
      </div>
    </div>
  );
}
