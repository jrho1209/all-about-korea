import clientPromise from '../app/api/auth/[...nextauth]/lib/mongodb';

export async function getUserSubscription(userEmail) {
  try {
    const client = await clientPromise;
    const db = client.db('allaboutkorea');
    const users = db.collection('users');

    const user = await users.findOne({ email: userEmail });
    
    if (!user || !user.subscription) {
      return {
        plan: 'FREE',
        status: 'active',
        usageCount: 0,
        currentPeriodEnd: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null
      };
    }

    return user.subscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

export async function updateUserSubscription(userEmail, subscriptionData) {
  try {
    const client = await clientPromise;
    const db = client.db('allaboutkorea');
    const users = db.collection('users');

    const result = await users.updateOne(
      { email: userEmail },
      { 
        $set: { 
          subscription: subscriptionData,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return result;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return null;
  }
}

export async function incrementUsageCount(userEmail) {
  try {
    const client = await clientPromise;
    const db = client.db('allaboutkorea');
    const users = db.collection('users');

    const result = await users.updateOne(
      { email: userEmail },
      { 
        $inc: { 'subscription.usageCount': 1 },
        $set: { updatedAt: new Date() }
      }
    );

    return result;
  } catch (error) {
    console.error('Error incrementing usage count:', error);
    return null;
  }
}

export async function resetUsageCount(userEmail) {
  try {
    const client = await clientPromise;
    const db = client.db('allaboutkorea');
    const users = db.collection('users');

    const result = await users.updateOne(
      { email: userEmail },
      { 
        $set: { 
          'subscription.usageCount': 0,
          updatedAt: new Date()
        }
      }
    );

    return result;
  } catch (error) {
    console.error('Error resetting usage count:', error);
    return null;
  }
}

export function canUseAIPlanner(subscription) {
  if (!subscription) return false;
  
  // Check if subscription is active
  if (subscription.status !== 'active') return false;
  
  // Free plan has no AI access
  if (subscription.plan === 'FREE') return false;
  
  // Premium plan has unlimited access
  if (subscription.plan === 'PREMIUM') return true;
  
  // Basic plan has 30 uses per month
  if (subscription.plan === 'BASIC') {
    return subscription.usageCount < 30;
  }
  
  return false;
}

export function getUsageInfo(subscription) {
  if (!subscription) {
    return { used: 0, limit: 0, remaining: 0 };
  }
  
  if (subscription.plan === 'FREE') {
    return { used: 0, limit: 0, remaining: 0 };
  }
  
  if (subscription.plan === 'PREMIUM') {
    return { used: subscription.usageCount || 0, limit: -1, remaining: -1 }; // -1 means unlimited
  }
  
  if (subscription.plan === 'BASIC') {
    const used = subscription.usageCount || 0;
    const limit = 30;
    const remaining = Math.max(0, limit - used);
    return { used, limit, remaining };
  }
  
  return { used: 0, limit: 0, remaining: 0 };
}