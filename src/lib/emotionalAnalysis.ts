export interface EmotionalState {
  state: string;
  intensity: number;
}

// Emotional keywords and their corresponding states
const emotionalKeywords = {
  // Positive emotions
  joyful: ['happy', 'joy', 'excited', 'thrilled', 'delighted', 'elated', 'ecstatic', 'cheerful', 'gleeful', 'jubilant'],
  empowered: ['strong', 'confident', 'empowered', 'capable', 'powerful', 'determined', 'resilient', 'courageous', 'brave'],
  creative: ['creative', 'inspired', 'imaginative', 'artistic', 'innovative', 'visionary', 'expressive'],
  calm: ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed', 'content', 'at ease', 'centered'],
  
  // Negative emotions
  anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'fearful', 'panicked', 'overwhelmed', 'distressed'],
  depressed: ['sad', 'depressed', 'melancholy', 'down', 'hopeless', 'despair', 'grief', 'sorrow', 'blue'],
  angry: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'enraged', 'hostile', 'aggressive', 'livid'],
  vulnerable: ['vulnerable', 'scared', 'afraid', 'frightened', 'terrified', 'insecure', 'exposed', 'defenseless']
};

// Analyze text and return emotional state
export function analyzeEmotionalState(text: string): EmotionalState {
  const lowerText = text.toLowerCase();
  let maxScore = 0;
  let detectedState = 'calm';
  let intensity = 5; // Default moderate intensity

  // Check for emotional keywords
  for (const [state, keywords] of Object.entries(emotionalKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score += 1;
        // Check for intensifiers
        if (lowerText.includes('very ' + keyword) || 
            lowerText.includes('extremely ' + keyword) ||
            lowerText.includes('really ' + keyword)) {
          score += 2;
        }
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      detectedState = state;
    }
  }

  // Calculate intensity based on emotional indicators
  const intensityIndicators = {
    very: 2,
    extremely: 3,
    really: 2,
    so: 1.5,
    quite: 1.2,
    somewhat: 0.8,
    slightly: 0.6
  };

  let intensityMultiplier = 1;
  for (const [indicator, multiplier] of Object.entries(intensityIndicators)) {
    if (lowerText.includes(indicator)) {
      intensityMultiplier = Math.max(intensityMultiplier, multiplier);
    }
  }

  // Base intensity by emotion type
  const baseIntensities = {
    joyful: 7,
    empowered: 8,
    creative: 6,
    calm: 4,
    anxious: 6,
    depressed: 5,
    angry: 8,
    vulnerable: 6
  };

  intensity = (baseIntensities[detectedState as keyof typeof baseIntensities] || 5) * intensityMultiplier;
  intensity = Math.min(Math.max(intensity, 1), 10); // Clamp between 1-10

  return {
    state: detectedState,
    intensity: Math.round(intensity)
  };
}

// Analyze conversation context for emotional progression
export function analyzeConversationEmotion(messages: Array<{ role: string; content: string }>): EmotionalState {
  if (messages.length === 0) {
    return { state: 'calm', intensity: 5 };
  }

  // Focus on recent messages (last 3)
  const recentMessages = messages.slice(-3);
  const userMessages = recentMessages.filter(msg => msg.role === 'user');
  
  if (userMessages.length === 0) {
    return { state: 'calm', intensity: 5 };
  }

  // Analyze the most recent user message
  const latestUserMessage = userMessages[userMessages.length - 1];
  return analyzeEmotionalState(latestUserMessage.content);
}

// Get appropriate response emotional state based on user's emotional state
export function getResponseEmotionalState(userEmotionalState: EmotionalState): EmotionalState {
  const { state, intensity } = userEmotionalState;
  
  // Therapeutic response mapping
  const responseMapping: Record<string, { state: string; intensity: number }> = {
    anxious: { state: 'calm', intensity: Math.max(3, intensity - 2) },
    depressed: { state: 'empowered', intensity: Math.min(8, intensity + 1) },
    angry: { state: 'calm', intensity: Math.max(4, intensity - 1) },
    vulnerable: { state: 'calm', intensity: Math.max(3, intensity - 1) },
    joyful: { state: 'joyful', intensity: Math.min(9, intensity + 1) },
    empowered: { state: 'empowered', intensity: Math.min(9, intensity + 1) },
    creative: { state: 'creative', intensity: Math.min(9, intensity + 1) },
    calm: { state: 'calm', intensity: Math.max(4, intensity) }
  };

  return responseMapping[state] || { state: 'calm', intensity: 5 };
} 