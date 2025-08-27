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

export class OpenAIService {
  private apiKey: string;
  private baseUrl: string;
  private isServer: boolean;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
    this.isServer = typeof window === 'undefined';
  }

  async chatCompletion(
    messages: ChatMessage[],
    model: string = 'gpt-4o',
    maxTokens: number = 1000,
    temperature: number = 0.7
  ): Promise<ChatCompletionResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      if (!this.isServer) {
        throw new Error('OpenAI service is only available on the server side');
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: maxTokens,
          temperature: temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async streamChatCompletion(
    messages: ChatMessage[],
    model: string = 'gpt-4o',
    maxTokens: number = 1000,
    temperature: number = 0.7
  ): Promise<ReadableStream> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      if (!this.isServer) {
        throw new Error('OpenAI service is only available on the server side');
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      return response.body as ReadableStream;
    } catch (error) {
      console.error('OpenAI streaming error:', error);
      throw new Error(`OpenAI streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      await this.chatCompletion([
        { role: 'user', content: 'Hello' }
      ], 'gpt-4o', 10);

      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  getAvailableModels(): string[] {
    return [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
    ];
  }

  // Client-side safe method to check if service is available
  isAvailable(): boolean {
    return this.isServer && this.apiKey !== '';
  }
}

// Export a singleton instance
export const openAIService = new OpenAIService();

// Export the main function for backward compatibility
export const openAIChatCompletion = (
  messages: ChatMessage[],
  model?: string,
  maxTokens?: number,
  temperature?: number
) => {
  return openAIService.chatCompletion(messages, model, maxTokens, temperature);
}; 