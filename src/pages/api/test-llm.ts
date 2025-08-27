import { NextApiRequest, NextApiResponse } from 'next';
import { openRouterChatCompletion } from '../../services/openRouterService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { userInput, conversationHistory = [] } = req.body;
  
  try {
    const messages = [
      { role: 'user' as const, content: userInput },
      ...conversationHistory.map((content: string) => ({ role: 'user' as const, content }))
    ];
    
    const response = await openRouterChatCompletion(messages);
    res.status(200).json({ response: response.choices[0]?.message?.content || '' });
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
} 