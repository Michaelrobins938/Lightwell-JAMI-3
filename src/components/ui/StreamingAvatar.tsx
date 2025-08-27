// Streaming Avatar Component with Skeleton Loaders
// Animated avatar that shows different states during AI interactions

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StreamingAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  state?: 'idle' | 'thinking' | 'responding' | 'listening' | 'error';
  isStreaming?: boolean;
  className?: string;
  showSkeleton?: boolean;
  avatarUrl?: string;
  name?: string;
}

export const StreamingAvatar: React.FC<StreamingAvatarProps> = ({
  size = 'md',
  state = 'idle',
  isStreaming = false,
  className = '',
  showSkeleton = false,
  avatarUrl,
  name = 'Luna AI',
}) => {
  const [dots, setDots] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  // Animated dots for thinking state
  useEffect(() => {
    if (state === 'thinking') {
      const interval = setInterval(() => {
        setDots(prev => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setDots(0);
    }
  }, [state]);

  // Pulse animation for listening state
  useEffect(() => {
    if (state === 'listening') {
      const interval = setInterval(() => {
        setPulseIntensity(prev => (prev + 0.1) % 1);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setPulseIntensity(0);
    }
  }, [state]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const getStateColors = () => {
    switch (state) {
      case 'thinking':
        return {
          bg: 'bg-yellow-500',
          border: 'border-yellow-300',
          pulse: 'bg-yellow-400',
        };
      case 'responding':
        return {
          bg: 'bg-green-500',
          border: 'border-green-300',
          pulse: 'bg-green-400',
        };
      case 'listening':
        return {
          bg: 'bg-blue-500',
          border: 'border-blue-300',
          pulse: 'bg-blue-400',
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          border: 'border-red-300',
          pulse: 'bg-red-400',
        };
      default:
        return {
          bg: 'bg-gray-500',
          border: 'border-gray-300',
          pulse: 'bg-gray-400',
        };
    }
  };

  const colors = getStateColors();

  const renderAvatar = () => {
    if (showSkeleton) {
      return (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse`}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400" />
        </div>
      );
    }

    if (avatarUrl) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 ${colors.border}`}
        />
      );
    }

    return (
      <div className={`${sizeClasses[size]} rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center text-white font-bold`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  const renderStateIndicator = () => {
    switch (state) {
      case 'thinking':
        return (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-xs text-yellow-900 font-bold">
              {'.'.repeat(dots)}
            </span>
          </motion.div>
        );

      case 'responding':
        return (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        );

      case 'listening':
        return (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        );

      case 'error':
        return (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">!</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Avatar */}
      <motion.div
        animate={{
          scale: state === 'listening' ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: state === 'listening' ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {renderAvatar()}
      </motion.div>

      {/* State Indicator */}
      <AnimatePresence>
        {state !== 'idle' && renderStateIndicator()}
      </AnimatePresence>

      {/* Pulse Ring for Listening */}
      <AnimatePresence>
        {state === 'listening' && (
          <motion.div
            className={`absolute inset-0 rounded-full border-2 ${colors.pulse}`}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ 
              scale: [1, 1.5, 2],
              opacity: [0.7, 0.4, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </AnimatePresence>

      {/* Streaming Indicator */}
      <AnimatePresence>
        {isStreaming && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <motion.div
              className="w-full h-full bg-green-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Skeleton Loader Component
export const AvatarSkeleton: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse`}>
      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400" />
    </div>
  );
};

// Thinking Animation Component
export const ThinkingAnimation: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Streaming Text Animation
export const StreamingText: React.FC<{ 
  text: string; 
  isStreaming?: boolean;
  className?: string;
}> = ({ text, isStreaming = false, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isStreaming && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50); // Adjust speed as needed

      return () => clearTimeout(timer);
    } else if (!isStreaming) {
      setDisplayText(text);
      setCurrentIndex(text.length);
    }
  }, [text, isStreaming, currentIndex]);

  return (
    <div className={className}>
      <span>{displayText}</span>
      {isStreaming && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-blue-500 ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
};
