import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Loading = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-dark-background' : 'bg-light-background'}`}>
      <BouncingLoader />
    </div>
  );
};

const BouncingLoader = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex space-x-4">
      <motion.i
        className={`fab fa-facebook-f ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} text-4xl`}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
      />
      <motion.i
        className={`fab fa-twitter ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} text-4xl`}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut', delay: 0.1 }}
      />
      <motion.i
        className={`fab fa-instagram ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} text-4xl`}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
      />
      <motion.i
        className={`fab fa-youtube ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} text-4xl`}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
      />
    </div>
  );
};

export default Loading;
