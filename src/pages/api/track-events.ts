import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, eventName, eventData } = req.body;

  try {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        event: eventName,
        properties: JSON.stringify(eventData),
      },
    });

    res.status(200).json({ message: 'Event tracked successfully' });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ message: 'Error tracking event' });
  }
}