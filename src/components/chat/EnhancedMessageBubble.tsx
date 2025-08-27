import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Expand, Check } from 'lucide-react';

interface EnhancedMessageBubbleProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
  };
  isStreaming?: boolean;
  isTyping?: boolean;
  streamingContent?: string;
  className?: string;
}

export const EnhancedMessageBubble: React.FC<EnhancedMessageBubbleProps> = ({
  message,
  isStreaming = false,
  isTyping = false,
  streamingContent = '',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const displayContent = isStreaming ? streamingContent : message.content;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 bg-[#343541] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          AI
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <motion.div
          className={`px-3 py-2 rounded-2xl ${
            isUser 
              ? 'bg-[#202123] text-white' 
              : 'bg-[#343541] text-white'
          }`}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Message Text */}
          <div className="text-sm leading-6 whitespace-pre-wrap">
            {displayContent}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div className="inline-flex items-center gap-1 ml-2">
                <motion.span
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.span
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
              </motion.div>
            )}
          </div>

          {/* Action Buttons - Show on hover */}
          <AnimatePresence>
            {!isUser && (
              <motion.div
                className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {/* Expand Button */}
                <motion.button
                  onClick={handleExpand}
                  className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Expand message"
                >
                  <Expand className="w-3 h-3" />
                </motion.button>

                {/* Copy Button */}
                <motion.button
                  onClick={handleCopy}
                  className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Copy message"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 bg-[#202123] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          U
        </div>
      )}
    </motion.div>
  );
};

// Typing indicator component for when AI is thinking
export const TypingIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`flex gap-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Avatar */}
      <div className="w-8 h-8 bg-[#343541] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
        AI
      </div>

      {/* Typing Bubble */}
      <div className="max-w-[70%]">
        <div className="px-3 py-2 bg-[#343541] rounded-2xl">
          <div className="flex items-center gap-1">
            <motion.span
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.span
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
