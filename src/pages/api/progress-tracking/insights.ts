import { NextApiRequest, NextApiResponse } from 'next';
import { insightsSystem } from '../../../features/progress-tracking/insights';
import { verifyToken } from '../../../services/authService';
import { logger } from '../../../services/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    const decodedToken = verifyToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = decodedToken.userId;

    switch (req.method) {
      case 'GET':
        // Get insights for user
        try {
          const insights = await insightsSystem.getInsights(userId);
          return res.status(200).json({ insights });
        } catch (error) {
          logger.error('Error getting insights', error instanceof Error ? error : new Error(String(error)), { userId });
          return res.status(500).json({ error: 'Failed to retrieve insights' });
        }

      case 'POST':
        // Generate fresh insights
        try {
          const insights = await insightsSystem.generatePersonalizedInsights(userId);
          return res.status(200).json({ insights });
        } catch (error) {
          logger.error('Error generating insights', error instanceof Error ? error : new Error(String(error)), { userId });
          return res.status(500).json({ error: 'Failed to generate insights' });
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('Insights API error', error instanceof Error ? error : new Error(String(error)));
    return res.status(500).json({ error: 'Internal server error' });
  }
}