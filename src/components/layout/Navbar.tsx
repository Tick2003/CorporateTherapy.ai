import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAppContext();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/vent', label: 'Vent to AI' },
    { path: '/journal', label: 'Journaling' },
    { path: '/skills', label: 'Soft Skills' },
    { path: '/mood', label: 'Mood Tracker' },
    { path: '/audio', label: 'Audio Boost' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary-600 dark:text-primary-400">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            <span>CorporateTherapy.ai</span>
          </Link>

          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.button>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                } transition-colors duration-200`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Premium badge for desktop */}
          <div className="hidden md:block">
            {user.isPremium ? (
              <span className="bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Premium
              </span>
            ) : (
              <Link 
                to="/profile" 
                className="text-xs px-2 py-1 rounded-full font-medium bg-gradient-to-r from-accent-500 to-primary-500 text-white flex items-center"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                } transition-colors duration-200`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Premium badge for mobile */}
            <div className="pt-2 mt-3 border-t border-gray-200 dark:border-gray-700">
              {user.isPremium ? (
                <span className="block px-3 py-2 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 rounded-md text-sm font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Premium Account
                </span>
              ) : (
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 bg-gradient-to-r from-accent-500 to-primary-500 text-white rounded-md text-sm font-medium flex items-center"
                  onClick={closeMenu}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;