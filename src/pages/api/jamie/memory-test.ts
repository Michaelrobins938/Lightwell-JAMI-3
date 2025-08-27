import type { NextApiRequest, NextApiResponse } from 'next';
import { jamieService } from '../../../services/jamieService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ 
        error: 'userId and message are required' 
      });
    }

    console.log(`🧠 Testing Jamie's memory system for user: ${userId}`);

    // Test 1: Get response from Jamie (this will create memories)
    const jamieResponse = await jamieService.getResponse(userId, message);
    
    console.log('✅ Jamie response generated:', {
      text: jamieResponse.text.substring(0, 100) + '...',
      safetyStatus: jamieResponse.safetyStatus,
      auditId: jamieResponse.auditId
    });

    // Test 2: Get therapeutic response (this will use memories)
    const therapeuticResponse = await jamieService.getTherapeuticResponse(userId, message);
    
    console.log('✅ Therapeutic response generated:', {
      text: therapeuticResponse.text.substring(0, 100) + '...',
      crisisDetected: therapeuticResponse.metadata.crisisDetected,
      therapeuticTechniques: therapeuticResponse.metadata.therapeuticTechniques
    });

    // Test 3: Check memory health
    const memoryHealth = await jamieService.healthCheck();
    
    console.log('✅ Memory system health:', memoryHealth);

    res.status(200).json({
      success: true,
      message: 'Memory test completed successfully',
      jamieResponse: {
        text: jamieResponse.text,
        safetyStatus: jamieResponse.safetyStatus,
        auditId: jamieResponse.auditId
      },
      therapeuticResponse: {
        text: therapeuticResponse.text,
        crisisDetected: therapeuticResponse.metadata.crisisDetected,
        therapeuticTechniques: therapeuticResponse.metadata.therapeuticTechniques
      },
      memoryHealth,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Memory test failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
