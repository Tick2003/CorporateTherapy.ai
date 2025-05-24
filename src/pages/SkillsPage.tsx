import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SkillsPage: React.FC = () => {
  const { skillLessons, completeSkillLesson } = useAppContext();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [streak, setStreak] = useState(3); // Mock streak count
  
  const currentLesson = skillLessons[currentLessonIndex];
  
  const handleOptionSelect = (index: number) => {
    if (hasSubmitted) return;
    setSelectedOption(index);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setHasSubmitted(true);
    
    if (selectedOption === currentLesson.quiz.correctIndex) {
      // Correct answer
      setStreak(prev => prev + 1);
      completeSkillLesson(currentLesson.id);
    } else {
      // Incorrect answer
      setStreak(0);
    }
  };
  
  const handleNextSkill = () => {
    setCurrentLessonIndex((prev) => (prev + 1) % skillLessons.length);
    setSelectedOption(null);
    setHasSubmitted(false);
  };
  
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title mb-0">Soft Skill Sprint</h1>
          
          <div className="flex items-center bg-accent-50 text-accent-800 px-3 py-1 rounded-full">
            <Trophy className="h-4 w-4 mr-1 text-accent-500" />
            <span className="text-sm font-medium">{streak} Day Streak</span>
          </div>
        </div>
        
        <div className="card mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{currentLesson.title}</h2>
            <div className="text-sm text-gray-500">
              Lesson {currentLessonIndex + 1}/{skillLessons.length}
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none text-gray-700 mb-6 whitespace-pre-line">
            {currentLesson.content}
          </div>
        </div>
        
        <div className="card mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Check</h3>
          
          <div className="mb-4">
            <p className="text-gray-800 mb-3">{currentLesson.quiz.question}</p>
            
            <div className="space-y-2">
              {currentLesson.quiz.options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-3 rounded-lg border ${
                    selectedOption === index
                      ? hasSubmitted
                        ? index === currentLesson.quiz.correctIndex
                          ? 'border-success-300 bg-success-50'
                          : 'border-error-300 bg-error-50'
                        : 'border-primary-300 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } transition-colors`}
                  onClick={() => handleOptionSelect(index)}
                  disabled={hasSubmitted}
                >
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    
                    {hasSubmitted && index === currentLesson.quiz.correctIndex && (
                      <CheckCircle className="h-5 w-5 text-success-500" />
                    )}
                    
                    {hasSubmitted && selectedOption === index && index !== currentLesson.quiz.correctIndex && (
                      <XCircle className="h-5 w-5 text-error-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {hasSubmitted ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                selectedOption === currentLesson.quiz.correctIndex
                  ? 'bg-success-50 border border-success-200'
                  : 'bg-error-50 border border-error-200'
              }`}>
                <div className={`font-medium ${
                  selectedOption === currentLesson.quiz.correctIndex
                    ? 'text-success-800'
                    : 'text-error-800'
                }`}>
                  {selectedOption === currentLesson.quiz.correctIndex
                    ? 'Correct!'
                    : 'Not quite right'}
                </div>
                <p className="text-sm mt-1">
                  {currentLesson.quiz.explanation}
                </p>
              </div>
              
              <button
                className="btn btn-primary w-full"
                onClick={handleNextSkill}
              >
                Next Skill
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary w-full"
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
            >
              Check Answer
            </button>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Skills Progress</h3>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${(skillLessons.filter(l => l.completed).length / skillLessons.length) * 100}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-600 flex justify-between">
            <span>{skillLessons.filter(l => l.completed).length} completed</span>
            <span>{skillLessons.length} total</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SkillsPage;