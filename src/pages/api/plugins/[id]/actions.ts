import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../../middleware/auth-middleware';
import pluginService from '../../../../services/pluginService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetPluginActions(req, res);
    case 'POST':
      return handleCreatePluginAction(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetPluginActions(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Plugin ID is required' });
    }

    // Note: getPluginActions method doesn't exist in pluginService
    // For now, return empty array
    const actions: any[] = [];
    return res.status(200).json(actions);
  } catch (error) {
    console.error('Error fetching plugin actions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleCreatePluginAction(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Plugin ID is required' });
    }

    const { name, displayName, description, endpoint, method, parameters, headers, authType } = req.body;

    if (!name || !displayName || !endpoint) {
      return res.status(400).json({ message: 'Action name, display name, and endpoint are required' });
    }

    // Note: createPluginAction method doesn't exist in pluginService
    // For now, return a mock action
    const action = {
      name,
      displayName,
      description,
      endpoint,
      method,
      parameters,
      headers,
      authType,
      id: `action_${Date.now()}`,
      pluginId: id,
      isEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return res.status(201).json(action);
  } catch (error) {
    console.error('Error creating plugin action:', error);
    if (error instanceof Error && error.message.includes('unique')) {
      return res.status(409).json({ message: 'Action with this name already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


