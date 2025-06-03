import type { ChatMessage } from '../types';

// Therapy-focused response patterns
const patterns = [
  {
    keywords: ['stress', 'overwhelm', 'pressure', 'too much'],
    responses: [
      "It sounds like you're dealing with a lot of pressure. Can you tell me what specific aspects of work are feeling most overwhelming?",
      "I hear that you're feeling stressed. Let's break this down into smaller, more manageable parts. What's your most immediate concern?",
      "That sounds really challenging. Have you been able to take any breaks or practice self-care during your workday?"
    ]
  },
  {
    keywords: ['manager', 'boss', 'supervisor', 'lead'],
    responses: [
      "Relationships with managers can be complex. How long has this situation been affecting you?",
      "That's a challenging situation with your manager. Have you had a chance to discuss your concerns with them directly?",
      "Managing up can be tricky. What kind of support or changes would help improve the situation?"
    ]
  },
  {
    keywords: ['colleague', 'coworker', 'team', 'peer'],
    responses: [
      "Team dynamics can significantly impact our wellbeing. How are these interactions affecting your work?",
      "It's important to maintain professional relationships while setting healthy boundaries. What strategies have you tried so far?",
      "Working with others can be challenging. What would an ideal resolution look like for you?"
    ]
  },
  {
    keywords: ['tired', 'exhausted', 'burnout', 'fatigue'],
    responses: [
      "I'm hearing signs of potential burnout. Have you noticed any changes in your energy levels or motivation recently?",
      "It's important to recognize when we need rest. What opportunities do you have to recharge during your workday?",
      "Taking care of yourself is crucial. What small changes could you make to your routine to help manage your energy better?"
    ]
  }
];

// Default responses when no pattern matches
const defaultResponses = [
  "Can you tell me more about how this situation is affecting you?",
  "That sounds challenging. What support would be most helpful right now?",
  "I'm here to listen. How long have you been feeling this way?",
  "Thank you for sharing that. What aspects of this situation feel most pressing to address?",
  "It takes courage to open up about these feelings. What would you like to focus on first?"
];

function findMatchingPattern(message: string): string[] {
  const lowercaseMessage = message.toLowerCase();
  
  for (const pattern of patterns) {
    if (pattern.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return pattern.responses;
    }
  }
  
  return defaultResponses;
}

function getRandomResponse(responses: string[]): string {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  // Get the latest user message
  const lastMessage = messages[messages.length - 1];
  
  if (!lastMessage.isUser) {
    throw new Error('Invalid message sequence');
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find matching responses and select one randomly
  const matchingResponses = findMatchingPattern(lastMessage.text);
  return getRandomResponse(matchingResponses);
}