import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { updateUserSubscription } from '../../../../lib/subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  let event;

  // 개발 환경에서는 서명 검증 없이 진행
  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await req.text();
      event = JSON.parse(body);
      console.log('Development mode: Processing webhook event:', event.type);
    } catch (error) {
      console.log('JSON parsing failed:', error.message);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  } else {
    // 프로덕션에서는 정상적인 서명 검증
    try {
      const stripeSignature = (await headers()).get('stripe-signature');
      const body = await req.arrayBuffer();
      const buf = Buffer.from(body);

      event = stripe.webhooks.constructEvent(
        buf,
        stripeSignature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log('Production: Event verified with signature:', event.type);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log('Webhook signature verification failed:', message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }
  }

  const permittedEvents = [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
  ];

  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutCompleted(event.data.object);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          // optional: handle invoice payment success
          break;
        case 'invoice.payment_failed':
          // optional: handle invoice payment failure
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error processing webhook event:', error);
      return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutCompleted(session) {
  const userEmail = session.customer_email;
  if (!userEmail) return;

  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await updateSubscriptionFromStripe(userEmail, subscription);
  }
}

async function handleSubscriptionUpdated(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userEmail = customer.email;
  if (!userEmail) return;

  await updateSubscriptionFromStripe(userEmail, subscription);
}

async function handleSubscriptionDeleted(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userEmail = customer.email;
  if (!userEmail) return;

  await updateUserSubscription(userEmail, {
    plan: 'FREE',
    status: 'canceled',
    usageCount: 0,
    currentPeriodEnd: null,
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id,
  });
}

async function updateSubscriptionFromStripe(userEmail, stripeSubscription) {
  const priceId = stripeSubscription.items.data[0]?.price.id;
  let plan = 'FREE';
  if (priceId === process.env.STRIPE_BASIC_PRICE_ID) plan = 'BASIC';
  if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) plan = 'PREMIUM';

  await updateUserSubscription(userEmail, {
    plan,
    status: stripeSubscription.status,
    usageCount: 0,
    currentPeriodEnd: stripeSubscription.current_period_end ? new Date(stripeSubscription.current_period_end * 1000) : null,
    stripeCustomerId: stripeSubscription.customer,
    stripeSubscriptionId: stripeSubscription.id,
  });
}