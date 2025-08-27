import { prisma } from '../../lib/prisma';

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJournalEntryRequest {
  title: string;
  content: string;
  mood?: number;
  tags?: string[];
}

export interface UpdateJournalEntryRequest {
  title?: string;
  content?: string;
  mood?: number;
  tags?: string[];
}

export const journalSystem = {
  async createEntry(userId: string, content: string, title?: string, mood?: number, tags?: string[]): Promise<JournalEntry> {
    try {
      const entry = await prisma.journalEntry.create({
        data: {
          userId,
          title: title || 'Journal Entry',
          content,
          mood: mood || null,
          tags: tags ? JSON.stringify(tags) : null,
          date: new Date(),
        },
      });

      return {
        id: entry.id,
        userId: entry.userId,
        title: entry.title,
        content: entry.content,
        mood: entry.mood || undefined,
        tags: entry.tags ? JSON.parse(entry.tags) : [],
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      };
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw new Error('Failed to create journal entry');
    }
  },

  async updateEntry(entryId: string, updates: UpdateJournalEntryRequest): Promise<JournalEntry> {
    try {
      const entry = await prisma.journalEntry.update({
        where: { id: entryId },
        data: {
          title: updates.title,
          content: updates.content,
          mood: updates.mood,
          tags: updates.tags ? JSON.stringify(updates.tags) : undefined,
          updatedAt: new Date(),
        },
      });

      return {
        id: entry.id,
        userId: entry.userId,
        title: entry.title,
        content: entry.content,
        mood: entry.mood || undefined,
        tags: entry.tags ? JSON.parse(entry.tags) : [],
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      };
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw new Error('Failed to update journal entry');
    }
  },

  async getEntries(userId: string): Promise<JournalEntry[]> {
    try {
      const entries = await prisma.journalEntry.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      });

      return entries.map((entry: any) => ({
        id: entry.id,
        userId: entry.userId,
        title: entry.title,
        content: entry.content,
        mood: entry.mood || undefined,
        tags: entry.tags ? JSON.parse(entry.tags) : [],
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      }));
    } catch (error) {
      console.error('Error getting journal entries:', error);
      throw new Error('Failed to retrieve journal entries');
    }
  },

  async getEntriesForUser(userId: string, limit: number = 10): Promise<JournalEntry[]> {
    try {
      const entries = await prisma.journalEntry.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: limit,
      });

      return entries.map((entry: any) => ({
        id: entry.id,
        userId: entry.userId,
        title: entry.title,
        content: entry.content,
        mood: entry.mood || undefined,
        tags: entry.tags ? JSON.parse(entry.tags) : [],
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      }));
    } catch (error) {
      console.error('Error getting journal entries for user:', error);
      throw new Error('Failed to retrieve journal entries');
    }
  },

  async getEntry(entryId: string): Promise<JournalEntry | null> {
    try {
      const entry = await prisma.journalEntry.findUnique({
        where: { id: entryId },
      });

      if (!entry) {
        return null;
      }

      return {
        id: entry.id,
        userId: entry.userId,
        title: entry.title,
        content: entry.content,
        mood: entry.mood || undefined,
        tags: entry.tags ? JSON.parse(entry.tags) : [],
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      };
    } catch (error) {
      console.error('Error getting journal entry:', error);
      throw new Error('Failed to retrieve journal entry');
    }
  },

  async deleteEntry(entryId: string): Promise<boolean> {
    try {
      await prisma.journalEntry.delete({
        where: { id: entryId },
      });
      return true;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw new Error('Failed to delete journal entry');
    }
  },

  async analyzeMood(userId: string): Promise<{ averageMood: number; moodTrend: string }> {
    try {
      const entries = await prisma.journalEntry.findMany({
        where: {
          userId,
          mood: { not: null },
        },
        orderBy: { date: 'desc' },
        take: 30, // Last 30 entries
      });

      if (entries.length === 0) {
        return {
          averageMood: 5,
          moodTrend: 'stable',
        };
      }

      const totalMood = entries.reduce((sum: number, entry: any) => sum + (entry.mood || 0), 0);
      const averageMood = totalMood / entries.length;

      // Determine trend by comparing recent vs older entries
      const recentEntries = entries.slice(0, 7);
      const olderEntries = entries.slice(7, 14);

      let moodTrend = 'stable';
      if (recentEntries.length > 0 && olderEntries.length > 0) {
        const recentAvg = recentEntries.reduce((sum: number, entry: any) => sum + (entry.mood || 0), 0) / recentEntries.length;
        const olderAvg = olderEntries.reduce((sum: number, entry: any) => sum + (entry.mood || 0), 0) / olderEntries.length;

        if (recentAvg > olderAvg + 0.5) moodTrend = 'improving';
        else if (recentAvg < olderAvg - 0.5) moodTrend = 'declining';
      }

      return {
        averageMood: Math.round(averageMood * 10) / 10,
        moodTrend,
      };
    } catch (error) {
      console.error('Error analyzing mood from journal:', error);
      return {
        averageMood: 5,
        moodTrend: 'stable',
      };
    }
  },

  async generateJournalPrompt(): Promise<string> {
    const prompts = [
      "How are you feeling today? What's on your mind?",
      "What's something you're grateful for right now?",
      "Describe a challenge you're facing and how you're handling it.",
      "What's something you're looking forward to?",
      "Reflect on a recent interaction that made you feel good.",
      "What's something you've learned about yourself recently?",
      "Describe your ideal day and what makes it special.",
      "What's a goal you're working toward and how's it going?",
      "Reflect on a time when you felt proud of yourself.",
      "What's something you'd like to improve about yourself?",
    ];

    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return randomPrompt;
  },
}; 