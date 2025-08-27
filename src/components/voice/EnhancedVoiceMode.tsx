// src/components/voice/EnhancedVoiceMode.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { AITherapistOrb } from '../therapeutic/AITherapistOrb';

interface EmotionalState {
  state: string;
  intensity: number;
}

interface EnhancedVoiceModeProps {
  isActive: boolean;
  onToggle: () => void;
  onSpeechResult: (text: string) => void;
  onAudioLevel: (level: number) => void;
  isSpeaking: boolean;
  emotionalState: EmotionalState;
}

const EnhancedVoiceMode: React.FC<EnhancedVoiceModeProps> = ({
  isActive,
  onToggle,
  onSpeechResult,
  onAudioLevel,
  isSpeaking,
  emotionalState
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          onSpeechResult(finalTranscript);
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onSpeechResult]);

  // Setup audio analysis for visual feedback
  useEffect(() => {
    const setupAudioAnalysis = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        microphone.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateAudioLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            const level = average / 255;
            setAudioLevel(level);
            onAudioLevel(level);
          }
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        };

        updateAudioLevel();
      } catch (error) {
        console.error('Error setting up audio analysis:', error);
      }
    };

    if (isActive) {
      setupAudioAnalysis();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, onAudioLevel]);

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
      >
        {/* Main Voice Interface */}
        <div className="relative flex flex-col items-center space-y-8 p-8">
          {/* AI Therapist Orb */}
          <div className="w-64 h-64">
            <AITherapistOrb
              emotionalState={emotionalState}
              isSpeaking={isSpeaking}
              isListening={isListening}
              isThinking={false}
            />
          </div>

          {/* Voice Controls */}
          <div className="flex flex-col items-center space-y-4">
            <motion.button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25'
                  : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}

              {/* Audio Level Indicator */}
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-400"
                  animate={{
                    scale: [1, 1 + audioLevel * 0.3],
                    opacity: [0.5, 0.8]
                  }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </motion.button>

            {/* Status Text */}
            <div className="text-center">
              <p className="text-white text-lg font-medium">
                {isListening ? 'Listening...' : 'Tap to speak'}
              </p>
              {isListening && (
                <p className="text-gray-300 text-sm mt-2">
                  Speak clearly and pause when finished
                </p>
              )}
            </div>

            {/* Transcript Display */}
            <AnimatePresence>
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md"
                >
                  <p className="text-white text-sm">{transcript}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Audio Level Visualization */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 bg-emerald-500 rounded-full"
                animate={{
                  height: isListening ? `${Math.max(8, audioLevel * 40 + 8)}px` : '8px',
                  opacity: isListening ? 0.8 : 0.3
                }}
                transition={{ duration: 0.1, delay: i * 0.02 }}
              />
            ))}
          </div>

          {/* Close Button */}
          <motion.button
            onClick={onToggle}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <VolumeX className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export { EnhancedVoiceMode };

