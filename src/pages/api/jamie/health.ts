import type { NextApiRequest, NextApiResponse } from 'next';
import { jamieService } from '../../../services/jamieService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const health = await jamieService.healthCheck();
    
    res.status(200).json({
      success: true,
      jamie: health,
      timestamp: new Date().toISOString(),
      message: `Jamie system status: ${health.status}`
    });
  } catch (error) {
    console.error('Jamie health check error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
