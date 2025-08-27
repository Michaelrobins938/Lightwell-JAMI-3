// Hook for syncing memories across devices and sessions

import { useState, useEffect, useCallback } from 'react';
import { Memory } from '../types/memory.types';
import { memoryService } from '../services/memoryService';

interface MemorySyncState {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingSync: boolean;
  syncError: string | null;
}

export function useMemorySync(userId: string) {
  const [syncState, setSyncState] = useState<MemorySyncState>({
    isOnline: navigator.onLine,
    lastSyncTime: null,
    pendingSync: false,
    syncError: null,
  });

  const [localMemories, setLocalMemories] = useState<Memory[]>([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncState(prev => ({ ...prev, isOnline: true }));
      syncMemories(); // Auto-sync when coming back online
    };

    const handleOffline = () => {
      setSyncState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load memories from localStorage when offline
  const loadLocalMemories = useCallback(() => {
    try {
      const stored = localStorage.getItem(`memories_${userId}`);
      if (stored) {
        const memories = JSON.parse(stored) as Memory[];
        setLocalMemories(memories);
        return memories;
      }
    } catch (error) {
      console.error('Failed to load local memories:', error);
    }
    return [];
  }, [userId]);

  // Save memories to localStorage for offline access
  const saveLocalMemories = useCallback((memories: Memory[]) => {
    try {
      localStorage.setItem(`memories_${userId}`, JSON.stringify(memories));
      setLocalMemories(memories);
    } catch (error) {
      console.error('Failed to save local memories:', error);
    }
  }, [userId]);

  // Sync memories with server
  const syncMemories = useCallback(async () => {
    if (!syncState.isOnline || syncState.pendingSync) return;

    setSyncState(prev => ({ ...prev, pendingSync: true, syncError: null }));

    try {
      // Get server memories
      const serverMemories = await memoryService.getMemories(userId);
      
      // Get local memories
      const localMems = loadLocalMemories();
      
      // Merge and resolve conflicts
      const mergedMemories = await mergeMemories(localMems, serverMemories);
      
      // Save merged memories locally
      saveLocalMemories(mergedMemories);
      
      setSyncState(prev => ({
        ...prev,
        lastSyncTime: new Date(),
        pendingSync: false,
      }));

      return mergedMemories;
    } catch (error) {
      setSyncState(prev => ({
        ...prev,
        syncError: error instanceof Error ? error.message : 'Sync failed',
        pendingSync: false,
      }));
      
      // Return local memories if sync fails
      return loadLocalMemories();
    }
  }, [userId, syncState.isOnline, syncState.pendingSync, loadLocalMemories, saveLocalMemories]);

  // Merge local and server memories, resolving conflicts
  const mergeMemories = async (
    localMemories: Memory[],
    serverMemories: Memory[]
  ): Promise<Memory[]> => {
    const merged = new Map<string, Memory>();
    
    // Add server memories (they're the source of truth)
    serverMemories.forEach(memory => {
      merged.set(memory.id, memory);
    });
    
    // Add local memories that don't exist on server
    localMemories.forEach(localMemory => {
      if (!merged.has(localMemory.id)) {
        // This is a local-only memory, upload it
        uploadLocalMemory(localMemory);
      } else {
        // Check if local version is newer
        const serverMemory = merged.get(localMemory.id)!;
        if (new Date(localMemory.updatedAt) > new Date(serverMemory.updatedAt)) {
          // Local version is newer, update server
          updateServerMemory(localMemory);
          merged.set(localMemory.id, localMemory);
        }
      }
    });
    
    return Array.from(merged.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  };

  // Upload local-only memory to server
  const uploadLocalMemory = async (memory: Memory) => {
    try {
      await memoryService.addMemory({
        userId: memory.userId,
        key: memory.key,
        value: memory.value,
        chatId: memory.chatId,
        category: memory.category,
        confidence: memory.confidence,
      });
    } catch (error) {
      console.error('Failed to upload local memory:', error);
    }
  };

  // Update server memory with local changes
  const updateServerMemory = async (memory: Memory) => {
    try {
      await memoryService.updateMemory({
        id: memory.id,
        value: memory.value,
        confidence: memory.confidence,
        category: memory.category,
      });
    } catch (error) {
      console.error('Failed to update server memory:', error);
    }
  };

  // Auto-sync on mount and periodically
  useEffect(() => {
    if (userId) {
      syncMemories();
      
      // Set up periodic sync every 5 minutes when online
      const interval = setInterval(() => {
        if (syncState.isOnline) {
          syncMemories();
        }
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [userId, syncMemories, syncState.isOnline]);

  return {
    ...syncState,
    localMemories,
    syncMemories,
    loadLocalMemories,
    saveLocalMemories,
  };
}

// Hook for handling offline memory operations
export function useOfflineMemory(userId: string) {
  const { isOnline, localMemories, saveLocalMemories } = useMemorySync(userId);
  
  const addOfflineMemory = useCallback((
    memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newMemory: Memory = {
      ...memory,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updated = [...localMemories, newMemory];
    saveLocalMemories(updated);
    
    return newMemory;
  }, [localMemories, saveLocalMemories]);

  const updateOfflineMemory = useCallback((
    id: string,
    updates: Partial<Memory>
  ) => {
    const updated = localMemories.map(memory =>
      memory.id === id
        ? { ...memory, ...updates, updatedAt: new Date() }
        : memory
    );
    
    saveLocalMemories(updated);
  }, [localMemories, saveLocalMemories]);

  const deleteOfflineMemory = useCallback((id: string) => {
    const updated = localMemories.filter(memory => memory.id !== id);
    saveLocalMemories(updated);
  }, [localMemories, saveLocalMemories]);

  return {
    isOnline,
    memories: localMemories,
    addMemory: isOnline ? null : addOfflineMemory,
    updateMemory: isOnline ? null : updateOfflineMemory,
    deleteMemory: isOnline ? null : deleteOfflineMemory,
  };
}