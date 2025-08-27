import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth-middleware';
import { teamWorkspaceService } from '../../../services/teamWorkspaceService';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetTeams(req, res);
    case 'POST':
      return handleCreateTeam(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetTeams(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const teams = await teamWorkspaceService.getUserTeams(userId);
    return res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleCreateTeam(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, description, avatar, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const team = await teamWorkspaceService.createTeam(userId, {
      name,
      description,
      avatar,
      isPublic
    });

    return res.status(201).json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


