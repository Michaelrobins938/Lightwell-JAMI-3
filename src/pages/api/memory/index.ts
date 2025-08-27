import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../middleware/auth-middleware';
import memoryService from '../../../services/memoryService';
import { withSecurity, SecureRequest } from '../../../middleware/securityMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetMemories(req, res);
    case 'POST':
      return handleStoreMemory(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetMemories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      conversationId,
      type,
      category,
      tags,
      importance,
      limit,
      offset,
      sortBy
    } = req.query;

    const query: any = {
      userId,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
    };

    if (conversationId) query.conversationId = conversationId as string;
    if (type) query.type = type as string;
    if (category) query.category = category as string;
    if (tags) query.tags = (tags as string).split(',');
    if (importance) query.importance = parseInt(importance as string);
    if (sortBy) query.sortBy = sortBy as string;

    const memories = await memoryService.retrieveMemories(query);

    return res.status(200).json({ memories });
  } catch (error) {
    console.error('Failed to retrieve memories:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleStoreMemory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      conversationId,
      type,
      category,
      content,
      importance,
      emotionalValence,
      tags,
      metadata
    } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({
        message: 'Missing required fields: conversationId, content'
      });
    }

    const memory = await memoryService.storeMemory({
      userId,
      type,
      content,
      importance,
      tags,
      metadata
    });

    return res.status(201).json({ memory });
  } catch (error) {
    console.error('Failed to store memory:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withSecurity(authMiddleware(handler));


