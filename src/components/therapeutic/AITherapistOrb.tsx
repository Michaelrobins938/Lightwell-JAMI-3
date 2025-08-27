import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { NarratorOrbComponent } from '../visuals/NarratorOrb';

interface AITherapistOrbProps {
  isSpeaking: boolean;
  isListening?: boolean;
  isThinking?: boolean;
  emotionalState: {
    state: string;
    intensity: number;
  };
  messageContent?: string;
  isTyping?: boolean;
  className?: string;
}

export const AITherapistOrb: React.FC<AITherapistOrbProps> = ({
  isSpeaking,
  isListening = false,
  isThinking = false,
  emotionalState,
  messageContent = '',
  isTyping = false,
  className = ''
}) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [intensity, setIntensity] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Initialize audio context and analyser when speaking starts
  useEffect(() => {
    if (isSpeaking && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, [isSpeaking]);

  // Calculate audio level from analyser when speaking, otherwise use dummy oscillator
  useEffect(() => {
    const updateAudioLevel = () => {
      if (isSpeaking && analyserRef.current) {
        // Real audio analysis when speaking
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(average / 256);
      } else {
        // Dummy oscillator for visual feedback when not speaking
        const time = Date.now() * 0.001;
        const level = Math.sin(time * 2) * 0.3 + 0.3;
        setAudioLevel(level);
      }
    };
    
    const interval = setInterval(updateAudioLevel, 100);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Breathing animation
  useEffect(() => {
    const breathingInterval = setInterval(() => {
      setBreathingPhase(prev => (prev + 0.1) % (Math.PI * 2));
    }, 100);
    return () => clearInterval(breathingInterval);
  }, []);

  // Update intensity based on emotional state and speaking status
  useEffect(() => {
    let newIntensity = emotionalState.intensity / 10;
    
    if (isSpeaking) {
      newIntensity += 0.3;
    }
    
    if (isTyping) {
      newIntensity += 0.2;
    }
    
    setIntensity(Math.min(newIntensity, 1.0));
  }, [emotionalState.intensity, isSpeaking, isTyping]);

  // Emotional state color mapping
  const getEmotionalColor = () => {
    const colors = {
      calm: '#0ea5e9',
      anxious: '#fbbf24',
      depressed: '#7c3aed',
      angry: '#3b82f6',
      joyful: '#ec4899',
      creative: '#d946ef',
      empowered: '#10b981',
      vulnerable: '#f472b6',
      default: '#0ea5e9',
    };
    return colors[emotionalState.state as keyof typeof colors] || colors.default;
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 3D Orb Container */}
      <div className="relative w-full h-full">
        <NarratorOrbComponent
          isVisible={true}
          intensity={intensity}
          audioLevel={audioLevel}
          className="w-full h-full"
        />
      </div>

      {/* Emotional State Overlay */}
      {emotionalState.state !== 'calm' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="w-16 h-16 rounded-full border-4 border-opacity-30"
            style={{
              borderColor: getEmotionalColor(),
              boxShadow: `0 0 20px ${getEmotionalColor()}40`
            }}
          />
        </motion.div>
      )}

      {/* Speaking Indicator */}
      {isSpeaking && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </motion.div>
      )}

      {/* Typing Indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -top-4 right-0 bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
        >
          Thinking...
        </motion.div>
      )}
    </motion.div>
  );
}; 