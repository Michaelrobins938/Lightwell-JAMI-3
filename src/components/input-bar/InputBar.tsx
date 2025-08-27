"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Paperclip } from 'lucide-react';
import VoiceButton from './VoiceButton';
import AttachmentButton from './AttachmentButton';
import AttachmentPreview from './AttachmentPreview';
import VoiceOverlay from '../voice/VoiceOverlay';
import { useChat } from '../../hooks/useChat';
import { useVoiceSession } from '../../hooks/useVoiceSession';

interface InputBarProps {}

export default function InputBar({}: InputBarProps) {
  const { messages, sendMessage } = useChat();
  const {
    isVoiceActive,
    transcript,
    startVoiceRecording,
    stopVoiceRecording,
    isAssistantSpeaking
  } = useVoiceSession();
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() && !files.length) return;
    sendMessage(text, files);
    setText('');
    setFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <motion.div
        initial={{ y: messages.length > 0 ? 0 : "50%" }}
        animate={{ y: 0 }}
        className={`px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${
          messages.length > 0 ? "fixed bottom-0 left-0 right-0" : "flex-1 flex items-center"
        }`}
      >
        <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full">
          {/* File previews */}
          {files.length > 0 && (
            <AttachmentPreview files={files} onRemove={removeFile} />
          )}

          {/* Input */}
          <div className="flex items-end gap-2">
            <AttachmentButton onFileSelect={handleFileSelect} />

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Lightwell..."
              />
            </div>

            <VoiceButton onClick={startVoiceRecording} isActive={isVoiceActive} />

            <button
              onClick={handleSend}
              disabled={!text.trim() && !files.length}
              className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Voice Overlay */}
      {isVoiceActive && (
        <VoiceOverlay
          transcript={transcript}
          onStop={stopVoiceRecording}
          isAssistantSpeaking={isAssistantSpeaking}
        />
      )}
    </>
  );
}
