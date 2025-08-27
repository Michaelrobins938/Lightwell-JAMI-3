import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { verifyToken } from '../../services/authService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: decodedToken.userId },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to last 10 conversations for performance
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}