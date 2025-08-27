import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import TypingIndicator from './TypingIndicator';
import { fadeIn, slideDown } from '../utils/animations';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatWindowProps {
  messages?: Message[];
  isTyping?: boolean;
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages = [],
  isTyping = false,
  className = '',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!messages || messages.length === 0 && !isTyping) {
    return (
      <motion.div
        className={`flex-1 flex items-center justify-center ${className}`}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Bot className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">
            Ready to help
          </h2>
          <p className="text-gray-500 text-sm">
            Start a conversation by typing a message below
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto px-4 py-6 ${className}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence>
          {messages && messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
              variants={slideDown}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === 'user'
                    ? 'bg-gray-800 text-gray-200'
                    : 'bg-transparent text-gray-200'
                } rounded-2xl px-4 py-3`}
              >
                <div className="flex items-start gap-3">
                  {message.sender === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    {message.sender === 'user' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-300" />
                        </div>
                        <span className="text-xs text-gray-400">You</span>
                      </div>
                    )}
                    
                    <div className="prose prose-sm max-w-none">
                      {message.isStreaming ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="whitespace-pre-wrap"
                        >
                          {message.content}
                          <motion.span
                            className="inline-block w-2 h-4 bg-purple-500 ml-1"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </motion.div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="flex justify-start"
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="max-w-[70%] bg-transparent text-gray-200 rounded-2xl px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 pt-2">
                  <TypingIndicator />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;