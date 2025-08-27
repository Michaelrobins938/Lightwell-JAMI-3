import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const containerClasses = fullScreen 
    ? 'flex justify-center items-center h-screen' 
    : 'flex justify-center items-center';

  return (
    <motion.div 
      className={`${containerClasses} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className={`animate-spin rounded-full border-2 border-luna-violet/20 border-t-luna-violet ${sizeClasses[size]}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {text && (
          <motion.p 
            className="text-luna-violet font-medium text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

// Alternative loading component with dots
export const LoadingDots: React.FC<{ text?: string }> = ({ text = 'Loading' }) => (
  <motion.div className="flex items-center space-x-2">
    <span className="text-luna-violet font-medium">{text}</span>
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-luna-violet rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  </motion.div>
);

// Skeleton loading component
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
);

export default LoadingSpinner;