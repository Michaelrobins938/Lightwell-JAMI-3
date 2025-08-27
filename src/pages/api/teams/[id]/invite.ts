import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../../middleware/auth-middleware';
import { teamWorkspaceService } from '../../../../services/teamWorkspaceService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return handleInviteToTeam(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleInviteToTeam(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Team ID is required' });
    }

    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const invitation = await teamWorkspaceService.inviteToTeam(id, userId, email, role);
    return res.status(201).json(invitation);
  } catch (error) {
    console.error('Error inviting to team:', error);
    if (error instanceof Error && error.message.includes('permissions')) {
      return res.status(403).json({ message: error.message });
    }
    if (error instanceof Error && error.message.includes('already')) {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


