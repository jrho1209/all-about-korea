'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHero from '../components/PageHero/PageHero';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'FREE',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for exploring Korea',
      features: [
        'Browse Tour Agencies',
        'View Food Recommendations',
        'Basic Community Access',
        'Email Support'
      ],
      buttonText: 'Current Plan',
      highlighted: false,
      popular: false
    },
    {
      id: 'BASIC',
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      description: 'Great for occasional travelers',
      features: [
        'AI Travel Planner - 30 uses/month',
        'Unlimited Agency Access',
        'Save & Export Travel Plans',
        'Priority Email Support',
        'Community Features'
      ],
      buttonText: 'Get Started',
      highlighted: true,
      popular: true
    },
    {
      id: 'PREMIUM',
      name: 'Premium',
      price: '$19.99',
      period: '/month',
      description: 'For frequent Korea travelers',
      features: [
        'Unlimited AI Travel Planner',
        'All Features Unlocked',
        'Priority Support & Live Chat',
        'Exclusive Travel Discounts',
        'Early Access to New Features',
        'Custom Itinerary Consultation'
      ],
      buttonText: 'Go Premium',
      highlighted: false,
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You\'ll continue to have access to premium features until the end of your current billing period."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) through our secure Stripe payment system."
    },
    {
      question: "Is there a free trial?",
      answer: "We offer a Free plan that lets you explore basic features. You can upgrade to paid plans anytime to unlock AI planning features."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your saved travel plans and account data remain accessible even after cancellation. You can always reactivate your subscription later."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 7-day money-back guarantee for new subscriptions. Contact our support team if you\'re not satisfied."
    }
  ];

  const handleSubscribe = async (planId) => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (planId === 'FREE') {
      return;
    }

    const priceIdMap = {
      'BASIC': process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID,
      'PREMIUM': process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
    };

    const priceId = priceIdMap[planId];
    if (!priceId) {
      alert('Invalid plan selected');
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero />
      
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Billing Toggle Removed */}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  plan.highlighted ? 'ring-4 ring-red-600 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-extrabold text-gray-900">
                      {billingCycle === 'monthly' ? plan.price : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {billingCycle === 'monthly' ? plan.period : plan.yearlyPeriod}
                    </span>
                    {billingCycle === 'yearly' && plan.savings && (
                      <div className="text-green-600 font-medium text-sm mt-1">
                        {plan.savings}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">What&apos;s included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id || (plan.id === 'FREE' && !session)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                      plan.highlighted
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    } ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading === plan.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      plan.buttonText
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Compare Plans
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Basic</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 text-gray-700">AI Travel Planner</td>
                    <td className="py-4 px-6 text-center text-red-500">✗</td>
                    <td className="py-4 px-6 text-center text-green-500">30 uses/month</td>
                    <td className="py-4 px-6 text-center text-green-500">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Browse Agencies</td>
                    <td className="py-4 px-6 text-center text-green-500">✓</td>
                    <td className="py-4 px-6 text-center text-green-500">✓</td>
                    <td className="py-4 px-6 text-center text-green-500">✓</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Save Travel Plans</td>
                    <td className="py-4 px-6 text-center text-red-500">✗</td>
                    <td className="py-4 px-6 text-center text-green-500">✓</td>
                    <td className="py-4 px-6 text-center text-green-500">✓</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Travel Discounts</td>
                    <td className="py-4 px-6 text-center text-red-500">✗</td>
                    <td className="py-4 px-6 text-center text-red-500">✗</td>
                    <td className="py-4 px-6 text-center text-green-500">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Plan Your Korea Adventure?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of travelers who trust our AI-powered planning
            </p>
            <div className="space-x-4">
              <button
                onClick={() => handleSubscribe('BASIC')}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start with Basic
              </button>
              <button
                onClick={() => handleSubscribe('PREMIUM')}
                className="bg-red-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors"
              >
                Go Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}