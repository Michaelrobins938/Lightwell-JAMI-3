import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../../../middleware/auth-middleware';
import pluginService from '../../../../../services/pluginService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return handleExecutePluginAction(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleExecutePluginAction(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Action ID is required' });
    }

    const { conversationId, parameters } = req.body;

    const execution = await pluginService.executeAction(
      id,
      'action', // actionId parameter
      { userId, chatId: conversationId }, // context parameter
      parameters || {} // input parameter
    );

    return res.status(200).json(execution);
  } catch (error) {
    console.error('Error executing plugin action:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof Error && error.message.includes('disabled')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


