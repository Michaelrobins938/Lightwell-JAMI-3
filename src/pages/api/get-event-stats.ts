import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { prisma } from '../../lib/database';

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

    const { period = '7d', eventName } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Build where clause
    const whereClause: any = {
      timestamp: {
        gte: startDate,
        lte: now,
      },
    };

    if (eventName) {
      whereClause.event = eventName;
    }

    // Get event statistics
    const eventStats = await prisma.analyticsEvent.groupBy({
      by: ['event'],
      where: whereClause,
      _count: {
        event: true,
      },
    });

    // Get total events
    const totalEvents = await prisma.analyticsEvent.count({
      where: whereClause,
    });

    // Get unique users
    const uniqueUsers = await prisma.analyticsEvent.groupBy({
      by: ['userId'],
      where: {
        ...whereClause,
        userId: { not: null },
      },
    });

    const stats = {
      period,
      totalEvents,
      uniqueUsers: uniqueUsers.length,
      eventBreakdown: eventStats.map((stat: any) => ({
        eventName: stat.event,
        count: stat._count.event,
      })),
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
    };

    return res.status(200).json({ data: stats });
  } catch (error) {
    console.error('Get event stats API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}