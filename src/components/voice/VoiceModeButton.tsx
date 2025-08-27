import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoiceSession } from './useVoiceSession';

interface VoiceModeButtonProps {
  onTranscriptUpdate?: (transcript: string) => void;
  onVoiceModeToggle?: (isActive: boolean) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceModeButton: React.FC<VoiceModeButtonProps> = ({
  onTranscriptUpdate,
  onVoiceModeToggle,
  className = '',
  size = 'md'
}) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const session = useVoiceSession();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const handleVoiceModeToggle = async () => {
    if (!isVoiceMode) {
      try {
        setIsVoiceMode(true);
        onVoiceModeToggle?.(true);
        await session.init();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to initialize voice mode:', error);
        setIsVoiceMode(false);
        onVoiceModeToggle?.(false);
      }
    } else {
      setIsVoiceMode(false);
      setIsListening(false);
      setIsSpeaking(false);
      onVoiceModeToggle?.(false);
    }
  };

  const handleMuteToggle = () => {
    setIsSpeaking(!isSpeaking);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleVoiceModeToggle}
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          flex items-center justify-center 
          transition-all duration-200 
          ${isVoiceMode 
            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25' 
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
          } 
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isVoiceMode ? 'Disable Voice Mode' : 'Enable Voice Mode'}
      >
        {isVoiceMode ? (
          <Mic className={`w-${iconSizes[size] / 2} h-${iconSizes[size] / 2}`} />
        ) : (
          <Mic className={`w-${iconSizes[size] / 2} h-${iconSizes[size] / 2}`} />
        )}
      </motion.button>

      {/* Voice Mode Status Indicators */}
      <AnimatePresence>
        {isVoiceMode && (
          <>
            {/* Connection Status - Top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-yellow-500'
              } ${isConnected ? 'animate-pulse' : 'animate-bounce'}`}
              title={isConnected ? 'Connected to OpenAI' : 'Connecting...'}
            />

            {/* Listening Indicator - Right */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                title="Listening"
              />
            )}

            {/* Speaking Indicator - Bottom */}
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                title="Speaking"
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
