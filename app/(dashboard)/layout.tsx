'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <PageLoader />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <div className="lg:pl-60">
        {children}
      </div>
    </div>
  );
}
