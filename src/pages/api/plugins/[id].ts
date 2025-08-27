import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth-middleware';
import pluginService from '../../../services/pluginService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetPlugin(req, res);
    case 'PUT':
      return handleUpdatePlugin(req, res);
    case 'DELETE':
      return handleDeletePlugin(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetPlugin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Plugin ID is required' });
    }

    const plugin = await pluginService.getPlugin(id);
    return res.status(200).json(plugin);
  } catch (error) {
    console.error('Error fetching plugin:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleUpdatePlugin(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Plugin ID is required' });
    }

    const { displayName, description, version, author, icon, isEnabled, config } = req.body;

    const plugin = await pluginService.updatePluginConfig(id, {
      displayName,
      description,
      version,
      author,
      icon,
      isEnabled,
      config
    });

    return res.status(200).json(plugin);
  } catch (error) {
    console.error('Error updating plugin:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleDeletePlugin(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Plugin ID is required' });
    }

    // Note: deletePlugin method doesn't exist in pluginService
    // For now, we'll disable the plugin instead
    await pluginService.togglePlugin(id, false);
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting plugin:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  await handler(req, res);
});


