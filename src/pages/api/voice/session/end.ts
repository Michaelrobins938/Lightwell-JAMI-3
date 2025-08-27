/**
 * Voice Session End Endpoint
 * Closes a voice session and saves session data
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { voiceSessionManager } from '../../../../services/voiceSessionManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🛑 Voice session end requested');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionData = req.body;
    const sessionId = sessionData?.id;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    console.log(`📝 Ending session: ${sessionId}`);

    // End session using session manager
    const completedSession = voiceSessionManager.endSession(sessionId, {
      endTime: sessionData?.endTime,
      duration: sessionData?.duration,
      transcript: sessionData?.transcript
    });

    if (!completedSession) {
      console.warn(`⚠️ Session not found: ${sessionId}`);
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log(`📊 Session stats:`, {
      id: sessionId,
      duration: completedSession.duration,
      transcriptLength: completedSession.transcript.length,
      audioChunks: completedSession.audioChunks.length
    });

    console.log(`✅ Voice session ended: ${sessionId}`);

    // Return session summary
    res.status(200).json({
      success: true,
      message: 'Voice session ended successfully',
      session: {
        id: completedSession.id,
        startTime: completedSession.startTime,
        endTime: completedSession.endTime,
        duration: completedSession.duration,
        transcriptLength: completedSession.transcript.length,
        audioChunksCount: completedSession.audioChunks.length
      }
    });

  } catch (error) {
    console.error('❌ Failed to end voice session:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to end voice session'
    });
  }
}