const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');
const WebSocket = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Prepare Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Create WebSocket server for OpenAI Realtime proxy
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket upgrades
  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/api/realtime') {
      console.log('🔌 WebSocket upgrade request for /api/realtime');
      
      wss.handleUpgrade(request, socket, head, (ws) => {
        console.log('🌐 Browser connected to /api/realtime proxy');

        // Connect to OpenAI Realtime
        const openaiWs = new WebSocket(
          'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview',
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              'OpenAI-Beta': 'realtime=v1',
            },
          }
        );

        // Forward browser → OpenAI
        ws.on('message', (msg) => {
          console.log('📤 Browser → OpenAI:', msg.toString());
          if (openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.send(msg);
          }
        });

        // Forward OpenAI → browser
        openaiWs.on('message', (msg) => {
          console.log('📥 OpenAI → Browser:', msg.toString());
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(msg);
          }
        });

        // Handle connection events
        openaiWs.on('open', () => {
          console.log('✅ OpenAI WebSocket connected');
        });

        openaiWs.on('error', (err) => {
          console.error('❌ OpenAI WebSocket error:', err);
        });

        openaiWs.on('close', (code, reason) => {
          console.log('🔌 OpenAI WebSocket closed:', code, reason);
        });

        // Handle closes
        openaiWs.on('close', () => ws.close());
        ws.on('close', () => openaiWs.close());
      });
    } else {
      socket.destroy();
    }
  });

  // Start server
  server.listen(port, () => {
    console.log(`🚀 Ready on http://${hostname}:${port}`);
    console.log('🎙️ OpenAI Realtime proxy available at ws://localhost:3000/api/realtime');
  });
});
