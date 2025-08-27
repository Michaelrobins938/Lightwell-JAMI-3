import React from 'react';
import { motion } from 'framer-motion';

interface ChatGPTToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  position?: 'left' | 'right';
}

export const ChatGPTToggle: React.FC<ChatGPTToggleProps> = ({
  isCollapsed,
  onToggle,
  position = 'left'
}) => {
  if (!isCollapsed) return null;

  return (
    <motion.button
      onClick={onToggle}
      className={`fixed ${position === 'left' ? 'top-4 left-4' : 'top-4 right-4'} z-50 
                 p-2.5 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 
                 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                 transition-all duration-200 hover:shadow-lg`}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
        />
      </svg>
    </motion.button>
  );
};