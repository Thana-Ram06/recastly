import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { getUser, createOrUpdateUser, getUsageForMonth, getGenerations } from '@/lib/firestore';
import { PLAN_CONFIGS } from '@/types';

export async function GET(req: NextRequest) {
  const start = Date.now();
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    console.log(`[usage] uid=${uid}`);

    const includeHistory = req.nextUrl.searchParams.get('history') === 'true';

    let [user, usageCount] = await Promise.all([getUser(uid), getUsageForMonth(uid)]);

    // First-time user — create the Firestore doc on the fly so we never 404
    if (!user) {
      console.log(`[usage] user not found, creating doc for uid=${uid}`);
      await createOrUpdateUser({
        uid,
        email: decoded.email || '',
        displayName: decoded.name || '',
        photoURL: decoded.picture || null,
      });
      user = await getUser(uid);
    }

    const plan = user?.plan || 'free';
    const config = PLAN_CONFIGS[plan];
    const usageLimit = config.limit;

    const response: Record<string, unknown> = { plan, usageCount, usageLimit };

    if (includeHistory) {
      const generations = await getGenerations(uid, 50);
      response.generations = generations;
    }

    console.log(`[usage] done in ${Date.now() - start}ms — plan=${plan} count=${usageCount}`);
    return NextResponse.json(response);
  } catch (err) {
    console.error('[usage] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
