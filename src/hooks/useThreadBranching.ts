import { useState, useCallback, useRef, useEffect } from 'react';

export interface ThreadMessage {
  id: string;
  parentId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  threadId: string;
  branchIndex?: number;
  metadata?: Record<string, any>;
}

export interface Thread {
  id: string;
  messages: ThreadMessage[];
  parentMessageId?: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UseThreadBranchingOptions {
  userId?: string;
  autoSave?: boolean;
  maxThreads?: number;
}

export interface UseThreadBranchingReturn {
  threads: Thread[];
  currentThread: Thread | null;
  activeThreadId: string | null;
  isLoading: boolean;
  error: string | null;
  tree: any;
  currentPath: string[];
  isNavigatingHistory: boolean;
  isInitialized: boolean;
  showBranchVisualization: boolean;
  selectedBranchId: string | null;
  initializeThread: (threadId?: string) => Promise<void>;
  addMessage: (message: Omit<ThreadMessage, 'id' | 'threadId'>) => Promise<void>;
  createBranch: (fromMessageId: string, content: string) => Promise<Thread>;
  switchBranch: (branchId: string) => void;
  deleteBranch: (branchId: string) => Promise<void>;
  toggleBranchVisualization: () => void;
  navigateToNode: (nodeId: string) => void;
  returnToPresent: () => void;
  getThreadStats: () => any;
  createThread: (fromMessageId?: string, title?: string) => Promise<Thread>;
  switchThread: (threadId: string) => void;
  addMessageToThread: (threadId: string, message: Omit<ThreadMessage, 'id' | 'threadId'>) => Promise<void>;
  branchFromMessage: (messageId: string, newContent: string) => Promise<Thread>;
  mergeThreads: (sourceThreadId: string, targetThreadId: string) => Promise<void>;
  deleteThread: (threadId: string) => Promise<void>;
  getMessageBranches: (messageId: string) => ThreadMessage[];
  saveThreads: () => Promise<void>;
  loadThreads: () => Promise<void>;
}

export function useThreadBranching({
  userId = 'default-user',
  autoSave = true,
  maxThreads = 10
}: UseThreadBranchingOptions = {}): UseThreadBranchingReturn {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isNavigatingHistory, setIsNavigatingHistory] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showBranchVisualization, setShowBranchVisualization] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentThread = threads.find(t => t.id === activeThreadId) || null;
  
  // Build thread tree structure
  const tree = threads.reduce((acc, thread) => {
    acc[thread.id] = {
      ...thread,
      children: threads.filter(t => t.parentMessageId && 
        thread.messages.some(m => m.id === t.parentMessageId))
    };
    return acc;
  }, {} as any);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && threads.length > 0) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        saveThreads();
      }, 1000); // Auto-save after 1 second of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [threads, autoSave]);

  // Load threads on mount
  useEffect(() => {
    loadThreads();
  }, [userId]);

  const createThread = useCallback(async (fromMessageId?: string, title?: string): Promise<Thread> => {
    const newThread: Thread = {
      id: Date.now().toString(),
      messages: [],
      parentMessageId: fromMessageId,
      title: title || `Thread ${threads.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setThreads(prev => {
      const updated = [...prev, newThread];
      // Keep only the most recent threads if we exceed the limit
      if (updated.length > maxThreads) {
        updated.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        return updated.slice(0, maxThreads);
      }
      return updated;
    });

    setActiveThreadId(newThread.id);
    return newThread;
  }, [threads.length, maxThreads]);

  const switchThread = useCallback((threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setActiveThreadId(threadId);
      setError(null);
    } else {
      setError(`Thread ${threadId} not found`);
    }
  }, [threads]);

  const addMessageToThread = useCallback(async (threadId: string, message: Omit<ThreadMessage, 'id' | 'threadId'>) => {
    const newMessage: ThreadMessage = {
      ...message,
      id: Date.now().toString(),
      threadId,
    };

    setThreads(prev => 
      prev.map(thread => 
        thread.id === threadId
          ? {
              ...thread,
              messages: [...thread.messages, newMessage],
              updatedAt: new Date(),
            }
          : thread
      )
    );
  }, []);

  const branchFromMessage = useCallback(async (messageId: string, newContent: string): Promise<Thread> => {
    // Find the message and its thread
    let sourceThread: Thread | null = null;
    let messageIndex = -1;

    for (const thread of threads) {
      const index = thread.messages.findIndex(m => m.id === messageId);
      if (index !== -1) {
        sourceThread = thread;
        messageIndex = index;
        break;
      }
    }

    if (!sourceThread || messageIndex === -1) {
      throw new Error('Message not found for branching');
    }

    // Create a new thread with messages up to the branch point
    const branchThread: Thread = {
      id: Date.now().toString(),
      messages: sourceThread.messages.slice(0, messageIndex + 1),
      parentMessageId: messageId,
      title: `Branch from ${sourceThread.title}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add the new message to the branch
    const newMessage: ThreadMessage = {
      id: (Date.now() + 1).toString(),
      parentId: messageId,
      role: 'user',
      content: newContent,
      timestamp: new Date(),
      threadId: branchThread.id,
      branchIndex: 1,
    };

    branchThread.messages.push(newMessage);

    setThreads(prev => {
      const updated = [...prev, branchThread];
      if (updated.length > maxThreads) {
        updated.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        return updated.slice(0, maxThreads);
      }
      return updated;
    });

    setActiveThreadId(branchThread.id);
    return branchThread;
  }, [threads, maxThreads]);

  const mergeThreads = useCallback(async (sourceThreadId: string, targetThreadId: string) => {
    const sourceThread = threads.find(t => t.id === sourceThreadId);
    const targetThread = threads.find(t => t.id === targetThreadId);

    if (!sourceThread || !targetThread) {
      setError('One or both threads not found for merging');
      return;
    }

    // Merge messages, avoiding duplicates
    const mergedMessages = [...targetThread.messages];
    const targetMessageIds = new Set(targetThread.messages.map(m => m.id));

    for (const message of sourceThread.messages) {
      if (!targetMessageIds.has(message.id)) {
        mergedMessages.push({
          ...message,
          threadId: targetThreadId,
        });
      }
    }

    // Sort messages by timestamp
    mergedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    setThreads(prev =>
      prev
        .filter(t => t.id !== sourceThreadId) // Remove source thread
        .map(thread =>
          thread.id === targetThreadId
            ? {
                ...thread,
                messages: mergedMessages,
                updatedAt: new Date(),
              }
            : thread
        )
    );

    setActiveThreadId(targetThreadId);
  }, [threads]);

  const deleteThread = useCallback(async (threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
    
    if (activeThreadId === threadId) {
      const remainingThreads = threads.filter(t => t.id !== threadId);
      setActiveThreadId(remainingThreads.length > 0 ? remainingThreads[0].id : null);
    }
  }, [threads, activeThreadId]);

  const getMessageBranches = useCallback((messageId: string): ThreadMessage[] => {
    const branches: ThreadMessage[] = [];

    for (const thread of threads) {
      const branchMessages = thread.messages.filter(m => m.parentId === messageId);
      branches.push(...branchMessages);
    }

    return branches.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [threads]);

  const saveThreads = useCallback(async () => {
    if (!userId || threads.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          threads,
          activeThreadId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save threads: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save threads');
      console.error('Thread saving error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, threads, activeThreadId]);

  const loadThreads = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/threads?userId=${userId}`);
      
      if (response.status === 404) {
        // No threads exist yet, create a default one
        const defaultThread = await createThread(undefined, 'Main Thread');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to load threads: ${response.status}`);
      }

      const data = await response.json();
      setThreads(data.threads || []);
      setActiveThreadId(data.activeThreadId || (data.threads?.[0]?.id) || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load threads');
      console.error('Thread loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, createThread]);

  // Additional missing functions
  const initializeThread = useCallback(async (threadId?: string) => {
    setIsInitialized(true);
    if (threadId && threadId !== activeThreadId) {
      switchThread(threadId);
    }
  }, [activeThreadId, switchThread]);

  const addMessage = useCallback(async (message: Omit<ThreadMessage, 'id' | 'threadId'>) => {
    if (!activeThreadId) return;
    await addMessageToThread(activeThreadId, message);
  }, [activeThreadId, addMessageToThread]);

  const createBranch = useCallback(async (fromMessageId: string, content: string): Promise<Thread> => {
    return await branchFromMessage(fromMessageId, content);
  }, [branchFromMessage]);

  const getThreadStats = useCallback(() => {
    return {
      totalThreads: threads.length,
      totalMessages: threads.reduce((sum, t) => sum + t.messages.length, 0),
      activeThread: currentThread?.title || 'None',
    };
  }, [threads, currentThread]);

  const switchBranch = useCallback((branchId: string) => {
    setSelectedBranchId(branchId);
    setActiveThreadId(branchId);
  }, []);

  const deleteBranch = useCallback(async (branchId: string): Promise<void> => {
    await deleteThread(branchId);
  }, [deleteThread]);

  const toggleBranchVisualization = useCallback(() => {
    setShowBranchVisualization(prev => !prev);
  }, []);

  const navigateToNode = useCallback((nodeId: string) => {
    const targetThread = threads.find(thread => 
      thread.messages.some(msg => msg.id === nodeId)
    );
    if (targetThread) {
      setActiveThreadId(targetThread.id);
      setCurrentPath(prev => [...prev, nodeId]);
      setIsNavigatingHistory(true);
    }
  }, [threads]);

  const returnToPresent = useCallback(() => {
    setIsNavigatingHistory(false);
    setCurrentPath([]);
    if (threads.length > 0) {
      setActiveThreadId(threads[0].id);
    }
  }, [threads]);

  return {
    threads,
    currentThread,
    activeThreadId,
    isLoading,
    error,
    tree,
    currentPath,
    isNavigatingHistory,
    isInitialized,
    showBranchVisualization,
    selectedBranchId,
    initializeThread,
    addMessage,
    createBranch,
    switchBranch,
    deleteBranch,
    toggleBranchVisualization,
    navigateToNode,
    returnToPresent,
    getThreadStats,
    createThread,
    switchThread,
    addMessageToThread,
    branchFromMessage,
    mergeThreads,
    deleteThread,
    getMessageBranches,
    saveThreads,
    loadThreads,
  };
}