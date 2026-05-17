export type Plan = 'free' | 'starter' | 'pro';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  plan: Plan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UsageRecord {
  uid: string;
  month: string; // 'YYYY-MM'
  count: number;
  updatedAt: number;
}

export interface Generation {
  id: string;
  uid: string;
  youtubeUrl: string;
  videoTitle?: string;
  linkedinPosts: string[];
  twitterThreads: string[][];
  newsletter: string;
  instagramCaptions: string[];
  createdAt: number;
}

export interface Subscription {
  uid: string;
  plan: Plan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: number;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive';
  updatedAt: number;
}

export interface GenerateRequest {
  youtubeUrl: string;
}

export interface GenerateResponse {
  generation: Generation;
}

export interface PlanConfig {
  name: string;
  limit: number | null;
  price: number;
  priceId: string | null;
  features: string[];
}

export const PLAN_CONFIGS: Record<Plan, PlanConfig> = {
  free: {
    name: 'Free',
    limit: 1,
    price: 0,
    priceId: null,
    features: ['1 generation/month', 'All platforms', 'Basic support'],
  },
  starter: {
    name: 'Starter',
    limit: 10,
    price: 9,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || null,
    features: ['10 generations/month', 'All platforms', 'Priority support', 'History access'],
  },
  pro: {
    name: 'Pro',
    limit: null,
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID || null,
    features: ['Unlimited generations', 'All platforms', 'Priority support', 'Full history', 'Early access'],
  },
};

export interface AdminStats {
  totalUsers: number;
  totalGenerations: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
}
