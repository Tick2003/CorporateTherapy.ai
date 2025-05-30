import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { MoodEntry } from '../types';
import { format } from 'date-fns';

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

export function checkBurnoutRisk(moodEntries: MoodEntry[]): string {
  if (moodEntries.length < 5) return 'Low';
  
  const recentEntries = moodEntries.slice(-7);
  const averageMood = recentEntries.reduce((sum, entry) => sum + entry.value, 0) / recentEntries.length;
  
  // Calculate trend (negative trend increases risk)
  const trend = recentEntries[recentEntries.length - 1].value - recentEntries[0].value;
  
  // Calculate volatility
  const volatility = Math.sqrt(
    recentEntries.reduce((sum, entry, i, arr) => {
      if (i === 0) return sum;
      const diff = entry.value - arr[i - 1].value;
      return sum + diff * diff;
    }, 0) / (recentEntries.length - 1)
  );

  // Weighted risk score
  const riskScore = (
    (100 - averageMood) * 0.5 + // Lower mood increases risk
    Math.max(0, -trend) * 0.3 + // Negative trend increases risk
    volatility * 0.2 // High volatility increases risk
  );

  if (riskScore > 60) return 'High';
  if (riskScore > 40) return 'Medium';
  return 'Low';
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy h:mm a');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getMoodEmoji(value: number): string {
  if (value >= 80) return '😊';
  if (value >= 60) return '🙂';
  if (value >= 40) return '😐';
  if (value >= 20) return '😕';
  return '😢';
}

export function getMoodText(value: number): string {
  if (value >= 80) return 'Excellent';
  if (value >= 60) return 'Good';
  if (value >= 40) return 'Neutral';
  if (value >= 20) return 'Low';
  return 'Very Low';
}

export function scheduleNotification(title: string, body: string, time: Date): void {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      const now = new Date().getTime();
      const scheduledTime = time.getTime();
      
      setTimeout(() => {
        new Notification(title, { body });
      }, Math.max(0, scheduledTime - now));
    }
  });
}

export function scheduleDailyNotifications(): void {
  const today = new Date();
  
  // Morning notification (9 AM)
  const morning = new Date(today.setHours(9, 0, 0, 0));
  scheduleNotification(
    'Morning Check-in',
    'New day, new clarity. Want to journal?',
    morning
  );
  
  // Afternoon notification (2 PM)
  const afternoon = new Date(today.setHours(14, 0, 0, 0));
  scheduleNotification(
    'Afternoon Check-in',
    'Midday check-in: How\'s your energy?',
    afternoon
  );
  
  // Evening notification (6 PM)
  const evening = new Date(today.setHours(18, 0, 0, 0));
  scheduleNotification(
    'Evening Reflection',
    'Let\'s reflect. Log your mood?',
    evening
  );
}