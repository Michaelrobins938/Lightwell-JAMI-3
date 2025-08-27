import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface JamieAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'static' | 'animated' | 'interactive';
  className?: string;
  onInteraction?: (interaction: string) => void;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48'
};

const textSizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-5xl'
};

function AnimatedOrb({ size = 'lg', variant = 'animated', onInteraction }: JamieAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const handleInteraction = (type: string) => {
    setIsInteracting(true);
    onInteraction?.(type);
    setTimeout(() => setIsInteracting(false), 1000);
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-br from-[#b39ddb] via-[#9C63FF] to-[#18122B] overflow-hidden cursor-pointer`}
      initial={{ scale: 0.95, rotate: 0 }}
      animate={{ 
        scale: variant === 'static' ? 1 : [0.95, 1.05, 0.95], 
        rotate: variant === 'static' ? 0 : [0, 8, -8, 0],
        boxShadow: variant === 'static' ? '0 0 20px rgba(156,99,255,0.3)' : [
          '0 0 20px rgba(156,99,255,0.3)',
          '0 0 40px rgba(156,99,255,0.5)',
          '0 0 20px rgba(156,99,255,0.3)'
        ]
      }}
      transition={{ 
        repeat: variant === 'static' ? 0 : Infinity, 
        duration: 6, 
        ease: 'easeInOut' 
      }}
      whileHover={variant === 'interactive' ? {
        scale: 1.1,
        boxShadow: '0 0 50px rgba(156,99,255,0.7)',
        transition: { duration: 0.3 }
      } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => variant === 'interactive' && handleInteraction('click')}
      aria-hidden="true"
    >
      {/* Animated background layers */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#9C63FF]/20"
        animate={variant === 'static' ? {} : {
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <svg 
        width={size === 'sm' ? 64 : size === 'md' ? 96 : size === 'lg' ? 128 : 192} 
        height={size === 'sm' ? 64 : size === 'md' ? 96 : size === 'lg' ? 128 : 192} 
        viewBox="0 0 180 180" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#b39ddb" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#18122B" stopOpacity="0.5" />
          </radialGradient>
          <filter id="orbGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="90" cy="90" rx="80" ry="80" fill="url(#orbGrad)" filter="url(#orbGlow)" />
        <ellipse cx="60" cy="70" rx="18" ry="12" fill="#fff" opacity="0.12" />
        <ellipse cx="120" cy="110" rx="12" ry="8" fill="#fff" opacity="0.10" />
        <ellipse cx="100" cy="60" rx="10" ry="6" fill="#b39ddb" opacity="0.18" />
        
        {/* Animated particles */}
        {variant !== 'static' && (
          <>
            <motion.circle 
              cx="50" cy="50" r="2" fill="#fff" opacity="0.6"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle 
              cx="130" cy="130" r="1.5" fill="#b39ddb" opacity="0.8"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </>
        )}
      </svg>
      
      <motion.span 
        className={`relative z-10 font-display font-bold text-white drop-shadow-lg select-none ${textSizes[size]}`}
        animate={variant === 'static' ? {} : {
          scale: [1, 1.05, 1],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        J
      </motion.span>

      {/* Interactive feedback */}
      {isHovered && variant === 'interactive' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-luna-900/90 text-white text-xs rounded-full shadow-lg"
        >
          Click to interact
        </motion.div>
      )}

      {/* Status indicator */}
      <motion.div
        className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-green-400 border-2 border-white shadow-lg"
        title="Status: Online"
        initial={{ scale: 0.8, opacity: 0.7 }}
        animate={{ 
          scale: [0.8, 1.1, 0.9, 1], 
          opacity: [0.7, 1, 0.8, 1],
          boxShadow: [
            '0 0 5px rgba(34,197,94,0.5)',
            '0 0 10px rgba(34,197,94,0.8)',
            '0 0 5px rgba(34,197,94,0.5)'
          ]
        }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

export default function JamieAvatar(props: JamieAvatarProps) {
  const [is3DReady, setIs3DReady] = useState(false);

  // Future 3D integration check
  useEffect(() => {
    // Check if Three.js or R3F is available
    const check3DSupport = async () => {
      try {
        // This would be replaced with actual 3D library detection
        // For now, we'll use the SVG version
        setIs3DReady(false);
      } catch (error) {
        setIs3DReady(false);
      }
    };

    check3DSupport();
  }, []);

  // For now, always use the SVG version
  // In the future, this would conditionally render 3D or SVG
  return <AnimatedOrb {...props} />;
}

// Export for future 3D integration
export { AnimatedOrb }; 