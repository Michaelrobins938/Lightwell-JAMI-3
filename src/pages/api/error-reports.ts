import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { prisma } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { errorType, errorMessage, stackTrace, userAgent, url, userId } = req.body;

    if (!errorType || !errorMessage) {
      return res.status(400).json({ error: 'Error type and message are required' });
    }

    // Try to get user ID from token if not provided
    let authenticatedUserId = null;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        authenticatedUserId = decoded.userId;
      } catch (error) {
        // Token is invalid, but we can still report errors anonymously
        console.log('Invalid token for error reporting, proceeding anonymously');
      }
    }

    // Create error report
    const errorReport = await prisma.feedback.create({
      data: {
        userId,
        rating: 0,
        comment: `Error: ${errorMessage}\nType: ${errorType}\nStack: ${stackTrace}\nUserAgent: ${userAgent}\nURL: ${url}\nTimestamp: ${new Date().toISOString()}`,
      },
    });

    return res.status(200).json({ 
      success: true, 
      data: { reportId: errorReport.id }
    });
  } catch (error) {
    console.error('Error reports API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 