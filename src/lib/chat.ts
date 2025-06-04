import type { ChatMessage } from '../types';
import { auth } from './firebase';

export async function sendChatMessage(chatHistory: ChatMessage[]): Promise<string> {
  try {
    // Get the current user's ID token
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const token = await user.getIdToken();

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ messages: chatHistory }),
    });

    if (!response.ok) {
      throw new Error('Failed to get chat response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}