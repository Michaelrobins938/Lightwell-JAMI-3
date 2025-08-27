import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth-middleware';
import { teamWorkspaceService } from '../../../services/teamWorkspaceService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetWorkspaces(req, res);
    case 'POST':
      return handleCreateWorkspace(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetWorkspaces(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const workspaces = await teamWorkspaceService.getUserWorkspaces(userId);
    return res.status(200).json(workspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleCreateWorkspace(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, description, teamId, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }

    const workspace = await teamWorkspaceService.createWorkspace(userId, {
      name,
      description,
      teamId,
      isPublic
    });

    return res.status(201).json(workspace);
  } catch (error) {
    console.error('Error creating workspace:', error);
    if (error instanceof Error && error.message.includes('team member')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


