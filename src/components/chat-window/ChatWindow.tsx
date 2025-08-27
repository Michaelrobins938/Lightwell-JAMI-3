import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import { Message } from '../../hooks/useChat';
import { CopyButton } from '../shared/CopyButton';
import { ThumbsUpDownButtons } from '../shared/ThumbsUpDownButtons';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onRegenerateResponse?: (messageId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  isLoading, 
  onRegenerateResponse 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Render individual message
  const renderMessage = (message: Message, index: number) => {
    const isAssistant = message.role === 'assistant';
    const isLastMessage = index === messages.length - 1;

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={`flex mb-6 ${isAssistant ? 'justify-start' : 'justify-end'}`}
      >
        <div 
          className={`
            max-w-2xl w-full p-4 rounded-2xl 
            ${isAssistant 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
              : 'bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-gray-100'}
            relative
          `}
        >
          {/* Message Content with Markdown Rendering */}
          <div className="prose dark:prose-invert max-w-full">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative">
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                      <CopyButton 
                        text={String(children)} 
                        className="absolute top-2 right-2" 
                      />
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Message Actions */}
          {isAssistant && (
            <div className="flex items-center justify-end space-x-2 mt-2">
              <ThumbsUpDownButtons 
                onPositiveFeedback={() => {/* Implement feedback logic */}}
                onNegativeFeedback={() => {/* Implement feedback logic */}}
              />
              {isLastMessage && isLoading && (
                <button 
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => onRegenerateResponse?.(message.id)}
                >
                  Stop Generating
                </button>
              )}
              {isLastMessage && !isLoading && (
                <button 
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => onRegenerateResponse?.(message.id)}
                >
                  Regenerate
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Render loading indicator
  const renderLoadingIndicator = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center my-4"
    >
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </motion.div>
  );

  // Render welcome state when no messages
  const renderWelcomeState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6 flex items-center justify-center">
        <span className="text-2xl text-white">🧠</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Hello! I'm JAMI-3
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        I'm here to provide therapeutic support and help you work through your thoughts and emotions.
      </p>
    </motion.div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Welcome State */}
        {messages.length === 0 && renderWelcomeState()}

        {/* Messages */}
        <AnimatePresence>
          {messages.map(renderMessage)}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && renderLoadingIndicator()}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
