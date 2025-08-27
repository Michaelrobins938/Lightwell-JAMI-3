import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../middleware/auth-middleware';
import memoryService from '../../../services/memoryService';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetInsights(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetInsights(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // For now, return empty insights
    // In a real implementation, you would generate insights here
    const insights = {
      patterns: [],
      recommendations: [],
      summary: 'No insights available yet.'
    };

    return res.status(200).json({ insights });
  } catch (error) {
    console.error('Failed to generate insights:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


