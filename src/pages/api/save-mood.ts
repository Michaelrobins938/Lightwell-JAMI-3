// pages/api/save-mood.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, mood, date } = req.body;

  try {
    const moodEntry = await prisma.moodEntry.create({
      data: { userId, mood, createdAt: date },
    });

    res.status(200).json(moodEntry);
  } catch (error) {
    console.error('Error saving mood:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}