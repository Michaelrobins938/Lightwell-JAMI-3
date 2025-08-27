// pages/api/mood-history.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.query;

  try {
    const moodHistory = await prisma.moodEntry.findMany({
      where: { userId: String(userId) },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(moodHistory);
  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}