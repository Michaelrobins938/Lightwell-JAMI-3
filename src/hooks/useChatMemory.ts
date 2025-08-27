import { useState, useCallback, useEffect } from 'react';

export interface MemoryEntry {
  id: string;
  userId: string;
  type: 'conversation' | 'preference' | 'context' | 'emotional';
  content: string;
  metadata: {
    timestamp: Date;
    relevance: number;
    tags: string[];
    source: string;
  };
}

export interface ConversationMemory {
  summary: string;
  keyTopics: string[];
  emotionalContext: string;
  preferences: Record<string, any>;
}

export interface UseChatMemoryReturn {
  memories: MemoryEntry[];
  conversationMemory: ConversationMemory | null;
  isLoading: boolean;
  error: string | null;
  addMemory: (memory: Omit<MemoryEntry, 'id'>) => Promise<void>;
  getRelevantMemories: (query: string, limit?: number) => Promise<MemoryEntry[]>;
  updateConversationMemory: (updates: Partial<ConversationMemory>) => Promise<void>;
  clearMemories: () => Promise<void>;
  searchMemories: (query: string) => Promise<MemoryEntry[]>;
}

export function useChatMemory(userId: string): UseChatMemoryReturn {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [conversationMemory, setConversationMemory] = useState<ConversationMemory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load memories on mount
  useEffect(() => {
    loadMemories();
    loadConversationMemory();
  }, [userId]);

  const loadMemories = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/memory?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to load memories: ${response.status}`);
      }

      const data = await response.json();
      setMemories(data.memories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memories');
      console.error('Memory loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadConversationMemory = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/memory/conversation?userId=${userId}`);
      if (!response.ok) {
        if (response.status === 404) {
          // No conversation memory exists yet, this is normal
          return;
        }
        throw new Error(`Failed to load conversation memory: ${response.status}`);
      }

      const data = await response.json();
      setConversationMemory(data);
    } catch (err) {
      console.error('Conversation memory loading error:', err);
      // Don't set error state for this, as it's not critical
    }
  }, [userId]);

  const addMemory = useCallback(async (memory: Omit<MemoryEntry, 'id'>) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    try {
      const newMemory: MemoryEntry = {
        ...memory,
        id: Date.now().toString(),
      };

      const response = await fetch('/api/memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMemory),
      });

      if (!response.ok) {
        throw new Error(`Failed to add memory: ${response.status}`);
      }

      setMemories(prev => [...prev, newMemory]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add memory');
      console.error('Memory addition error:', err);
    }
  }, [userId]);

  const getRelevantMemories = useCallback(async (query: string, limit = 5): Promise<MemoryEntry[]> => {
    if (!userId || !query.trim()) {
      return [];
    }

    try {
      const response = await fetch('/api/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          query,
          limit,
          type: 'relevant',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get relevant memories: ${response.status}`);
      }

      const data = await response.json();
      return data.memories || [];
    } catch (err) {
      console.error('Relevant memories retrieval error:', err);
      return [];
    }
  }, [userId]);

  const searchMemories = useCallback(async (query: string): Promise<MemoryEntry[]> => {
    if (!userId || !query.trim()) {
      return [];
    }

    try {
      const response = await fetch('/api/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          query,
          type: 'search',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to search memories: ${response.status}`);
      }

      const data = await response.json();
      return data.memories || [];
    } catch (err) {
      console.error('Memory search error:', err);
      return [];
    }
  }, [userId]);

  const updateConversationMemory = useCallback(async (updates: Partial<ConversationMemory>) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    try {
      const updatedMemory = {
        ...conversationMemory,
        ...updates,
      };

      const response = await fetch('/api/memory/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          memory: updatedMemory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update conversation memory: ${response.status}`);
      }

      setConversationMemory(updatedMemory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation memory');
      console.error('Conversation memory update error:', err);
    }
  }, [userId, conversationMemory]);

  const clearMemories = useCallback(async () => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    try {
      const response = await fetch(`/api/memory?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to clear memories: ${response.status}`);
      }

      setMemories([]);
      setConversationMemory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear memories');
      console.error('Memory clearing error:', err);
    }
  }, [userId]);

  return {
    memories,
    conversationMemory,
    isLoading,
    error,
    addMemory,
    getRelevantMemories,
    updateConversationMemory,
    clearMemories,
    searchMemories,
  };
}