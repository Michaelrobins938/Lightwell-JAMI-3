import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface StreamingChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface UseStreamingChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  isThinking: boolean;
  currentStreamingMessage: string;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  editMessage: (id: string, content: string) => void;
  clearMessages: () => void;
  clearError: () => void;
  retryLastMessage: () => Promise<void>;
  stopStreaming: () => void;
  setError: (error: string | null) => void;
}

export function useStreamingChat(userId?: string, conversationId?: string): UseStreamingChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsThinking(false);
    setCurrentStreamingMessage('');
  }, []);

  const sendMessage = useCallback(async (content: string, options?: any) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      parentId: options?.parentId,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setIsThinking(true);
    setCurrentStreamingMessage('');
    setError(null);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userId,
          stream: true,
          ...options,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsThinking(false);

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
        parentId: userMessage.id,
      };

      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                done = true;
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const token = parsed.choices?.[0]?.delta?.content || '';
                
                if (token) {
                  accumulatedContent += token;
                  setCurrentStreamingMessage(accumulatedContent);
                  
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessage.id
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  );
                }
              } catch (parseError) {
                console.warn('Failed to parse streaming data:', parseError);
              }
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, this is expected
        return;
      }
      
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Streaming chat error:', err);
    } finally {
      setIsStreaming(false);
      setIsThinking(false);
      setCurrentStreamingMessage('');
      abortControllerRef.current = null;
    }
  }, [messages, userId]);

  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    // Find the message and its position
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const message = messages[messageIndex];
    if (message.role !== 'user') return; // Only allow editing user messages

    // Update the message content
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: newContent }
          : msg
      )
    );

    // Remove all messages after the edited message
    const messagesToKeep = messages.slice(0, messageIndex + 1);
    setMessages(messagesToKeep.map(msg =>
      msg.id === messageId
        ? { ...msg, content: newContent }
        : msg
    ));

    // Re-send the conversation from this point
    await sendMessage(newContent, message.parentId);
  }, [messages, sendMessage]);

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    if (!lastUserMessage) return;

    // Remove the last assistant response if it exists
    const lastAssistantIndex = messages.findIndex(
      msg => msg.role === 'assistant' && msg.parentId === lastUserMessage.id
    );

    if (lastAssistantIndex !== -1) {
      setMessages(prev => prev.slice(0, lastAssistantIndex));
    }

    // Retry the last message
    await sendMessage(lastUserMessage.content, lastUserMessage.parentId);
  }, [messages, sendMessage]);

  const clearMessages = useCallback(() => {
    stopStreaming();
    setMessages([]);
    setCurrentStreamingMessage('');
    setError(null);
  }, [stopStreaming]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading: isStreaming,
    isStreaming,
    isThinking,
    currentStreamingMessage,
    error,
    sendMessage,
    editMessage,
    clearMessages,
    clearError,
    retryLastMessage,
    stopStreaming,
    setError,
  };
}