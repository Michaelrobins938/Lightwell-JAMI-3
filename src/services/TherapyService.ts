import { prisma } from '../lib/prisma';

export interface TherapySession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  emotionalState: string;
  crisisLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  therapeuticTechniques: string[];
  notes: string;
}

export interface TherapyServiceConfig {
  crisisDetectionEnabled: boolean;
  sessionTimeoutMinutes: number;
  maxSessionsPerDay: number;
}

export class TherapyService {
  private config: TherapyServiceConfig;

  constructor(config: Partial<TherapyServiceConfig> = {}) {
    this.config = {
      crisisDetectionEnabled: true,
      sessionTimeoutMinutes: 60,
      maxSessionsPerDay: 5,
      ...config
    };
  }

  async startSession(userId: string): Promise<TherapySession> {
    try {
      // Check if user has exceeded daily session limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const sessionsToday = await prisma.therapySession.count({
        where: {
          userId,
          startTime: {
            gte: today
          }
        }
      });

      if (sessionsToday >= this.config.maxSessionsPerDay) {
        throw new Error('Daily session limit exceeded');
      }

      const session = await prisma.therapySession.create({
        data: {
          userId,
          startTime: new Date(),
          emotionalState: 'neutral',
          crisisLevel: 'NONE',
          therapeuticTechniques: [],
          notes: ''
        }
      });

      return session;
    } catch (error) {
      console.error('Failed to start therapy session:', error);
      throw error;
    }
  }

  async endSession(sessionId: string): Promise<void> {
    try {
      await prisma.therapySession.update({
        where: { id: sessionId },
        data: { endTime: new Date() }
      });
    } catch (error) {
      console.error('Failed to end therapy session:', error);
      throw error;
    }
  }

  async updateSession(sessionId: string, updates: Partial<TherapySession>): Promise<TherapySession> {
    try {
      const session = await prisma.therapySession.update({
        where: { id: sessionId },
        data: updates
      });
      return session;
    } catch (error) {
      console.error('Failed to update therapy session:', error);
      throw error;
    }
  }

  async getSessionHistory(userId: string, limit: number = 10): Promise<TherapySession[]> {
    try {
      const sessions = await prisma.therapySession.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        take: limit
      });
      return sessions;
    } catch (error) {
      console.error('Failed to get session history:', error);
      throw error;
    }
  }

  async addNote(sessionId: string, note: string): Promise<void> {
    try {
      const session = await prisma.therapySession.findUnique({
        where: { id: sessionId }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      const updatedNotes = session.notes ? `${session.notes}\n${note}` : note;

      await prisma.therapySession.update({
        where: { id: sessionId },
        data: { notes: updatedNotes }
      });
    } catch (error) {
      console.error('Failed to add note to session:', error);
      throw error;
    }
  }

  detectCrisis(userInput: string): 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' {
    if (!this.config.crisisDetectionEnabled) {
      return 'NONE';
    }

    const input = userInput.toLowerCase();
    
    // High risk keywords
    const highRiskKeywords = ['suicide', 'kill myself', 'want to die', 'end it all', 'no reason to live'];
    if (highRiskKeywords.some(keyword => input.includes(keyword))) {
      return 'HIGH';
    }

    // Medium risk keywords
    const mediumRiskKeywords = ['self harm', 'hurt myself', 'crisis', 'emergency', 'can\'t take it anymore'];
    if (mediumRiskKeywords.some(keyword => input.includes(keyword))) {
      return 'MEDIUM';
    }

    // Low risk keywords
    const lowRiskKeywords = ['depressed', 'hopeless', 'worthless', 'alone', 'no one cares'];
    if (lowRiskKeywords.some(keyword => input.includes(keyword))) {
      return 'LOW';
    }

    return 'NONE';
  }

  async getSessionAnalytics(userId: string): Promise<{
    totalSessions: number;
    averageSessionDuration: number;
    crisisSessions: number;
    mostCommonTechniques: string[];
  }> {
    try {
      const sessions = await prisma.therapySession.findMany({
        where: { userId }
      });

      const totalSessions = sessions.length;
      const crisisSessions = sessions.filter(s => s.crisisLevel !== 'NONE').length;
      
      const sessionDurations = sessions
        .filter(s => s.endTime)
        .map(s => s.endTime!.getTime() - s.startTime.getTime());
      
      const averageSessionDuration = sessionDurations.length > 0 
        ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
        : 0;

      const allTechniques = sessions.flatMap(s => s.therapeuticTechniques);
      const techniqueCounts = allTechniques.reduce((acc, technique) => {
        acc[technique] = (acc[technique] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonTechniques = Object.entries(techniqueCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([technique]) => technique);

      return {
        totalSessions,
        averageSessionDuration,
        crisisSessions,
        mostCommonTechniques
      };
    } catch (error) {
      console.error('Failed to get session analytics:', error);
      throw error;
    }
  }
}
