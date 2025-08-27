/**
 * Chat Feature Module
 * 
 * Real-time chat functionality with streaming responses,
 * file uploads, and message management.
 */

// Components
export { default as ChatWindow } from './components/ChatWindow';
export { default as ChatInput } from './components/ChatInput'; 
export { default as ChatMessage } from './components/ChatMessage';
export { default as TypingIndicator } from './components/TypingIndicator';

// Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  attachments?: { name: string; url: string; type: string }[];
  timestamp: Date;
}

export interface ChatConfig {
  maxMessages: number;
  enableFileUpload: boolean;
  enableVoiceMessages: boolean;
  streamingEnabled: boolean;
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
}

// Default configuration
export const defaultChatConfig: ChatConfig = {
  maxMessages: 1000,
  enableFileUpload: true,
  enableVoiceMessages: true,
  streamingEnabled: true,
  maxFileSize: 10,
  allowedFileTypes: ['image/*', 'text/*', 'application/pdf']
};

// Feature state
let initialized = false;
let config = defaultChatConfig;

/**
 * Initialize the chat feature
 */
export async function initializeChat(): Promise<boolean> {
  try {
    console.log('Initializing Chat feature...');
    
    // Chat components are ready to use
    initialized = true;
    
    console.log('✅ Chat feature initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize Chat feature:', error);
    return false;
  }
}

/**
 * Update chat configuration
 */
export function updateChatConfig(newConfig: Partial<ChatConfig>) {
  config = { ...config, ...newConfig };
}

/**
 * Get current chat status
 */
export function getChatStatus() {
  return {
    initialized,
    config
  };
}