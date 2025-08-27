// Enhanced chat input with streaming support and typing dots

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Plus } from 'lucide-react';
import { StreamingMessage } from './StreamingMessage';

interface EnhancedChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  hasMessages: boolean;
  isMobile?: boolean;
  onShowInputModal?: () => void;
  onOpenJARVISVoice?: () => void;
}

export const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  input = '',
  setInput,
  onSendMessage,
  isLoading,
  isListening,
  onStartListening,
  onStopListening,
  suggestions = [
    "What can I help with?",
    "I'm feeling anxious today",
    "Help me understand my emotions",
    "I need someone to listen"
  ],
  onSuggestionClick,
  hasMessages,
  isMobile = false,
  onShowInputModal,
  onOpenJARVISVoice
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Handle first message sent
  const handleFirstMessage = () => {
    if (!chatStarted && input.trim()) {
      setChatStarted(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleFirstMessage();
        onSendMessage(input);
      }
    }
  };

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  const handleSendClick = () => {
    if (input.trim()) {
      handleFirstMessage();
      onSendMessage(input);
    }
  };

  // Reset chat state when starting new conversation
  useEffect(() => {
    if (!hasMessages) {
      setChatStarted(false);
    }
  }, [hasMessages]);

  return (
    <div className="w-full">
      {/* Main Input Container with Animation */}
      <motion.div
        className={`fixed left-1/2 transform -translate-x-1/2 z-10 ${
          chatStarted 
            ? 'bottom-4 w-[90%] max-w-3xl' 
            : 'top-1/3 w-[60%]'
        }`}
        animate={{
          bottom: chatStarted ? '1rem' : undefined,
          top: chatStarted ? undefined : '33%',
          width: chatStarted ? '90%' : '60%',
          maxWidth: chatStarted ? '48rem' : undefined,
          scale: chatStarted ? 1 : 0.95
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        whileHover={{
          scale: chatStarted ? 1.02 : 0.97
        }}
      >
        {/* Input Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[#2a2a2a] rounded-2xl transition-all duration-200 shadow-lg"
          style={{
            minHeight: '52px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            padding: '0 16px'
          }}
        >
          <div className="flex items-end gap-3 h-full py-3">
            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                id="chat-input"
                name="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={chatStarted ? "Message ChatGPT..." : "What can I help with?"}
                className="w-full resize-none bg-transparent text-[#ECECEC] 
                         placeholder-[#C1C1C1] outline-none border-none
                         min-h-[24px] max-h-[120px] leading-6"
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '16px'
                }}
                rows={1}
                disabled={isLoading}
                aria-label="Chat message input"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Voice Button */}
              <button
                onClick={isListening ? onStopListening : onStartListening}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'text-[#ECECEC] hover:text-white hover:bg-[#404040]'
                }`}
                title={isListening ? "Stop voice input" : "Start voice input"}
                disabled={isLoading}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* Send Button */}
              <AnimatePresence>
                {input.trim() && (
                  <motion.button
                    onClick={handleSendClick}
                    className="p-2 rounded-full bg-[#ab68ff] hover:bg-[#9b58ef] 
                             text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Sticky Footer Gradient */}
        {chatStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-[#343541] to-transparent pointer-events-none"
          />
        )}
      </motion.div>

      {/* Suggestions Below Input Bar - Show when no messages and input has focus */}
      <AnimatePresence>
        {!chatStarted && inputFocused && input.trim() === '' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeIn" }}
            className="fixed left-1/2 transform -translate-x-1/2 top-[calc(33%+80px)] w-[60%] max-w-md"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setInput(suggestion);
                  // Trigger send immediately after setting suggestion
                  setTimeout(() => {
                    handleFirstMessage();
                    onSendMessage(suggestion);
                  }, 50);
                }}
                className="w-full text-left px-0 py-2 text-[14px] text-[#C1C1C1] hover:text-[#ECECEC] transition-colors"
                style={{ 
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Footer - Only show when no messages */}
      <AnimatePresence>
        {!chatStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-1/2 transform -translate-x-1/2 top-[calc(33%+200px)] text-center text-xs text-gray-400"
            style={{
              fontSize: '12px',
              color: '#9CA3AF'
            }}
          >
            ChatGPT can make mistakes. Check important info.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Message display component for the chat interface
export function ChatMessageBubble({ 
  message, 
  isStreaming = false, 
  isThinking = false 
}: { 
  message: any; 
  isStreaming?: boolean; 
  isThinking?: boolean; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-3 ${
        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
        message.role === 'user'
          ? 'bg-blue-600'
          : 'bg-gray-600'
      }`}>
        {message.role === 'user' ? 'U' : 'AI'}
      </div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${
        message.role === 'user' ? 'text-right' : ''
      }`}>
        <div className={`inline-block p-3 rounded-2xl max-w-lg ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        }`}>
          {isStreaming || isThinking ? (
            <StreamingMessage
              content={message.content}
              isStreaming={isStreaming}
              isThinking={isThinking}
              className="text-inherit"
            />
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${
          message.role === 'user' ? 'text-right' : ''
        }`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}