import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { getUser, getUsageForMonth, getGenerations } from '@/lib/firestore';
import { PLAN_CONFIGS } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const includeHistory = req.nextUrl.searchParams.get('history') === 'true';

    const [user, usageCount] = await Promise.all([getUser(uid), getUsageForMonth(uid)]);

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const plan = user.plan || 'free';
    const config = PLAN_CONFIGS[plan];
    const usageLimit = config.limit;

    const response: Record<string, unknown> = { plan, usageCount, usageLimit };

    if (includeHistory) {
      const generations = await getGenerations(uid, 50);
      response.generations = generations;
    }

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
