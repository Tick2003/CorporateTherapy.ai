import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import type { SubscriptionTier } from '../../types';
import { cn } from '../../lib/utils';

interface PricingCardProps {
  tier: SubscriptionTier;
  isCurrentTier?: boolean;
  onSelect: (tierId: SubscriptionTier['id']) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ tier, isCurrentTier, onSelect }) => {
  const isPopular = tier.id === 'heal';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        'rounded-xl p-6 transition-shadow',
        isCurrentTier
          ? 'bg-primary-50 border-2 border-primary-500'
          : 'bg-white border border-gray-200',
        isPopular && 'ring-2 ring-accent-500'
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="h-4 w-4 mr-1" />
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
        <p className="text-gray-600 mt-2">{tier.description}</p>
        <div className="mt-4">
          <span className="text-3xl font-bold text-gray-900">₹{tier.price}</span>
          <span className="text-gray-600">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start">
            <Check className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {tier.referralBenefit && (
        <div className="bg-accent-50 border border-accent-100 rounded-lg p-3 mb-6">
          <p className="text-sm text-accent-800">
            <span className="font-medium">Referral Benefit:</span> {tier.referralBenefit}
          </p>
        </div>
      )}

      <button
        onClick={() => onSelect(tier.id)}
        className={cn(
          'w-full py-2 px-4 rounded-lg font-medium transition-colors',
          isCurrentTier
            ? 'bg-primary-100 text-primary-700'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        )}
      >
        {isCurrentTier ? 'Current Plan' : 'Upgrade Now'}
      </button>
    </motion.div>
  );
};

export default PricingCard;