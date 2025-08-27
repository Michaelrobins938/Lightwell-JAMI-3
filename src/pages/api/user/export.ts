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

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all user data for export
    const [moodEntries, sleepEntries, assessments] = await Promise.all([
      prisma.moodEntry.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.sleepEntry.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.assessment.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Calculate analytics
    const analytics = {
      totalMoodEntries: moodEntries.length,
      totalSleepEntries: sleepEntries.length,
      totalAssessments: assessments.length,
      averageMood: moodEntries.length > 0 
        ? Math.round((moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length) * 10) / 10
        : 0,
      averageSleep: sleepEntries.length > 0
        ? Math.round((sleepEntries.reduce((sum, entry) => sum + entry.hours, 0) / sleepEntries.length) * 10) / 10
        : 0,
      moodTrend: calculateMoodTrend(moodEntries),
      sleepTrend: calculateSleepTrend(sleepEntries),
      assessmentSummary: summarizeAssessments(assessments)
    };

    // Create comprehensive export data
    const exportData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        memberSince: user.createdAt
      },
      data: {
        moodEntries: moodEntries.map(entry => ({
          mood: entry.mood,
          energy: entry.energy,
          anxiety: entry.anxiety,
          notes: entry.notes,
          date: entry.createdAt
        })),
        sleepEntries: sleepEntries.map(entry => ({
          hours: entry.hours,
          quality: entry.quality,
          notes: entry.notes,
          date: entry.createdAt
        })),
        assessments: assessments.map(assessment => ({
          type: assessment.type,
          score: assessment.score,
          severity: assessment.severity,
          interpretation: assessment.interpretation,
          date: assessment.createdAt
        }))
      },
      analytics,
      exportMetadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        totalRecords: moodEntries.length + sleepEntries.length + assessments.length,
        dataRange: {
          earliest: getEarliestDate([...moodEntries, ...sleepEntries, ...assessments]),
          latest: getLatestDate([...moodEntries, ...sleepEntries, ...assessments])
        }
      }
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="luna-health-data-${user.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json"`);

    return res.status(200).json(exportData);
  } catch (error) {
    console.error('Export API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function calculateMoodTrend(moodEntries: any[]) {
  if (moodEntries.length < 2) return 'insufficient_data';
  
  const recent = moodEntries.slice(0, Math.floor(moodEntries.length / 2));
  const older = moodEntries.slice(Math.floor(moodEntries.length / 2));
  
  const recentAvg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
  const olderAvg = older.reduce((sum, entry) => sum + entry.mood, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 0.5) return 'improving';
  if (diff < -0.5) return 'declining';
  return 'stable';
}

function calculateSleepTrend(sleepEntries: any[]) {
  if (sleepEntries.length < 2) return 'insufficient_data';
  
  const recent = sleepEntries.slice(0, Math.floor(sleepEntries.length / 2));
  const older = sleepEntries.slice(Math.floor(sleepEntries.length / 2));
  
  const recentAvg = recent.reduce((sum, entry) => sum + entry.hours, 0) / recent.length;
  const olderAvg = older.reduce((sum, entry) => sum + entry.hours, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 0.5) return 'improving';
  if (diff < -0.5) return 'declining';
  return 'stable';
}

function summarizeAssessments(assessments: any[]) {
  const summary: any = {};
  
  assessments.forEach(assessment => {
    if (!summary[assessment.type]) {
      summary[assessment.type] = {
        count: 0,
        averageScore: 0,
        latestScore: null,
        trend: 'stable'
      };
    }
    
    summary[assessment.type].count++;
    if (summary[assessment.type].latestScore === null) {
      summary[assessment.type].latestScore = assessment.score;
    }
  });
  
  // Calculate averages and trends
  Object.keys(summary).forEach(type => {
    const typeAssessments = assessments.filter(a => a.type === type);
    summary[type].averageScore = Math.round(
      (typeAssessments.reduce((sum, a) => sum + a.score, 0) / typeAssessments.length) * 10
    ) / 10;
    
    if (typeAssessments.length >= 2) {
      const recent = typeAssessments.slice(0, Math.ceil(typeAssessments.length / 2));
      const older = typeAssessments.slice(Math.ceil(typeAssessments.length / 2));
      
      const recentAvg = recent.reduce((sum, a) => sum + a.score, 0) / recent.length;
      const olderAvg = older.reduce((sum, a) => sum + a.score, 0) / older.length;
      
      // For mental health assessments, lower scores are typically better
      const diff = olderAvg - recentAvg;
      
      if (diff > 2) summary[type].trend = 'improving';
      else if (diff < -2) summary[type].trend = 'declining';
      else summary[type].trend = 'stable';
    }
  });
  
  return summary;
}

function getEarliestDate(entries: any[]) {
  if (entries.length === 0) return null;
  return entries.reduce((earliest, entry) => 
    new Date(entry.createdAt) < new Date(earliest) ? entry.createdAt : earliest
  , entries[0].createdAt);
}

function getLatestDate(entries: any[]) {
  if (entries.length === 0) return null;
  return entries.reduce((latest, entry) => 
    new Date(entry.createdAt) > new Date(latest) ? entry.createdAt : latest
  , entries[0].createdAt);
}