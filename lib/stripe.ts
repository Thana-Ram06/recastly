import Stripe from 'stripe';

// Use a placeholder key at build time — real key is available at runtime.
// The Stripe client won't be called during build (only in API route handlers).
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? 'sk_test_build_placeholder'
);

export async function createStripeCustomer(email: string, name: string): Promise<string> {
  const customer = await stripe.customers.create({ email, name });
  return customer.id;
}

export async function createCheckoutSession({
  customerId,
  priceId,
  uid,
  successUrl,
  cancelUrl,
}: {
  customerId: string;
  priceId: string;
  uid: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { uid },
    subscription_data: { metadata: { uid } },
    allow_promotion_codes: true,
  });

  return session.url!;
}

export async function createBillingPortalSession(customerId: string, returnUrl: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

export function constructWebhookEvent(payload: string, signature: string): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
}

export function getPlanFromPriceId(priceId: string): 'starter' | 'pro' | 'free' {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter';
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro';
  return 'free';
}
