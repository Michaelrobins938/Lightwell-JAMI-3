# AI Therapist Orb Implementation

## Overview

The AI Therapist Orb is a sophisticated 3D visual representation of the AI therapist that responds to user emotions, conversation context, and interaction states. It provides a unique and engaging way for users to interact with the Luna mental health platform.

## Features

### 🎭 Emotional Analysis
- **Real-time Text Analysis**: Analyzes user messages to detect emotional states
- **Emotional States Supported**:
  - `joyful` - Happy, excited, delighted
  - `anxious` - Worried, nervous, stressed
  - `depressed` - Sad, hopeless, melancholy
  - `angry` - Furious, irritated, frustrated
  - `vulnerable` - Scared, afraid, insecure
  - `creative` - Inspired, imaginative, artistic
  - `empowered` - Strong, confident, capable
  - `calm` - Peaceful, serene, relaxed

### 🌟 Visual Response System
- **Dynamic Particle System**: 3D nebula-style particles that respond to emotional intensity
- **Color Mapping**: Different colors for different emotional states
- **Intensity Scaling**: Visual intensity changes based on emotional strength
- **Breathing Animation**: Subtle breathing effect for lifelike appearance
- **Audio Reactivity**: Responds to speech synthesis and audio levels

### 🔊 Audio Integration
- **Speech Synthesis**: Text-to-speech for AI responses
- **Audio Analysis**: Real-time frequency analysis for visual effects
- **Speaking Indicators**: Visual feedback when the AI is speaking
- **Typing Indicators**: Shows when the AI is processing/thinking

## Technical Implementation

### Core Components

#### 1. `AITherapistOrb.tsx`
The main component that integrates all AI therapist functionality:
```typescript
interface AITherapistOrbProps {
  isSpeaking: boolean;
  emotionalState: {
    state: string;
    intensity: number;
  };
  messageContent?: string;
  isTyping?: boolean;
  className?: string;
}
```

#### 2. `NarratorOrb.jsx`
The 3D Three.js implementation with:
- **Vertex Shaders**: Particle movement and positioning
- **Fragment Shaders**: Color and transparency effects
- **Audio Reactivity**: Frequency-based visual responses
- **Breathing Animation**: Organic movement patterns

#### 3. `emotionalAnalysis.ts`
Utility functions for emotional state analysis:
```typescript
export function analyzeEmotionalState(text: string): EmotionalState
export function analyzeConversationEmotion(messages: Array<{ role: string; content: string }>): EmotionalState
export function getResponseEmotionalState(userEmotionalState: EmotionalState): EmotionalState
```

### Integration Points

#### Chat Interface (`src/pages/chat.tsx`)
- **Header Integration**: Small orb in the chat header
- **Welcome State**: Large orb displayed when no messages exist
- **Emotional Tracking**: Real-time emotional state analysis
- **Response Mapping**: AI responses adapt to user emotional state

#### Test Interface (`src/pages/test-ai-therapist.tsx`)
- **Interactive Testing**: Test different emotional states
- **Custom Messages**: Analyze any text input
- **Visual Feedback**: Real-time state display
- **Documentation**: How-it-works explanations

## Usage Examples

### Basic Integration
```typescript
import { AITherapistOrb } from '../components/therapeutic/AITherapistOrb';

<AITherapistOrb
  isSpeaking={isTyping}
  emotionalState={aiEmotionalState}
  messageContent={currentMessage}
  isTyping={isTyping}
  className="w-full h-full"
/>
```

### Emotional Analysis
```typescript
import { analyzeEmotionalState } from '../lib/emotionalAnalysis';

const userMessage = "I'm feeling really anxious about my presentation";
const emotionalState = analyzeEmotionalState(userMessage);
// Returns: { state: 'anxious', intensity: 7 }
```

### Response Mapping
```typescript
import { getResponseEmotionalState } from '../lib/emotionalAnalysis';

const userState = { state: 'anxious', intensity: 8 };
const aiResponse = getResponseEmotionalState(userState);
// Returns: { state: 'calm', intensity: 6 } - therapeutic response
```

