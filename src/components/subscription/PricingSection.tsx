import React from 'react';
import { motion } from 'framer-motion';
import PricingCard from './PricingCard';
import { subscriptionTiers } from '../../lib/subscription';
import { useAppContext } from '../../context/AppContext';

const PricingSection: React.FC = () => {
  const { user, updateUser } = useAppContext();

  const handleSelectTier = (tierId: string) => {
    // In a real app, this would open a payment flow
    console.log('Selected tier:', tierId);
  };

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Choose Your Wellness Journey
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 max-w-2xl mx-auto"
        >
          Select the plan that best supports your mental health and career growth needs
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {subscriptionTiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PricingCard
              tier={tier}
              isCurrentTier={user.tier === tier.id}
              onSelect={handleSelectTier}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-gray-500">
          All plans include access to our mobile app and web platform.
          <br />
          Need help choosing? Chat with our support team.
        </p>
      </motion.div>
    </div>
  );
};

export default PricingSection;