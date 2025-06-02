import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Lock, Info, Volume2, Upload } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { uploadAudio } from '../lib/supabase';

const AudioPage: React.FC = () => {
  const { audioBoosts, playAudioBoost, user } = useAppContext();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [showingPremiumInfo, setShowingPremiumInfo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Group audio boosts by category
  const audioByCategory = audioBoosts.reduce((acc, audio) => {
    if (!acc[audio.category]) {
      acc[audio.category] = [];
    }
    acc[audio.category].push(audio);
    return acc;
  }, {} as Record<string, typeof audioBoosts>);
  
  const handlePlayAudio = (id: string) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
      return;
    }
    
    const canPlay = playAudioBoost(id);
    
    if (canPlay) {
      setCurrentlyPlaying(id);
      
      setTimeout(() => {
        setCurrentlyPlaying(null);
      }, 5000);
    } else {
      setShowingPremiumInfo(true);
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const audioUrl = await uploadAudio(file);
      console.log('Uploaded audio URL:', audioUrl);
      // Here you would typically update your audioBoosts array with the new audio
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);
  
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title mb-0">Audio Boosts</h1>
          
          {user.isPremium && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Audio'}
            </button>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileUpload}
        />
        
        {!user.isPremium && (
          <div className="card mb-6 bg-accent-50 border border-accent-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <Info className="h-5 w-5 text-accent-700" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-accent-800">Free Usage Limit</h3>
                <div className="mt-2 text-sm text-accent-700">
                  <p>You have {2 - user.audioPlaysToday} audio plays remaining today.</p>
                  <p className="mt-1">Upgrade to premium for unlimited audio boosts.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-8">
          {Object.entries(audioByCategory).map(([category, audios]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{category}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {audios.map((audio) => (
                  <div
                    key={audio.id}
                    className={`card p-4 border ${
                      currentlyPlaying === audio.id
                        ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/50'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{audio.title}</h3>
                      {audio.isPremium && !user.isPremium && (
                        <div className="bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 px-2 py-0.5 text-xs rounded-full font-medium flex items-center">
                          <Lock className="h-3 w-3 mr-1" />
                          Premium
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {audio.duration} • {audio.category}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        className={`p-3 rounded-full ${
                          currentlyPlaying === audio.id
                            ? 'bg-primary-500 text-white'
                            : audio.isPremium && !user.isPremium
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handlePlayAudio(audio.id)}
                        disabled={audio.isPremium && !user.isPremium}
                      >
                        {currentlyPlaying === audio.id ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </button>
                      
                      {currentlyPlaying === audio.id && (
                        <div className="flex-1 ml-3">
                          <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="absolute top-0 left-0 h-full bg-primary-500"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 5, ease: "linear" }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>0:00</span>
                            <span>{audio.duration}</span>
                          </div>
                        </div>
                      )}
                      
                      {currentlyPlaying !== audio.id && (
                        <div className="flex items-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">Preview</div>
                          <Volume2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {showingPremiumInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Upgrade to Premium</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You've reached your free audio plays limit or this is a premium-only audio boost.
              </p>
              <div className="bg-accent-50 dark:bg-accent-900/50 p-4 rounded-lg mb-4 border border-accent-100 dark:border-accent-800">
                <h4 className="font-medium text-accent-900 dark:text-accent-200 mb-2">Premium Benefits:</h4>
                <ul className="space-y-1 text-sm text-accent-800 dark:text-accent-300">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Unlimited audio boosts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Downloadable audio files</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Access to exclusive premium content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Advanced burnout tracking</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowingPremiumInfo(false)}
                >
                  Not Now
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowingPremiumInfo(false);
                    window.location.href = '/profile';
                  }}
                >
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AudioPage;