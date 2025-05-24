import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Info, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getMoodEmoji, getMoodText } from '../lib/utils';
import BurnoutAlert from '../components/ui/BurnoutAlert';

const MoodPage: React.FC = () => {
  const { moodEntries, addMoodEntry, currentBurnoutRisk } = useAppContext();
  const [moodValue, setMoodValue] = useState(70);
  
  // Format data for chart
  const chartData = [...moodEntries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: entry.value,
    }));
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoodValue(parseInt(e.target.value));
  };
  
  const handleSaveMood = () => {
    addMoodEntry(moodValue);
    
    // Show a success message or animation
    const saveButton = document.getElementById('save-mood-button');
    if (saveButton) {
      saveButton.innerText = 'Saved!';
      setTimeout(() => {
        saveButton.innerText = 'Save Today\'s Mood';
      }, 2000);
    }
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="mb-1">{payload[0].payload.date}</p>
          <p className="font-medium">{getMoodText(value)} {getMoodEmoji(value)}</p>
          <p>Score: {value}/100</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="page-title">Mood Tracker</h1>
        
        {currentBurnoutRisk !== 'Low' && <BurnoutAlert />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mood History</h2>
              
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fontSize: 12 }}
                        tickCount={6}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#4f46e5", strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <p>No mood data available yet. Start tracking your mood!</p>
                </div>
              )}
            </div>
            
            <div className="card">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Burnout Risk Analysis</h3>
                <div className="ml-2 text-gray-500 cursor-help">
                  <Info className="h-4 w-4" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-4 rounded-lg ${
                  currentBurnoutRisk === 'Low' 
                    ? 'bg-success-50 border border-success-100 text-success-900' 
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  <div className="text-lg font-medium">Low</div>
                  <div className="text-sm">Maintaining wellbeing</div>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  currentBurnoutRisk === 'Medium' 
                    ? 'bg-warning-50 border border-warning-100 text-warning-900' 
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  <div className="text-lg font-medium">Medium</div>
                  <div className="text-sm">Watch for signs</div>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  currentBurnoutRisk === 'High' 
                    ? 'bg-error-50 border border-error-100 text-error-900' 
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  <div className="text-lg font-medium">High</div>
                  <div className="text-sm">Take action</div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Burnout risk is calculated based on your mood trend over the past week.</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="card mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Mood</h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">
                  {getMoodEmoji(moodValue)}
                </div>
                <div className="text-xl font-medium text-gray-900">
                  {getMoodText(moodValue)}
                </div>
                <div className="text-sm text-gray-600">
                  Score: {moodValue}/100
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Struggling</span>
                  <span>Great</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={moodValue}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mood-slider"
                />
                <div className="flex justify-between text-2xl mt-1">
                  <span>😩</span>
                  <span>😔</span>
                  <span>😐</span>
                  <span>😊</span>
                  <span>😃</span>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.97 }}
                id="save-mood-button"
                className="btn btn-primary w-full flex items-center justify-center"
                onClick={handleSaveMood}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Today's Mood
              </motion.button>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
              <h4 className="font-medium text-primary-900 mb-2">Mood Tracking Tips</h4>
              <ul className="space-y-2 text-sm text-primary-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Track your mood at the same time each day for consistency</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Note any specific events that influenced your mood</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use journaling alongside mood tracking for deeper insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MoodPage;