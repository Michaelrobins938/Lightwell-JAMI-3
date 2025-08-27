import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { verifyToken } from '../../services/authService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    const { conversation } = req.body;

    await prisma.conversation.create({
      data: {
        userId: decodedToken.userId,
        content: JSON.stringify(conversation),
      },
    });

    res.status(200).json({ message: 'Conversation saved successfully' });
  } catch (error) {
    console.error('Error saving conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}