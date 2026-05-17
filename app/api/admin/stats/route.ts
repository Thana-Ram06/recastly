import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { getAdminStats } from '@/lib/firestore';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim());

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    if (!ADMIN_EMAILS.includes(decoded.email || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
