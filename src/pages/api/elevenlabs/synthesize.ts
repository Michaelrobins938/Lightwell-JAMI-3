import { NextApiRequest, NextApiResponse } from 'next';
import { elevenLabsService } from '../../../services/elevenLabsService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voiceId } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Use the provided voice ID or default
    const finalVoiceId = voiceId || 'RILOU7YmBhvwJGDGjNmP';
    
    // Update the service configuration with the voice ID
    elevenLabsService.updateConfig({
      voiceId: finalVoiceId,
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.0,
      useSpeakerBoost: true
    });

    // Synthesize speech
    const voiceResponse = await elevenLabsService.synthesizeSpeech(text);
    
    // Return the audio data
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', voiceResponse.audio.byteLength);
    res.send(Buffer.from(voiceResponse.audio));
    
  } catch (error) {
    console.error('ElevenLabs synthesis error:', error);
    res.status(500).json({ 
      error: 'Failed to synthesize speech',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 