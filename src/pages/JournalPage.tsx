import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, RefreshCw, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { format, truncateText } from '../lib/utils';
import { useAppContext } from '../context/AppContext';
import BurnoutAlert from '../components/ui/BurnoutAlert';

const JournalPage: React.FC = () => {
  const { journalEntries, addJournalEntry, updateJournalEntry, currentBurnoutRisk } = useAppContext();
  const [journalText, setJournalText] = useState('');
  const [isReframing, setIsReframing] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;
    
    addJournalEntry({ content: journalText });
    setJournalText('');
    
    // Simulate reframing process
    setIsReframing(true);
    setTimeout(() => {
      // In a real app, this would call an AI API
      const reframes = [
        "While today presented challenges, I notice you practiced resilience by persisting through difficult tasks. Consider how this strengthens your professional capabilities over time.",
        "I see that you're experiencing frustration, which shows you care deeply about your work. This passion, when channeled constructively, can drive meaningful improvements.",
        "The obstacles you faced today are temporary learning opportunities. Each challenge is developing problem-solving skills that will serve you throughout your career.",
        "You've identified specific workplace tensions, which demonstrates your emotional intelligence. This awareness can be leveraged to improve team dynamics and communication.",
        "Your reflection shows conscientiousness about your performance. Remember that growth isn't linear—today's struggles are building tomorrow's strengths."
      ];
      
      const randomReframe = reframes[Math.floor(Math.random() * reframes.length)];
      
      // Update the most recent entry with the reframe
      const latestEntry = journalEntries[0];
      if (latestEntry) {
        updateJournalEntry(latestEntry.id, randomReframe);
      }
      
      setIsReframing(false);
    }, 2000);
  };

  const toggleEntryExpansion = (id: string) => {
    if (expandedEntryId === id) {
      setExpandedEntryId(null);
    } else {
      setExpandedEntryId(id);
    }
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="page-title">Journaling Zone</h1>
        
        {currentBurnoutRisk !== 'Low' && <BurnoutAlert />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-2 rounded-full mr-3">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Mind Dump</h2>
              </div>
              
              <form onSubmit={handleSubmit}>
                <textarea
                  className="textarea mb-4"
                  rows={6}
                  placeholder="How was work today? What's on your mind?"
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  required
                ></textarea>
                
                <div className="flex justify-end">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="btn btn-primary flex items-center"
                    disabled={!journalText.trim() || isReframing}
                  >
                    {isReframing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Reframing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reframe my thoughts
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
            
            {journalEntries.length > 0 && journalEntries[0].reframe && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="card mb-6 bg-secondary-50 border border-secondary-100"
              >
                <h3 className="text-lg font-medium text-secondary-900 mb-2">Positive Reframe</h3>
                <p className="text-secondary-800">{journalEntries[0].reframe}</p>
                
                <div className="mt-4 flex justify-end">
                  <button className="btn btn-outline text-secondary-700 border-secondary-300 hover:bg-secondary-100 flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save to favorites
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          <div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Journal History</h3>
              
              {journalEntries.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p>Your journal entries will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {journalEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      className="border border-gray-200 rounded-lg p-3 hover:border-primary-200 cursor-pointer"
                      onClick={() => toggleEntryExpansion(entry.id)}
                      whileHover={{ x: 3 }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {format(entry.date, 'PPP')}
                        </div>
                        
                        {entry.burnoutLevel && (
                          <div className={`text-xs px-2 py-0.5 rounded-full ${
                            entry.burnoutLevel === 'High' 
                              ? 'bg-error-100 text-error-800' 
                              : entry.burnoutLevel === 'Medium'
                                ? 'bg-warning-100 text-warning-800'
                                : 'bg-success-100 text-success-800'
                          }`}>
                            {entry.burnoutLevel} Burnout
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-1 text-sm text-gray-600">
                        {expandedEntryId === entry.id 
                          ? entry.content 
                          : truncateText(entry.content, 100)}
                      </div>
                      
                      {entry.reframe && expandedEntryId === entry.id && (
                        <div className="mt-2 p-2 bg-secondary-50 rounded text-xs text-secondary-800">
                          <div className="font-medium mb-1">Reframe:</div>
                          {entry.reframe}
                        </div>
                      )}
                      
                      <div className="mt-2 flex justify-end text-primary-600">
                        {expandedEntryId === entry.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JournalPage;