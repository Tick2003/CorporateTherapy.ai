import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, to, className }) => {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -5 }}
        className={cn(
          "bg-white rounded-xl shadow-md p-6 h-full border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-200",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center p-2 bg-primary-100 rounded-lg text-primary-600">
              {icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm flex-grow">{description}</p>
          <div className="mt-4 text-primary-600 text-sm font-medium flex items-center">
            <span>Get started</span>
            <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default FeatureCard;