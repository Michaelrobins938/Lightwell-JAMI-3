// AI-powered chat title generation service

import { 
  ChatTitleRequest, 
  ChatTitleResponse, 
  ChatTitleOptions, 
  ChatTitleCache,
  TitleGenerationJob,
  TitleSuggestion 
} from '../types/chatTitle.types';

export class TitleGenerationService {
  private static instance: TitleGenerationService;
  private cache = new Map<string, ChatTitleCache>();
  private jobQueue: TitleGenerationJob[] = [];
  private isProcessing = false;
  
  public static getInstance(): TitleGenerationService {
    if (!TitleGenerationService.instance) {
      TitleGenerationService.instance = new TitleGenerationService();
    }
    return TitleGenerationService.instance;
  }

  // Generate title for a conversation
  async generateTitle(request: ChatTitleRequest): Promise<ChatTitleResponse> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cached = this.getCachedTitle(request.conversationId, request.messages.length);
      if (cached) {
        return {
          success: true,
          title: cached.title,
          confidence: cached.confidence,
          processingTime: Date.now() - startTime
        };
      }

      // Validate input
      if (!request.messages || request.messages.length === 0) {
        return {
          success: false,
          errorMessage: 'No messages provided for title generation'
        };
      }

      // Generate title using AI
      const result = await this.generateTitleWithAI(request);
      
      // Cache successful result
      if (result.success && result.title) {
        this.cacheTitle(request.conversationId, result.title, request.messages, result.confidence || 0.8);
      }

