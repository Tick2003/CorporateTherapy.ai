import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, LogOut, Bell, Languages as Language } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { loadStripe } from '@stripe/stripe-js';

// Add null check for Stripe key
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  throw new Error('Stripe publishable key is missing. Please check your .env file.');
}
const stripePromise = loadStripe(stripeKey);

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAppContext();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleLanguageChange = (language: 'english' | 'hindi') => {
    updateUser({
      ...user,
      preferences: {
        ...user.preferences,
        language,
      },
    });
  };
  
  const handleNotificationsChange = () => {
    updateUser({
      ...user,
      preferences: {
        ...user.preferences,
        notifications: !user.preferences.notifications,
      },
    });
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setIsProcessing(true);
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/profile?success=true`,
          cancelUrl: `${window.location.origin}/profile?canceled=true`,
        }),
      });

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const subscriptionPlans = [
    {
      id: 'premium-monthly',
      name: 'Premium',
      price: '₹199',
      interval: 'month',
      features: [
        'Unlimited AI chat sessions',
        'Advanced burnout tracking',
        'Unlimited journal entries',
        'Daily audio boosts',
      ],
    },
    {
      id: 'premium-yearly',
      name: 'Pro+',
      price: '₹499',
      interval: 'month',
      features: [
        'Everything in Premium',
        'Downloadable audio files',
        'Hindi language support',
        'Personalized career roadmap',
        'Priority support',
      ],
    },
  ];
  
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="page-title">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!user.isPremium && (
              <div className="card mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Upgrade Your Plan</h2>
                  
                  <div className="bg-white rounded-full p-1 border border-gray-200 flex text-sm">
                    <button
                      className={`px-3 py-1 rounded-full ${
                        selectedPlan === 'monthly'
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600'
                      }`}
                      onClick={() => setSelectedPlan('monthly')}
                    >
                      Monthly
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full ${
                        selectedPlan === 'yearly'
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600'
                      }`}
                      onClick={() => setSelectedPlan('yearly')}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-xl p-5 ${
                        (plan.interval === 'month' && selectedPlan === 'monthly') ||
                        (plan.interval === 'year' && selectedPlan === 'yearly')
                          ? 'border-primary-300 bg-primary-50'
                          : 'border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{plan.name}</h3>
                          <div className="text-primary-600 font-medium flex items-center mt-1">
                            <Sparkles className="h-4 w-4 mr-1" />
                            <span>Unlock all features</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                          <div className="text-sm text-gray-500">per {plan.interval}</div>
                        </div>
                      </div>
                      
                      <ul className="space-y-2 mb-5">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className="h-5 w-5 text-success-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button 
                        className="btn btn-primary w-full"
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : `Get ${plan.name}`}
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-sm text-gray-500 text-center">
                  <p>Secure payment via Stripe. Cancel anytime.</p>
                </div>
              </div>
            )}
            
            {user.isPremium && (
              <div className="card mb-6 bg-accent-50 border border-accent-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-white p-2 rounded-full">
                    <Sparkles className="h-6 w-6 text-accent-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-accent-900">Premium Subscription Active</h3>
                    <p className="text-accent-700 mt-1">
                      You're enjoying all the benefits of our Premium plan. Your next billing date is September 15, 2025.
                    </p>
                    <div className="mt-4">
                      <button className="text-sm font-medium text-accent-700 hover:text-accent-800">
                        Manage Subscription
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Profile Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="input"
                        value={user.name}
                        onChange={(e) => updateUser({ ...user, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="input"
                        value="user@example.com"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Language Preferences</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      className={`px-4 py-2 rounded-md ${
                        user.preferences.language === 'english'
                          ? 'bg-primary-100 text-primary-800 border border-primary-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                      onClick={() => handleLanguageChange('english')}
                    >
                      <div className="flex items-center">
                        <Language className="h-4 w-4 mr-2" />
                        <span>English</span>
                      </div>
                    </button>
                    
                    <button
                      className={`px-4 py-2 rounded-md ${
                        user.preferences.language === 'hindi'
                          ? 'bg-primary-100 text-primary-800 border border-primary-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                      onClick={() => handleLanguageChange('hindi')}
                    >
                      <div className="flex items-center">
                        <Language className="h-4 w-4 mr-2" />
                        <span>Hindi</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Notification Settings</h3>
                  <div className="flex items-center">
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        user.preferences.notifications ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                      onClick={handleNotificationsChange}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          user.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="ml-3 text-sm text-gray-700">Enable notifications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="card mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">user@example.com</p>
                </div>
              </div>
              
              {user.isPremium ? (
                <div className="bg-accent-50 text-accent-800 px-3 py-2 rounded-md text-sm flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-accent-500" />
                  <span>Premium Member</span>
                </div>
              ) : (
                <div className="bg-gray-50 text-gray-600 px-3 py-2 rounded-md text-sm flex items-center">
                  <span>Free Account</span>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-primary-50 to-secondary-50">
              <h3 className="font-medium text-gray-900 mb-2">Usage Statistics</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">AI Chats</span>
                    <span className="font-medium text-gray-900">7 sessions</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">Journal Entries</span>
                    <span className="font-medium text-gray-900">3 entries</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">Skills Completed</span>
                    <span className="font-medium text-gray-900">1 of 6</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-500 rounded-full" style={{ width: '16.6%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">Audio Plays</span>
                    <span className="font-medium text-gray-900">{user.audioPlaysToday} today</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success-500 rounded-full" 
                      style={{ width: `${(user.audioPlaysToday / 2) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;