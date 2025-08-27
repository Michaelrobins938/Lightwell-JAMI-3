import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic
} from 'lucide-react';


interface ChatGPTInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
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
  onVoiceModeToggle?: (isActive: boolean) => void;
}

export const ChatGPTInput: React.FC<ChatGPTInputProps> = ({
  input,
  setInput,
  onSendMessage,
  isLoading,
  isListening,
  onStartListening,
  onStopListening,
  suggestions = [],
  onSuggestionClick,
  hasMessages = false,
  isMobile = false,
  onShowInputModal,
  onOpenJARVISVoice,
  onVoiceModeToggle
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputFocused, setInputFocused] = useState(false);

  // Ensure input is always a string
  const safeInput = typeof input === 'string' ? input : '';

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [safeInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (safeInput.trim()) {
        onSendMessage();
      }
    }
  };

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  // Generate contextual suggestions based on input
  const getContextualSuggestions = (currentInput: string) => {
    if (!currentInput || !currentInput.trim()) return [];
    
    const input = currentInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return [
        "hello! have you read any good books lately?",
        "hello! did you see that new documentary about ocean conservation?",
        "hello! what have you been up to lately?"
      ];
    }
    
    if (input.includes('how are you')) {
      return [
        "I'm doing well, thanks for asking! How about you?",
        "I'm functioning perfectly. What's on your mind today?",
        "I'm here and ready to help. What would you like to discuss?"
      ];
    }
    
    if (input.includes('help') || input.includes('support')) {
      return [
        "I'm here to help! What specific issue are you facing?",
        "I can assist with many topics. What would you like to know?",
        "Let me know what you need help with and I'll do my best!"
      ];
    }
    
    if (input.includes('feeling') || input.includes('emotion')) {
      return [
        "I'm here to listen. What's been on your mind?",
        "It's okay to feel that way. Want to talk about it?",
        "Your feelings are valid. How can I support you?"
      ];
    }
    
    // Default suggestions for any input
    return [
      "Tell me more about that.",
      "That's interesting! Can you elaborate?",
      "I'd love to hear your thoughts on this."
    ];
  };

  const contextualSuggestions = getContextualSuggestions(safeInput);

  return (
    <div className="w-full">
      {/* Main Input Container - Perfect ChatGPT Style */}
      <div
        className="relative bg-[#2a2a2a] rounded-[24px] transition-all duration-200"
        style={{
          height: '48px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          padding: '0 16px'
        }}
      >
        <div className="flex items-center gap-3 h-full">
          {/* Text Input - Full flex */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              id="chat-input"
              name="chat-input"
              value={safeInput}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Message Luna AI"
              className="w-full resize-none bg-transparent text-[#ECECEC] 
                       placeholder-[#C1C1C1] outline-none border-none
                       min-h-[24px] max-h-[200px] leading-6"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '16px'
              }}
              rows={1}
              disabled={isLoading}
              aria-label="Chat message input"
            />
          </div>

          {/* Right Side Icons - Voice + Send */}
          <div className="flex items-center gap-2">
            {/* REAL VOICE MODE - Only Button You Need */}
            <button
              onClick={() => {
                if (onVoiceModeToggle) {
                  onVoiceModeToggle(true);
                } else {
                  onStartListening();
                }
              }}
              className={`p-2 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'text-[#ECECEC] hover:text-white hover:bg-[#404040]'
              }`}
              title="Open Real ChatGPT Voice Mode"
              disabled={isLoading}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <AnimatePresence>
              {safeInput.trim() && (
                <motion.button
                  onClick={onSendMessage}
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
      </div>

      {/* Suggestions Below Input Bar - Show when no messages and input has focus */}
      <AnimatePresence>
        {!hasMessages && inputFocused && safeInput.trim() === '' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeIn" }}
            className="mt-2 max-w-full overflow-hidden"
            style={{ 
              width: '100%',
              maxWidth: '600px',
              maxHeight: '240px',
              overflowY: 'auto'
            }}
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setInput(suggestion);
                  // Trigger send immediately after setting suggestion
                  setTimeout(() => onSendMessage(), 50);
                }}
                className="w-full text-left px-3 py-2 text-[14px] text-[#C1C1C1] hover:text-[#ECECEC] transition-colors hover:bg-white/5 rounded-lg"
                style={{ 
                  minHeight: '36px',
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
        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-4 text-xs text-gray-400"
            style={{
              fontSize: '12px',
              color: '#9CA3AF'
            }}
          >
            Luna AI can make mistakes. Check important info.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};