## Visual States

### Color Mapping
- **Calm**: Blue (#0ea5e9)
- **Anxious**: Yellow (#fbbf24)
- **Depressed**: Purple (#7c3aed)
- **Angry**: Blue (#3b82f6)
- **Joyful**: Pink (#ec4899)
- **Creative**: Purple (#d946ef)
- **Empowered**: Green (#10b981)
- **Vulnerable**: Pink (#f472b6)

### Intensity Effects
- **Low (1-3)**: Subtle particle movement, muted colors
- **Medium (4-6)**: Moderate activity, balanced colors
- **High (7-10)**: Intense particle activity, bright colors

## Audio Features

### Speech Synthesis
- **Browser TTS**: Uses Web Speech API
- **Voice Selection**: Configurable voice options
- **Rate Control**: Adjustable speech speed
- **Volume Control**: Configurable audio levels

### Audio Analysis
- **Frequency Analysis**: Real-time FFT processing
- **Visual Response**: Particle intensity based on audio
- **Breathing Enhancement**: Audio-reactive breathing patterns

## Performance Considerations

### Optimization
- **Particle Count**: Configurable (default: 3000)
- **Tendril Count**: Configurable (default: 8)
- **Frame Rate**: Optimized for 60fps
- **Memory Management**: Proper cleanup on unmount

### Browser Compatibility
- **WebGL Support**: Required for 3D rendering
- **Audio API**: Required for speech synthesis
- **Fallbacks**: Graceful degradation for unsupported features

## Customization

### Styling
```css
/* Custom orb container */
.ai-therapist-orb {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}
```

### Configuration
```typescript
// Custom particle settings
<NarratorOrb 
  particleCount={5000}
  tendrilCount={12}
  intensity={0.8}
/>
```

## Testing

### Test Page Features
- **Emotional State Testing**: Pre-defined test messages
- **Interaction Testing**: Speaking and typing simulations
- **Custom Message Analysis**: Real-time emotional analysis
- **Visual Feedback**: Live state and intensity display

### Manual Testing
1. Navigate to `/test-ai-therapist`
2. Try different emotional test messages
3. Observe visual changes in the orb
4. Test speaking and typing states
5. Enter custom messages for analysis

## Future Enhancements

### Planned Features
- **Advanced NLP**: More sophisticated emotional analysis
- **Voice Recognition**: Real-time speech input
- **Gesture Control**: Hand tracking for interaction
- **Haptic Feedback**: Vibration responses
- **Multi-modal**: Combined text, voice, and gesture input

### Technical Improvements
- **WebGL 2.0**: Enhanced shader capabilities
- **Web Audio API**: Advanced audio processing
- **Machine Learning**: Real-time emotion classification
- **Accessibility**: Screen reader and keyboard navigation

## Troubleshooting

### Common Issues

#### Orb Not Rendering
- Check WebGL support in browser
- Verify Three.js dependencies
- Check console for errors

#### Audio Not Working
- Ensure browser supports Speech API
- Check microphone permissions
- Verify audio context initialization

#### Performance Issues
- Reduce particle count
- Lower tendril count
- Check device capabilities

### Debug Mode
```typescript
// Enable debug logging
const DEBUG_MODE = true;

if (DEBUG_MODE) {
  console.log('Emotional State:', emotionalState);
  console.log('Audio Level:', audioLevel);
  console.log('Intensity:', intensity);
}
```

## Contributing

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Navigate to test page: `/test-ai-therapist`
4. Make changes and test functionality

### Code Style
- **TypeScript**: Strict type checking
- **React Hooks**: Functional components
- **Framer Motion**: Smooth animations
- **Three.js**: WebGL best practices

### Testing
- **Unit Tests**: Component functionality
- **Integration Tests**: Full user flows
- **Performance Tests**: Frame rate and memory usage
- **Accessibility Tests**: Screen reader compatibility

## License

This implementation is part of the Luna mental health platform and follows the same licensing terms as the main project. 