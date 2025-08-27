import type { NextApiRequest, NextApiResponse } from 'next';
import JamieResponseGenerator from '../../../ai/jamie_response_generator';

const jamieGenerator = new JamieResponseGenerator();

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  chatId?: string;
  markdown?: boolean;
  userId?: string;
}

interface ChatResponse {
  text: string;
  error?: string;
  emotionalAssessment?: any;
  crisisAssessment?: any;
  therapeuticIntervention?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ text: '', error: 'Method Not Allowed' });
  }

  try {
    const { 
      messages = [], 
      model = 'gpt-4o-mini',
      chatId = 'default',
      markdown = true,
      userId = 'anonymous'
    }: ChatRequest = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ 
        text: '', 
        error: 'Messages array is required and cannot be empty' 
      });
    }

    // Get the latest user message
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    if (!lastUserMessage) {
      return res.status(400).json({ 
        text: '', 
        error: 'No user message found in messages array' 
      });
    }

    // Convert messages to conversation history format
    const conversationHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    // Generate Jamie's response
    const result = await jamieGenerator.generateResponse(
      userId,
      lastUserMessage.content,
      conversationHistory
    );

    // Return the response
    return res.status(200).json({
      text: result.response,
      emotionalAssessment: result.emotionalAssessment,
      crisisAssessment: result.crisisAssessment,
      therapeuticIntervention: result.therapeuticIntervention
    });

  } catch (error) {
    console.error('Enhanced chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return res.status(500).json({
      text: "I apologize, but I'm experiencing technical difficulties. Your feelings and concerns are important to me. Can you try sharing again?",
      error: errorMessage
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};