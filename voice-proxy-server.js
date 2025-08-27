/**
 * Voice Proxy Server - Bridges Frontend to OpenAI Realtime API
 * Run this alongside your Next.js app: node voice-proxy-server.js
 */

const WebSocket = require('ws');
const http = require('http');

// Configuration
const PORT = process.env.VOICE_WS_PORT || 8080;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_REALTIME_URL = 'wss://api.openai.com/v1/realtime';

// Voice personality mapping to OpenAI voices (updated to match new config)
const VOICE_MAPPING = {
  vale: 'alloy',      // Bright and inquisitive
  ember: 'echo',      // Confident and optimistic  
  cove: 'fable',      // Composed and direct
  spruce: 'onyx',     // Calm and affirming
  maple: 'nova',      // Cheerful and candid
  arbor: 'shimmer',   // Easygoing and versatile
  breeze: 'alloy',    // Light and airy
  juniper: 'onyx',    // Natural and grounding
  sol: 'echo'         // Bright and energetic
};

// Store active voice sessions
const activeSessions = new Map();

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'Voice proxy server is running',
    activeSessions: activeSessions.size,
    supportedVoices: Object.keys(VOICE_MAPPING)
  }));
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

console.log(`🎤 Starting voice proxy server on port ${PORT}`);

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  console.log('🎤 Voice client connected:', req.socket.remoteAddress);

  // Handle messages from frontend
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`📨 [PROXY] Received ${data.type} from client`);
      
      switch (data.type) {
        case 'init_session':
          console.log(`🎯 [PROXY] Initializing session: ${data.sessionId} with voice: ${data.voiceId}`);
          await handleSessionInit(ws, data);
          break;
          
        case 'audio_chunk':
          console.log(`🎵 [PROXY] Audio chunk received: ${data.audioData?.length || 0} bytes`);
          await handleAudioChunk(ws, data);
          break;
          
        case 'end_session':
          console.log(`🛑 [PROXY] Ending session: ${data.sessionId}`);
          handleSessionEnd(data.sessionId);
          break;
          
        default:
          console.warn('⚠️ [PROXY] Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('❌ [PROXY] Error processing message:', error);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('🎤 Voice client disconnected');
    // Clean up any sessions associated with this connection
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.clientWs === ws) {
        handleSessionEnd(sessionId);
      }
    }
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

/**
 * Handle voice session initialization
 */
async function handleSessionInit(clientWs, data) {
  try {
    console.log('🎯 Initializing voice session:', data.sessionId, 'with voice:', data.voiceId);
    
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Map frontend voice ID to OpenAI voice
    const openaiVoiceId = VOICE_MAPPING[data.voiceId] || 'echo';
    
    // Create OpenAI WebSocket connection with proper session creation
    const openaiWs = new WebSocket(`${OPENAI_REALTIME_URL}?model=gpt-4o-realtime-preview`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    });

    // Handle OpenAI connection events
    openaiWs.on('open', () => {
      console.log('🔗 Connected to OpenAI Realtime API');
      
      // Send session initialization to OpenAI with proper format
      const initMessage = {
        type: 'session.create',
        session: {
          model: 'gpt-4o-realtime-preview',
          voice: openaiVoiceId,
          modalities: ['audio', 'text'],
          audio: {
            input: {
              type: 'microphone',
              sampling_rate: 16000
            },
            output: {
              type: 'speaker',
              sampling_rate: 24000
            }
          }
        }
      };
      
      openaiWs.send(JSON.stringify(initMessage));
      
      // Store session
      activeSessions.set(data.sessionId, {
        clientWs,
        openaiWs,
        voiceId: data.voiceId,
        isActive: true,
        startTime: Date.now()
      });
      
      // Send confirmation to client
      clientWs.send(JSON.stringify({
        type: 'session_ready',
        sessionId: data.sessionId,
        voiceId: data.voiceId
      }));
      
      console.log('✅ Voice session initialized:', data.sessionId);
    });

    openaiWs.on('message', (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log(`📨 [OPENAI] Message type: ${response.type}`);
        handleOpenAIMessage(clientWs, response, data.sessionId);
      } catch (error) {
        console.error('❌ [OPENAI] Error parsing message:', error);
      }
    });

    openaiWs.on('error', (error) => {
      console.error('❌ OpenAI WebSocket error:', error);
      clientWs.send(JSON.stringify({
        type: 'session_error',
        error: 'OpenAI connection error',
        details: error.message
      }));
    });

    openaiWs.on('close', () => {
      console.log('🔗 OpenAI connection closed for session:', data.sessionId);
      handleSessionEnd(data.sessionId);
    });

  } catch (error) {
    console.error('❌ Failed to initialize voice session:', error);
    clientWs.send(JSON.stringify({
      type: 'session_error',
      error: 'Failed to initialize voice session',
      details: error.message
    }));
  }
}

