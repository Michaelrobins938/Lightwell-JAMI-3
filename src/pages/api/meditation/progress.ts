import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import config from '../../../config';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    userId = decoded.userId;
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch user's meditation progress
      const progress = await prisma.meditationProgress.findMany({
        where: {
          userId: userId
        },
        include: {
          session: {
            select: {
              title: true,
              duration: true,
              category: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          completedAt: 'desc'
        }
      });

      const transformedProgress = progress.map(p => ({
        sessionId: p.sessionId,
        completedAt: p.completedAt,
        duration: p.duration,
        rating: p.rating,
        notes: p.notes,
        sessionTitle: p.session.title,
        sessionDuration: p.session.duration,
        sessionCategory: p.session.category.name
      }));

      res.status(200).json({ 
        progress: transformedProgress,
        total: transformedProgress.length
      });

    } catch (error) {
      console.error('Error fetching meditation progress:', error);
      res.status(500).json({ error: 'Failed to fetch meditation progress' });
    }
  } else if (req.method === 'POST') {
    try {
      const { sessionId, duration, completedAt, rating, notes } = req.body;

      if (!sessionId || !duration || !completedAt) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create or update meditation progress
      const progress = await prisma.meditationProgress.upsert({
        where: {
          userId_sessionId: {
            userId: userId,
            sessionId: sessionId
          }
        },
        update: {
          completedAt: new Date(completedAt),
          duration: duration,
          rating: rating || null,
          notes: notes || null,
          updatedAt: new Date()
        },
        create: {
          userId: userId,
          sessionId: sessionId,
          completedAt: new Date(completedAt),
          duration: duration,
          rating: rating || null,
          notes: notes || null
        }
      });

      // Update session play count
      await prisma.meditationSessionPlay.create({
        data: {
          sessionId: sessionId,
          userId: userId,
          playedAt: new Date(),
          duration: duration
        }
      });

      res.status(200).json({ 
        success: true,
        progress: {
          sessionId: progress.sessionId,
          completedAt: progress.completedAt,
          duration: progress.duration,
          rating: progress.rating,
          notes: progress.notes
        }
      });

    } catch (error) {
      console.error('Error saving meditation progress:', error);
      res.status(500).json({ error: 'Failed to save meditation progress' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

  await prisma.$disconnect();
} 