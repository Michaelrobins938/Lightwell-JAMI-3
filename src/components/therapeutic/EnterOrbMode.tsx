import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Send, Mic, MicOff, Square } from 'lucide-react';
import { NarratorOrbComponent } from '../visuals/NarratorOrb';
import { JamieOrbOverlay } from './JamieOrbOverlay';

interface EnterOrbModeProps {
  isOpen: boolean;
  onClose: () => void;
  emotionalState: {
    state: string;
    intensity: number;
  };
  textToSpeak?: string;
  children?: React.ReactNode;
  sidebarOrbRef?: React.RefObject<HTMLDivElement>;
  onTransitionStart?: () => void;
  onTransitionComplete?: () => void;
  // Add text input functionality
  onSendMessage?: (message: string) => void;
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  isSpeaking?: boolean;
}

export const EnterOrbMode: React.FC<EnterOrbModeProps> = ({
  isOpen,
  onClose,
  emotionalState,
  textToSpeak = '',
  children,
  sidebarOrbRef,
  onTransitionStart,
  onTransitionComplete,
  onSendMessage,
  isListening = false,
  onStartListening,
  onStopListening,
  isSpeaking = false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isResponding, setIsResponding] = React.useState(false);
  const [inputText, setInputText] = useState('');
  const [showControls, setShowControls] = useState(false);

  // OpenAI-style animation constants
  const TRANSITION_DURATION = shouldReduceMotion ? 0.1 : 0.4;
  const OVERLAY_DURATION = shouldReduceMotion ? 0.1 : 0.25;
  const EASE_CURVE = [0.4, 0, 0.2, 1] as const;

  // Message handling
  const handleSendMessage = useCallback(() => {
    if (inputText.trim() && onSendMessage) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  }, [inputText, onSendMessage]);

  const handleMicToggle = useCallback(() => {
    if (isListening) {
      onStopListening?.();
    } else {
      onStartListening?.();
    }
  }, [isListening, onStartListening, onStopListening]);

  // Handle focus lock and keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Notify transition start
    onTransitionStart?.();
    
    // Show controls after a delay  
    const controlsTimer = setTimeout(() => {
      setShowControls(true);
    }, shouldReduceMotion ? 0 : 600);
    
    // Notify transition complete after orb animation
    const timer = setTimeout(() => {
      onTransitionComplete?.();
    }, TRANSITION_DURATION * 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      clearTimeout(controlsTimer);
    };
  }, [isOpen, onClose, onTransitionStart, onTransitionComplete, TRANSITION_DURATION, shouldReduceMotion]);

  // Detect if orb is responding to input (textToSpeak changed)
  useEffect(() => {
    if (textToSpeak && isOpen) {
      setIsResponding(true);
      const timer = setTimeout(() => setIsResponding(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [textToSpeak, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Semi-transparent Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: OVERLAY_DURATION, 
              ease: "easeOut" 
            }}
            onClick={onClose}
          />

          {/* Orb Container */}
          <motion.div
            ref={orbContainerRef}
            className="fixed z-50 orb-transition"
            style={{ 
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(90vw, 500px)',
              height: 'min(90vw, 500px)',
              maxWidth: '500px',
              maxHeight: '500px'
            }}
            initial={{ scale: 0.4, opacity: 0, y: 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.4, opacity: 0, y: 0 }}
            transition={{ 
              duration: TRANSITION_DURATION, 
              ease: EASE_CURVE 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Orb Visual */}
            <div className="orb-visual relative rounded-full overflow-hidden w-full h-full">
              <div className="w-full h-full relative">
                <NarratorOrbComponent
                  isVisible={true}
                  intensity={emotionalState.intensity}
                  className="w-full h-full"
                />
                
                {/* Orb overlay for emotional state */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  <JamieOrbOverlay emotionalState={emotionalState} showMoodLabel />
                </div>
              </div>
              
              {/* Idle Breathing Glow */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-full orb-particles"
                animate={shouldReduceMotion ? {} : {
                  boxShadow: [
                    '0 0 20px 5px rgba(168, 85, 247, 0.1)',
                    '0 0 40px 15px rgba(168, 85, 247, 0.2)',
                    '0 0 20px 5px rgba(168, 85, 247, 0.1)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Responding to Input */}
              {isResponding && !shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 30px 10px rgba(34, 197, 94, 0.2)',
                      '0 0 60px 25px rgba(34, 197, 94, 0.3)',
                      '0 0 30px 10px rgba(34, 197, 94, 0.2)'
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>
          </motion.div>

          {/* Close Button */}
          <motion.button
            className="fixed top-12 right-12 z-60 text-white text-3xl w-12 h-12 flex items-center justify-center 
                       rounded-full hover:bg-white/10 transition-all duration-150"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              delay: shouldReduceMotion ? 0 : 0.2,
              duration: shouldReduceMotion ? 0.1 : 0.2,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close orb mode"
          >
            <X className="w-8 h-8" />
          </motion.button>

          {/* Status Text */}
          <motion.div
            className="fixed bottom-16 w-full text-center text-white/70 text-sm z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ 
              delay: shouldReduceMotion ? 0 : 0.3,
              duration: shouldReduceMotion ? 0.1 : 0.3,
              ease: "easeOut"
            }}
          >
            <div className="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full border border-white/10 inline-block">
              {emotionalState.state} • Intensity: {Math.round(emotionalState.intensity * 10)}/10
            </div>
          </motion.div>

          {/* Text Input Controls - Added for seamless conversation */}
          {showControls && onSendMessage && (
            <motion.div
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-60 w-full max-w-lg px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : 0.4,
                duration: shouldReduceMotion ? 0.1 : 0.3,
                ease: "easeOut"
              }}
            >
              {/* Voice Controls Row */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {/* Voice Toggle */}
                <motion.button
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isListening 
                      ? 'bg-red-500/90 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
                      : 'bg-blue-500/90 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  } backdrop-blur-xl border border-white/10`}
                  onClick={handleMicToggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <Square className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </motion.button>
              </motion.div>

              {/* Text Input */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Message Jamie..."
                  className="w-full h-12 px-4 pr-12 bg-black/40 text-white placeholder-white/50 
                           rounded-full border border-white/20 focus:border-blue-400/70 
                           focus:outline-none focus:ring-2 focus:ring-blue-400/20 
                           backdrop-blur-xl transition-all duration-200 text-sm
                           shadow-lg shadow-black/20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputText.trim()) {
                      handleSendMessage();
                    }
                    if (e.key === 'Escape') {
                      onClose();
                    }
                  }}
                />
                {inputText.trim() && (
                  <motion.button
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 
                             bg-blue-500 hover:bg-blue-600 text-white rounded-full
                             transition-all duration-150 flex items-center justify-center
                             shadow-md"
                    onClick={handleSendMessage}
                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 10 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Additional Content */}
          {children && (
            <motion.div
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : 0.4,
                duration: shouldReduceMotion ? 0.1 : 0.3,
                ease: "easeOut"
              }}
            >
              {children}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

// OpenAI-style transition constants for external use
export const orbModeTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1] as const,
  overlayDuration: 0.25,
  reducedDuration: 0.1
};