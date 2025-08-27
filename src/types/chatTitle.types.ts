// AI-generated chat title types

export interface ChatTitleRequest {
  conversationId: string;
  messages: ChatTitleMessage[];
  userId?: string;
  options?: ChatTitleOptions;
}

export interface ChatTitleMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatTitleOptions {
  maxLength?: number; // Default: 50 characters
  style?: 'descriptive' | 'concise' | 'creative' | 'technical';
  includeEmoji?: boolean;
  language?: string; // Default: 'en'
  contextWindow?: number; // Number of recent messages to consider (default: 10)
  fallbackToFirstMessage?: boolean; // Fallback if AI generation fails
}

export interface ChatTitleResponse {
  success: boolean;
  title?: string;
  confidence?: number; // 0-1 confidence score
  alternatives?: string[]; // Alternative title suggestions
  errorMessage?: string;
  processingTime?: number; // in milliseconds
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ChatTitleCache {
  conversationId: string;
  title: string;
  generatedAt: Date;
  messageCount: number;
  lastMessageId: string;
  confidence: number;
  style: string;
}

export interface TitleGenerationJob {
  id: string;
  conversationId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  priority: 'low' | 'normal' | 'high';
  retryCount: number;
  maxRetries: number;
  result?: ChatTitleResponse;
  error?: string;
}

export interface TitleGenerationStats {
  totalGenerated: number;
  averageProcessingTime: number;
  successRate: number;
  averageConfidence: number;
  popularStyles: Record<string, number>;
  cacheHitRate: number;
}

export interface TitleSuggestion {
  title: string;
  confidence: number;
  reasoning?: string;
  style: string;
  tags?: string[];
}