import { NextApiRequest, NextApiResponse } from 'next';
import { journalSystem } from '../../../features/progress-tracking/journal';
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
        // Get journal entries for user
        try {
          const { limit } = req.query;
          const entries = await journalSystem.getEntriesForUser(
            userId, 
            limit ? parseInt(limit as string) : 10
          );
          return res.status(200).json({ entries });
        } catch (error) {
          logger.error('Error getting journal entries', error instanceof Error ? error : new Error(String(error)), { userId });
          return res.status(500).json({ error: 'Failed to retrieve journal entries' });
        }

      case 'POST':
        // Create new journal entry
        try {
          const { content, title, mood, tags } = req.body;

          if (!content) {
            return res.status(400).json({ error: 'Content is required' });
          }

          const entry = await journalSystem.createEntry(
            userId,
            content,
            title,
            mood,
            tags
          );

          logger.info('Journal entry created', { userId, entryId: entry.id });
          return res.status(201).json({ entry });
        } catch (error) {
          logger.error('Error creating journal entry', error instanceof Error ? error : new Error(String(error)), { userId });
          return res.status(500).json({ error: 'Failed to create journal entry' });
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('Journal API error', error instanceof Error ? error : new Error(String(error)));
    return res.status(500).json({ error: 'Internal server error' });
  }
}