# 🎤 Voice System Setup Guide

## Overview

Your voice system is now fully integrated with OpenAI's Realtime API! This guide will help you get everything running.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install ws
```

### 2. Set Environment Variables

Add to your `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
VOICE_WS_PORT=8080
```

**Important**: Make sure your OpenAI API key has access to the Realtime API.

### 3. Start the Voice System

The voice system is now **fully integrated** into your Next.js app! Just run:

```bash
npm run dev
```

That's it! The voice proxy server runs automatically as part of your Next.js API routes.

## 🔧 How It Works

### Frontend Components
- **`useVoiceSession.ts`** - Manages voice session state and WebSocket connection
- **`VoiceModeScreen.tsx`** - Full-screen voice interface with personality selection
- **`JARVIS_audioProcessor.ts`** - Advanced PCM16 audio processing
- **`googleTTSService.ts`** - Voice personality management

### Backend Bridge
- **`src/pages/api/voice/realtime.ts`** - Integrated WebSocket proxy that bridges frontend to OpenAI Realtime API

### Data Flow
```
Frontend (PCM16 Audio) → WebSocket → Voice Proxy → OpenAI Realtime API
                                                      ↓
Frontend (Responses) ← WebSocket ← Voice Proxy ← OpenAI Realtime API
```

## 🎭 Voice Personalities

Your system supports 9 voice personalities:

| Frontend ID | OpenAI Voice | Personality |
|-------------|--------------|-------------|
| `vale`      | `alloy`      | Bright and inquisitive |
| `ember`     | `echo`       | Confident and optimistic |
| `cove`      | `fable`      | Composed and direct |
| `spruce`    | `onyx`       | Calm and affirming |
| `maple`     | `nova`       | Cheerful and candid |
| `arbor`     | `shimmer`    | Easygoing and versatile |
| `breeze`    | `alloy`      | Light and airy |
| `juniper`   | `onyx`       | Natural and grounding |
| `sol`       | `echo`       | Bright and energetic |

## 🎯 Features

### ✅ What's Working
- **Advanced Audio Processing** - PCM16 pipeline with real-time downsampling
- **Voice Personalities** - 9 different AI personalities with unique colors
- **Audio-Reactive Orb** - Visual feedback based on audio levels
- **Real-time Transcription** - Live speech-to-text from OpenAI
- **Voice Responses** - AI responses with personality-specific voices
- **Session Management** - Proper cleanup and error handling

### 🔄 Real-time Communication
- **Audio Streaming** - PCM16 chunks sent to OpenAI in real-time
- **Transcript Updates** - Live transcription as you speak
- **AI Responses** - GPT-4o processing with voice personality
- **Audio Playback** - TTS responses from OpenAI

## 🛠️ Troubleshooting

### Common Issues

#### 1. WebSocket Connection Failed
```bash
# Check if voice proxy server is running
curl http://localhost:3000/api/voice/realtime
# Should return: {"status":"Voice proxy server is running",...}
```

#### 2. OpenAI API Key Issues
```bash
# Verify your API key has realtime access
# Check OpenAI dashboard for realtime permissions
```

#### 3. Audio Not Working
```bash
# Check browser permissions for microphone
# Ensure HTTPS in production (required for microphone access)
```

#### 4. Voice Personalities Not Loading
```bash
# Check browser console for errors
# Verify all voice mapping is correct
```

### Debug Mode

Add to your `.env.local`:
```env
DEBUG=voice:*
```

## 📊 Monitoring

### Voice Proxy Server Status
```bash
# Check server status
curl http://localhost:3000/api/voice/realtime

# Expected response:
{
  "status": "Voice proxy server is running",
  "activeSessions": 1,
  "supportedVoices": ["vale", "ember", "cove", "spruce", "maple", "arbor", "breeze", "juniper", "sol"]
}
```

### Logs to Watch
- **Frontend**: Browser console for WebSocket connection status
- **Backend**: Terminal running voice proxy for OpenAI API communication

## 🚀 Production Deployment

### Environment Variables
```env
OPENAI_API_KEY=your_production_openai_key
VOICE_WS_PORT=8080
NODE_ENV=production
```

### Deployment Steps
1. Deploy your Next.js app
2. Deploy the voice proxy server separately
3. Update frontend WebSocket URL to production endpoint
4. Ensure HTTPS for microphone access

## 🎉 Usage

1. **Open Voice Mode**: Click the microphone button in your chat interface
2. **Select Voice**: Click the orb or voice button to choose personality
3. **Start Speaking**: The orb will react to your voice
4. **Get Responses**: AI will respond with the selected voice personality

## 🔗 API Endpoints

- **WebSocket**: `ws://localhost:8080` (voice proxy)
- **Status**: `http://localhost:8080` (server status)
- **Frontend**: `http://localhost:3000` (Next.js app)

Your voice system is now fully connected to OpenAI's Realtime API with all the advanced features from the JARVIS and Luna systems!
