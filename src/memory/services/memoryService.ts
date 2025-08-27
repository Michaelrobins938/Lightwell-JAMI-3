// Memory service for API interactions with Luna's memory system

import { Memory, MemoryQuery, MemoryExtraction, MemoryUpdate } from '../types/memory.types';

class MemoryService {
  private baseUrl = '/api/memory';

  /**
   * Get all memories for a user
   */
  async getMemories(userId: string): Promise<Memory[]> {
    const response = await fetch(`${this.baseUrl}?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch memories');
    }
    return response.json();
  }

  /**
   * Search memories with filters
   */
  async searchMemories(query: MemoryQuery): Promise<Memory[]> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    
    if (!response.ok) {
      throw new Error('Failed to search memories');
    }
    return response.json();
  }

  /**
   * Add a new memory
   */
  async addMemory(memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memory> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add memory');
    }
    return response.json();
  }

  /**
   * Update an existing memory
   */
  async updateMemory(update: MemoryUpdate): Promise<Memory> {
    const response = await fetch(`${this.baseUrl}/${update.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update memory');
    }
    return response.json();
  }

  /**
   * Delete a memory
   */
  async deleteMemory(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete memory');
    }
  }

  /**
   * Extract memories from conversation text using AI
   */
  async extractMemoriesFromText(
    text: string, 
    userId: string, 
    chatId?: string
  ): Promise<MemoryExtraction> {
    const response = await fetch(`${this.baseUrl}/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, userId, chatId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to extract memories');
    }
    return response.json();
  }

  /**
   * Get memory context for AI conversation (formatted for system prompt)
   */
  async getMemoryContext(userId: string): Promise<string> {
    const memories = await this.getMemories(userId);
    
    if (memories.length === 0) {
      return '';
    }

    const contextSections = [
      '# User Memory Context',
      '',
      '## Preferences:',
      ...memories
        .filter(m => m.category === 'preferences')
        .map(m => `- ${m.key}: ${m.value}`),
      '',
      '## Context & Background:',
      ...memories
        .filter(m => m.category === 'context' || m.category === 'facts')
        .map(m => `- ${m.value}`),
      '',
      '## Therapeutic Goals:',
      ...memories
        .filter(m => m.category === 'goals')
        .map(m => `- ${m.value}`),
      '',
      '## Communication Style:',
      ...memories
        .filter(m => m.category === 'personality')
        .map(m => `- ${m.value}`),
      '',
      '## Important Notes:',
      ...memories
        .filter(m => m.category === 'triggers')
        .map(m => `- ${m.value} (handle sensitively)`),
    ];

    return contextSections.filter(line => line !== '').join('\n');
  }

  /**
   * Auto-process chat message for memory extraction
   */
  async processMessageForMemories(
    message: string,
    userId: string,
    chatId?: string
  ): Promise<Memory[]> {
    try {
      const extraction = await this.extractMemoriesFromText(message, userId, chatId);
      const newMemories: Memory[] = [];

      for (const memoryData of extraction.extractedMemories) {
        if (memoryData.key && memoryData.value && extraction.confidence > 0.6) {
          const memory = await this.addMemory({
            ...memoryData,
            userId,
            chatId,
            confidence: extraction.confidence,
          } as Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>);
          newMemories.push(memory);
        }
      }

      return newMemories;
    } catch (error) {
      console.error('Failed to process message for memories:', error);
      return [];
    }
  }
}

export const memoryService = new MemoryService();