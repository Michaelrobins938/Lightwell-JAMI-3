import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from '../types/chat.types';

export interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ConversationActions {
  createConversation: (title?: string) => string;
  loadConversation: (conversationId: string) => void;
  selectConversation: (conversationId: string) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  deleteConversation: (conversationId: string) => void;
  startNewConversation: () => string;
  renameConversation: (conversationId: string, newTitle: string) => void;
}

export const useConversations = (userId: string): ConversationState & ConversationActions => {
  const [state, setState] = useState<ConversationState>({
    conversations: [],
    currentConversation: null,
    loading: false,
    isLoading: false,
    error: null
  });

  const loadConversations = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true, error: null }));

      // Load from localStorage for now
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`conversations-${userId}`);
        if (saved) {
          const conversations = JSON.parse(saved).map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt)
          }));
          setState(prev => ({ ...prev, conversations, loading: false }));
        } else {
          setState(prev => ({ ...prev, conversations: [], loading: false }));
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load conversations'
      }));
    }
  }, [userId]);

  const saveConversations = useCallback((conversations: Conversation[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`conversations-${userId}`, JSON.stringify(conversations));
    }
  }, [userId]);

  const createConversation = useCallback((title = 'New Chat') => {
    const conversationId = uuidv4();
    const newConversation: Conversation = {
      id: conversationId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [], // Initialize messages as an empty array
      preview: '', // Initialize preview
      timestamp: new Date(), // Initialize timestamp
      messageCount: 0,
      metadata: { id: conversationId }
    };

    setState(prev => {
      const updatedConversations = [newConversation, ...prev.conversations];
      saveConversations(updatedConversations);
      return {
        ...prev,
        conversations: updatedConversations,
        currentConversation: newConversation
      };
    });

    return conversationId;
  }, [saveConversations]);

  const loadConversation = useCallback((conversationId: string) => {
    setState(prev => {
      const conversation = prev.conversations.find(c => c.id === conversationId);
      return {
        ...prev,
        currentConversation: conversation || null
      };
    });
  }, []);

  const selectConversation = useCallback((conversationId: string) => {
    setState(prev => {
      const conversation = prev.conversations.find(c => c.id === conversationId);
      return {
        ...prev,
        currentConversation: conversation || null
      };
    });
  }, []);

  const updateConversation = useCallback((conversationId: string, updates: Partial<Conversation>) => {
    setState(prev => {
      const updatedConversations = prev.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, ...updates, updatedAt: new Date() }
          : conv
      );
      saveConversations(updatedConversations);
      return {
        ...prev,
        conversations: updatedConversations,
        currentConversation: prev.currentConversation?.id === conversationId
          ? { ...prev.currentConversation, ...updates, updatedAt: new Date() }
          : prev.currentConversation
      };
    });
  }, [saveConversations]);

  const deleteConversation = useCallback((conversationId: string) => {
    setState(prev => {
      const updatedConversations = prev.conversations.filter(c => c.id !== conversationId);
      saveConversations(updatedConversations);
      return {
        ...prev,
        conversations: updatedConversations,
        currentConversation: prev.currentConversation?.id === conversationId
          ? null
          : prev.currentConversation
      };
    });
  }, [saveConversations]);

  const startNewConversation = useCallback(() => {
    return createConversation();
  }, [createConversation]);

  const renameConversation = useCallback((conversationId: string, newTitle: string) => {
    updateConversation(conversationId, { title: newTitle });
  }, [updateConversation]);

  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId, loadConversations]);

  return {
    ...state,
    createConversation,
    loadConversation,
    selectConversation,
    updateConversation,
    deleteConversation,
    startNewConversation,
    renameConversation
  };
};


