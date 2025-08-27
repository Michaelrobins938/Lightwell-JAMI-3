import { NextApiRequest, NextApiResponse } from 'next';
import { enhancedVoiceAgent } from '../../../services/enhancedVoiceAgent';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, sessionId, userId, audioData, voiceSettings, text } = req.body;

    switch (action) {
      case 'initialize':
        await enhancedVoiceAgent.initializeSession(sessionId, userId);
        res.status(200).json({ success: true, message: 'Session initialized' });
        break;

      case 'process':
        if (!audioData) {
          return res.status(400).json({ error: 'Audio data required' });
        }

        // Convert base64 to ArrayBuffer
        const audioBuffer = Buffer.from(audioData, 'base64');
        const arrayBuffer = audioBuffer.buffer.slice(
          audioBuffer.byteOffset,
          audioBuffer.byteOffset + audioBuffer.byteLength
        );

        const response = await enhancedVoiceAgent.processUserInput(arrayBuffer, sessionId);
        
        // Convert ArrayBuffer to base64 for response
        const responseBuffer = Buffer.from(response.audioBuffer);
        const responseBase64 = responseBuffer.toString('base64');

        res.status(200).json({
          success: true,
          text: response.text,
          audio: responseBase64,
          emotionalTone: response.emotionalTone,
          therapeuticNotes: response.therapeuticNotes,
          nextIntervention: response.nextIntervention,
          crisisAssessment: response.crisisAssessment,
          conversationState: enhancedVoiceAgent.getConversationState()
        });
        break;

      case 'preview':
        if (!text) {
          return res.status(400).json({ error: 'Text required for preview' });
        }

        const { voice, speed } = req.body;
        
        // Generate preview audio with specified voice settings
        const previewAudio = await enhancedVoiceAgent.synthesizePreviewSpeech(
          text, 
          voice || voiceSettings?.style,
          speed || voiceSettings?.speed
        );
        
        // Return audio as blob
        res.setHeader('Content-Type', 'audio/mpeg');
        res.status(200).send(Buffer.from(previewAudio));
        break;

      case 'state':
        const state = enhancedVoiceAgent.getConversationState();
        res.status(200).json({ success: true, state });
        break;

      case 'end':
        enhancedVoiceAgent.endSession();
        res.status(200).json({ success: true, message: 'Session ended' });
        break;

      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Voice agent API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
