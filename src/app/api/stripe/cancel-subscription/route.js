import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { updateUserSubscription } from '../../../../lib/subscription';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { subscriptionId } = await request.json();
    
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 });
    }

    console.log('Attempting to cancel subscription:', subscriptionId);

    // Handle test/temp subscription IDs
    if (subscriptionId === 'temp_subscription_id' || subscriptionId.startsWith('temp_')) {
      // For test subscriptions, just update the database without calling Stripe
      await updateUserSubscription(session.user.email, {
        plan: 'FREE',
        status: 'canceled',
        usageCount: 0,
        currentPeriodEnd: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Test subscription canceled successfully (mock cancellation)'
      });
    }

    // 먼저 Stripe에서 구독 정보 확인
    let existingSubscription;
    try {
      existingSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      console.log('Current subscription status:', existingSubscription.status);
    } catch (retrieveError) {
      console.error('Error retrieving subscription:', retrieveError);
      return NextResponse.json({ 
        error: 'Subscription not found in Stripe',
        details: retrieveError.message
      }, { status: 400 });
    }

    // 이미 취소된 구독인지 확인
    if (existingSubscription.status === 'canceled') {
      return NextResponse.json({ 
        error: 'Subscription is already canceled' 
      }, { status: 400 });
    }

    // Stripe에서 구독 취소
    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
    
    // 데이터베이스 업데이트
    await updateUserSubscription(session.user.email, {
      plan: 'FREE',
      status: 'canceled',
      usageCount: 0,
      currentPeriodEnd: new Date(canceledSubscription.current_period_end * 1000),
      stripeCustomerId: canceledSubscription.customer,
      stripeSubscriptionId: subscriptionId
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription canceled successfully',
      subscription: canceledSubscription
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    
    // Stripe 에러 처리
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ 
        error: 'Invalid subscription or already canceled',
        details: error.message,
        subscriptionId: subscriptionId
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to cancel subscription',
      details: error.message
    }, { status: 500 });
  }
}