// pages/api/journal-entries.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.query;

  try {
    const journalEntries = await prisma.journalEntry.findMany({
      where: { userId: String(userId) },
      orderBy: { date: 'desc' },
    });

    res.status(200).json(journalEntries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}