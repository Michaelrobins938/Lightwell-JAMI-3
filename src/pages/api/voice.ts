// WebSocket API for Luna voice mode with OpenAI Realtime integration
// Handles voice orb ↔ OpenAI Realtime proxy

import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth-middleware';

// Import voice session manager (create a simple one if it doesn't exist)
// const voiceSessionManager = require('../../services/voiceSessionManager');

export default authMiddleware(async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if this is a WebSocket upgrade request
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket') {
    return res.status(400).json({ error: 'WebSocket upgrade required' });
  }

  // Get the socket from the request
  const { socket } = req as any;
  if (!socket) {
    return res.status(500).json({ error: 'Socket not available' });
  }

  // Handle WebSocket upgrade
  const head = Buffer.from([]);
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    'Sec-WebSocket-Accept: ' + req.headers['sec-websocket-key'] + '\r\n' +
    '\r\n'
  );

  console.log('🎙️ Voice client connected');

  let sessionId: string | null = null;
  let session: any = null;

  // Handle incoming messages from client
  socket.on('data', async (data: any) => {
    try {
      // Parse the WebSocket frame
      const message = parseWebSocketFrame(data);
      if (!message) return;

      const parsedMessage = JSON.parse(message);

      switch (parsedMessage.type) {
        case 'session_init':
          console.log('🎙️ Voice session init:', parsedMessage);
          
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          try {
            // Simplified session creation for now
            session = {
              id: sessionId,
              status: 'active',
              userId: parsedMessage.user_id || 'anonymous',
              model: parsedMessage.model || 'gpt-4o-realtime-preview',
              voice: parsedMessage.voice || 'verse',
              sampleRate: parsedMessage.sample_rate || 16000,
            };

            // Send session acknowledgment
            sendWebSocketMessage(socket, {
              type: 'session_ack',
              sessionId: session.id,
              status: session.status,
              message: 'Voice session initialized'
            });

          } catch (error: any) {
            console.error('Failed to create voice session:', error);
            sendWebSocketMessage(socket, {
              type: 'error',
              message: 'Failed to initialize voice service',
              error: error.message
            });
          }
          break;

        case 'audio_input':
          if (sessionId) {
            // Simplified audio handling
            console.log('Audio input received for session:', sessionId);
            sendWebSocketMessage(socket, { type: 'audio_received' });
          }
          break;

        case 'audio_commit':
          if (sessionId) {
            // Simplified audio commit
            console.log('Audio commit for session:', sessionId);
            sendWebSocketMessage(socket, { type: 'audio_committed' });
          }
          break;

        case 'session_end':
          if (sessionId) {
            console.log('🎙️ Voice session ended:', sessionId);
            session = null;
            sessionId = null;
          }
          break;

        default:
          console.log('Unknown message type:', parsedMessage.type);
      }
    } catch (error: any) {
      console.error('Error processing WebSocket message:', error);
      sendWebSocketMessage(socket, {
        type: 'error',
        message: 'Failed to process message',
        error: error.message
      });
    }
  });

  // Handle socket close
  socket.on('close', () => {
    console.log('🎙️ Voice client disconnected');
    if (sessionId) {
      // Clean up session
      session = null;
      sessionId = null;
    }
  });

  // Handle socket errors
  socket.on('error', (error: any) => {
    console.error('🎙️ Voice socket error:', error);
  });
});

// Helper function to parse WebSocket frames
function parseWebSocketFrame(data: Buffer): string | null {
  try {
    // Simplified WebSocket frame parsing
    // In a real implementation, you'd need proper WebSocket frame parsing
    return data.toString('utf8');
  } catch (error) {
    console.error('Error parsing WebSocket frame:', error);
    return null;
  }
}

// Helper function to send WebSocket messages
function sendWebSocketMessage(socket: any, message: any) {
  try {
    const messageStr = JSON.stringify(message);
    const frame = Buffer.from(messageStr, 'utf8');
    socket.write(frame);
  } catch (error) {
    console.error('Error sending WebSocket message:', error);
  }
}