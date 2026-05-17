import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { getUser, createOrUpdateUser } from '@/lib/firestore';
import { stripe, createStripeCustomer, createCheckoutSession } from '@/lib/stripe';
import { PLAN_CONFIGS } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { plan } = await req.json() as { plan: 'starter' | 'pro' };
    const config = PLAN_CONFIGS[plan];

    if (!config.priceId) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const user = await getUser(uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let customerId = user.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      customerId = await createStripeCustomer(user.email, user.displayName);
      await createOrUpdateUser({ uid, stripeCustomerId: customerId });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutUrl = await createCheckoutSession({
      customerId,
      priceId: config.priceId,
      uid,
      successUrl: `${baseUrl}/dashboard?upgrade=success`,
      cancelUrl: `${baseUrl}/settings?upgrade=canceled`,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error('[stripe/checkout]', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
