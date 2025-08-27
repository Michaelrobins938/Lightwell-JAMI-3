import { openRouterChatCompletion, ChatMessage } from './openRouterService';

export interface AIResponse {
  response: string;
  emotionalAssessment?: any;
  therapeuticIntervention?: any;
  crisisLevel?: any;
  sessionProgress?: any;
  empathyResponse?: any;
  emotionalRegulationTechnique?: any;
  crisisAssessment?: any;
  metadata?: {
    processingTime: number;
    confidence: number;
    modelUsed: string;
  };
}

class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  async generateTherapeuticResponse(
    userId: string, 
    userInput: string, 
    conversationHistory: string[] = []
  ): Promise<AIResponse> {
    try {
      // Make API call to server-side endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userInput,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI Service error:', error);
      throw new Error(`AI Service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeEmotionalState(userInput: string): Promise<any> {
    try {
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Emotional analysis error:', error);
      throw new Error(`Emotional analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async assessCrisisLevel(userInput: string, emotionalState: any): Promise<any> {
    try {
      const response = await fetch('/api/crisis-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput,
          emotionalState,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Crisis assessment error:', error);
      throw new Error(`Crisis assessment error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateTherapeuticIntervention(emotionalState: any, crisisLevel: any): Promise<any> {
    try {
      const response = await fetch('/api/therapeutic-intervention', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emotionalState,
          crisisLevel,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Therapeutic intervention error:', error);
      throw new Error(`Therapeutic intervention error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Server-side only method for direct OpenRouter calls
  async serverSideChatCompletion(
    messages: ChatMessage[],
    model?: string,
    maxTokens?: number,
    temperature?: number
  ): Promise<any> {
    // This method should only be called on the server side
    if (typeof window !== 'undefined') {
      throw new Error('This method is only available on the server side');
    }

    return openRouterChatCompletion(messages, model, maxTokens, temperature);
  }

  // Client-safe method to check if AI service is available
  isAvailable(): boolean {
    return typeof window !== 'undefined';
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export for backward compatibility
export default aiService;