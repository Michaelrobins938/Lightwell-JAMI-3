import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { range = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get basic metrics
    const [totalConversations, totalMessages, crisisInterventions] = await Promise.all([
      prisma.chatSession.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.chatMessage.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.analyticsEvent.count({
        where: { 
          event: 'chat_message',
          timestamp: { gte: startDate }
        }
      })
    ]);

    // Calculate average session length
    const sessions = await prisma.chatSession.findMany({
      where: { createdAt: { gte: startDate } },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    const sessionLengths = sessions.map(session => {
      if (session.messages.length < 2) return 0;
      const firstMessage = session.messages[0];
      const lastMessage = session.messages[session.messages.length - 1];
      return (new Date(lastMessage.createdAt).getTime() - new Date(firstMessage.createdAt).getTime()) / (1000 * 60); // minutes
    }).filter(length => length > 0);

    const averageSessionLength = sessionLengths.length > 0 
      ? Math.round(sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length)
      : 0;

    // Generate emotional trends data
    const emotionalTrends = [];
    const days = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      // Mock emotional data (in real app, this would come from sentiment analysis)
      emotionalTrends.push({
        date: dayStart.toISOString().split('T')[0],
        positive: Math.floor(Math.random() * 20) + 10,
        neutral: Math.floor(Math.random() * 30) + 20,
        negative: Math.floor(Math.random() * 15) + 5
      });
    }

    // Generate message volume data
    const messageVolume = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayMessages = await prisma.message.count({
        where: { createdAt: { gte: dayStart, lte: dayEnd } }
      });
      
      messageVolume.push({
        date: dayStart.toISOString().split('T')[0],
        messages: dayMessages
      });
    }

    // Mock emotional distribution
    const emotionalDistribution = [
      { emotion: 'Calm', count: 45, percentage: 30 },
      { emotion: 'Anxious', count: 30, percentage: 20 },
      { emotion: 'Sad', count: 25, percentage: 17 },
      { emotion: 'Angry', count: 20, percentage: 13 },
      { emotion: 'Happy', count: 15, percentage: 10 },
      { emotion: 'Confused', count: 15, percentage: 10 }
    ];

    // Mock therapeutic techniques data
    const therapeuticTechniques = [
      { technique: 'Cognitive Reframing', usage: 25, effectiveness: 85 },
      { technique: 'Mindfulness', usage: 20, effectiveness: 78 },
      { technique: 'Deep Breathing', usage: 18, effectiveness: 82 },
      { technique: 'Progressive Relaxation', usage: 15, effectiveness: 75 },
      { technique: 'Gratitude Practice', usage: 12, effectiveness: 88 },
      { technique: 'Problem Solving', usage: 10, effectiveness: 80 }
    ];

    // Mock user engagement metrics
    const userEngagement = [
      { metric: 'Daily Active Users', value: 1250, change: 12 },
      { metric: 'Session Duration', value: 18, change: -5 },
      { metric: 'Messages per Session', value: 24, change: 8 },
      { metric: 'Return Rate', value: 78, change: 15 }
    ];

    // Mock crisis data
    const crisisData = [
      { level: 'none', count: 1200, trend: -10 },
      { level: 'low', count: 45, trend: 5 },
      { level: 'medium', count: 12, trend: -15 },
      { level: 'high', count: 3, trend: -20 },
      { level: 'critical', count: 1, trend: -50 }
    ];

    // Calculate average response time (mock data)
    const averageResponseTime = 2.5; // seconds

    res.status(200).json({
      totalConversations,
      totalMessages,
      averageSessionLength,
      averageResponseTime,
      crisisInterventions,
      emotionalTrends,
      messageVolume,
      emotionalDistribution,
      therapeuticTechniques,
      userEngagement,
      crisisData
    });

  } catch (error) {
    console.error('Error fetching chat analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  } finally {
    await prisma.$disconnect();
  }
}
