import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { updateUserSubscription } from '../../../../lib/subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);
  
  const userEmail = session.customer_email || session.metadata?.userId;
  if (!userEmail) {
    console.error('No user email found in checkout session');
    return;
  }

  // 구독 정보 가져오기
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await updateSubscriptionFromStripe(userEmail, subscription);
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);
  
  const userEmail = subscription.metadata?.userId;
  if (!userEmail) {
    console.error('No user email found in subscription metadata');
    return;
  }

  await updateSubscriptionFromStripe(userEmail, subscription);
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);
  
  const userEmail = subscription.metadata?.userId;
  if (!userEmail) {
    console.error('No user email found in subscription metadata');
    return;
  }

  await updateSubscriptionFromStripe(userEmail, subscription);
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  const userEmail = subscription.metadata?.userId;
  if (!userEmail) {
    console.error('No user email found in subscription metadata');
    return;
  }

  // 구독 취소 시 FREE 플랜으로 변경
  await updateUserSubscription(userEmail, {
    plan: 'FREE',
    status: 'canceled',
    usageCount: 0,
    currentPeriodEnd: new Date(),
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id
  });
}

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded for invoice:', invoice.id);
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const userEmail = subscription.metadata?.userId;
    
    if (userEmail) {
      // 결제 성공 시 사용량 초기화 (새 청구 주기 시작)
      await updateSubscriptionFromStripe(userEmail, subscription, true);
    }
  }
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed for invoice:', invoice.id);
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const userEmail = subscription.metadata?.userId;
    
    if (userEmail) {
      await updateSubscriptionFromStripe(userEmail, subscription);
    }
  }
}

async function updateSubscriptionFromStripe(userEmail, stripeSubscription, resetUsage = false) {
  // Stripe 구독에서 플랜 정보 추출
  const priceId = stripeSubscription.items.data[0]?.price.id;
  let plan = 'FREE';
  
  if (priceId === process.env.STRIPE_BASIC_PRICE_ID) {
    plan = 'BASIC';
  } else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
    plan = 'PREMIUM';
  }

  const subscriptionData = {
    plan: plan,
    status: stripeSubscription.status,
    usageCount: resetUsage ? 0 : undefined, // 리셋이 필요한 경우만 0으로 설정
    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    stripeCustomerId: stripeSubscription.customer,
    stripeSubscriptionId: stripeSubscription.id
  };

  // undefined 값 제거
  const cleanedData = Object.fromEntries(
    Object.entries(subscriptionData).filter(([_, v]) => v !== undefined)
  );

  await updateUserSubscription(userEmail, cleanedData);
}