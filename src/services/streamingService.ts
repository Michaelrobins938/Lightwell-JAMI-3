// Streaming service for Luna AI - handles real-time token streaming

export interface StreamingConfig {
  endpoint: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamEvent {
  type: 'token' | 'done' | 'error' | 'thinking';
  data: string;
  timestamp: Date;
}

export class StreamingService {
  private abortController: AbortController | null = null;

  async *streamChat(
    messages: Message[],
    config: StreamingConfig,
    onEvent?: (event: StreamEvent) => void
  ): AsyncGenerator<string, void, unknown> {
    this.abortController = new AbortController();

    try {
      // Emit thinking event
      onEvent?.({
        type: 'thinking',
        data: 'Starting request...',
        timestamp: new Date(),
      });

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          temperature: config.temperature || 0.7,
          max_tokens: config.maxTokens || 4000,
          stream: true,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let hasFirstToken = false;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onEvent?.({
            type: 'done',
            data: 'Stream completed',
            timestamp: new Date(),
          });
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              onEvent?.({
                type: 'done',
                data: 'Stream completed',
                timestamp: new Date(),
              });
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              
              if (delta) {
                if (!hasFirstToken) {
                  hasFirstToken = true;
                  // First token received - thinking phase is over
                }

                onEvent?.({
                  type: 'token',
                  data: delta,
                  timestamp: new Date(),
                });

                yield delta;
              }
            } catch (error) {
              console.warn('Failed to parse streaming chunk:', error);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        onEvent?.({
          type: 'done',
          data: 'Stream aborted',
          timestamp: new Date(),
        });
        return;
      }

      onEvent?.({
        type: 'error',
        data: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      });
      throw error;
    }
  }

  // Stream to OpenAI GPT models
  async *streamOpenAI(
    messages: Message[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {},
    onEvent?: (event: StreamEvent) => void
  ): AsyncGenerator<string, void, unknown> {
    const config: StreamingConfig = {
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: options.model || 'gpt-4o-mini',
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 4000,
      stream: true,
    };

    yield* this.streamChat(messages, config, onEvent);
  }

  // Stream to local Luna API
  async *streamLuna(
    messages: Message[],
    chatId?: string,
    onEvent?: (event: StreamEvent) => void
  ): AsyncGenerator<string, void, unknown> {
    const config: StreamingConfig = {
      endpoint: '/api/chat/stream',
      model: 'luna-therapist',
      temperature: 0.8,
      maxTokens: 4000,
      stream: true,
    };

    // Add chat context if available
    const payload = {
      messages,
      chatId,
      stream: true,
    };

    this.abortController = new AbortController();

    try {
      onEvent?.({
        type: 'thinking',
        data: 'Connecting to Luna...',
        timestamp: new Date(),
      });

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onEvent?.({
            type: 'done',
            data: 'Stream completed',
            timestamp: new Date(),
          });
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';

        for (const chunk of chunks) {
          if (chunk.startsWith('data: ')) {
            const data = chunk.slice(6);
            
            if (data === '[DONE]') {
              onEvent?.({
                type: 'done',
                data: 'Stream completed',
                timestamp: new Date(),
              });
              return;
            }

            if (data.trim()) {
              onEvent?.({
                type: 'token',
                data: data,
                timestamp: new Date(),
              });
              yield data;
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        onEvent?.({
          type: 'done',
          data: 'Stream aborted',
          timestamp: new Date(),
        });
        return;
      }

      onEvent?.({
        type: 'error',
        data: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      });
      throw error;
    }
  }

  // Abort current stream
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // Check if currently streaming
  isStreaming(): boolean {
    return this.abortController !== null;
  }
}

// Global streaming service instance
export const streamingService = new StreamingService();

// React hook for streaming messages
import { useState, useRef, useCallback } from 'react';

export function useStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const streamingServiceRef = useRef(new StreamingService());

  const streamMessage = useCallback(async (
    messages: Message[],
    chatId?: string,
    onComplete?: (fullMessage: string) => void
  ) => {
    setIsStreaming(true);
    setIsThinking(true);
    setCurrentMessage('');
    setError(null);

    let fullMessage = '';
    let hasFirstToken = false;

    try {
      const stream = streamingServiceRef.current.streamLuna(
        messages,
        chatId,
        (event) => {
          switch (event.type) {
            case 'thinking':
              setIsThinking(true);
              break;
            case 'token':
              if (!hasFirstToken) {
                setIsThinking(false); // Stop thinking on first token
                hasFirstToken = true;
              }
              fullMessage += event.data;
              setCurrentMessage(fullMessage);
              break;
            case 'done':
              setIsStreaming(false);
              setIsThinking(false);
              onComplete?.(fullMessage);
              break;
            case 'error':
              setError(event.data);
              setIsStreaming(false);
              setIsThinking(false);
              break;
          }
        }
      );

      // Consume the stream
      for await (const token of stream) {
        // Tokens are handled in the onEvent callback
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Streaming failed');
      setIsStreaming(false);
      setIsThinking(false);
    }
  }, []);

  const stopStreaming = useCallback(() => {
    streamingServiceRef.current.abort();
    setIsStreaming(false);
    setIsThinking(false);
  }, []);

  return {
    isStreaming,
    isThinking,
    currentMessage,
    error,
    streamMessage,
    stopStreaming,
  };
}