import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Settings, X } from 'lucide-react';

interface VoiceModeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceModeToggle?: (isActive: boolean) => void;
}

const VoiceModeScreen: React.FC<VoiceModeScreenProps> = ({
  isOpen,
  onClose,
  onVoiceModeToggle
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      onVoiceModeToggle?.(false);
    } else {
      setIsListening(true);
      onVoiceModeToggle?.(true);
      // Simulate voice input
      setTimeout(() => {
        setTranscript('Hello, how can you help me today?');
        setTimeout(() => {
          setResponse('Hello! I\'m here to help you. I can assist with various tasks, answer questions, and provide support. What would you like to know or discuss?');
          setIsSpeaking(true);
          setTimeout(() => setIsSpeaking(false), 3000);
        }, 1000);
      }, 2000);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Voice Mode</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* Main Voice Button */}
            <button
              onClick={handleVoiceToggle}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white shadow-lg`}
            >
              {isListening ? (
                <MicOff className="w-12 h-12" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </button>

            {/* Mute Toggle */}
            <button
              onClick={handleMuteToggle}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white shadow-lg`}
            >
              {isMuted ? (
                <VolumeX className="w-8 h-8" />
              ) : (
                <Volume2 className="w-8 h-8" />
              )}
            </button>

            {/* Settings */}
            <button className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 text-white shadow-lg flex items-center justify-center transition-all duration-200">
              <Settings className="w-8 h-8" />
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {isListening && (
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Listening...</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Speaking...</span>
              </div>
            )}
            {isMuted && (
              <div className="flex items-center gap-2 text-red-400">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-sm font-medium">Muted</span>
              </div>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Your Message</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-200">{transcript}</p>
              </div>
            </div>
          )}

          {/* AI Response */}
          {response && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">AI Response</h3>
              <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 border border-blue-700">
                <p className="text-blue-100">{response}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center text-gray-400 text-sm">
            <p>Click the microphone to start voice interaction</p>
            <p>Use the mute button to control audio output</p>
            <p>Voice mode provides hands-free conversation</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceModeScreen;
