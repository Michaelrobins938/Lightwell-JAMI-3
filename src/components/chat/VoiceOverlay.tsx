import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceOverlayProps {
  isActive: boolean;
}

export default function VoiceOverlay({ isActive }: VoiceOverlayProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (isActive) {
      initializeVoice();
    } else {
      cleanup();
    }

    return () => cleanup();
  }, [isActive]);

  const initializeVoice = async () => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

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

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize audio context for visualization
    try {
      audioContextRef.current = new AudioContext();
    } catch (error) {
      console.error('Audio context not supported:', error);
    }
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript('');
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        >
          <div className="text-center">
            {/* Voice Visualization */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto relative">
                {/* Pulsing circles */}
                <motion.div
                  className="absolute inset-0 border-4 border-blue-500 rounded-full"
                  animate={{
                    scale: isListening ? [1, 1.2, 1] : 1,
                    opacity: isListening ? [0.7, 0.3, 0.7] : 0.7
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-2 border-2 border-green-400 rounded-full"
                  animate={{
                    scale: isSpeaking ? [1, 1.1, 1] : 1,
                    opacity: isSpeaking ? [0.6, 0.2, 0.6] : 0.6
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Center microphone icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={toggleListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      isListening
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Status Text */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Voice Mode
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isListening ? 'Listening...' : 'Tap the microphone to start'}
              </p>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {transcript}
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <button
                onClick={toggleListening}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </button>

              <button
                onClick={toggleSpeaking}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isSpeaking
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                {isSpeaking ? (
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Speaking
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4" />
                    Muted
                  </div>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              <p>Try saying: "Explain quantum physics" or "What's the weather like?"</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
