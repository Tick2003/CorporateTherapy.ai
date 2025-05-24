export interface User {
  id: string;
  name: string;
  isPremium: boolean;
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
  value: number; // 0-100
}

export interface AudioBoost {
  id: string;
  title: string;
  category: string;
  duration: string;
  isPremium: boolean;
  audioUrl: string;
}

export interface Subscription {
  id: string;
  name: string;
  price: string;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}