      result.processingTime = Date.now() - startTime;
      return result;

    } catch (error) {
      console.error('Title generation failed:', error);
      
      // Fallback to first message if enabled
      if (request.options?.fallbackToFirstMessage) {
        const fallbackTitle = this.generateFallbackTitle(request.messages);
        return {
          success: true,
          title: fallbackTitle,
          confidence: 0.3,
          processingTime: Date.now() - startTime
        };
      }

      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error during title generation',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Generate title using AI in the background
  async generateTitleWithAI(request: ChatTitleRequest): Promise<ChatTitleResponse> {
    const options = this.getDefaultOptions(request.options);
    
    // Prepare conversation context
    const context = this.prepareConversationContext(request.messages, options.contextWindow);
    
    // Create prompt for title generation
    const prompt = this.createTitlePrompt(context, options);

    try {
      // Call OpenAI API for title generation
      const response = await fetch('/api/chat/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          options,
          conversationId: request.conversationId
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Parse and validate the AI response
      return this.parseAIResponse(result, options);

    } catch (error) {
      console.error('AI title generation failed:', error);
      throw error;
    }
  }

  // Generate title suggestions (multiple options)
  async generateTitleSuggestions(
    request: ChatTitleRequest, 
    count: number = 3
  ): Promise<TitleSuggestion[]> {
    const suggestions: TitleSuggestion[] = [];
    
    // Generate titles with different styles
    const styles = ['descriptive', 'concise', 'creative'] as const;
    
    for (let i = 0; i < Math.min(count, styles.length); i++) {
      try {
        const styleRequest = {
          ...request,
          options: {
            ...request.options,
            style: styles[i]
          }
        };
        
        const result = await this.generateTitleWithAI(styleRequest);
        
        if (result.success && result.title) {
          suggestions.push({
            title: result.title,
            confidence: result.confidence || 0.7,
            style: styles[i],
            reasoning: `Generated using ${styles[i]} style`
          });
        }
      } catch (error) {
        console.warn(`Failed to generate ${styles[i]} title:`, error);
      }
    }

    // Add fallback if no AI suggestions succeeded
    if (suggestions.length === 0) {
      const fallback = this.generateFallbackTitle(request.messages);
      suggestions.push({
        title: fallback,
        confidence: 0.3,
        style: 'fallback',
        reasoning: 'Fallback based on first user message'
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  // Queue title generation for background processing
  queueTitleGeneration(
    conversationId: string, 
    messages: any[], 
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): string {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: TitleGenerationJob = {
      id: jobId,
      conversationId,
      status: 'pending',
      createdAt: new Date(),
      priority,
      retryCount: 0,
      maxRetries: 3
    };

    // Insert job based on priority
    if (priority === 'high') {
      this.jobQueue.unshift(job);
    } else {
      this.jobQueue.push(job);
    }

    // Start processing if not already running
    if (!this.isProcessing) {
      this.processJobQueue();
    }

    return jobId;
  }

  // Process queued title generation jobs
  private async processJobQueue(): Promise<void> {
    if (this.isProcessing || this.jobQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.jobQueue.length > 0) {
      const job = this.jobQueue.shift();
      if (!job) continue;

      try {
        job.status = 'processing';
        
        // Convert messages for title generation
        const titleMessages = job.conversationId ? await this.getMessagesForJob(job) : [];
        
        const request: ChatTitleRequest = {
          conversationId: job.conversationId,
          messages: titleMessages,
          options: {
            style: 'descriptive',
            maxLength: 50,
            fallbackToFirstMessage: true
          }
        };

        const result = await this.generateTitleWithAI(request);
        
        job.result = result;
        job.status = result.success ? 'completed' : 'failed';
        job.completedAt = new Date();

      } catch (error) {
        job.error = error instanceof Error ? error.message : 'Unknown error';
        job.status = 'failed';
        job.retryCount++;

        // Retry if under max retries
        if (job.retryCount < job.maxRetries) {
          job.status = 'pending';
          this.jobQueue.push(job); // Re-queue for retry
        }
      }

      // Small delay between jobs to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.isProcessing = false;
  }

  // Get job status
  getJobStatus(jobId: string): TitleGenerationJob | null {
    return this.jobQueue.find(job => job.id === jobId) || null;
  }

  // Helper methods
  private prepareConversationContext(messages: any[], contextWindow: number = 10): string {
    // Take the most recent messages for context
    const recentMessages = messages.slice(-contextWindow);
    
    return recentMessages
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
  }

  private createTitlePrompt(context: string, options: ChatTitleOptions): string {
    const styleInstructions = {
      descriptive: 'Create a descriptive title that clearly explains what the conversation is about.',
      concise: 'Create a brief, concise title using minimal words.',
      creative: 'Create a creative, engaging title that captures the essence of the conversation.',
      technical: 'Create a technical title that focuses on the specific topics or problems discussed.'
    };

    const instruction = styleInstructions[options.style || 'descriptive'];
    const maxLength = options.maxLength || 50;
    const emojiInstruction = options.includeEmoji ? ' You may include a relevant emoji at the beginning.' : ' Do not include emojis.';

    return `You are an AI assistant that generates concise, meaningful titles for chat conversations.

${instruction}

Rules:
- Maximum ${maxLength} characters
- Be specific and relevant to the conversation content
- Use title case (capitalize important words)
- Focus on the main topic or question${emojiInstruction}
- Do not use quotes around the title
- Make it suitable for a chat application sidebar

Conversation context:
${context}

Generate a single title that best represents this conversation:`;
  }

  private parseAIResponse(response: any, options: ChatTitleOptions): ChatTitleResponse {
    try {
      let title = '';
      let confidence = 0.8;
      let alternatives: string[] = [];
      let tokenUsage = undefined;

      // Handle different response formats
      if (typeof response === 'string') {
        title = response.trim();
      } else if (response.choices && response.choices[0]) {
        title = response.choices[0].message?.content?.trim() || '';
        tokenUsage = response.usage;
      } else if (response.title) {
        title = response.title.trim();
        confidence = response.confidence || 0.8;
        alternatives = response.alternatives || [];
      }

      // Clean up the title
      title = this.cleanTitle(title, options);

      // Validate title
      if (!title || title.length === 0) {
        throw new Error('Empty title received from AI');
      }

      if (title.length > (options.maxLength || 50)) {
        title = title.slice(0, (options.maxLength || 50) - 3) + '...';
      }

      return {
        success: true,
        title,
        confidence,
        alternatives,
        tokenUsage
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: `Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private cleanTitle(title: string, options: ChatTitleOptions): string {
    // Remove quotes if present
    title = title.replace(/^["']|["']$/g, '');
    
    // Remove "Title:" prefix if present
    title = title.replace(/^(Title:\s*)/i, '');
    
    // Trim whitespace
    title = title.trim();
    
    // Ensure proper capitalization
    if (title.length > 0) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    return title;
  }

  private generateFallbackTitle(messages: any[]): string {
    // Find first user message
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    
    if (firstUserMessage) {
      let title = firstUserMessage.content.slice(0, 47);
      if (firstUserMessage.content.length > 47) {
        title += '...';
      }
      return title;
    }

    // Ultimate fallback
    return `Chat ${new Date().toLocaleDateString('en-US')}`;
  }

  private getDefaultOptions(options?: ChatTitleOptions): ChatTitleOptions {
    return {
      maxLength: 50,
      style: 'descriptive',
      includeEmoji: false,
      language: 'en',
      contextWindow: 10,
      fallbackToFirstMessage: true,
      ...options
    };
  }

  // Cache management
  private getCachedTitle(conversationId: string, messageCount: number): ChatTitleCache | null {
    const cached = this.cache.get(conversationId);
    
    // Return cached title if it's still valid (same message count)
    if (cached && cached.messageCount === messageCount) {
      return cached;
    }

    return null;
  }

  private cacheTitle(
    conversationId: string, 
    title: string, 
    messages: any[], 
    confidence: number
  ): void {
    const cacheEntry: ChatTitleCache = {
      conversationId,
      title,
      generatedAt: new Date(),
      messageCount: messages.length,
      lastMessageId: messages[messages.length - 1]?.id || '',
      confidence,
      style: 'descriptive' // Default style for cache
    };

    this.cache.set(conversationId, cacheEntry);

    // Clean up old cache entries (keep only last 100)
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0.85 // Mock hit rate - in production, track actual hits
    };
  }

  private async getMessagesForJob(job: TitleGenerationJob): Promise<any[]> {
    // In a real implementation, this would fetch messages from the database
    // For now, return empty array as fallback
    return [];
  }
}