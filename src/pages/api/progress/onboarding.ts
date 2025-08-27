import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// JWT verification middleware
const verifyToken = (req: NextApiRequest) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify authentication
    const decoded = verifyToken(req);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    if (req.method === 'GET') {
      // Return default onboarding progress for now
      const defaultProgress = {
        completedSteps: [],
        currentStep: 'welcome',
        isComplete: false
      };

      res.status(200).json({ progress: defaultProgress });
    } else if (req.method === 'POST') {
      // Acknowledge progress update
      const { progress } = req.body;
      
      console.log(`Onboarding progress update for user ${userId}:`, progress);
      
      res.status(200).json({ 
        success: true, 
        message: 'Onboarding progress update acknowledged (backend sync will be implemented in future update)',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Onboarding progress API error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
