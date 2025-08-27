# Jamie AI Therapist Implementation

## Overview

Jamie is an advanced AI therapist that provides both text-based chat and an immersive voice + particle orb interface. The implementation includes real-time voice synthesis using ElevenLabs, audio-reactive particle visualization, and seamless integration with the existing chat system.

## Features

### 🎙️ Voice Integration
- **ElevenLabs TTS**: High-quality voice synthesis with natural speech patterns
- **Real-time Audio Analysis**: Audio level detection for orb reactivity
- **Voice Recognition**: Speech-to-text input for hands-free interaction
- **Fallback Support**: Browser TTS fallback if ElevenLabs is unavailable

### 🌌 Particle Orb Visualization
- **Nebula-style Particles**: Organic, flowing particle system with 3D shaders
- **Audio Reactivity**: Particles respond to voice audio levels in real-time
- **Emotional State Mapping**: Orb appearance changes based on emotional state
- **Breathing Animation**: Subtle breathing effect for lifelike presence

### 🔄 Seamless Mode Switching
- **Unified Conversation**: All messages sync between text and orb modes
- **Continuous Experience**: Switch between modes without losing context
- **Real-time Updates**: Messages appear in both interfaces simultaneously

## Architecture

### Core Components

#### 1. `JamieOrbMode.tsx`
The main orb interface component that handles:
- Voice input/output
- Particle orb visualization
- Settings and controls
- Emotional state display

#### 2. `NarratorOrb.tsx`
Enhanced particle system with:
- Custom GLSL shaders for nebula effects
- Audio-reactive particle behavior
- Organic flow and tendril effects
- Real-time audio level integration

#### 3. `useJamieVoice.ts`
Voice management hook providing:
- ElevenLabs API integration
- Audio context management
- Real-time audio analysis
- Error handling and fallbacks

#### 4. `elevenLabsService.ts`
Service layer for ElevenLabs integration:
- Voice synthesis API calls
- Audio buffer management
- Configuration management
- Error handling

### Integration Points

#### Chat Page Integration
```typescript
// State management
const [jamieOrbMode, setJamieOrbMode] = useState(false);
const [lastJamieMessage, setLastJamieMessage] = useState<string>('');

// Message handling
const handleJamieOrbMessage = async (message: string) => {
  // Process message through existing chat API
  // Update conversation state
  // Sync with text chat interface
};
```

#### Voice Service Integration
```typescript
// ElevenLabs configuration
const defaultJamieVoice = {
  apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
  voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
  stability: 0.5,
  similarityBoost: 0.75
};
```

## Setup Instructions

### 1. Environment Configuration

Add to your `.env.local`:
```bash
NEXT_PUBLIC_ELEVENLABS_API_KEY="your-elevenlabs-api-key-here"
```

### 2. ElevenLabs Setup

1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Get your API key from the dashboard
3. Choose a voice ID (default: Rachel - warm and empathetic)
4. Add the API key to your environment variables

### 3. Voice Configuration

The default Jamie voice is configured for:
- **Voice ID**: `21m00Tcm4TlvDq8ikWAM` (Rachel)
- **Stability**: 0.5 (balanced naturalness)
- **Similarity Boost**: 0.75 (consistent voice)
- **Style**: 0.0 (neutral)
- **Speaker Boost**: true (enhanced clarity)

### 4. Browser Compatibility

The implementation includes fallbacks for:
- **Speech Recognition**: WebkitSpeechRecognition with fallback
- **Audio Context**: WebkitAudioContext support
- **TTS**: Browser TTS fallback if ElevenLabs fails

## Usage

### Activating Jamie Orb Mode

1. **From Chat Interface**: Click "Jamie Orb Mode" in the tools sidebar
2. **Floating Button**: Use the floating orb button in the bottom-right corner
3. **Direct Access**: Navigate to `/chat` and enable orb mode

### Voice Interaction

#### Speaking to Jamie
- **Voice Input**: Click the microphone button to start voice recognition
- **Text Input**: Type messages in the text area
- **Real-time Feedback**: Visual indicators show listening/speaking status

