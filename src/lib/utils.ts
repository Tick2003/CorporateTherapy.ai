import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getMoodEmoji(value: number): string {
  const emojis = ['😩', '😔', '😐', '😊', '😃'];
  // Convert 0-100 scale to 0-4 index
  const index = Math.min(Math.floor(value / 25), 4);
  return emojis[index];
}

export function getMoodText(value: number): string {
  if (value < 20) return 'Struggling';
  if (value < 40) return 'Down';
  if (value < 60) return 'Okay';
  if (value < 80) return 'Good';
  return 'Great';
}

export function checkBurnoutRisk(moodHistory: {date: string, value: number}[]): string {
  if (moodHistory.length < 3) return 'Low';
  
  const recentMoods = moodHistory.slice(-3);
  const avgMood = recentMoods.reduce((sum, mood) => sum + mood.value, 0) / recentMoods.length;
  
  if (avgMood < 30) return 'High';
  if (avgMood < 50) return 'Medium';
  return 'Low';
}

export function getBurnoutTip(risk: string): string {
  if (risk === 'High') {
    return 'Consider taking a day off to recharge. Your wellbeing matters.';
  }
  if (risk === 'Medium') {
    return 'Try scheduling short breaks throughout your day to prevent burnout.';
  }
  return 'Keep up the good work! Regular self-care helps maintain your wellbeing.';
}