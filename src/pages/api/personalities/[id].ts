import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth-middleware';
import { personalityService } from '../../../services/personalityService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetPersonality(req, res);
    case 'PUT':
      return handleUpdatePersonality(req, res);
    case 'DELETE':
      return handleDeletePersonality(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetPersonality(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid personality ID' });
    }

    // Get personality
    const personality = await personalityService.getPersonalityById(id);
    if (!personality) {
      return res.status(404).json({ message: 'Personality not found' });
    }

    return res.status(200).json({ personality });
  } catch (error) {
    console.error('Failed to get personality:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleUpdatePersonality(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid personality ID' });
    }

    // Get personality
    const existingPersonality = await personalityService.getPersonalityById(id);
    if (!existingPersonality) {
      return res.status(404).json({ message: 'Personality not found' });
    }

    const {
      name,
      description,
      category,
      therapeuticApproach,
      specialization,
      coreInstructions,
      safetyProtocols,
      therapeuticTechniques,
      boundarySettings,
      crisisIntervention,
      communicationStyle,
      responseLength,
      empathyLevel,
      directiveLevel,
      safetyChecks,
      crisisKeywords,
      escalationProtocols,
      disclaimers
    } = req.body;

    // Validate safety protocols
    const safetyValidation = personalityService.validateSafetyProtocols({
      safetyProtocols,
      crisisIntervention,
      disclaimers,
      boundarySettings,
      coreInstructions
    });

    if (!safetyValidation.passed) {
      return res.status(400).json({
        message: 'Safety validation failed',
        validation: safetyValidation
      });
    }

    const updatedPersonality = await personalityService.updatePersonality(id, {
      name,
      description,
      category,
      therapeuticApproach,
      specialization,
      coreInstructions,
      safetyProtocols,
      therapeuticTechniques,
      boundarySettings,
      crisisIntervention,
      communicationStyle,
      responseLength,
      empathyLevel,
      directiveLevel,
      safetyChecks,
      crisisKeywords,
      escalationProtocols,
      disclaimers
    });

    return res.status(200).json({ personality: updatedPersonality });
  } catch (error) {
    console.error('Failed to update personality:', error);
    if (error instanceof Error && error.message.includes('Safety validation failed')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleDeletePersonality(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid personality ID' });
    }

    // Get personality
    const personality = await personalityService.getPersonalityById(id);
    if (!personality) {
      return res.status(404).json({ message: 'Personality not found' });
    }

    // Delete the personality
    await personalityService.deletePersonality(id);

    return res.status(200).json({ message: 'Personality deleted successfully' });
  } catch (error) {
    console.error('Failed to delete personality:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