#### Jamie's Responses
- **Voice Output**: Jamie speaks responses using ElevenLabs
- **Visual Feedback**: Orb reacts to Jamie's voice in real-time
- **Emotional Display**: Orb appearance reflects emotional state

### Settings and Controls

#### Voice Settings
- **Enable/Disable Voice**: Toggle voice synthesis
- **Audio Level Monitor**: Real-time audio level display
- **Status Indicators**: Speaking, listening, and processing states

#### Orb Visualization
- **Particle Count**: Adjustable particle density
- **Audio Reactivity**: Sensitivity to voice audio levels
- **Emotional Mapping**: Visual representation of emotional states

## Technical Details

### Audio Processing Pipeline

1. **Voice Input**: Speech recognition → Text conversion
2. **Message Processing**: Send to chat API → Get AI response
3. **Voice Synthesis**: ElevenLabs API → Audio buffer generation
4. **Audio Playback**: Web Audio API → Real-time analysis
5. **Visual Feedback**: Audio levels → Particle system reactivity

### Particle System Architecture

#### Shader Components
- **Vertex Shader**: Position calculation, audio reactivity, breathing
- **Fragment Shader**: Color mapping, transparency, glow effects
- **Noise Functions**: Organic flow and tendril generation

#### Audio Integration
- **Analyser Node**: Real-time frequency analysis
- **Audio Level Mapping**: Frequency data → particle intensity
- **Smooth Transitions**: Lerp interpolation for natural movement

### Performance Optimizations

- **Particle Culling**: Distance-based particle management
- **Shader Optimization**: Efficient noise and flow calculations
- **Audio Buffering**: Optimized audio context usage
- **Memory Management**: Proper cleanup of audio resources

## Error Handling

### Voice Synthesis Errors
- **API Failures**: Automatic fallback to browser TTS
- **Network Issues**: Graceful degradation with error messages
- **Audio Context Errors**: User-friendly error notifications

### Browser Compatibility
- **Speech Recognition**: Feature detection and fallbacks
- **Web Audio API**: Cross-browser audio context support
- **Three.js Rendering**: Performance-based quality adjustment

## Future Enhancements

### Planned Features
- **Custom Voice Training**: User-specific voice cloning
- **Emotional Voice Modulation**: Voice tone matching emotional state
- **Advanced Particle Effects**: More complex visual patterns
- **Voice Commands**: Hands-free navigation and controls

### Technical Improvements
- **WebRTC Integration**: Real-time voice communication
- **Advanced Audio Processing**: Better audio analysis algorithms
- **Performance Optimization**: Further rendering optimizations
- **Accessibility Features**: Screen reader and keyboard navigation

## Troubleshooting

### Common Issues

#### Voice Not Working
1. Check ElevenLabs API key configuration
2. Verify browser microphone permissions
3. Test with browser TTS fallback
4. Check network connectivity

#### Orb Not Displaying
1. Verify Three.js dependencies
2. Check WebGL support in browser
3. Monitor console for shader errors
4. Test with reduced particle count

#### Audio Analysis Issues
1. Check Web Audio API support
2. Verify microphone access
3. Test audio context initialization
4. Monitor audio level indicators

### Debug Mode

Enable debug logging by adding to your environment:
```bash
NEXT_PUBLIC_DEBUG_JAMIE=true
```

This will show:
- Audio level values
- Voice synthesis status
- Particle system performance
- Error details

## Security Considerations

### API Key Management
- **Environment Variables**: Never expose API keys in client code
- **Rate Limiting**: Implement proper API usage limits
- **Error Handling**: Don't expose sensitive error details

### User Privacy
- **Voice Data**: No voice data is stored or transmitted
- **Audio Processing**: All processing happens client-side
- **Session Data**: Standard chat session management

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

### Code Style
- **TypeScript**: Strict type checking enabled
- **React Hooks**: Functional components with hooks
- **Error Boundaries**: Proper error handling
- **Performance**: Optimized rendering and audio processing

### Testing
- **Voice Integration**: Test with different ElevenLabs voices
- **Audio Analysis**: Verify real-time audio level detection
- **Particle System**: Test with various audio inputs
- **Browser Compatibility**: Test across different browsers

## License

This implementation is part of the Luna AI project and follows the same licensing terms. 