import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Bell, Languages as Language, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PricingSection from '../components/subscription/PricingSection';
import { getRemainingTrialDays, canAccessChat } from '../lib/subscription';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAppContext();
  
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

  const remainingDays = getRemainingTrialDays(user);
  const canChat = canAccessChat(user);

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title mb-0">Your Profile</h1>
          
          {user.tier === 'explore' && remainingDays > 0 && (
            <div className="bg-accent-50 text-accent-800 px-4 py-2 rounded-full flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                {remainingDays} days left in trial
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
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
                      disabled={user.tier === 'explore' || user.tier === 'reflect'}
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

                {user.referralCode && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Your Referral Code</h3>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between">
                        <code className="text-primary-600 font-mono">{user.referralCode}</code>
                        <button
                          onClick={() => navigator.clipboard.writeText(user.referralCode)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Share this code with friends to give them a 1-week free trial of Reflect tier
                      </p>
                    </div>
                  </div>
                )}
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
              
              <div className="bg-accent-50 text-accent-800 px-3 py-2 rounded-md text-sm">
                <span className="font-medium">{user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Plan</span>
                {user.tier === 'explore' && remainingDays > 0 && (
                  <span className="block text-xs mt-1">
                    Trial ends in {remainingDays} days
                  </span>
                )}
              </div>
              
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
                    <span className="font-medium text-gray-900">
                      {canChat ? 'Available' : 'Trial Ended'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: canChat ? '100%' : '0%' }}
                    ></div>
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

        <PricingSection />
      </motion.div>
    </div>
  );
};

export default ProfilePage;