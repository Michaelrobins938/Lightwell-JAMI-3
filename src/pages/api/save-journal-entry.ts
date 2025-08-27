// pages/api/save-journal-entry.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, prompt, entry, date } = req.body;

  try {
    const journalEntry = await prisma.journalEntry.create({
      data: { userId, prompt, content: entry, date },
    });

    res.status(200).json(journalEntry);
  } catch (error) {
    console.error('Error saving journal entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}