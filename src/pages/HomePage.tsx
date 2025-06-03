import React from 'react';
import { motion } from 'framer-motion';
import { Brain, PenLine, Dumbbell, BarChart3, Headphones, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import FeatureCard from '../components/ui/FeatureCard';
import BurnoutAlert from '../components/ui/BurnoutAlert';
import { getGreeting } from '../lib/utils';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { user, currentBurnoutRisk } = useAppContext();

  const features = [
    {
      title: "🧠 Vent to AI",
      description: "Talk through work challenges with a supportive AI therapist who listens and provides guidance.",
      icon: <Brain className="h-6 w-6" />,
      to: "/vent"
    },
    {
      title: "✍️ Journaling Zone",
      description: "Unload your thoughts and get AI-powered positive reframing to gain new perspectives.",
      icon: <PenLine className="h-6 w-6" />,
      to: "/journal"
    },
    {
      title: "💪 Soft Skill Sprint",
      description: "Build essential workplace skills with bite-sized daily lessons and quick quizzes.",
      icon: <Dumbbell className="h-6 w-6" />,
      to: "/skills"
    },
    {
      title: "📊 Mood Tracker",
      description: "Monitor your emotional wellbeing over time and receive early burnout warnings.",
      icon: <BarChart3 className="h-6 w-6" />,
      to: "/mood"
    },
    {
      title: "🎧 Audio Boost",
      description: "Get quick motivational pick-me-ups for specific workplace scenarios.",
      icon: <Headphones className="h-6 w-6" />,
      to: "/audio"
    },
    {
      title: "👤 Profile",
      description: "Manage your account, preferences, and explore premium features.",
      icon: <User className="h-6 w-6" />,
      to: "/profile"
    }
  ];

  const quickActions = [
    {
      icon: <Brain className="h-5 w-5 text-primary-600" />,
      label: "Quick Vent",
      to: "/vent",
      bgColor: "bg-primary-100"
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-secondary-600" />,
      label: "Log Mood",
      to: "/mood",
      bgColor: "bg-secondary-100"
    },
    {
      icon: <Headphones className="h-5 w-5 text-accent-600" />,
      label: "Audio Boost",
      to: "/audio",
      bgColor: "bg-accent-100"
    },
    {
      icon: <Dumbbell className="h-5 w-5 text-success-600" />,
      label: "Today's Skill",
      to: "/skills",
      bgColor: "bg-success-100"
    }
  ];

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section className="mb-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {getGreeting()}, {user.name}!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              How's work feeling today? Vent, journal, or skill up.
            </p>
          </div>
          
          {currentBurnoutRisk !== 'Low' && <BurnoutAlert />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                to={feature.to}
              />
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 shadow-sm border border-primary-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Today's Insight</h2>
            <p className="text-gray-700 mb-4">
              "Small moments of self-care throughout your workday can significantly improve your focus and wellbeing. Try the 'breathe and reset' technique when switching between tasks."
            </p>
            <Link to="/skills" className="btn btn-primary">
              Try a Quick Breathing Exercise
            </Link>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="block"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex flex-col items-center justify-center text-center h-full"
                >
                  <div className={`${action.bgColor} p-2 rounded-full mb-2`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{action.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default HomePage;