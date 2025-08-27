import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import { prisma } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user stats from database
    const [moodEntries, sleepEntries, assessments] = await Promise.all([
      prisma.moodEntry.count({
        where: { userId: decoded.userId }
      }),
      prisma.sleepEntry.count({
        where: { userId: decoded.userId }
      }),
      prisma.assessment.count({
        where: { userId: decoded.userId }
      })
    ]);

    // Calculate streak days (simplified - count consecutive days with activity)
    const recentMoodEntries = await prisma.moodEntry.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: { createdAt: true }
    });

    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasActivityOnDate = recentMoodEntries.some(entry => {
        const entryDate = new Date(entry.createdAt);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });

      if (hasActivityOnDate) {
        streakDays++;
      } else {
        break;
      }
    }

    // Calculate total active days
    const firstEntry = await prisma.moodEntry.findFirst({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true }
    });

    let totalDaysActive = 0;
    if (firstEntry) {
      const startDate = new Date(firstEntry.createdAt);
      const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      totalDaysActive = Math.min(daysDiff + 1, moodEntries + sleepEntries);
    }

    // Calculate improvement score (simplified algorithm)
    const recentAssessments = await prisma.assessment.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { score: true, type: true, createdAt: true }
    });

    let improvementScore = 50; // baseline
    if (recentAssessments.length >= 2) {
      const recent = recentAssessments.slice(0, Math.floor(recentAssessments.length / 2));
      const older = recentAssessments.slice(Math.floor(recentAssessments.length / 2));
      
      const recentAvg = recent.reduce((sum, a) => sum + a.score, 0) / recent.length;
      const olderAvg = older.reduce((sum, a) => sum + a.score, 0) / older.length;
      
      // For depression/anxiety scales, lower scores are better
      const improvement = olderAvg - recentAvg;
      improvementScore = Math.max(0, Math.min(100, 50 + (improvement * 5)));
    }

    // Mock therapy sessions count (would come from chat/session tracking)
    const therapySessions = Math.floor(Math.random() * 50) + 20;

    const stats = {
      moodEntries,
      sleepTracking: sleepEntries,
      assessmentsCompleted: assessments,
      therapySessions,
      streakDays,
      totalDaysActive,
      lastActivity: recentMoodEntries[0]?.createdAt || new Date().toISOString(),
      improvementScore: Math.round(improvementScore)
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('User stats API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}