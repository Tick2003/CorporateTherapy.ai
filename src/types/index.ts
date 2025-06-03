export interface User {
  id: string;
  name: string;
  tier: 'explore' | 'reflect' | 'heal' | 'thrive';
  trialEndsAt?: Date;
  referralCode: string;
  referredBy?: string;
  audioPlaysToday: number;
  preferences: {
    language: 'english' | 'hindi';
    notifications: boolean;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  reframe?: string;
  burnoutLevel?: 'Low' | 'Medium' | 'High';
}

export interface SkillLesson {
  id: string;
  title: string;
  content: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  completed: boolean;
}

export interface MoodEntry {
  id: string;
  date: string;
  value: number;
}

export interface AudioBoost {
  id: string;
  title: string;
  category: string;
  duration: string;
  isPremium: boolean;
  audioUrl: string;
}

export interface SubscriptionTier {
  id: 'explore' | 'reflect' | 'heal' | 'thrive';
  name: string;
  price: number;
  description: string;
  features: string[];
  referralBenefit?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tierId: SubscriptionTier['id'];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  referralCode: string;
}