import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth-middleware';
import { teamWorkspaceService } from '../../../services/teamWorkspaceService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetWorkspace(req, res);
    case 'PUT':
      return handleUpdateWorkspace(req, res);
    case 'DELETE':
      return handleDeleteWorkspace(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetWorkspace(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Workspace ID is required' });
    }

    const workspace = await teamWorkspaceService.getWorkspaceById(id, userId);
    return res.status(200).json(workspace);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleUpdateWorkspace(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Workspace ID is required' });
    }

    const { name, description, isPublic } = req.body;

    const workspace = await teamWorkspaceService.updateWorkspace(id, userId, {
      name,
      description,
      isPublic
    });

    return res.status(200).json(workspace);
  } catch (error) {
    console.error('Error updating workspace:', error);
    if (error instanceof Error && error.message.includes('permissions')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleDeleteWorkspace(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Workspace ID is required' });
    }

    await teamWorkspaceService.deleteWorkspace(id, userId);
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting workspace:', error);
    if (error instanceof Error && error.message.includes('permissions')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  await handler(req, res);
});


