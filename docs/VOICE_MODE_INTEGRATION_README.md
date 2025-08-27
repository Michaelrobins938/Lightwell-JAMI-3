# ChatGPT Voice Mode Integration

This document describes the integration of ChatGPT-style voice mode into your Luna AI application.

## 🎯 Overview

The voice mode system provides real-time voice interaction capabilities similar to ChatGPT's voice features, including:
- Real-time voice input and output
- OpenAI Realtime API integration
- Automatic reconnection and token refresh
- Seamless integration with existing chat interface

## 📁 File Structure

```
src/
├── components/
│   └── voice/
│       ├── VoiceModeButton.tsx      # Main voice mode toggle button
│       ├── useVoiceSession.ts       # Voice session management hook
│       ├── AudioPlayer.ts           # Audio playback handling
│       └── ChatUI.ts               # Chat interface updates
├── state/
│   └── chatStore.ts                # Zustand-based chat state management
└── pages/
    └── api/
        └── session.ts              # OpenAI session creation endpoint
```

## 🚀 Quick Start

### 1. Environment Setup

Ensure you have the following environment variable set:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Test the Integration

Visit `/voice-test-chatgpt` to test the voice mode functionality.

### 3. Use in Your Chat Interface

The `VoiceModeButton` component is already integrated into your `ChatGPTInput` component.

## 🔧 Components

### VoiceModeButton

A React component that provides:
- Voice mode toggle functionality
- Visual status indicators (listening, speaking)
- Mute/unmute controls
- Smooth animations and transitions

**Props:**
- `onVoiceModeToggle`: Callback when voice mode is toggled
- `onTranscriptUpdate`: Callback for transcript updates
- `className`: Additional CSS classes
- `size`: Button size ('sm', 'md', 'lg')

**Usage:**
```tsx
import { VoiceModeButton } from '../components/voice/VoiceModeButton';

<VoiceModeButton
  onVoiceModeToggle={(isActive) => console.log('Voice mode:', isActive)}
  size="md"
/>
```

### useVoiceSession

A React hook that manages:
- WebRTC peer connection setup
- OpenAI Realtime API integration
- Automatic reconnection
- Token refresh

**Features:**
- Automatic microphone access
- Real-time audio streaming
- Connection state management
- Error handling and recovery

### AudioPlayer

Handles audio playback with:
- Audio buffer queuing
- Base64 audio decoding
- Stream playback support
- Automatic queue management

### ChatUI

Manages chat interface updates:
- Real-time message streaming
- Message finalization
- Delta updates handling

## 🔌 API Endpoints

### POST /api/session

Creates a new OpenAI Realtime session.

**Request Body:**
```json
{
  "model": "gpt-4o-realtime-preview",
  "voice": "verse"
}
```

**Response:**
```json
{
  "client_secret": {
    "value": "session_token_here"
  }
}
```

## 🎨 UI Integration

The voice mode button is integrated into your existing chat interface with:
- Clinical/enterprise styling
- Smooth animations
- Status indicators
- Responsive design

## 🔒 Security Considerations

- Microphone permissions are requested only when needed
- API keys are stored securely in environment variables
- WebRTC connections use secure protocols
- No audio data is stored locally

## 🐛 Troubleshooting

### Common Issues

1. **Microphone Permission Denied**
   - Ensure browser has microphone access
   - Check browser settings for site permissions

2. **OpenAI API Key Issues**
   - Verify OPENAI_API_KEY is set correctly
   - Check API key permissions and quotas

3. **WebRTC Connection Failures**
   - Check network connectivity
   - Verify firewall settings
   - Try refreshing the page

### Debug Mode

Enable console logging to see detailed connection information:
```typescript
// In useVoiceSession.ts
console.log('Connection state:', pc.current?.connectionState);
console.log('Session token:', token);
```

## 🔄 Updates and Maintenance

The system automatically handles:
- Connection failures and reconnection
- Token expiration and refresh
- Audio stream management
- Error recovery

## 📱 Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Limited support (WebRTC limitations)
- Mobile browsers: Varies by platform

## 🎯 Future Enhancements

Potential improvements:
- Voice activity detection
- Custom voice models
- Multi-language support
- Advanced audio processing
- Integration with existing voice services

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify environment variable configuration
3. Test with the voice-test-chatgpt page
4. Review browser compatibility requirements
