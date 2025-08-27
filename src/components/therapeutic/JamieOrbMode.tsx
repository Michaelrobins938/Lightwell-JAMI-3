import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X, Settings } from 'lucide-react';
import { NarratorOrbComponent } from '../visuals/NarratorOrb';
import { useJamieVoice } from './useJamieVoice';
// Disabled toast to eliminate spammy notifications
// import { toast } from 'react-toastify';

interface JamieOrbModeProps {
  isActive: boolean;
  onToggle: () => void;
  onMessage: (message: string) => void;
  currentMessage?: string;
  isTyping?: boolean;
  emotionalState?: {
    state: string;
    intensity: number;
  };
  className?: string;
}

export const JamieOrbMode: React.FC<JamieOrbModeProps> = ({
  isActive,
  onToggle,
  onMessage,
  currentMessage = '',
  isTyping = false,
  emotionalState = { state: 'calm', intensity: 5 },
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    speak,
    stopSpeaking,
    isSpeaking,
    audioLevel,
    breathingPhase,
    error,
    setError
  } = useJamieVoice({
    enableVoice: voiceEnabled
  });

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    setIsProcessing(true);
    try {
      await onMessage(message);
      setUserInput('');
    } catch (err) {
      // toast.error('Failed to send message');
    } finally {
      setIsProcessing(false);
    }
  }, [onMessage]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
        // Stop recognition before sending to prevent feedback loop
        recognitionRef.current.stop();
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        // toast.error('Voice recognition failed. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [handleSendMessage]);

  // Speak when Jamie responds - DISABLED to prevent feedback loop
  // useEffect(() => {
  //   if (currentMessage && voiceEnabled && !isSpeaking && currentMessage.trim() !== '') {
  //     // Add a small delay to prevent immediate re-triggering
  //     const timeoutId = setTimeout(() => {
  //       speak(currentMessage);
  //     }, 1000); // 1 second delay to prevent feedback loop
  //     
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [currentMessage, voiceEnabled, isSpeaking, speak]);

  // Manual voice trigger function
  const speakCurrentMessage = () => {
    if (currentMessage && voiceEnabled && !isSpeaking && currentMessage.trim() !== '') {
      speak(currentMessage);
    }
  };

  // Handle error display
  useEffect(() => {
    if (error) {
      // toast.error(`Voice error: ${error}`);
      setError(null);
    }
  }, [error, setError]);

  const startListening = () => {
    if (recognitionRef.current && !isSpeaking) {
      // Stop any current speech before starting recognition
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      // Add a small delay to prevent immediate re-triggering
      setTimeout(() => {
        recognitionRef.current.start();
      }, 500);
    } else {
      // toast.error('Voice recognition not supported or speech is active');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(userInput);
    }
  };

  if (!isActive) {
    return null; // Remove floating button since it's now integrated into input area
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center ${className}`}
      >
        <div className="relative w-full h-full max-w-4xl max-h-[90vh] bg-luna-900/95 backdrop-blur-xl rounded-2xl border border-luna-700/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-luna-800/50 backdrop-blur-xl border-b border-luna-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold">Jamie AI Therapist</h2>
                  <p className="text-luna-300 text-sm">Voice & Orb Mode</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={speakCurrentMessage}
                  disabled={!currentMessage || isSpeaking}
                  className={`p-2 rounded-lg transition-colors ${
                    currentMessage && !isSpeaking
                      ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                      : 'bg-gray-600/20 text-gray-400'
                  }`}
                  title="Speak current message"
                >
                  <Volume2 size={20} />
                </button>
                
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-lg transition-colors ${
                    voiceEnabled 
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                      : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                  }`}
                  title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg bg-luna-700/50 text-luna-300 hover:bg-luna-700/70 transition-colors"
                  title="Settings"
                >
                  <Settings size={20} />
                </button>
                
                <button
                  onClick={onToggle}
                  className="p-2 rounded-lg bg-luna-700/50 text-luna-300 hover:bg-luna-700/70 transition-colors"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative w-full h-full pt-20 pb-32">
            {/* Orb Container */}
            <div className="w-full h-full">
              <NarratorOrbComponent
                isVisible={true}
                intensity={emotionalState.intensity / 10}
                audioLevel={audioLevel}
                className="w-full h-full"
              />
            </div>

            {/* Status Overlay */}
            <div className="absolute top-24 left-4 right-4">
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-blue-600/20 backdrop-blur-xl border border-blue-500/50 rounded-lg p-3 text-center"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-300 font-medium">Listening...</span>
                    </div>
                  </motion.div>
                )}

                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-600/20 backdrop-blur-xl border border-green-500/50 rounded-lg p-3 text-center"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 font-medium">Jamie is speaking...</span>
                    </div>
                  </motion.div>
                )}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-purple-600/20 backdrop-blur-xl border border-purple-500/50 rounded-lg p-3 text-center"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-purple-300 font-medium">Jamie is thinking...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Emotional State Indicator */}
            {emotionalState.state !== 'calm' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-24 right-4 bg-luna-800/50 backdrop-blur-xl border border-luna-700/50 rounded-lg p-3"
              >
                <div className="text-center">
                  <div className="text-luna-300 text-sm">Emotional State</div>
                  <div className="text-white font-semibold capitalize">{emotionalState.state}</div>
                  <div className="w-full bg-luna-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(emotionalState.intensity / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-luna-800/50 backdrop-blur-xl border-t border-luna-700/50">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or use voice input..."
                  className="w-full p-4 border border-luna-700/50 rounded-xl resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-luna-800/50 text-white placeholder-luna-400 text-sm"
                  rows={1}
                  style={{ minHeight: '60px', maxHeight: '120px' }}
                  disabled={isProcessing}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-luna-700/50 hover:bg-luna-700/70 text-luna-300'
                  } disabled:opacity-50`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                
                <button
                  onClick={() => handleSendMessage(userInput)}
                  disabled={!userInput.trim() || isProcessing}
                  className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  title="Send message"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="absolute top-0 right-0 h-full w-80 bg-luna-800/90 backdrop-blur-xl border-l border-luna-700/50 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Voice Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 rounded-lg bg-luna-700/50 text-luna-300 hover:bg-luna-700/70 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-luna-300 text-sm mb-2 block">Voice Enabled</label>
                    <button
                      onClick={toggleVoice}
                      className={`w-full p-3 rounded-lg transition-colors ${
                        voiceEnabled 
                          ? 'bg-green-600/20 text-green-400 border border-green-500/50' 
                          : 'bg-red-600/20 text-red-400 border border-red-500/50'
                      }`}
                    >
                      {voiceEnabled ? 'Voice Enabled' : 'Voice Disabled'}
                    </button>
                  </div>
                  
                  <div>
                    <label className="text-luna-300 text-sm mb-2 block">Current Status</label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-luna-300">Speaking:</span>
                        <span className={isSpeaking ? 'text-green-400' : 'text-luna-400'}>
                          {isSpeaking ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-luna-300">Listening:</span>
                        <span className={isListening ? 'text-blue-400' : 'text-luna-400'}>
                          {isListening ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-luna-300">Audio Level:</span>
                        <span className="text-luna-300">
                          {Math.round(audioLevel * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 