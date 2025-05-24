import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  ChatMessage, 
  JournalEntry, 
  SkillLesson, 
  MoodEntry, 
  AudioBoost
} from '../types';
import { checkBurnoutRisk } from '../lib/utils';

// Sample data
const sampleUser: User = {
  id: '1',
  name: 'Rahul',
  isPremium: false,
  audioPlaysToday: 0,
  preferences: {
    language: 'english',
    notifications: true,
  },
};

const sampleChatHistory: ChatMessage[] = [
  {
    id: '1',
    text: "Hey there! How's your day going at work?",
    isUser: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    text: "It's been pretty stressful with the new project deadline.",
    isUser: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
  },
  {
    id: '3',
    text: "I hear you. Deadlines can be overwhelming. Let's break this down - what's the most challenging part right now?",
    isUser: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
  },
];

const sampleJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    content: "Today my manager gave me more work even though I told him I'm already swamped. I feel like I'm drowning in tasks and nobody seems to care.",
    reframe: "I had the courage to communicate my workload concerns. While the outcome wasn't ideal, I practiced self-advocacy, which is growth. I can try scheduling a more focused meeting about workload balancing tomorrow.",
    burnoutLevel: 'Medium',
  },
];

const sampleSkillLessons: SkillLesson[] = [
  {
    id: '1',
    title: 'Setting Healthy Boundaries',
    content: `
      Setting boundaries at work is essential for your wellbeing and productivity. Here are three simple ways to establish healthy boundaries:
      
      1. Be clear and direct about your capacity
      2. Use "I" statements when communicating limits
      3. Schedule focused work time on your calendar
      
      Remember, setting boundaries isn't selfish - it helps you deliver your best work sustainably.
    `,
    quiz: {
      question: "What's an effective way to communicate a boundary to a colleague who frequently interrupts your work?",
      options: [
        "Ignore their messages and hope they stop",
        "Say: 'I'd like to help, but I need to finish this task first. Can we talk at 2pm?'",
        "Complain to your manager about the interruptions",
        "Take on their request but work late to finish your own tasks"
      ],
      correctIndex: 1,
      explanation: "Using clear, respectful communication that acknowledges their needs while protecting your time is the most effective approach to setting boundaries."
    },
    completed: false,
  },
  {
    id: '2',
    title: 'Effective Email Communication',
    content: `
      Email overwhelm is a common workplace stressor. These strategies can help you communicate more effectively:
      
      1. Use clear, specific subject lines
      2. Start with your main point or request
      3. Format using bullets and short paragraphs
      4. End with clear next steps or expectations
      
      Mastering email communication can save you hours each week and reduce miscommunication stress.
    `,
    quiz: {
      question: "Which of these is the most effective email subject line?",
      options: [
        "Hello",
        "Quick question",
        "Project update - decision needed by Friday",
        "URGENT!!!"
      ],
      correctIndex: 2,
      explanation: "The best subject lines are specific, informative, and include any relevant deadlines or actions needed."
    },
    completed: false,
  },
];

const sampleMoodEntries: MoodEntry[] = [
  { id: '1', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], value: 75 },
  { id: '2', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], value: 80 },
  { id: '3', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], value: 65 },
  { id: '4', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], value: 50 },
  { id: '5', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], value: 45 },
  { id: '6', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], value: 40 },
];

const sampleAudioBoosts: AudioBoost[] = [
  {
    id: '1',
    title: 'Pre-Meeting Confidence Boost',
    category: 'Before tough call',
    duration: '2:15',
    isPremium: false,
    audioUrl: '#',
  },
  {
    id: '2',
    title: 'Midday Energy Renewal',
    category: 'Midday motivation',
    duration: '1:45',
    isPremium: false,
    audioUrl: '#',
  },
  {
    id: '3',
    title: 'Handling Difficult Feedback',
    category: 'Tough situations',
    duration: '3:20',
    isPremium: true,
    audioUrl: '#',
  },
  {
    id: '4',
    title: 'End of Day Decompression',
    category: 'Wind down',
    duration: '4:10',
    isPremium: true,
    audioUrl: '#',
  },
];

interface AppContextType {
  user: User;
  updateUser: (user: User) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  updateJournalEntry: (id: string, reframe: string) => void;
  skillLessons: SkillLesson[];
  completeSkillLesson: (id: string) => void;
  moodEntries: MoodEntry[];
  addMoodEntry: (value: number) => void;
  audioBoosts: AudioBoost[];
  playAudioBoost: (id: string) => boolean;
  currentBurnoutRisk: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(sampleUser);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(sampleChatHistory);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(sampleJournalEntries);
  const [skillLessons, setSkillLessons] = useState<SkillLesson[]>(sampleSkillLessons);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(sampleMoodEntries);
  const [audioBoosts, setAudioBoosts] = useState<AudioBoost[]>(sampleAudioBoosts);
  const [currentBurnoutRisk, setCurrentBurnoutRisk] = useState<string>('Low');

  // Update burnout risk when mood entries change
  useEffect(() => {
    const risk = checkBurnoutRisk(moodEntries);
    setCurrentBurnoutRisk(risk);
  }, [moodEntries]);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, newMessage]);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date(),
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  const updateJournalEntry = (id: string, reframe: string) => {
    setJournalEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, reframe } : entry
      )
    );
  };

  const completeSkillLesson = (id: string) => {
    setSkillLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id ? { ...lesson, completed: true } : lesson
      )
    );
  };

  const addMoodEntry = (value: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if there's already an entry for today
    const existingEntryIndex = moodEntries.findIndex(entry => entry.date === today);
    
    if (existingEntryIndex !== -1) {
      // Update existing entry
      setMoodEntries(prev => {
        const updated = [...prev];
        updated[existingEntryIndex] = { ...updated[existingEntryIndex], value };
        return updated;
      });
    } else {
      // Add new entry
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: today,
        value,
      };
      setMoodEntries((prev) => [...prev, newEntry]);
    }
  };

  const playAudioBoost = (id: string): boolean => {
    const boost = audioBoosts.find((b) => b.id === id);
    
    if (!boost) return false;
    
    // Check if premium content
    if (boost.isPremium && !user.isPremium) {
      return false;
    }
    
    // Check free user limits
    if (!user.isPremium && user.audioPlaysToday >= 2) {
      return false;
    }
    
    // Increment play count
    setUser((prev) => ({
      ...prev,
      audioPlaysToday: prev.audioPlaysToday + 1,
    }));
    
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        chatHistory,
        addChatMessage,
        journalEntries,
        addJournalEntry,
        updateJournalEntry,
        skillLessons,
        completeSkillLesson,
        moodEntries,
        addMoodEntry,
        audioBoosts,
        playAudioBoost,
        currentBurnoutRisk,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};