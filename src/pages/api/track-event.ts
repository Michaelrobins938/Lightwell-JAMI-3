import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { prisma } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventName, eventData, userId } = req.body;

    if (!eventName || typeof eventName !== 'string') {
      return res.status(400).json({ error: 'Event name is required' });
    }

    // Try to get user ID from token if not provided
    let authenticatedUserId = null;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        authenticatedUserId = decoded.userId;
      } catch (error) {
        // Token is invalid, but we can still track anonymous events
        console.log('Invalid token for event tracking, proceeding anonymously');
      }
    }

    // Create analytics event (with error handling)
    let analyticsEvent;
    try {
      analyticsEvent = await prisma.analyticsEvent.create({
        data: {
          event: eventName,
          category: eventData?.category || 'general',
          properties: JSON.stringify({
            ...eventData,
            userAgent: req.headers['user-agent'] || '',
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
          }),
          userId: authenticatedUserId || null,
          timestamp: new Date(),
        },
      });
    } catch (dbError) {
      console.error('Database error in track-event:', dbError);
      // Return success even if DB fails - don't break the app
      return res.status(200).json({ 
        success: true, 
        data: { eventId: 'fallback' },
        warning: 'Event tracking temporarily unavailable'
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: { eventId: analyticsEvent.id }
    });
  } catch (error) {
    console.error('Track event API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 