import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { prisma } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
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
      
      const sleepEntries = await prisma.sleepEntry.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        select: {
          id: true,
          hours: true,
          quality: true,
          notes: true,
          createdAt: true,
        },
      });

      return res.status(200).json({ data: sleepEntries });
    }

    if (req.method === 'POST') {
      const { hours, quality, notes } = req.body;

      if (!hours || typeof hours !== 'number' || hours < 0 || hours > 24) {
        return res.status(400).json({ error: 'Valid hours value (0-24) is required' });
      }

      if (!quality || typeof quality !== 'number' || quality < 1 || quality > 10) {
        return res.status(400).json({ error: 'Valid quality value (1-10) is required' });
      }

      const sleepEntry = await prisma.sleepEntry.create({
        data: {
          userId: decoded.userId,
          hours,
          quality,
          notes: notes || '',
        },
        select: {
          id: true,
          hours: true,
          quality: true,
          notes: true,
          createdAt: true,
        },
      });

      return res.status(201).json({ data: sleepEntry });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { hours, quality, notes } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Entry ID is required' });
      }

      if (!hours || typeof hours !== 'number' || hours < 0 || hours > 24) {
        return res.status(400).json({ error: 'Valid hours value (0-24) is required' });
      }

      if (!quality || typeof quality !== 'number' || quality < 1 || quality > 10) {
        return res.status(400).json({ error: 'Valid quality value (1-10) is required' });
      }

      const sleepEntry = await prisma.sleepEntry.update({
        where: { 
          id: id,
          userId: decoded.userId // Ensure user owns this entry
        },
        data: {
          hours,
          quality,
          notes: notes || '',
        },
        select: {
          id: true,
          hours: true,
          quality: true,
          notes: true,
          createdAt: true,
        },
      });

      return res.status(200).json({ data: sleepEntry });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Entry ID is required' });
      }

      await prisma.sleepEntry.delete({
        where: { 
          id: id,
          userId: decoded.userId // Ensure user owns this entry
        },
      });

      return res.status(200).json({ message: 'Sleep entry deleted successfully' });
    }
  } catch (error) {
    console.error('Sleep API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 