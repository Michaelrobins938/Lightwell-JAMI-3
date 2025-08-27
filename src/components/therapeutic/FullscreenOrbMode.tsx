import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Mic, MicOff, Square, Send } from 'lucide-react';
import { NarratorOrbComponent } from '../visuals/NarratorOrb';
import { JamieOrbOverlay } from './JamieOrbOverlay';

interface FullscreenOrbModeProps {
  isOpen: boolean;
  onClose: () => void;
  emotionalState: {
    state: string;
    intensity: number;
  };
  textToSpeak?: string;
  onSendMessage?: (message: string) => void;
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  isSpeaking?: boolean;
  onToggleMute?: () => void;
  isMuted?: boolean;
}

export const FullscreenOrbMode: React.FC<FullscreenOrbModeProps> = ({
  isOpen,
  onClose,
  emotionalState,
  textToSpeak = '',
  onSendMessage,
  isListening = false,
  onStartListening,
  onStopListening,
  isSpeaking = false,
  onToggleMute,
  isMuted = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [showControls, setShowControls] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // OpenAI-style animation constants
  const ENTRY_DURATION = shouldReduceMotion ? 0.1 : 0.5;
  const OVERLAY_DURATION = shouldReduceMotion ? 0.1 : 0.3;
  const CONTROLS_DELAY = shouldReduceMotion ? 0 : 0.8;
  const EXIT_DURATION = shouldReduceMotion ? 0.1 : 0.4;
  const EASE_CURVE = [0.4, 0, 0.2, 1] as const;

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

  // Handle immersive focus and accessibility
  useEffect(() => {
    if (!isOpen) return;

    // Preserve scroll position and disable scrolling
    const originalScrollTop = window.scrollY || document.documentElement.scrollTop;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${originalScrollTop}px`;
    document.body.style.width = '100%';
    const originalFocus = document.activeElement as HTMLElement;
    
    // Show controls after entry animation
    const controlsTimer = setTimeout(() => {
      setShowControls(true);
    }, CONTROLS_DELAY * 1000);

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      if (e.key === 'Enter' && inputText.trim()) {
        handleSendMessage();
      }
      
      if (e.key === ' ' && e.ctrlKey) {
        e.preventDefault();
        handleMicToggle();
      }
      
      if (e.key === '/' && !inputRef.current?.matches(':focus')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Restore scroll position and re-enable scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, originalScrollTop);
      
      if (originalFocus) {
        originalFocus.focus();
      }
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(controlsTimer);
    };
  }, [isOpen, inputText, onClose, CONTROLS_DELAY, handleSendMessage, handleMicToggle]);

  // Detect orb response state
  useEffect(() => {
    if (textToSpeak && isOpen) {
      setIsResponding(true);
      const timer = setTimeout(() => setIsResponding(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [textToSpeak, isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fullscreen-orb-mode">
          {/* Dark Overlay Fade-In - Precise rgba(0,0,0,0) → rgba(0,0,0,0.85) */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(2px)'
            }}
            initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            animate={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
            exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            transition={{ 
              duration: shouldReduceMotion ? 0.1 : 0.25,
              ease: [0.4, 0, 0.2, 1]
            }}
          />
          
          {/* Sidebar & UI Blur Effect */}
          <motion.div
            className="fixed inset-0 z-30"
            initial={{ filter: 'blur(0px) brightness(1)' }}
            animate={{ filter: 'blur(1px) brightness(0.15)' }}
            exit={{ filter: 'blur(0px) brightness(1)' }}
            transition={{ 
              duration: shouldReduceMotion ? 0.1 : 0.25,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{ pointerEvents: 'none' }}
          />

          {/* Centered Orb Container - Immersive experience */}
          <motion.div
            ref={orbContainerRef}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              padding: 'max(5vh, 40px)'
            }}
            initial={{ 
              scale: 0.4, 
              opacity: 0, 
              x: '-85vw', // From sidebar position
              y: '40vh' // From sidebar vertical position
            }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              x: 0, // To center
              y: 0 // To center
            }}
            exit={{ 
              scale: 0.4, 
              opacity: 0, 
              x: '-85vw', // Back to sidebar
              y: '40vh', // Back to sidebar
              transition: {
                duration: EXIT_DURATION,
                ease: EASE_CURVE
              }
            }}
            transition={{ 
              duration: shouldReduceMotion ? 0.1 : 0.5,
              ease: EASE_CURVE,
              delay: shouldReduceMotion ? 0 : 0.1
            }}
            onAnimationComplete={() => {
              // Trigger particle burst at animation completion
              if (isOpen) {
                const orbElement = orbContainerRef.current?.querySelector('.orb-visual');
                if (orbElement) {
                  orbElement.dispatchEvent(new CustomEvent('fullscreen-orb-burst'));
                }
              }
            }}
          >
            {/* Main Orb Visual */}
            <div 
              className="orb-visual relative rounded-full overflow-hidden"
              style={{ 
                width: 'min(75vh, 80vw)', 
                height: 'min(75vh, 80vw)',
                maxWidth: '650px',
                maxHeight: '650px',
                minWidth: '400px',
                minHeight: '400px'
              }}
            >
                             {/* Use NarratorOrb for consistent 3D rendering */}
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
              
              {/* Idle State - Continuous Life Pulse */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-full"
                animate={shouldReduceMotion ? {} : {
                  boxShadow: [
                    '0 0 30px 8px rgba(168, 85, 247, 0.08)',
                    '0 0 60px 20px rgba(168, 85, 247, 0.18)',
                    '0 0 90px 35px rgba(168, 85, 247, 0.12)',
                    '0 0 30px 8px rgba(168, 85, 247, 0.08)'
                  ],
                  scale: [1, 1.02, 1.01, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.3, 0.7, 1]
                }}
              />
              
              {/* Interactive State - Response Glow */}
              {(isResponding || isSpeaking) && !shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 40px 12px rgba(34, 197, 94, 0.15)',
                      '0 0 80px 30px rgba(34, 197, 94, 0.35)',
                      '0 0 120px 50px rgba(34, 197, 94, 0.25)',
                      '0 0 40px 12px rgba(34, 197, 94, 0.15)'
                    ],
                    scale: [1, 1.03, 1.05, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.25, 0.6, 1]
                  }}
                />
              )}
              
              {/* Listening State Ring */}
              {isListening && !shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-full border-2 border-blue-400/50"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              {/* Entry Particle Burst - Enhanced "inhale" effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-full"
                initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
                animate={{
                  scale: [0.8, 1.6, 1.1, 1],
                  opacity: [0, 0.8, 0.4, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: shouldReduceMotion ? 0.2 : 1.2,
                  delay: shouldReduceMotion ? 0 : (ENTRY_DURATION * 0.8),
                  ease: "easeOut",
                  times: [0, 0.3, 0.7, 1]
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-radial from-purple-400/60 via-blue-400/40 to-transparent blur-2xl" />
              </motion.div>
              
              {/* Particle Ring Burst */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: [0.5, 2.5, 1],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: shouldReduceMotion ? 0.1 : 0.8,
                  delay: shouldReduceMotion ? 0 : (ENTRY_DURATION * 0.9),
                  ease: "easeOut"
                }}
              >
                <div className="w-full h-full rounded-full border border-purple-300/30 shadow-lg shadow-purple-400/20" />
              </motion.div>
            </div>
          </motion.div>

          {/* Close Button (X) - Fixed top-right positioning */}
          <AnimatePresence>
            {isOpen && (
              <motion.button
                className="fixed top-12 right-12 z-70 w-12 h-12 rounded-full flex items-center justify-center
                         bg-black/20 hover:bg-black/40 text-white/70 hover:text-white
                         backdrop-blur-sm border border-white/10 hover:border-white/20
                         transition-all duration-200 shadow-lg"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ 
                  duration: shouldReduceMotion ? 0.1 : 0.3,
                  delay: shouldReduceMotion ? 0 : 0.2,
                  ease: EASE_CURVE
                }}
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close fullscreen mode"
              >
                <X className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Bottom Controls Dock - OpenAI measurements with 48px mobile padding */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="fixed bottom-0 left-0 right-0 z-60"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ 
                  opacity: 0, 
                  y: 60,
                  transition: {
                    duration: 0.2,
                    ease: "easeIn"
                  }
                }}
                transition={{ 
                  duration: shouldReduceMotion ? 0.1 : 0.4,
                  ease: EASE_CURVE,
                  delay: shouldReduceMotion ? 0 : 0.3
                }}
                style={{ padding: 'max(24px, env(safe-area-inset-bottom))' }}
              >
                {/* Controls Container - Precise spacing */}
                <div className="flex flex-col items-center pb-8 pt-4">
                  
                  {/* Control Buttons Row - Proper alignment */}
                  <motion.div
                    className="flex items-center justify-center gap-3 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    {/* Voice Toggle - Primary action, larger */}
                    <motion.button
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      } backdrop-blur-xl`}
                      onClick={handleMicToggle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={isListening ? "Stop listening" : "Start voice input"}
                    >
                      {isListening ? (
                        <Square className="w-6 h-6" />
                      ) : (
                        <Mic className="w-6 h-6" />
                      )}
                    </motion.button>

                    {/* Mute Toggle - Secondary action */}
                    <motion.button
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isMuted 
                          ? 'bg-zinc-700/90 hover:bg-zinc-600 text-zinc-300 border border-zinc-600' 
                          : 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/50'
                      } backdrop-blur-xl`}
                      onClick={onToggleMute}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </motion.button>

                  </motion.div>

                  {/* Primary Text Input - OpenAI pill style */}
                  <motion.div
                    className="w-full max-w-xl px-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Message Jamie..."
                        className="w-full h-14 px-6 pr-16 bg-zinc-900/80 text-white placeholder-zinc-400 
                                 rounded-full border border-zinc-700/60 focus:border-blue-400/70 
                                 focus:outline-none focus:ring-2 focus:ring-blue-400/20 
                                 backdrop-blur-xl transition-all duration-200 text-base
                                 shadow-lg shadow-black/20"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && inputText.trim()) {
                            handleSendMessage();
                          }
                        }}
                      />
                      <AnimatePresence>
                        {inputText.trim() && (
                          <motion.button
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 
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
                            <Send className="w-4 h-4" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Context Panel - Optional status below orb */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 z-45 text-center"
                style={{ marginTop: 'min(37.5vh, 40vw, 325px)' }} // Half orb height + margin
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  delay: shouldReduceMotion ? 0 : (ENTRY_DURATION + 0.4), 
                  duration: shouldReduceMotion ? 0.1 : 0.3 
                }}
              >
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full 
                              border border-white/20 text-white/70 text-sm font-light
                              shadow-lg shadow-black/10">
                  {emotionalState.state} • Intensity: {Math.round(emotionalState.intensity * 10)}/10
                  {isListening && (
                    <span className="ml-2 text-blue-300 animate-pulse">
                      • Listening
                    </span>
                  )}
                  {isSpeaking && (
                    <span className="ml-2 text-purple-300">
                      • Speaking
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Escape Hint - Precisely positioned top indicator */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.4, duration: 0.25 }}
              >
                <div className="px-3 py-1.5 bg-zinc-900/30 backdrop-blur-sm rounded-full 
                              border border-zinc-700/30 text-zinc-400 text-xs font-medium
                              shadow-sm">
                  Press ESC to exit • / to focus input
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};