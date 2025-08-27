export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterService {
  private apiKey: string;
  private baseUrl: string;
  private isServer: boolean;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
    this.isServer = typeof window === 'undefined';
  }

  async openRouterChatCompletion(
    messages: ChatMessage[],
    model: string = 'anthropic/claude-3.5-sonnet',
    maxTokens: number = 1000,
    temperature: number = 0.7
  ): Promise<ChatCompletionResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenRouter API key not configured');
      }

      if (!this.isServer) {
        throw new Error('OpenRouter service is only available on the server side');
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
          'X-Title': 'Luna AI Therapy Platform'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: maxTokens,
          temperature: temperature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error(`OpenRouter API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async streamChatCompletion(
    messages: ChatMessage[],
    model: string = 'anthropic/claude-3.5-sonnet',
    maxTokens: number = 1000,
    temperature: number = 0.7
  ): Promise<ReadableStream> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenRouter API key not configured');
      }

      if (!this.isServer) {
        throw new Error('OpenRouter service is only available on the server side');
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
          'X-Title': 'Luna AI Therapy Platform'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: maxTokens,
          temperature: temperature,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter streaming request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.body!;
    } catch (error) {
      console.error('OpenRouter streaming error:', error);
      throw new Error(`OpenRouter streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        return false;
      }

      if (!this.isServer) {
        return false;
      }

      // Test the API key with a simple request
      await this.openRouterChatCompletion([
        { role: 'user', content: 'Hello' }
      ], 'anthropic/claude-3.5-sonnet', 10);

      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  getAvailableModels(): string[] {
    return [
      'anthropic/claude-3.5-sonnet',
      'anthropic/claude-3-haiku',
      'openai/gpt-4o',
      'openai/gpt-4o-mini',
      'meta-llama/llama-3.1-8b-instruct',
      'meta-llama/llama-3.1-70b-instruct',
    ];
  }

  // Client-side safe method to check if service is available
  isAvailable(): boolean {
    return this.isServer && this.apiKey !== '';
  }
}

// Export a singleton instance
export const openRouterService = new OpenRouterService();

// Export the main function for backward compatibility
export const openRouterChatCompletion = (
  messages: ChatMessage[],
  model?: string,
  maxTokens?: number,
  temperature?: number
) => {
  return openRouterService.openRouterChatCompletion(messages, model, maxTokens, temperature);
};