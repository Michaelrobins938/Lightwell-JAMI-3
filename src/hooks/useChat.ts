"use client";

import { useState } from 'react';

// Define message type
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useChat() {
  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState('GPT-4o');
  const [conversations, setConversations] = useState([]);

  // Send a new message
  const sendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      // Placeholder for actual API call
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate assistant response
      setTimeout(() => {
        const assistantResponse: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `You said: ${content}. This is a placeholder response.`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to send message', error);
      setIsLoading(false);
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    setMessages([]);
  };

  // Regenerate last response (placeholder)
  const regenerateLastResponse = () => {
    // Logic to regenerate last assistant response
  };

  // File upload handler (placeholder)
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
  };

  // Voice input handler (placeholder)
  const handleVoiceInput = (audioBlob: Blob) => {
    console.log('Voice input received:', audioBlob);
  };

  return {
    messages,
    isLoading,
    currentModel,
    conversations,
    sendMessage,
    startNewConversation,
    regenerateLastResponse,
    handleFileUpload,
    handleVoiceInput,
    setCurrentModel
  };
}