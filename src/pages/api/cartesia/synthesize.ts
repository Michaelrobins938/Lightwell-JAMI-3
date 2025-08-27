import { NextApiRequest, NextApiResponse } from 'next';
import { cartesiaTTSService } from '../../../services/cartesiaTTSService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voiceId, options } = req.body;
    
    console.log('🔊 Cartesia TTS request received:', {
      textLength: text?.length,
      voiceId,
      hasOptions: !!options
    });

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text too long (max 5000 characters)' });
    }

    // Check if Cartesia service is available
    if (!cartesiaTTSService.isAvailable()) {
      console.error('❌ Cartesia service not available');
      return res.status(500).json({ 
        error: 'Cartesia TTS service not available',
        details: 'Check CARTESIA_API_KEY environment variable'
      });
    }

    console.log('🔊 Calling Cartesia service with text:', text.substring(0, 100) + '...');

    // Synthesize speech using Cartesia
    const result = await cartesiaTTSService.synthesizeSpeech(text, voiceId, options);
    
    console.log('🔊 Cartesia service returned:', {
      audioSize: result.audio.byteLength,
      contentType: result.contentType
    });

    // Set appropriate headers for audio response
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Length', result.audio.byteLength);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    console.log('🔊 Sending audio response, size:', result.audio.byteLength, 'bytes');

    // Send the audio data
    return res.send(Buffer.from(result.audio));
  } catch (error) {
    console.error('❌ Cartesia TTS API error:', error);
    return res.status(500).json({ 
      error: 'Failed to synthesize speech',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}