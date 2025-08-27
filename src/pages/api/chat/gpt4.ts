import { NextApiResponse } from 'next';
import { withProAuth } from '../../../lib/planGuard';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    plan: string;
  };
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // This route is only accessible to PRO and ENTERPRISE users
    // The withProAuth wrapper already verified the user's plan
    
    // Simulate GPT-4 response (in real app, this would call OpenAI API)
    const response = {
      id: Date.now().toString(),
      message: `This is a GPT-4 quality response to: "${message}". As a Pro user, you have access to our most advanced AI model with enhanced reasoning and creativity.`,
      model: 'gpt-4',
      tokens: 45,
      plan: req.user.plan,
      features: {
        maxTokens: 10000,
        customInstructions: true,
        priorityProcessing: true
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('GPT-4 API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default withProAuth(handler);
