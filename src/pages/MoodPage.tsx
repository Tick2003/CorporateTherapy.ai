import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Info, Save, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getMoodEmoji, getMoodText, format, subDays, eachDayOfInterval } from '../lib/utils';
import BurnoutAlert from '../components/ui/BurnoutAlert';

const MoodPage: React.FC = () => {
  const { moodEntries, addMoodEntry, currentBurnoutRisk } = useAppContext();
  const [moodValue, setMoodValue] = useState(70);
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  
  // Get date range for selected timeframe
  const getDateRange = () => {
    const end = new Date();
    const start = subDays(end, timeframe === 'week' ? 7 : 30);
    return { start, end };
  };

  // Generate chart data with all days (including empty ones)
  const generateChartData = () => {
    const { start, end } = getDateRange();
    const allDays = eachDayOfInterval({ start, end });
    
    return allDays.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = moodEntries.find(e => e.date === dateStr);
      return {
        date: format(date, 'MMM d'),
        value: entry?.value ?? null,
        burnoutRisk: entry?.value ? Math.max(0, 100 - entry.value) : null
      };
    });
  };

  const chartData = generateChartData();
  
  // Calculate statistics
  const stats = {
    averageMood: Math.round(
      chartData.reduce((sum, day) => sum + (day.value || 0), 0) / 
      chartData.filter(day => day.value !== null).length
    ),
    highestMood: Math.max(...chartData.map(day => day.value || 0)),
    lowestMood: Math.min(...chartData.filter(day => day.value !== null).map(day => day.value!)),
    entriesCount: chartData.filter(day => day.value !== null).length
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value;
      const burnoutValue = payload[1]?.value;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="font-medium text-gray-900">{label}</p>
          {moodValue !== null && (
            <div className="mt-1">
              <p className="text-sm text-gray-600">
                Mood: {getMoodText(moodValue)} {getMoodEmoji(moodValue)}
              </p>
              <p className="text-sm text-gray-600">
                Score: {moodValue}/100
              </p>
              {burnoutValue !== null && (
                <p className="text-sm text-error-600">
                  Burnout Risk: {Math.round(burnoutValue)}%
                </p>
              )}
            </div>
          )}
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title mb-0">Mood Analytics</h1>
          
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                timeframe === 'week'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setTimeframe('week')}
            >
              Week
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                timeframe === 'month'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setTimeframe('month')}
            >
              Month
            </button>
          </div>
        </div>

        {currentBurnoutRisk !== 'Low' && <BurnoutAlert />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Mood & Burnout Trends</h2>
                <div className="text-sm text-gray-500">
                  Last {timeframe === 'week' ? '7' : '30'} days
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      tickCount={6}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#818cf8"
                      strokeWidth={2}
                      fill="url(#moodGradient)"
                      dot={{ r: 4, fill: "#818cf8", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#6366f1", strokeWidth: 0 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="burnoutRisk"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="url(#burnoutGradient)"
                      dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#dc2626", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-500">Average</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {stats.averageMood}%
                </div>
                <div className="text-sm text-gray-600">
                  Mean mood score
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-success-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-success-600" />
                  </div>
                  <span className="text-sm text-gray-500">Peak</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {stats.highestMood}%
                </div>
                <div className="text-sm text-gray-600">
                  Highest mood
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-warning-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-warning-600 transform rotate-180" />
                  </div>
                  <span className="text-sm text-gray-500">Low</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {stats.lowestMood}%
                </div>
                <div className="text-sm text-gray-600">
                  Lowest mood
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-secondary-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-secondary-600" />
                  </div>
                  <span className="text-sm text-gray-500">Entries</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {stats.entriesCount}
                </div>
                <div className="text-sm text-gray-600">
                  Total logs
                </div>
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
                  onChange={(e) => setMoodValue(parseInt(e.target.value))}
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
                className="btn btn-primary w-full flex items-center justify-center"
                onClick={() => addMoodEntry(moodValue)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Today's Mood
              </motion.button>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-4 border border-primary-100">
              <h4 className="font-medium text-gray-900 mb-3">Mood Insights</h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Your mood tends to be highest on weekends</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Morning entries show better mood scores</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Consider journaling on low-mood days</span>
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