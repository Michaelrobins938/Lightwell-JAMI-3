import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../../middleware/auth-middleware';
import { teamWorkspaceService } from '../../../../services/teamWorkspaceService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return handleAcceptInvitation(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleAcceptInvitation(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Invitation token is required' });
    }

    const member = await teamWorkspaceService.acceptTeamInvitation(token, userId);
    return res.status(200).json(member);
  } catch (error) {
    console.error('Error accepting invitation:', error);
    if (error instanceof Error && error.message.includes('Invalid')) {
      return res.status(400).json({ message: error.message });
    }
    if (error instanceof Error && error.message.includes('expired')) {
      return res.status(410).json({ message: error.message });
    }
    if (error instanceof Error && error.message.includes('Email')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


