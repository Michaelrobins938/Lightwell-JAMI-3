import React from 'react';
import { motion } from 'framer-motion';

interface TokenRenderingDotProps {
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'amber' | 'blue' | 'green' | 'purple';
  className?: string;
}

const TokenRenderingDot: React.FC<TokenRenderingDotProps> = ({
  isActive = true,
  size = 'md',
  color = 'amber',
  className = ''
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5', 
    lg: 'w-3 h-3'
  };

  // Color variants (OpenAI uses amber most frequently)
  const colorVariants = {
    amber: {
      gradient: 'from-amber-400 to-amber-300',
      glow: 'shadow-amber-400/50',
      solid: 'bg-amber-400'
    },
    blue: {
      gradient: 'from-blue-400 to-blue-300',
      glow: 'shadow-blue-400/50',
      solid: 'bg-blue-400'
    },
    green: {
      gradient: 'from-emerald-400 to-emerald-300',
      glow: 'shadow-emerald-400/50',
      solid: 'bg-emerald-400'
    },
    purple: {
      gradient: 'from-purple-400 to-purple-300',
      glow: 'shadow-purple-400/50',
      solid: 'bg-purple-400'
    }
  };

  if (!isActive) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full bg-slate-600/30 ${className}`}
      />
    );
  }

  return (
    <motion.div
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br ${colorVariants[color].gradient}
        shadow-lg ${colorVariants[color].glow}
        ${className}
      `}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        boxShadow: `0 0 20px ${colorVariants[color].glow.includes('amber') ? '#fbbf24' : 
                   colorVariants[color].glow.includes('blue') ? '#60a5fa' :
                   colorVariants[color].glow.includes('emerald') ? '#34d399' : '#a78bfa'}40`
      }}
    />
  );
};

// ChatGPT-style typing indicator with 3 dots
export const TypingIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-300"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
};

// Single pulsing dot (most common ChatGPT usage)
export const PulsingDot: React.FC<{ 
  color?: 'amber' | 'blue' | 'green' | 'purple';
  className?: string;
}> = ({ color = 'amber', className = '' }) => {
  const colors = {
    amber: { bg: 'bg-amber-400', shadow: '#fbbf24' },
    blue: { bg: 'bg-blue-400', shadow: '#60a5fa' },
    green: { bg: 'bg-emerald-400', shadow: '#34d399' },
    purple: { bg: 'bg-purple-400', shadow: '#a78bfa' }
  };

  return (
    <motion.div
      className={`w-2.5 h-2.5 rounded-full ${colors[color].bg} ${className}`}
      animate={{
        scale: [1, 1.4, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        boxShadow: `0 0 15px ${colors[color].shadow}60, 0 0 25px ${colors[color].shadow}30`
      }}
    />
  );
};

// Breathing dot (subtle, continuous animation)
export const BreathingDot: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-300 ${className}`}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        boxShadow: '0 0 12px #fbbf2440, 0 0 20px #fbbf2420'
      }}
    />
  );
};

export default TokenRenderingDot;