/**
 * Handle audio chunks from frontend
 */
async function handleAudioChunk(clientWs, data) {
  try {
    const session = activeSessions.get(data.sessionId);
    if (!session || !session.isActive) {
      console.warn('⚠️ No active session for audio chunk:', data.sessionId);
      return;
    }

    // Convert array back to Uint8Array and forward to OpenAI
    if (session.openaiWs && session.openaiWs.readyState === WebSocket.OPEN) {
      const audioData = new Uint8Array(data.audioData);
      
      // Send audio data in the correct format for OpenAI Realtime API
      const audioMessage = {
        type: 'audio.delta',
        delta: Array.from(audioData) // Convert to array for JSON transmission
      };
      
      session.openaiWs.send(JSON.stringify(audioMessage));
    }
    
  } catch (error) {
    console.error('❌ Error processing audio chunk:', error);
  }
}

/**
 * Handle messages from OpenAI Realtime API
 */
function handleOpenAIMessage(clientWs, data, sessionId) {
  const session = activeSessions.get(sessionId);
  if (!session) return;

  // Forward different message types to client based on OpenAI Realtime API format
  switch (data.type) {
    case 'session.created':
      console.log('✅ Session created successfully');
      clientWs.send(JSON.stringify({
        type: 'session_ready',
        sessionId,
        voiceId: session.voiceId
      }));
      break;
      
    case 'transcript.delta':
      clientWs.send(JSON.stringify({
        type: 'transcript_update',
        sessionId,
        transcript: data.delta,
        isFinal: data.is_final || false
      }));
      break;
      
    case 'assistant.delta':
      clientWs.send(JSON.stringify({
        type: 'assistant_message',
        sessionId,
        message: data.delta,
        voiceId: session.voiceId
      }));
      break;
      
    case 'audio.delta':
      clientWs.send(JSON.stringify({
        type: 'audio_response',
        sessionId,
        audioData: data.delta,
        voiceId: session.voiceId
      }));
      break;
      
    case 'error':
      console.error('❌ OpenAI error:', data.error);
      clientWs.send(JSON.stringify({
        type: 'openai_error',
        sessionId,
        error: data.error
      }));
      break;
      
    default:
      // Forward any other messages
      clientWs.send(JSON.stringify({
        type: 'openai_response',
        sessionId,
        data: data
      }));
  }
}

/**
 * Handle session cleanup
 */
function handleSessionEnd(sessionId) {
  const session = activeSessions.get(sessionId);
  if (session) {
    if (session.openaiWs) {
      session.openaiWs.close();
    }
    session.isActive = false;
    activeSessions.delete(sessionId);
    console.log('🧹 Cleaned up session:', sessionId);
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`🎤 Voice proxy server running on port ${PORT}`);
  console.log(`🔗 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`📊 Status endpoint: http://localhost:${PORT}`);
  console.log(`🎭 Supported voices: ${Object.keys(VOICE_MAPPING).join(', ')}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down voice proxy server...');
  
  // Clean up all sessions
  for (const [sessionId] of activeSessions.entries()) {
    handleSessionEnd(sessionId);
  }
  
  server.close(() => {
    console.log('✅ Voice proxy server stopped');
    process.exit(0);
  });
});
