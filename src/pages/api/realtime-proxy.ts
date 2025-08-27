import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';

const wss = new WebSocketServer({ noServer: true });

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'WebSocket endpoint available at /api/realtime-proxy' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Handle WebSocket upgrade
wss.on('connection', async (client: WebSocket, request: IncomingMessage) => {
  console.log('Client connected to realtime proxy');

  try {
    // Open connection to OpenAI Realtime API
    const upstream = new WebSocket(
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview',
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'realtime=v1',
        },
      }
    );

    // Forward messages from OpenAI to client
    upstream.on('message', (msg) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });

    // Forward messages from client to OpenAI
    client.on('message', (msg) => {
      if (upstream.readyState === WebSocket.OPEN) {
        upstream.send(msg);
      }
    });

    // Handle disconnections
    client.on('close', () => {
      console.log('Client disconnected');
      upstream.close();
    });

    upstream.on('close', () => {
      console.log('OpenAI connection closed');
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });

    upstream.on('error', (error) => {
      console.error('OpenAI WebSocket error:', error);
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });

  } catch (error) {
    console.error('Failed to connect to OpenAI:', error);
    client.close();
  }
});

// Export the WebSocket server for use in the Next.js server
export { wss };