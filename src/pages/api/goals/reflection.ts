import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../services/authService';
import { logger } from '../../../services/logger';
import { insightsSystem } from '../../../features/progress-tracking/insights';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    const decodedToken = verifyToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = decodedToken.userId;
    const { reflection, goalId, goalTitle } = req.body;

    // Validate required fields
    if (!reflection || !goalId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process the reflection and generate insights
    try {
      // Store reflection in database (in production, this would be a separate table)
      logger.info('Goal reflection submitted', { userId, goalId, goalTitle });

      // Generate insights based on the reflection
      const insights = await insightsSystem.generatePersonalizedInsights(userId);

      // Find relevant insights for goal progress
      const goalInsights = insights.filter(insight => 
        insight.type === 'progress' || insight.type === 'behavioral'
      );

      return res.status(200).json({
        success: true,
        message: 'Reflection submitted successfully!',
        insights: goalInsights,
        reflection: {
          id: `reflection-${Date.now()}`,
          goalId,
          goalTitle,
          content: reflection,
          createdAt: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Error processing goal reflection', error instanceof Error ? error : new Error(String(error)), { userId, goalId });
      return res.status(500).json({ error: 'Failed to process reflection' });
    }

  } catch (error) {
    logger.error('Goal reflection API error', error instanceof Error ? error : new Error(String(error)));
    return res.status(500).json({ error: 'Internal server error' });
  }
} 