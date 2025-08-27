import { NextApiRequest, NextApiResponse } from 'next';
import { goalSettingSystem } from '../../../features/progress-tracking/goal-setting';
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
        // Get all goals for user
        try {
          const goals = await goalSettingSystem.getGoals(userId);
          return res.status(200).json({ goals });
        } catch (error) {
          logger.error('Error getting goals', error instanceof Error ? error : new Error(String(error)), { userId });
          return res.status(500).json({ error: 'Failed to retrieve goals' });
        }

      case 'POST':
        // Create new goal
        try {
          const { title, description, targetDate, milestones } = req.body;

          if (!title) {
            return res.status(400).json({ error: 'Title is required' });
          }

          const goal = await goalSettingSystem.createGoal(
            userId,
            title,
            description,
            targetDate ? new Date(targetDate) : undefined,
            milestones
          );

          logger.info('Goal created', { userId, goalId: goal.id, title });
          return res.status(201).json({ goal });
        } catch (error) {
          logger.error('Error creating goal', error instanceof Error ? error : new Error(String(error)), { userId });
          return res.status(500).json({ error: 'Failed to create goal' });
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('Goals API error', error instanceof Error ? error : new Error(String(error)));
    return res.status(500).json({ error: 'Internal server error' });
  }
}