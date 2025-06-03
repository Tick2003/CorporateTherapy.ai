import type { ChatMessage } from '../types';

export async function sendChatMessage(chatHistory: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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