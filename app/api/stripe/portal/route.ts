import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { getUser } from '@/lib/firestore';
import { createBillingPortalSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const user = await getUser(decoded.uid);

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const portalUrl = await createBillingPortalSession(user.stripeCustomerId, `${baseUrl}/settings`);

    return NextResponse.json({ url: portalUrl });
  } catch (err) {
    console.error('[stripe/portal]', err);
    return NextResponse.json({ error: 'Failed to create billing portal session' }, { status: 500 });
  }
}
