import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../middleware/auth-middleware';
import { personalityService } from '../../../services/personalityService';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetPersonalities(req, res);
    case 'POST':
      return handleCreatePersonality(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGetPersonalities(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { type = 'user' } = req.query;

    let personalities;
    if (type === 'system') {
      personalities = await personalityService.getSystemPersonalities();
    } else {
      personalities = await personalityService.getUserPersonalities(userId);
    }

    return res.status(200).json({ personalities });
  } catch (error) {
    console.error('Failed to get personalities:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleCreatePersonality(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
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

    // Validate required fields
    if (!name || !category || !coreInstructions || !safetyProtocols) {
      return res.status(400).json({
        message: 'Missing required fields: name, category, coreInstructions, safetyProtocols'
      });
    }

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

    const personality = await personalityService.createPersonality(userId, {
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

    return res.status(201).json({ personality });
  } catch (error) {
    console.error('Failed to create personality:', error);
    if (error instanceof Error && error.message.includes('Safety validation failed')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);


