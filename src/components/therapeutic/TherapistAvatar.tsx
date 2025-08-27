import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEmotionalState } from './EmotionalStateProvider';
import { Heart, Brain, Star, Shield, Eye, Zap, Moon, Sun, MessageCircle } from 'lucide-react';

export type TherapistPersonality = 
  | 'jamie' 
  | 'shadow-jamie' 
  | 'creative-jamie' 
  | 'executive-jamie';

interface TherapistAvatarProps {
  personality?: TherapistPersonality;
  isSpeaking?: boolean;
  message?: string;
  className?: string;
}

export const TherapistAvatar: React.FC<TherapistAvatarProps> = ({
  personality = 'jamie',
  isSpeaking = false,
  message = '',
  className = ''
}) => {
  const { currentState, intensity, getVoiceModulation } = useEmotionalState();
  const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'speaking' | 'thinking'>('idle');

  useEffect(() => {
    if (isSpeaking) {
      setAvatarState('speaking');
    } else if (message) {
      setAvatarState('thinking');
    } else {
      setAvatarState('idle');
    }
  }, [isSpeaking, message]);

  const getAvatarStyle = (): string => {
    const baseStyle = 'w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg';
    
    switch (personality) {
      case 'jamie':
        return `${baseStyle} bg-gradient-to-br from-luna-500 to-luna-600`;
      case 'shadow-jamie':
        return `${baseStyle} bg-gradient-to-br from-shadow-600 to-shadow-700`;
      case 'creative-jamie':
        return `${baseStyle} bg-gradient-to-br from-dream-500 to-dream-600`;
      case 'executive-jamie':
        return `${baseStyle} bg-gradient-to-br from-growth-500 to-growth-600`;
      default:
        return `${baseStyle} bg-gradient-to-br from-luna-500 to-luna-600`;
    }
  };

  const getAvatarIcon = (): React.ReactNode => {
    switch (personality) {
      case 'jamie':
        return <Heart className="w-8 h-8" />;
      case 'shadow-jamie':
        return <Shield className="w-8 h-8" />;
      case 'creative-jamie':
        return <Brain className="w-8 h-8" />;
      case 'executive-jamie':
        return <Eye className="w-8 h-8" />;
      default:
        return <Heart className="w-8 h-8" />;
    }
  };

  const getAnimationProps = () => {
    const voiceModulation = getVoiceModulation();
    
    switch (avatarState) {
      case 'speaking':
        return {
          animate: {
            scale: [1, 1.05, 1],
            rotate: voiceModulation === 'gentle' ? [0, -2, 2, 0] : [0, 2, -2, 0]
          },
          transition: {
            duration: 2,
            repeat: Infinity
          }
        };
      case 'listening':
        return {
          animate: {
            scale: [1, 1.02, 1],
            opacity: [1, 0.8, 1]
          },
          transition: {
            duration: 1.5,
            repeat: Infinity
          }
        };
      case 'thinking':
        return {
          animate: {
            rotate: [0, 5, -5, 0],
            scale: [1, 1.03, 1]
          },
          transition: {
            duration: 3,
            repeat: Infinity
          }
        };
      default:
        return {
          animate: {
            scale: [1, 1.01, 1]
          },
          transition: {
            duration: 4,
            repeat: Infinity
          }
        };
    }
  };

  const getPersonalityName = (): string => {
    switch (personality) {
      case 'jamie':
        return 'Jamie';
      case 'shadow-jamie':
        return 'Shadow Jamie';
      case 'creative-jamie':
        return 'Creative Jamie';
      case 'executive-jamie':
        return 'Executive Jamie';
      default:
        return 'Jamie';
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center space-y-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Avatar Container */}
      <motion.div
        className={`relative ${getAvatarStyle()}`}
        {...getAnimationProps()}
      >
        {getAvatarIcon()}
        
        {/* Speaking Indicator */}
        {isSpeaking && (
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 bg-compassion-500 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full h-full bg-compassion-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity
              }}
            />
          </motion.div>
        )}

        {/* Emotional Aura */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full"
        />
      </motion.div>

      {/* Personality Name */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-luna-700 dark:text-luna-300">
          {getPersonalityName()}
        </h3>
        <p className="text-sm text-luna-500 dark:text-luna-400">
          {personality === 'jamie' && 'Your compassionate guide'}
          {personality === 'shadow-jamie' && 'Your challenging mirror'}
          {personality === 'creative-jamie' && 'Your creative spark'}
          {personality === 'executive-jamie' && 'Your focused ally'}
        </p>
      </motion.div>

      {/* Voice Modulation Indicator */}
      <motion.div
        className="flex items-center space-x-2 text-xs text-luna-500 dark:text-luna-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <MessageCircle className="w-4 h-4" />
        <span className="capitalize">{getVoiceModulation()}</span>
      </motion.div>
    </motion.div>
  );
}; 