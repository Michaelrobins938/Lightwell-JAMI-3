import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import config from '../../../config';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication (optional for public sessions)
    const token = req.headers.authorization?.replace('Bearer ', '');
    let userId = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        userId = decoded.userId;
      } catch {}
    }

    // Fetch meditation sessions from database
    const sessions = await prisma.meditationSession.findMany({
      where: {
        isActive: true
      },
      include: {
        instructor: {
          select: {
            name: true,
            credentials: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            plays: true,
            ratings: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data for frontend
    const transformedSessions = sessions.map(session => ({
      id: session.id,
      title: session.title || 'Untitled Session',
      duration: session.duration,
      category: session.category.name,
      difficulty: session.difficulty,
      instructor: session.instructor.name,
      thumbnail: session.thumbnailUrl,
      audioUrl: session.audioUrl,
      tags: session.tags.map(t => t.tag.name),
      rating: session.averageRating || 0,
      plays: session._count.plays,
      userId: session.userId,
      isActive: session.isActive
    }));

    res.status(200).json({ 
      sessions: transformedSessions,
      total: transformedSessions.length
    });

  } catch (error) {
    console.error('Error fetching meditation sessions:', error);
    res.status(500).json({ error: 'Failed to fetch meditation sessions' });
  } finally {
    await prisma.$disconnect();
  }
} 