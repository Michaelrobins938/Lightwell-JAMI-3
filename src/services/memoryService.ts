// Persistent Memory System for Luna AI
// Stores and retrieves conversation context across all chats

import { prisma } from '../lib/database';

export interface MemoryEntry {
  id: string;
  userId: string;
  chatId?: string;
  type: 'conversation' | 'preference' | 'context' | 'insight';
  content: string;
  metadata?: Record<string, any>;
  importance: number; // 0-10 scale
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface MemoryQuery {
  userId: string;
  chatId?: string;
  type?: string;
  tags?: string[];
  limit?: number;
  importance?: number;
}

export class MemoryService {
  // Store a new memory entry
  static async storeMemory(entry: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'> & { category?: string }): Promise<MemoryEntry> {
    const memory = await prisma.memory.create({
              data: {
          userId: entry.userId,
          conversationId: entry.chatId || '',
          type: entry.type,
          category: entry.category || 'general',
          content: entry.content,
          metadata: JSON.stringify(entry.metadata || {}),
          importance: entry.importance,
          tags: JSON.stringify(entry.tags || []),
        },
    });

    return {
      id: memory.id,
      userId: memory.userId,
      chatId: memory.conversationId || undefined,
      type: memory.type as any,
      content: memory.content,
      metadata: JSON.parse(memory.metadata || '{}'),
      importance: memory.importance,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
      tags: JSON.parse(memory.tags || '[]'),
    };
  }

  // Retrieve relevant memories for a context
  static async retrieveMemories(query: MemoryQuery): Promise<MemoryEntry[]> {
    const where: any = {
      userId: query.userId,
    };

    if (query.chatId) {
      where.conversationId = query.chatId;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.importance) {
      where.importance = {
        gte: query.importance,
      };
    }

    const memories = await prisma.memory.findMany({
      where,
      orderBy: [
        { importance: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: query.limit || 50,
    });

    return memories.map(memory => ({
      id: memory.id,
      userId: memory.userId,
      chatId: memory.conversationId || undefined,
      type: memory.type as any,
      content: memory.content,
      metadata: JSON.parse(memory.metadata || '{}'),
      importance: memory.importance,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
      tags: JSON.parse(memory.tags || '[]'),
    }));
  }

  // Update memory importance
  static async updateMemoryImportance(memoryId: string, importance: number): Promise<void> {
    await prisma.memory.update({
      where: { id: memoryId },
      data: { importance },
    });
  }

  // Add tags to memory
  static async addTagsToMemory(memoryId: string, tags: string[]): Promise<void> {
    const memory = await prisma.memory.findUnique({
      where: { id: memoryId },
    });

    if (memory) {
      const existingTags = JSON.parse(memory.tags || '[]');
      const newTags = [...new Set([...existingTags, ...tags])];
      
      await prisma.memory.update({
        where: { id: memoryId },
        data: { tags: JSON.stringify(newTags) },
      });
    }
  }

  // Delete memory
  static async deleteMemory(memoryId: string): Promise<void> {
    await prisma.memory.delete({
      where: { id: memoryId },
    });
  }

  // Get memory insights for a user
  static async getMemoryInsights(userId: string): Promise<{
    totalMemories: number;
    conversationCount: number;
    averageImportance: number;
    topTags: Array<{ tag: string; count: number }>;
    recentActivity: Date;
  }> {
    const memories = await prisma.memory.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    const totalMemories = memories.length;
    const conversationCount = memories.filter(m => m.type === 'conversation').length;
    const averageImportance = memories.reduce((sum, m) => sum + m.importance, 0) / totalMemories || 0;

    // Count tags
    const tagCounts: Record<string, number> = {};
    memories.forEach(memory => {
      const tags = JSON.parse(memory.tags || '[]');
      tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recentActivity = memories[0]?.updatedAt || new Date();

    return {
      totalMemories,
      conversationCount,
      averageImportance,
      topTags,
      recentActivity,
    };
  }

  // Search memories by content
  static async searchMemories(userId: string, searchTerm: string): Promise<MemoryEntry[]> {
    const memories = await prisma.memory.findMany({
      where: {
        userId,
        content: {
          contains: searchTerm,
        },
      },
      orderBy: [
        { importance: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: 20,
    });

    return memories.map(memory => ({
      id: memory.id,
      userId: memory.userId,
      chatId: memory.conversationId || undefined,
      type: memory.type as any,
      content: memory.content,
      metadata: JSON.parse(memory.metadata || '{}'),
      importance: memory.importance,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
      tags: JSON.parse(memory.tags || '[]'),
    }));
  }
}

// Export as default for backward compatibility
export default MemoryService;


