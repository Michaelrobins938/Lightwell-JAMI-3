import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Test if we can access the HTTP server
    const httpServer = (res.socket as any)?.server;
    
    res.status(200).json({
      message: 'Voice API test endpoint',
      timestamp: new Date().toISOString(),
      httpServer: httpServer ? 'available' : 'not available',
      serverEvents: httpServer?._events ? Object.keys(httpServer._events) : 'none',
      hasUpgradeHandler: httpServer?._events?.upgrade ? 'yes' : 'no',
      socket: {
        remoteAddress: res.socket?.remoteAddress,
        readyState: res.socket?.readyState,
        destroyed: res.socket?.destroyed
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
