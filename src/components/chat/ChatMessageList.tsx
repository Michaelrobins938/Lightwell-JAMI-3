import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import { useScrollLock } from '../../hooks/useScrollLock';
import { ChatMessage as ChatMessageType } from '../../hooks/useChatStream';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isStreaming?: boolean;
}

export default function ChatMessageList({ messages, isStreaming = false }: ChatMessageListProps) {
  const { scrollRef, handleScroll } = useScrollLock([messages.length, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-4">
        <h1 className="text-4xl font-normal text-white">
          Ready when you are.
        </h1>
      </div>
    );
  }

  return (
    <div 
      className="px-4 py-6 space-y-4 overflow-y-auto"
      onScroll={handleScroll}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <ChatMessage 
                message={{
                  id: message.id,
                  role: message.role,
                  content: message.content,
                  timestamp: message.timestamp,
                  isStreaming: isStreaming && index === messages.length - 1
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div ref={scrollRef} />
    </div>
  );
}