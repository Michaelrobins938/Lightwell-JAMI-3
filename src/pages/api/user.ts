import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { prisma } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'PUT') {
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
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          preferences: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ data: user });
    }

    if (req.method === 'PUT') {
      const { name, preferences } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          ...(name && { name }),
          ...(preferences && { preferences }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          preferences: true,
        },
      });

      return res.status(200).json({ data: updatedUser });
    }
  } catch (error) {
    console.error('User API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 