import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { MoodEntry } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const burnoutTips = [
  "Take regular breaks throughout your workday",
  "Practice deep breathing exercises",
  "Set clear boundaries between work and personal life",
  "Get adequate sleep and maintain a consistent sleep schedule",
  "Engage in physical activity or exercise",
  "Connect with colleagues or friends for support",
  "Consider speaking with a mental health professional",
  "Practice mindfulness or meditation",
];

export function getBurnoutTip(): string {
  const randomIndex = Math.floor(Math.random() * burnoutTips.length);
  return burnoutTips[randomIndex];
}

export function checkBurnoutRisk(moodEntries: MoodEntry[]): boolean {
  if (moodEntries.length < 5) return false;
  
  const recentEntries = moodEntries.slice(-5);
  const averageMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
  
  return averageMood <= 2;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getMoodEmoji(mood: number): string {
  const emojis = ['😢', '😕', '😐', '🙂', '😊'];
  return emojis[Math.min(Math.floor(mood), 4)];
}

export function getMoodText(mood: number): string {
  const moodTexts = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
  return moodTexts[Math.min(Math.floor(mood), 4)];
}