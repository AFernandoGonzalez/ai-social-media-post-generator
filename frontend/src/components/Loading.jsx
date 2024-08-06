import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <BouncingLoader />
    </div>
  );
};

const BouncingLoader = () => {
  return (
    <div className="flex space-x-4">
      <motion.i
        className="fab fa-facebook-f text-gray-500 text-4xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
      />
      <motion.i
        className="fab fa-twitter text-gray-400 text-4xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut', delay: 0.1 }}
      />
      <motion.i
        className="fab fa-instagram text-gray-500 text-4xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
      />
      <motion.i
        className="fab fa-youtube text-gray-500 text-4xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
      />
    </div>
  );
};

export default Loading;
