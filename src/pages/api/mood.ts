import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { prisma } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
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

    if (req.method === 'GET') {
      const { limit = '30', offset = '0' } = req.query;
      
      const moodEntries = await prisma.moodEntry.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        select: {
          id: true,
          mood: true,
          notes: true,
          createdAt: true,
        },
      });

      return res.status(200).json({ data: moodEntries });
    }

    if (req.method === 'POST') {
      const { mood, notes } = req.body;

      if (!mood || typeof mood !== 'number' || mood < 1 || mood > 10) {
        return res.status(400).json({ error: 'Valid mood value (1-10) is required' });
      }

      const moodEntry = await prisma.moodEntry.create({
        data: {
          userId: decoded.userId,
          mood,
          notes: notes || '',
        },
        select: {
          id: true,
          mood: true,
          notes: true,
          createdAt: true,
        },
      });

      return res.status(201).json({ data: moodEntry });
    }
  } catch (error) {
    console.error('Mood API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 