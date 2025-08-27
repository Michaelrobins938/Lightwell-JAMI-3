"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

interface VoiceOverlayProps {
  transcript: string;
  onStop: () => void;
  isAssistantSpeaking: boolean;
}

export default function VoiceOverlay({
  transcript,
  onStop,
  isAssistantSpeaking
}: VoiceOverlayProps) {
  return (
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
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.3, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-2 border-2 border-green-400 rounded-full"
                animate={{
                  scale: isAssistantSpeaking ? [1, 1.1, 1] : 1,
                  opacity: isAssistantSpeaking ? [0.6, 0.2, 0.6] : 0.6
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Center microphone icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={onStop}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <MicOff className="w-8 h-8" />
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
              {transcript ? 'Listening...' : 'Tap the microphone to start'}
            </p>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onStop}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Stop Recording
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            <p>Try saying: "Explain quantum computing in simple terms"</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
