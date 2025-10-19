'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setSubscription({
        plan: session.user.plan || 'FREE',
        status: session.user.status || 'inactive',
        currentPeriodEnd: session.user.currentPeriodEnd || null,
        stripeSubscriptionId: session.user.stripeSubscriptionId || null
      });
      setLoading(false);
    }
  }, [session]);

  const handleCancelSubscription = async () => {
    if (!subscription?.stripeSubscriptionId) {
      alert('No active subscription found');
      return;
    }

    setCancelLoading(true);
    
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.stripeSubscriptionId
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Subscription canceled successfully. You will retain access until the end of your current billing period.');
        setShowCancelModal(false);
        // 페이지 새로고침으로 최신 상태 반영
        window.location.reload();
      } else {
        const errorMessage = data.error || 'Failed to cancel subscription';
        const details = data.details ? `\n\nDetails: ${data.details}` : '';
        const subId = data.subscriptionId ? `\n\nSubscription ID: ${data.subscriptionId}` : '';
        alert(`${errorMessage}${details}${subId}`);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('An error occurred while canceling subscription');
    } finally {
      setCancelLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your profile
          </h1>
          <Link 
            href="/login"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-4 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center border-4 border-gray-200">
                <span className="text-gray-600 text-2xl font-bold">
                  {(session.user.name || session.user.email)?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.user.name || 'User'}
              </h1>
              <p className="text-gray-600">{session.user.email}</p>
              {subscription?.plan && subscription.status === 'active' && (
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.plan === 'BASIC' 
                    ? 'bg-green-100 text-green-600' 
                    : subscription.plan === 'PREMIUM'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {subscription.plan === 'BASIC' ? 'Basic Plan' : 
                   subscription.plan === 'PREMIUM' ? 'Premium Plan' : 'Free Plan'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'subscription'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Subscription
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={session.user.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={session.user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
                  >
                    Edit Profile (Coming Soon)
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Subscription Details</h2>
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  </div>
                ) : subscription ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Current Plan</h3>
                        <p className={`text-lg font-semibold ${
                          subscription.plan === 'BASIC' ? 'text-green-600' : 
                          subscription.plan === 'PREMIUM' ? 'text-purple-600' : 'text-gray-600'
                        }`}>
                          {subscription.plan === 'BASIC' ? 'Basic Plan' : 
                           subscription.plan === 'PREMIUM' ? 'Premium Plan' : 'Free Plan'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Status</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          subscription.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {subscription.status}
                        </span>
                      </div>

                      {subscription.plan !== 'FREE' && (
                        <>
                          <div>
                            <h3 className="font-medium text-gray-900 mb-2">Usage This Month</h3>
                            <p className="text-lg">
                              {subscription.usageCount || 0} / {subscription.plan === 'BASIC' ? '30' : 'Unlimited'} uses
                            </p>
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-900 mb-2">Next Billing Date</h3>
                            <p className="text-lg">
                              {subscription.currentPeriodEnd 
                                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                                : 'N/A'
                              }
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-6 flex space-x-4">
                      <Link
                        href="/subscription"
                        className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
                      >
                        {subscription.plan === 'FREE' ? 'Upgrade Plan' : 'Change Plan'}
                      </Link>
                      
                      {subscription.plan !== 'FREE' && (
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
                        >
                          Cancel Subscription
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                    <p className="text-gray-600 mb-4">
                      You&apos;re currently on the free plan. Upgrade to unlock premium features!
                    </p>
                    <Link
                      href="/pricing"
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      View Plans
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Account Security</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        disabled
                        className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed text-sm"
                      >
                        Enable (Coming Soon)
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Change Password</h4>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <button
                        disabled
                        className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed text-sm"
                      >
                        Change (Coming Soon)
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Delete Account</h4>
                        <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                      </div>
                      <button
                        disabled
                        className="bg-red-300 text-red-500 px-4 py-2 rounded-md cursor-not-allowed text-sm"
                      >
                        Delete (Coming Soon)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cancel Subscription Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Cancel Subscription
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to cancel your subscription? You&apos;ll continue to have access to premium features until the end of your current billing period.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {cancelLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Canceling...
                    </div>
                  ) : (
                    'Yes, Cancel'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}