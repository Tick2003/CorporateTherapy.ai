import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { getBurnoutTip } from '../../lib/utils';

const BurnoutAlert: React.FC = () => {
  const { currentBurnoutRisk } = useAppContext();
  
  if (currentBurnoutRisk === 'Low') {
    return null;
  }
  
  const getAlertColor = () => {
    switch (currentBurnoutRisk) {
      case 'High':
        return 'bg-error-50 border-error-200 text-error-800';
      case 'Medium':
        return 'bg-warning-50 border-warning-200 text-warning-800';
      default:
        return 'bg-info-50 border-info-200 text-info-800';
    }
  };
  
  const getIcon = () => {
    switch (currentBurnoutRisk) {
      case 'High':
        return <AlertTriangle className="h-5 w-5 text-error-500" />;
      case 'Medium':
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      default:
        return <Info className="h-5 w-5 text-info-500" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`rounded-md border p-4 mb-6 ${getAlertColor()}`}
    >
      <motion.div 
        className="flex"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <motion.div 
          className="flex-shrink-0"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
        >
          {getIcon()}
        </motion.div>
        <div className="ml-3">
          <motion.h3 
            className="text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {currentBurnoutRisk === 'High' 
              ? 'Burnout Warning' 
              : 'Burnout Risk Alert'}
          </motion.h3>
          <motion.div 
            className="mt-2 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p>Your current burnout risk score is {currentBurnoutRisk}. {getBurnoutTip()}</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BurnoutAlert;