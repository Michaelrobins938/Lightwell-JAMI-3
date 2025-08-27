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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const decoded = verifyToken(req);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    const { waivers, chatHistory, memories, onboarding, assessment, preferences, uiState } = req.body;

    // For now, just acknowledge the data without complex database operations
    // This can be enhanced later when the database schema is fully resolved
    const syncSummary = {
      waivers: waivers?.length || 0,
      chatHistory: chatHistory?.length || 0,
      memories: memories?.length || 0,
      preferences: preferences ? 1 : 0,
      uiState: uiState ? 1 : 0,
      onboarding: onboarding ? 1 : 0,
      assessment: assessment ? 1 : 0
    };

    // Log the sync attempt for debugging
    console.log(`Persistence sync request for user ${userId}:`, syncSummary);

    res.status(200).json({ 
      success: true, 
      message: 'Data sync acknowledged (backend sync will be implemented in future update)',
      syncedItems: syncSummary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Persistence sync error:', error);
    res.status(500).json({ 
      error: 'Failed to process sync request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
