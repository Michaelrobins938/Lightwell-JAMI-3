// React hook for memory management in Luna AI Therapist

import { useState, useEffect, useCallback } from 'react';
import { Memory, MemoryQuery, MemoryUpdate, MemoryContext } from '../types/memory.types';
import { memoryService } from '../services/memoryService';

export function useMemory(userId: string): MemoryContext {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial memories
  const refreshMemories = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedMemories = await memoryService.getMemories(userId);
      setMemories(fetchedMemories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memories');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Auto-load memories when userId changes
  useEffect(() => {
    refreshMemories();
  }, [refreshMemories]);

  // Add new memory
  const addMemory = useCallback(async (
    memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Memory> => {
    setError(null);
    
    try {
      const newMemory = await memoryService.addMemory(memory);
      setMemories(prev => [...prev, newMemory]);
      return newMemory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add memory');
      throw err;
    }
  }, []);

  // Update existing memory
  const updateMemory = useCallback(async (update: MemoryUpdate): Promise<Memory> => {
    setError(null);
    
    try {
      const updatedMemory = await memoryService.updateMemory(update);
      setMemories(prev => 
        prev.map(memory => 
          memory.id === update.id ? updatedMemory : memory
        )
      );
      return updatedMemory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update memory');
      throw err;
    }
  }, []);

  // Delete memory
  const deleteMemory = useCallback(async (id: string) => {
    setError(null);
    
    try {
      await memoryService.deleteMemory(id);
      setMemories(prev => prev.filter(memory => memory.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete memory');
      throw err;
    }
  }, []);

  // Search memories
  const searchMemories = useCallback(async (query: MemoryQuery) => {
    setError(null);
    
    try {
      return await memoryService.searchMemories(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search memories');
      throw err;
    }
  }, []);

  // Extract memories from text
  const extractMemoriesFromText = useCallback(async (
    text: string, 
    chatId?: string
  ) => {
    setError(null);
    
    try {
      return await memoryService.extractMemoriesFromText(text, userId, chatId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract memories');
      throw err;
    }
  }, [userId]);

  return {
    memories,
    isLoading,
    error,
    addMemory,
    updateMemory,
    deleteMemory,
    searchMemories,
    extractMemoriesFromText,
    refreshMemories,
  };
}

// Hook for real-time memory processing during conversations
export function useMemoryProcessor(userId: string) {
  const { addMemory, memories } = useMemory(userId);
  const [isProcessing, setIsProcessing] = useState(false);

  const processMessage = useCallback(async (
    message: string,
    chatId?: string
  ): Promise<Memory[]> => {
    if (!message.trim() || isProcessing) return [];

    setIsProcessing(true);
    
    try {
      const newMemories = await memoryService.processMessageForMemories(
        message,
        userId,
        chatId
      );
      
      return newMemories;
    } catch (error) {
      console.error('Failed to process message for memories:', error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [userId, isProcessing]);

  // Get memory context for AI prompt injection
  const getMemoryContext = useCallback(async (): Promise<string> => {
    try {
      return await memoryService.getMemoryContext(userId);
    } catch (error) {
      console.error('Failed to get memory context:', error);
      return '';
    }
  }, [userId]);

  return {
    processMessage,
    getMemoryContext,
    isProcessing,
    memoryCount: memories.length,
  };
}