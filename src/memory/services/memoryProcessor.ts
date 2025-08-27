// AI-powered memory extraction and processing for therapeutic conversations

import { MemoryCategory, MemoryExtraction } from '../types/memory.types';

export class MemoryProcessor {
  private openaiKey: string;
  
  constructor(apiKey?: string) {
    this.openaiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  /**
   * Extract memories from conversation text using GPT-4
   */
  async extractMemories(text: string, userId: string): Promise<MemoryExtraction> {
    const prompt = this.buildExtractionPrompt(text);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: this.getSystemPrompt() },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const extractedData = JSON.parse(data.choices[0].message.content);
      
      return {
        text,
        extractedMemories: extractedData.memories || [],
        confidence: extractedData.confidence || 0.5,
      };
    } catch (error) {
      console.error('Memory extraction failed:', error);
      return {
        text,
        extractedMemories: [],
        confidence: 0,
      };
    }
  }

  /**
   * System prompt for memory extraction
   */
  private getSystemPrompt(): string {
    return `You are a therapeutic memory extraction AI. Analyze conversation text and extract key information that should be remembered about the user.

IMPORTANT GUIDELINES:
- Only extract information explicitly stated by the user
- Focus on therapeutic relevance (preferences, context, goals, triggers)
- Be conservative - only extract high-confidence memories
- Respect privacy and sensitivity
- Never infer or assume information not directly stated

CATEGORIES:
- preferences: Communication style, therapy preferences, likes/dislikes
- context: Current life situation, work, relationships, projects
- facts: Personal background, history, concrete information  
- personality: How they like to communicate, their therapeutic style
- goals: What they want to achieve in therapy or life
- triggers: Sensitive topics, trauma indicators, things to avoid
- progress: Therapeutic milestones, improvements, insights

OUTPUT FORMAT:
Return ONLY valid JSON in this exact format:
{
  "memories": [
    {
      "key": "short_identifier",
      "value": "detailed_description", 
      "category": "category_name",
      "confidence": 0.8
    }
  ],
  "confidence": 0.8
}`;
  }

  /**
   * Build extraction prompt from conversation text
   */
  private buildExtractionPrompt(text: string): string {
    return `Analyze this conversation text and extract key memories about the user:

CONVERSATION:
"""
${text}
"""

Extract memories following the guidelines. Focus on:
1. What the user explicitly shares about themselves
2. Their preferences for communication or therapy
3. Current life context or challenges
4. Therapeutic goals they mention
5. Any sensitive topics or triggers
6. Personal facts or background information

Remember: Only extract what is directly stated, not inferred.`;
  }

  /**
   * Process memories for conflict resolution and deduplication
   */
  async resolveMemoryConflicts(
    newMemory: any,
    existingMemories: any[]
  ): Promise<{ action: 'add' | 'update' | 'ignore'; memoryId?: string }> {
    const conflicts = existingMemories.filter(existing => 
      existing.key === newMemory.key || 
      this.semanticSimilarity(existing.value, newMemory.value) > 0.8
    );

    if (conflicts.length === 0) {
      return { action: 'add' };
    }

    // If new memory has higher confidence, update
    const highestConfidenceConflict = conflicts.reduce((prev, current) => 
      (current.confidence > prev.confidence) ? current : prev
    );

    if (newMemory.confidence > highestConfidenceConflict.confidence + 0.1) {
      return { action: 'update', memoryId: highestConfidenceConflict.id };
    }

    return { action: 'ignore' };
  }

  /**
   * Calculate semantic similarity between two text strings
   */
  private semanticSimilarity(text1: string, text2: string): number {
    // Simple word overlap calculation
    // In production, use more sophisticated semantic similarity
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Format memories for AI context injection
   */
  formatMemoriesForAI(memories: any[]): string {
    if (memories.length === 0) {
      return '';
    }

    const sections = {
      preferences: memories.filter(m => m.category === 'preferences'),
      context: memories.filter(m => m.category === 'context'),
      facts: memories.filter(m => m.category === 'facts'),
      personality: memories.filter(m => m.category === 'personality'),
      goals: memories.filter(m => m.category === 'goals'),
      triggers: memories.filter(m => m.category === 'triggers'),
      progress: memories.filter(m => m.category === 'progress'),
    };

    let formatted = '\n## IMPORTANT: User Memory Context\n\n';

    Object.entries(sections).forEach(([category, mems]) => {
      if (mems.length > 0) {
        formatted += `### ${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;
        mems.forEach(mem => {
          formatted += `- ${mem.value}\n`;
        });
        formatted += '\n';
      }
    });

    formatted += 'Use this context to provide personalized, consistent therapeutic support.\n\n';
    
    return formatted;
  }
}

export const memoryProcessor = new MemoryProcessor();