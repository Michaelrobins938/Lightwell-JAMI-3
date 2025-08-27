"use client";

import React from 'react';
import { motion } from 'framer-motion';
import MarkdownRenderer from './MarkdownRenderer';
import { Message } from '../../hooks/useChat';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { role, content, isStreaming, attachments } = message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex ${
        role === "user" ? "justify-end" : role === "system" ? "justify-center" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[740px] w-fit rounded-2xl px-4 py-3 shadow-sm ${
          role === "user"
            ? "bg-blue-600 dark:bg-blue-500 text-white"
            : role === "system"
            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        }`}
      >
        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="mb-2 space-y-2">
            {attachments.map((attachment, i) => (
              attachment.type.startsWith("image/") ? (
                <img
                  key={i}
                  src={attachment.url}
                  alt={attachment.name}
                  className="rounded-lg max-h-64 object-cover border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <a
                  key={i}
                  href={attachment.url}
                  download={attachment.name}
                  className="block text-sm underline text-blue-600 dark:text-blue-400"
                >
                  {attachment.name}
                </a>
              )
            ))}
          </div>
        )}

        {/* Message text */}
        <MarkdownRenderer content={content} isStreaming={isStreaming} />

        {/* Streaming indicator */}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-current opacity-50 animate-pulse ml-1" />
        )}
      </div>
    </motion.div>
  );
}
