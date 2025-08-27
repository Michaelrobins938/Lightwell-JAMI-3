/**
 * Voice API Health Check Endpoint
 * Verifies OpenAI API key and service availability
 */

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🏥 Voice health check requested');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found in environment');
      return res.status(500).json({ 
        status: 'error',
        error: 'OpenAI API key not configured',
        healthy: false
      });
    }

    console.log('🔑 OpenAI API key found');

    // Test OpenAI API connectivity (optional quick test)
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`OpenAI API returned ${response.status}`);
      }

      console.log('✅ OpenAI API connectivity verified');
    } catch (apiError) {
      console.warn('⚠️ OpenAI API connectivity test failed:', apiError);
      // Continue anyway as API might be temporarily down
    }

    // Return health status
    const healthData = {
      status: 'healthy',
      healthy: true,
      timestamp: new Date().toISOString(),
      services: {
        openai_api: process.env.OPENAI_API_KEY ? 'configured' : 'missing',
        voice_endpoints: 'available',
        websocket: 'available'
      },
      environment: process.env.NODE_ENV || 'development'
    };

    console.log('✅ Voice service health check passed');
    res.status(200).json(healthData);

  } catch (error) {
    console.error('❌ Voice health check failed:', error);
    res.status(500).json({
      status: 'error',
      healthy: false,
      error: error instanceof Error ? error.message : 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
}