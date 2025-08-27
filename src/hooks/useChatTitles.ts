import { useState, useCallback, useEffect } from 'react';

export interface ChatTitle {
  id: string;
  title: string;
  conversationId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastActivity: Date;
  isPinned?: boolean;
  tags?: string[];
}

export interface UseChatTitlesReturn {
  titles: ChatTitle[];
  currentTitle: ChatTitle | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  generateTitle: (conversationId: string, messages: any[]) => Promise<string>;
  saveTitle: (conversationId: string, title: string) => Promise<void>;
  updateTitle: (titleId: string, newTitle: string) => Promise<void>;
  deleteTitle: (titleId: string) => Promise<void>;
  loadTitles: (userId: string) => Promise<void>;
  pinTitle: (titleId: string) => Promise<void>;
  unpinTitle: (titleId: string) => Promise<void>;
  searchTitles: (query: string) => ChatTitle[];
  getTitleByConversationId: (conversationId: string) => ChatTitle | null;
  clearTitles: () => void;
}

export function useChatTitles(): UseChatTitlesReturn {
  const [titles, setTitles] = useState<ChatTitle[]>([]);
  const [currentTitle, setCurrentTitle] = useState<ChatTitle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTitle = useCallback(async (conversationId: string, messages: any[]): Promise<string> => {
    setIsGenerating(true);
    try {
      // Use the first few messages to generate a title
      const firstMessages = messages.slice(0, 3).map(msg => msg.content).join(' ');
      const truncated = firstMessages.substring(0, 200);

      const response = await fetch('/api/chat/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          messages: truncated,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate title: ${response.status}`);
      }

      const data = await response.json();
      return data.title || `Chat ${new Date().toLocaleDateString()}`;
    } catch (err) {
      console.error('Title generation error:', err);
      // Fallback to a simple title based on first message
      const firstUserMessage = messages.find(msg => msg.role === 'user');
      if (firstUserMessage) {
        const words = firstUserMessage.content.split(' ').slice(0, 5);
        return words.join(' ') + (firstUserMessage.content.split(' ').length > 5 ? '...' : '');
      }
      return `Chat ${new Date().toLocaleDateString()}`;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const saveTitle = useCallback(async (conversationId: string, title: string) => {
    setError(null);

    try {
      const response = await fetch('/api/chat/titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          title,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save title: ${response.status}`);
      }

      const savedTitle = await response.json();
      
      setTitles(prev => {
        const existing = prev.find(t => t.conversationId === conversationId);
        if (existing) {
          return prev.map(t => 
            t.conversationId === conversationId 
              ? { ...t, title, updatedAt: new Date() }
              : t
          );
        } else {
          return [...prev, savedTitle];
        }
      });

      if (currentTitle?.conversationId === conversationId) {
        setCurrentTitle(prev => prev ? { ...prev, title } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save title');
      console.error('Title save error:', err);
    }
  }, [currentTitle]);

  const updateTitle = useCallback(async (titleId: string, newTitle: string) => {
    setError(null);

    try {
      const response = await fetch(`/api/chat/titles/${titleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update title: ${response.status}`);
      }

      setTitles(prev => 
        prev.map(t => 
          t.id === titleId 
            ? { ...t, title: newTitle, updatedAt: new Date() }
            : t
        )
      );

      if (currentTitle?.id === titleId) {
        setCurrentTitle(prev => prev ? { ...prev, title: newTitle } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update title');
      console.error('Title update error:', err);
    }
  }, [currentTitle]);

  const deleteTitle = useCallback(async (titleId: string) => {
    setError(null);

    try {
      const response = await fetch(`/api/chat/titles/${titleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete title: ${response.status}`);
      }

      setTitles(prev => prev.filter(t => t.id !== titleId));

      if (currentTitle?.id === titleId) {
        setCurrentTitle(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete title');
      console.error('Title delete error:', err);
    }
  }, [currentTitle]);

  const loadTitles = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat/titles?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load titles: ${response.status}`);
      }

      const data = await response.json();
      setTitles(data.titles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load titles');
      console.error('Titles loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pinTitle = useCallback(async (titleId: string) => {
    setError(null);

    try {
      const response = await fetch(`/api/chat/titles/${titleId}/pin`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to pin title: ${response.status}`);
      }

      setTitles(prev => 
        prev.map(t => 
          t.id === titleId 
            ? { ...t, isPinned: true, updatedAt: new Date() }
            : t
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pin title');
      console.error('Title pin error:', err);
    }
  }, []);

  const unpinTitle = useCallback(async (titleId: string) => {
    setError(null);

    try {
      const response = await fetch(`/api/chat/titles/${titleId}/pin`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to unpin title: ${response.status}`);
      }

      setTitles(prev => 
        prev.map(t => 
          t.id === titleId 
            ? { ...t, isPinned: false, updatedAt: new Date() }
            : t
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpin title');
      console.error('Title unpin error:', err);
    }
  }, []);

  const searchTitles = useCallback((query: string): ChatTitle[] => {
    if (!query.trim()) return titles;

    const lowercaseQuery = query.toLowerCase();
    return titles.filter(title =>
      title.title.toLowerCase().includes(lowercaseQuery) ||
      title.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [titles]);

  const getTitleByConversationId = useCallback((conversationId: string): ChatTitle | null => {
    return titles.find(t => t.conversationId === conversationId) || null;
  }, [titles]);

  const clearTitles = useCallback(() => {
    setTitles([]);
    setCurrentTitle(null);
    setError(null);
  }, []);

  return {
    titles,
    currentTitle,
    isLoading,
    isGenerating,
    error,
    generateTitle,
    saveTitle,
    updateTitle,
    deleteTitle,
    loadTitles,
    pinTitle,
    unpinTitle,
    searchTitles,
    getTitleByConversationId,
    clearTitles,
  };
}