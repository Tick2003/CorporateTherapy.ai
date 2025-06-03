import { addDays, isAfter } from 'date-fns';
import type { SubscriptionTier, User } from '../types';

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'explore',
    name: 'Explore',
    price: 0,
    description: 'Start your mental wellness journey',
    features: [
      'AI chat access for 1 week',
      'Basic mood tracking',
      'Limited journal entries',
      'Access to free audio boosts'
    ]
  },
  {
    id: 'reflect',
    name: 'Reflect',
    price: 599,
    description: 'Build self-awareness and track patterns',
    features: [
      'Unlimited AI chat access',
      'Full mood tracking & notifications',
      'Unlimited journal entries',
      'Basic burnout analytics',
      '1-week free extension on referral'
    ],
    referralBenefit: '1 week free'
  },
  {
    id: 'heal',
    name: 'Heal',
    price: 999,
    description: 'Gain deeper insights and support',
    features: [
      'Everything in Reflect',
      'Personalized session summaries',
      'Advanced burnout analytics',
      'Weekly & monthly mood trends',
      'Priority chat support'
    ],
    referralBenefit: '1 week free'
  },
  {
    id: 'thrive',
    name: 'Thrive',
    price: 1499,
    description: 'Maximum support for optimal wellbeing',
    features: [
      'Everything in Heal',
      'Advanced burnout prediction',
      'Deeper personalized insights',
      'Mood trigger analysis',
      'Custom action plans',
      'VIP support access'
    ],
    referralBenefit: '1 week free'
  }
];

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 8;
  let code = '';
  for (let i = 0; i < codeLength; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function canAccessChat(user: User): boolean {
  if (user.tier === 'explore') {
    return user.trialEndsAt ? isAfter(user.trialEndsAt, new Date()) : false;
  }
  return true;
}

export function getRemainingTrialDays(user: User): number {
  if (!user.trialEndsAt) return 0;
  const now = new Date();
  const diff = user.trialEndsAt.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function applyReferralBenefit(user: User): Date {
  const extensionDays = 7; // 1 week
  const currentEnd = user.trialEndsAt || new Date();
  return addDays(currentEnd, extensionDays);
}