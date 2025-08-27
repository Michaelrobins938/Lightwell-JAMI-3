import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../../middleware/auth-middleware';
import { teamWorkspaceService } from '../../../../services/teamWorkspaceService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetWorkspaceConversations(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetWorkspaceConversations(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Workspace ID is required' });
    }

    const conversations = await teamWorkspaceService.getWorkspaceConversations(id, userId);
    return res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching workspace conversations:', error);
    if (error instanceof Error && error.message.includes('Access denied')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


