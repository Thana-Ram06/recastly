import { adminDb } from '@/firebase/admin';
import type { User, Generation, Subscription, UsageRecord, Plan } from '@/types';
import { getCurrentMonth } from '@/utils/helpers';

// ─── User ────────────────────────────────────────────────────────────────────

export async function getUser(uid: string): Promise<User | null> {
  const doc = await adminDb.collection('users').doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as User;
}

export async function createOrUpdateUser(user: Partial<User> & { uid: string }): Promise<void> {
  const ref = adminDb.collection('users').doc(user.uid);
  const existing = await ref.get();

  if (!existing.exists) {
    await ref.set({
      ...user,
      plan: 'free',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  } else {
    await ref.update({ ...user, updatedAt: Date.now() });
  }
}

export async function updateUserPlan(uid: string, plan: Plan, subscriptionData?: Partial<User>): Promise<void> {
  await adminDb.collection('users').doc(uid).update({
    plan,
    ...subscriptionData,
    updatedAt: Date.now(),
  });
}

// ─── Usage ───────────────────────────────────────────────────────────────────

export async function getUsageForMonth(uid: string, month?: string): Promise<number> {
  const m = month || getCurrentMonth();
  const doc = await adminDb.collection('usage').doc(`${uid}_${m}`).get();
  if (!doc.exists) return 0;
  return (doc.data() as UsageRecord).count;
}

export async function incrementUsage(uid: string): Promise<number> {
  const month = getCurrentMonth();
  const ref = adminDb.collection('usage').doc(`${uid}_${month}`);

  await adminDb.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) {
      tx.set(ref, { uid, month, count: 1, updatedAt: Date.now() });
    } else {
      const current = (doc.data() as UsageRecord).count;
      tx.update(ref, { count: current + 1, updatedAt: Date.now() });
    }
  });

  const updated = await ref.get();
  return (updated.data() as UsageRecord).count;
}

export async function hasExceededLimit(uid: string, plan: Plan): Promise<boolean> {
  const limits: Record<Plan, number | null> = { free: 1, starter: 10, pro: null };
  const limit = limits[plan];
  if (limit === null) return false;
  const usage = await getUsageForMonth(uid);
  return usage >= limit;
}

// ─── Generations ─────────────────────────────────────────────────────────────

export async function saveGeneration(generation: Omit<Generation, 'id'>): Promise<string> {
  const ref = adminDb.collection('generations').doc();
  await ref.set({ ...generation, id: ref.id });
  return ref.id;
}

export async function getGenerations(uid: string, limitCount = 20): Promise<Generation[]> {
  const snapshot = await adminDb
    .collection('generations')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(limitCount)
    .get();

  return snapshot.docs.map((doc) => doc.data() as Generation);
}

export async function getGeneration(id: string): Promise<Generation | null> {
  const doc = await adminDb.collection('generations').doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as Generation;
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function saveSubscription(sub: Subscription): Promise<void> {
  await adminDb.collection('subscriptions').doc(sub.uid).set({
    ...sub,
    updatedAt: Date.now(),
  });
}

export async function getSubscription(uid: string): Promise<Subscription | null> {
  const doc = await adminDb.collection('subscriptions').doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as Subscription;
}

export async function findUserByStripeCustomerId(customerId: string): Promise<User | null> {
  const snapshot = await adminDb
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as User;
}

// ─── Admin Stats ─────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const [usersSnap, generationsSnap, subsSnap] = await Promise.all([
    adminDb.collection('users').count().get(),
    adminDb.collection('generations').count().get(),
    adminDb.collection('subscriptions').where('status', '==', 'active').count().get(),
  ]);

  return {
    totalUsers: usersSnap.data().count,
    totalGenerations: generationsSnap.data().count,
    activeSubscriptions: subsSnap.data().count,
  };
}
