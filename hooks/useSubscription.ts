'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { Plan } from '@/types';

interface SubscriptionState {
  plan: Plan;
  usageCount: number;
  usageLimit: number | null;
  loading: boolean;
  error: string | null;
}

export function useSubscription() {
  const { user, getToken } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    plan: 'free',
    usageCount: 0,
    usageLimit: 1,
    loading: true,
    error: null,
  });

  const fetchUsage = useCallback(async () => {
    if (!user) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    try {
      const token = await getToken();
      const res = await fetch('/api/user/usage', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch usage');
      const data = await res.json();

      setState({
        plan: data.plan,
        usageCount: data.usageCount,
        usageLimit: data.usageLimit,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load subscription',
      }));
    }
  }, [user, getToken]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const hasReachedLimit = state.usageLimit !== null && state.usageCount >= state.usageLimit;

  return { ...state, hasReachedLimit, refetch: fetchUsage };
}
