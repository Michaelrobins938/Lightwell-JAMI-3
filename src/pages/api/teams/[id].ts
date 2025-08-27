import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth-middleware';
import { teamWorkspaceService } from '../../../services/teamWorkspaceService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetTeam(req, res);
    case 'PUT':
      return handleUpdateTeam(req, res);
    case 'DELETE':
      return handleDeleteTeam(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetTeam(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Team ID is required' });
    }

    const team = await teamWorkspaceService.getTeamById(id, userId);
    return res.status(200).json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleUpdateTeam(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Team ID is required' });
    }

    const { name, description, avatar, isPublic } = req.body;

    const team = await teamWorkspaceService.updateTeam(id, userId, {
      name,
      description,
      avatar,
      isPublic
    });

    return res.status(200).json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    if (error instanceof Error && error.message.includes('permissions')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleDeleteTeam(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Team ID is required' });
    }

    await teamWorkspaceService.deleteTeam(id, userId);
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting team:', error);
    if (error instanceof Error && error.message.includes('permissions')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  await handler(req, res);
});


