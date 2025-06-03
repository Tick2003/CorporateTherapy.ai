import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { sendChatMessage } from '../lib/chat';
import { canAccessChat } from '../lib/subscription';

const VentPage: React.FC = () => {
  const { chatHistory, addChatMessage, user } = useAppContext();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canChat = canAccessChat(user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent form submission from scrolling
    if (!message.trim() || !canChat || isLoading) return;
    
    // Add user message
    addChatMessage({ text: message, isUser: true });
    setMessage('');
    setIsLoading(true);
    
    try {
      const response = await sendChatMessage(chatHistory);
      addChatMessage({ text: response, isUser: false });
    } catch (error) {
      console.error('Chat error:', error);
      addChatMessage({
        text: "I apologize, but I'm having trouble responding right now. Please try again.",
        isUser: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToJournal = (text: string) => {
    // In a real app, this would navigate to journal and pre-fill
    console.log('Adding to journal:', text);
  };

  if (!canChat) {
    return (
      <div className="page-container max-w-3xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trial Period Ended</h2>
          <p className="text-gray-600 mb-6">
            Upgrade your plan to continue accessing AI chat support
          </p>
          <a href="/profile" className="btn btn-primary">
            View Plans
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="page-title">Vent to AI</h1>
        
        <div className="card mb-4 p-0 flex flex-col h-[60vh]">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-t-lg p-4 border-b border-primary-200">
            <h2 className="text-primary-800 font-semibold">AI Therapist Chat</h2>
            <p className="text-sm text-primary-700">
              Share what's on your mind. I'm here to listen and support you.
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg p-3 max-w-[80%] ${
                    msg.isUser 
                      ? 'bg-primary-100 text-primary-900' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  
                  {!msg.isUser && (
                    <button 
                      onClick={() => handleAddToJournal(msg.text)}
                      className="mt-2 text-xs text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to journal
                    </button>
                  )}
                  
                  <div className="text-xs mt-1 text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button 
                type="button"
                className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-primary-50"
                aria-label="Voice input"
              >
                <Mic className="h-5 w-5" />
              </button>
              
              <input
                type="text"
                className="input flex-1"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!message.trim() || isLoading}
                className="p-2 bg-primary-600 text-white rounded-full disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </form>
        </div>
        
        <div className="text-sm text-gray-500 text-center">
          <p>Your conversations are private and not stored beyond your current session.</p>
          <p className="mt-1">If you're experiencing a crisis, please reach out to a mental health professional.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default VentPage;