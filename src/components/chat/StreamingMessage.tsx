// Enhanced StreamingMessage Component - Fixes Overflow + Auto-TTS + Streaming Voice
// Drop-in replacement that handles overflow, TTS, and real-time voice streaming

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface StreamingMessageProps {
  content: string;
  isStreaming: boolean;
  isThinking?: boolean;
  onStreamComplete?: () => void;
  className?: string;
  isAssistant?: boolean; // New prop to identify assistant messages
  autoTTS?: boolean; // New prop to control TTS behavior
  onTTS?: (text: string) => void; // TTS callback function
}

export function StreamingMessage({ 
  content, 
  isStreaming, 
  isThinking = false,
  onStreamComplete,
  className = '',
  isAssistant = false,
  autoTTS = true,
  onTTS
}: StreamingMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showTypingDots, setShowTypingDots] = useState(true);
  const [hasSpoken, setHasSpoken] = useState(false);
  const contentRef = useRef<string>('');
  const streamingRef = useRef<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);
  
  // Generate a unique sessionId for voice streaming
  const sessionId = useMemo(() => uuidv4(), []);

  // Handle streaming content updates
  useEffect(() => {
    contentRef.current = content;
    streamingRef.current = isStreaming;

    if (content && content.length > 0) {
      // First token arrived - hide typing dots immediately
      setShowTypingDots(false);
      setDisplayedContent(content);
    } else if (isThinking || isStreaming) {
      // Show typing dots while thinking or waiting for first token
      setShowTypingDots(true);
      setDisplayedContent('');
    } else {
      // Not streaming and no content - hide dots
      setShowTypingDots(false);
      setDisplayedContent('');
    }
  }, [content, isStreaming, isThinking]);

  // Handle stream completion and auto-TTS
  useEffect(() => {
    if (!isStreaming && !isThinking && displayedContent) {
      // Stream completed
      setShowTypingDots(false);
      
      // Auto-TTS for assistant messages when stream completes
      if (isAssistant && autoTTS && onTTS && !hasSpoken) {
        // Small delay to ensure content is fully rendered
        setTimeout(() => {
          onTTS(displayedContent);
          setHasSpoken(true);
        }, 100);
      }
      
      onStreamComplete?.();
    }
  }, [isStreaming, isThinking, displayedContent, onStreamComplete, isAssistant, autoTTS, onTTS, hasSpoken]);

  // Reset TTS state when content changes (new message)
  useEffect(() => {
    if (content !== contentRef.current) {
      setHasSpoken(false);
    }
  }, [content]);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {showTypingDots ? (
          <TypingDots key="typing-dots" />
        ) : (
          <StreamingText 
            key="streaming-text"
            content={displayedContent}
            isStreaming={isStreaming}
            ref={messageRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Enhanced TypingDots with better positioning
function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-center space-x-1 py-2"
    >
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500 ml-2">Thinking...</span>
    </motion.div>
  );
}

// Enhanced StreamingText with overflow protection and auto-TTS
const StreamingText = React.forwardRef<HTMLDivElement, { 
  content: string; 
  isStreaming: boolean;
}>(({ content, isStreaming }, ref) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const animationRef = useRef<number | undefined>(undefined);

  // Simulate realistic typing animation
  useEffect(() => {
    if (!content) {
      setDisplayText('');
      return;
    }

    // If not streaming, show all content immediately
    if (!isStreaming) {
      setDisplayText(content);
      setShowCursor(false);
      return;
    }

    // Streaming mode - show content progressively
    setDisplayText(content);
    setShowCursor(true);

  }, [content, isStreaming]);

  // Cursor blinking animation
  useEffect(() => {
    if (!showCursor) return;

    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [showCursor]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="py-2"
    >
      {/* OVERFLOW FIX: Constrained message container */}
      <div className="max-w-2xl w-full whitespace-pre-wrap break-words leading-relaxed">
        <span className="text-gray-200">{displayText}</span>
        {isStreaming && (
          <motion.span
            animate={{ opacity: showCursor ? 1 : 0.3 }}
            transition={{ duration: 0.1 }}
            className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 align-middle"
          />
        )}
      </div>
    </motion.div>
  );
});

StreamingText.displayName = 'StreamingText';

// Enhanced hook for managing streaming state with TTS integration
export function useStreamingMessage(autoTTS: boolean = true) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [content, setContent] = useState('');
  const [hasFirstToken, setHasFirstToken] = useState(false);

  const startThinking = () => {
    setIsThinking(true);
    setIsStreaming(false);
    setContent('');
    setHasFirstToken(false);
  };

  const startStreaming = () => {
    setIsThinking(false);
    setIsStreaming(true);
    setContent('');
    setHasFirstToken(false);
  };

  const appendToken = (token: string) => {
    setContent(prev => {
      const newContent = prev + token;
      if (!hasFirstToken && token.trim()) {
        setHasFirstToken(true);
        setIsThinking(false); // Stop thinking immediately on first token
      }
      return newContent;
    });
  };

  const completeStream = () => {
    setIsStreaming(false);
    setIsThinking(false);
  };

  const reset = () => {
    setIsStreaming(false);
    setIsThinking(false);
    setContent('');
    setHasFirstToken(false);
  };

  return {
    isStreaming,
    isThinking,
    content,
    hasFirstToken,
    startThinking,
    startStreaming,
    appendToken,
    completeStream,
    reset,
  };
}

// New: MessageBubble component that handles both overflow and auto-TTS
export function MessageBubble({ 
  message, 
  isAssistant = false, 
  isStreaming = false,
  autoTTS = true,
  onTTS 
}: {
  message: string;
  isAssistant: boolean;
  isStreaming?: boolean;
  autoTTS?: boolean;
  onTTS?: (text: string) => void;
}) {
  const [hasSpoken, setHasSpoken] = useState(false);

  // Auto-TTS when message changes and it's an assistant message
  useEffect(() => {
    if (isAssistant && autoTTS && onTTS && !hasSpoken && message && !isStreaming) {
      // Small delay to ensure content is fully rendered
      setTimeout(() => {
        onTTS(message);
        setHasSpoken(true);
      }, 100);
    }
  }, [message, isAssistant, autoTTS, onTTS, hasSpoken, isStreaming]);

  // Reset TTS state when message changes
  useEffect(() => {
    setHasSpoken(false);
  }, [message]);

  return (
    <div className={`mb-4 ${isAssistant ? "text-gray-200" : "text-blue-400"}`}>
      {/* OVERFLOW FIX: Constrained message container */}
      <div className="max-w-2xl w-full whitespace-pre-wrap break-words leading-relaxed">
        {message}
      </div>
    </div>
  );
}

// New: ChatContainer component that handles scrolling and overflow
export function ChatContainer({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when children change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [children]);

  return (
    <div className={`flex-1 overflow-y-auto px-4 py-6 ${className}`}>
      {children}
      <div ref={bottomRef} />
    </div>
  );
}