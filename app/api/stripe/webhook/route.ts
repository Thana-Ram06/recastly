import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, getPlanFromPriceId } from '@/lib/stripe';
import { findUserByStripeCustomerId, saveSubscription, updateUserPlan } from '@/lib/firestore';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, signature);
  } catch (err) {
    console.error('[webhook] signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const uid = session.metadata?.uid;
        if (!uid) break;

        const sub = session.subscription as string;
        await updateUserPlan(uid, 'starter', {
          stripeSubscriptionId: sub,
          stripeCustomerId: session.customer as string,
        });

        await saveSubscription({
          uid,
          plan: 'starter',
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: sub,
          status: 'active',
          updatedAt: Date.now(),
        });
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        const user = await findUserByStripeCustomerId(customerId);
        if (!user) break;

        const priceId = sub.items.data[0]?.price.id;
        const plan = getPlanFromPriceId(priceId);
        const isActive = sub.status === 'active' || sub.status === 'trialing';

        await updateUserPlan(user.uid, plan, {
          stripeSubscriptionId: sub.id,
        });

        await saveSubscription({
          uid: user.uid,
          plan,
          stripeCustomerId: customerId,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          status: isActive ? 'active' : 'canceled',
          updatedAt: Date.now(),
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        const user = await findUserByStripeCustomerId(customerId);
        if (!user) break;

        await updateUserPlan(user.uid, 'free');
        await saveSubscription({
          uid: user.uid,
          plan: 'free',
          stripeCustomerId: customerId,
          stripeSubscriptionId: sub.id,
          status: 'canceled',
          updatedAt: Date.now(),
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const user = await findUserByStripeCustomerId(customerId);
        if (!user) break;

        await saveSubscription({
          uid: user.uid,
          plan: user.plan,
          stripeCustomerId: customerId,
          status: 'past_due',
          updatedAt: Date.now(),
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[webhook] handler error', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
