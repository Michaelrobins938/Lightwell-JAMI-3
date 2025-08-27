/**
 * Voice Session Start Endpoint
 * Initializes a new voice session and returns session details
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { voiceSessionManager } from '../../../../services/voiceSessionManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🎤 Voice session start requested');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return res.status(500).json({ error: 'Voice service not configured' });
    }

    const sessionData = req.body;
    console.log('📝 Session data received:', {
      id: sessionData?.id,
      language: sessionData?.language,
      personality: sessionData?.personality
    });

    // Create session using session manager
    const session = voiceSessionManager.createSession({
      id: sessionData?.id,
      userId: sessionData?.userId || 'anonymous',
      language: sessionData?.language || 'en-US',
      personality: sessionData?.personality || null,
      metadata: sessionData?.metadata || {}
    });

    console.log(`✅ Voice session created: ${session.id}`);

    // Return session details
    res.status(200).json({
      success: true,
      sessionId: session.id,
      status: 'active',
      message: 'Voice session started successfully',
      session: {
        id: session.id,
        startTime: session.startTime,
        language: session.language,
        personality: session.personality
      }
    });

  } catch (error) {
    console.error('❌ Failed to start voice session:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start voice session'
    });
  }
}