import Stripe from 'stripe';
import { getUserSubscription, canUseAIPlanner, getUsageInfo } from './subscription';

// Stripe 서버 사이드 클라이언트
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// 구독 플랜 정의
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    priceId: null,
    price: 0,
    features: [
      'Browse Agencies',
      'View Food Posts',
      'Basic Support'
    ],
    limits: {
      aiPlannerUsage: 0, // AI Planner 사용 불가
    }
  },
  BASIC: {
    name: 'Basic',
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    price: 9.99,
    features: [
      'AI Planner - 30 uses/month',
      'Unlimited Agency Access',
      'Save Travel Plans',
      'Email Support'
    ],
    limits: {
      aiPlannerUsage: 30, // 월 30회
    }
  },
  PREMIUM: {
    name: 'Premium',
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    price: 19.99,
    features: [
      'Unlimited AI Planner',
      'All Features Unlocked',
      'Priority Support',
      'Special Discounts',
      'Early Access to New Features'
    ],
    limits: {
      aiPlannerUsage: -1, // 무제한
    }
  }
};

// 구독 상태 확인 (이제 DB에서 가져옴)
export async function checkSubscriptionStatus(userEmail) {
  const subscription = await getUserSubscription(userEmail);
  if (!subscription) return 'FREE';
  
  // 구독이 활성 상태이고 만료되지 않았는지 확인
  if (subscription.status === 'active') {
    if (!subscription.currentPeriodEnd || new Date(subscription.currentPeriodEnd) > new Date()) {
      return subscription.plan;
    }
  }
  
  return 'FREE';
}

// AI Planner 사용 가능 여부 확인
export async function checkAIPlannerAccess(userEmail) {
  const subscription = await getUserSubscription(userEmail);
  const canUse = canUseAIPlanner(subscription);
  const usage = getUsageInfo(subscription);
  
  return {
    allowed: canUse,
    subscription: subscription,
    usage: usage
  };
}
