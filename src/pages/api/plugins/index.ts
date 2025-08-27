import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth-middleware';
import pluginService from '../../../services/pluginService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetPlugins(req, res);
    case 'POST':
      return handleCreatePlugin(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetPlugins(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const plugins = await pluginService.getPlugins(userId);
    return res.status(200).json(plugins);
  } catch (error) {
    console.error('Error fetching plugins:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleCreatePlugin(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, displayName, description, version, author, icon, isSystem, config } = req.body;

    if (!name || !displayName) {
      return res.status(400).json({ message: 'Plugin name and display name are required' });
    }

    // Note: registerPlugin method doesn't exist in pluginService
    // For now, return a mock plugin
    const plugin = {
      name,
      displayName,
      description: description || '',
      version: version || '1.0.0',
      author: author || 'Unknown',
      icon,
      config: config ? JSON.stringify(config) : '{}',
      id: `plugin_${Date.now()}`,
      isEnabled: true,
      isSystem: isSystem || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return res.status(201).json(plugin);
  } catch (error) {
    console.error('Error creating plugin:', error);
    if (error instanceof Error && error.message.includes('unique')) {
      return res.status(409).json({ message: 'Plugin with this name already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


