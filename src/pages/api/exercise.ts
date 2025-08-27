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
      
      const exerciseEntries = await prisma.exerciseEntry.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        select: {
          id: true,
          type: true,
          duration: true,
          intensity: true,
          notes: true,
          createdAt: true,
        },
      });

      return res.status(200).json({ data: exerciseEntries });
    }

    if (req.method === 'POST') {
      const { type, duration, intensity, notes } = req.body;

      if (!type || typeof type !== 'string') {
        return res.status(400).json({ error: 'Exercise type is required' });
      }

      if (!duration || typeof duration !== 'number' || duration < 0) {
        return res.status(400).json({ error: 'Valid duration value is required' });
      }

      if (!intensity || typeof intensity !== 'number' || intensity < 1 || intensity > 10) {
        return res.status(400).json({ error: 'Valid intensity value (1-10) is required' });
      }

      const exerciseEntry = await prisma.exerciseEntry.create({
        data: {
          userId: decoded.userId,
          type,
          duration,
          intensity,
          notes: notes || '',
        },
        select: {
          id: true,
          type: true,
          duration: true,
          intensity: true,
          notes: true,
          createdAt: true,
        },
      });

      return res.status(201).json({ data: exerciseEntry });
    }
  } catch (error) {
    console.error('Exercise API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 