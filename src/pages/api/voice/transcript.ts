/**
 * Voice Transcript Update Endpoint
 * Handles real-time transcript updates from voice sessions
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { voiceSessionManager } from '../../../services/voiceSessionManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('📝 Transcript update requested');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, transcript } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript required' });
    }

    console.log(`📄 Updating transcript for session: ${sessionId}`);
    console.log(`📝 Transcript length: ${transcript.length} characters`);

    // Update transcript using session manager
    const success = voiceSessionManager.updateTranscript(sessionId, transcript);

    if (!success) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get transcript data for response
    const transcriptData = voiceSessionManager.getTranscript(sessionId);

    console.log(`✅ Transcript updated successfully:`, {
      sessionId,
      wordCount: transcriptData?.wordCount || 0,
      characterCount: transcriptData?.characterCount || 0,
      updateCount: transcriptData?.updates.length || 0
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Transcript updated successfully',
      transcript: {
        sessionId: sessionId,
        wordCount: transcriptData?.wordCount || 0,
        characterCount: transcriptData?.characterCount || 0,
        lastUpdated: transcriptData?.lastUpdated || new Date(),
        updateCount: transcriptData?.updates.length || 0
      }
    });

  } catch (error) {
    console.error('❌ Failed to update transcript:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update transcript'
    });
  }
}