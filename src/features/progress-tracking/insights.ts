import { prisma } from '../../lib/prisma';

export interface MoodInsight {
  averageMood: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  triggers: string[];
  recommendations: string[];
}

export interface ProgressInsight {
  goalsCompleted: number;
  goalsInProgress: number;
  completionRate: number;
  averageProgress: number;
}

export interface Insight {
  id: string;
  userId: string;
  type: 'mood' | 'progress' | 'behavioral' | 'therapeutic';
  title: string;
  description: string;
  data: any;
  createdAt: Date;
}

export const insightsSystem = {
  async generateMoodInsights(userId: string): Promise<MoodInsight> {
    try {
      // Get user's mood entries from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const moodEntries = await prisma.moodEntry.findMany({
        where: {
          userId,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      if (moodEntries.length === 0) {
        return {
          averageMood: 5,
          moodTrend: 'stable',
          triggers: [],
          recommendations: ['Start tracking your mood regularly'],
        };
      }

      // Calculate average mood
      const totalMood = moodEntries.reduce((sum: number, entry: any) => sum + entry.mood, 0);
      const averageMood = totalMood / moodEntries.length;

      // Determine mood trend
      const recentEntries = moodEntries.slice(-7);
      const olderEntries = moodEntries.slice(0, -7);
      
      let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (recentEntries.length > 0 && olderEntries.length > 0) {
        const recentAvg = recentEntries.reduce((sum: number, entry: any) => sum + entry.mood, 0) / recentEntries.length;
        const olderAvg = olderEntries.reduce((sum: number, entry: any) => sum + entry.mood, 0) / olderEntries.length;
        
        if (recentAvg > olderAvg + 0.5) moodTrend = 'improving';
        else if (recentAvg < olderAvg - 0.5) moodTrend = 'declining';
      }

      // Analyze triggers from notes
      const triggers: string[] = [];
      const allNotes = moodEntries
        .filter((entry: any) => entry.notes)
        .map((entry: any) => entry.notes!.toLowerCase());

      const triggerKeywords = ['stress', 'work', 'sleep', 'exercise', 'social', 'family', 'health'];
      triggerKeywords.forEach(keyword => {
        const count = allNotes.filter((note: string) => note.includes(keyword)).length;
        if (count > 0) {
          triggers.push(keyword);
        }
      });

      // Generate recommendations based on mood and triggers
      const recommendations: string[] = [];
      if (averageMood < 5) {
        recommendations.push('Consider talking to a mental health professional');
        recommendations.push('Practice self-care activities');
      }
      if (triggers.includes('stress')) {
        recommendations.push('Try stress management techniques like deep breathing');
      }
      if (triggers.includes('sleep')) {
        recommendations.push('Establish a consistent sleep schedule');
      }
      if (triggers.includes('exercise')) {
        recommendations.push('Incorporate regular physical activity into your routine');
      }

      return {
        averageMood: Math.round(averageMood * 10) / 10,
        moodTrend,
        triggers,
        recommendations,
      };
    } catch (error) {
      console.error('Error generating mood insights:', error);
      return {
        averageMood: 5,
        moodTrend: 'stable',
        triggers: [],
        recommendations: ['Unable to generate insights at this time'],
      };
    }
  },

  async generateProgressInsights(userId: string): Promise<ProgressInsight> {
    try {
      const goals = await prisma.userProgress.findMany({
        where: { userId },
      });

      const goalsCompleted = goals.filter((goal: any) => goal.status === 'completed').length;
      const goalsInProgress = goals.filter((goal: any) => goal.status === 'active').length;
      const totalGoals = goals.length;
      const completionRate = totalGoals > 0 ? (goalsCompleted / totalGoals) * 100 : 0;
      
      const activeGoals = goals.filter((goal: any) => goal.status === 'active');
      const averageProgress = activeGoals.length > 0 
        ? activeGoals.reduce((sum: number, goal: any) => sum + (goal.progress || 0), 0) / activeGoals.length
        : 0;

      return {
        goalsCompleted,
        goalsInProgress,
        completionRate: Math.round(completionRate),
        averageProgress: Math.round(averageProgress),
      };
    } catch (error) {
      console.error('Error generating progress insights:', error);
      return {
        goalsCompleted: 0,
        goalsInProgress: 0,
        completionRate: 0,
        averageProgress: 0,
      };
    }
  },

  async generatePersonalizedInsights(userId: string): Promise<Insight[]> {
    try {
      const moodInsights = await this.generateMoodInsights(userId);
      const progressInsights = await this.generateProgressInsights(userId);
      
      const insights: Insight[] = [];

      // Mood insight
      insights.push({
        id: `mood-insight-${Date.now()}`,
        userId,
        type: 'mood',
        title: 'Mood Analysis',
        description: `Your average mood is ${moodInsights.averageMood}/10 and has been ${moodInsights.moodTrend} recently.`,
        data: moodInsights,
        createdAt: new Date(),
      });

      // Progress insight
      insights.push({
        id: `progress-insight-${Date.now()}`,
        userId,
        type: 'progress',
        title: 'Goal Progress',
        description: `You've completed ${progressInsights.goalsCompleted} goals with a ${progressInsights.completionRate}% completion rate.`,
        data: progressInsights,
        createdAt: new Date(),
      });

      // Behavioral insight based on journal entries
      const recentJournalEntries = await prisma.journalEntry.findMany({
        where: {
          userId,
          date: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        orderBy: { date: 'desc' },
        take: 10,
      });

      if (recentJournalEntries.length > 0) {
        const behavioralInsight: Insight = {
          id: `behavioral-insight-${Date.now()}`,
          userId,
          type: 'behavioral',
          title: 'Journal Activity',
          description: `You've written ${recentJournalEntries.length} journal entries in the past week.`,
          data: {
            entriesCount: recentJournalEntries.length,
            lastEntryDate: recentJournalEntries[0]?.date,
          },
          createdAt: new Date(),
        };
        insights.push(behavioralInsight);
      }

      return insights;
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      return [];
    }
  },

  async getInsights(userId: string): Promise<Insight[]> {
    try {
      // For now, generate fresh insights each time
      // In a production system, you might want to store and cache insights
      return await this.generatePersonalizedInsights(userId);
    } catch (error) {
      console.error('Error getting insights:', error);
      return [];
    }
  },

  async createInsight(userId: string, insightData: Omit<Insight, 'id' | 'userId' | 'createdAt'>): Promise<Insight> {
    try {
      const insight: Insight = {
        id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        ...insightData,
        createdAt: new Date(),
      };

      // In a production system, you might want to store insights in the database
      // For now, we'll return the insight without persisting it
      return insight;
    } catch (error) {
      console.error('Error creating insight:', error);
      throw new Error('Failed to create insight');
    }
  },
}; 