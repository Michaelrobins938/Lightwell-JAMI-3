/**
 * Voice Personality Configuration
 * ChatGPT-style voice carousel with preview functionality
 */

export interface VoicePersonality {
  id: string;
  name: string;
  description: string;
  openaiVoiceId: string;
  avatar: string;
  color: string;
  demoUrl?: string;
  sampleText: string;
  personality: string;
  category: 'warm' | 'professional' | 'energetic' | 'calm' | 'friendly';
}

export const VOICE_PERSONALITIES: VoicePersonality[] = [
  {
    id: 'vale',
    name: 'Vale',
    description: 'Bright and inquisitive',
    openaiVoiceId: 'alloy',
    avatar: '🌟',
    color: '#FFD700',
    sampleText: 'Hello! I\'m Vale, and I\'m here to help you explore and discover new things.',
    personality: 'Curious, enthusiastic, and always eager to learn',
    category: 'energetic'
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Confident and optimistic',
    openaiVoiceId: 'echo',
    avatar: '🔥',
    color: '#FF6B35',
    sampleText: 'Hi there! I\'m Ember, and I believe we can accomplish great things together.',
    personality: 'Motivating, positive, and solution-focused',
    category: 'warm'
  },
  {
    id: 'cove',
    name: 'Cove',
    description: 'Composed and direct',
    openaiVoiceId: 'fable',
    avatar: '🌊',
    color: '#4A90E2',
    sampleText: 'Greetings. I\'m Cove, and I\'m here to provide clear, direct assistance.',
    personality: 'Professional, articulate, and efficient',
    category: 'professional'
  },
  {
    id: 'spruce',
    name: 'Spruce',
    description: 'Calm and affirming',
    openaiVoiceId: 'onyx',
    avatar: '🌲',
    color: '#2E8B57',
    sampleText: 'Hello, I\'m Spruce. Let\'s work together to find the best solutions.',
    personality: 'Steady, supportive, and grounding',
    category: 'calm'
  },
  {
    id: 'maple',
    name: 'Maple',
    description: 'Cheerful and candid',
    openaiVoiceId: 'nova',
    avatar: '🍁',
    color: '#D2691E',
    sampleText: 'Hey! I\'m Maple, and I\'m excited to help you with whatever you need!',
    personality: 'Upbeat, honest, and approachable',
    category: 'friendly'
  },
  {
    id: 'arbor',
    name: 'Arbor',
    description: 'Easygoing and versatile',
    openaiVoiceId: 'shimmer',
    avatar: '🌳',
    color: '#8FBC8F',
    sampleText: 'Hi! I\'m Arbor, and I\'m here to adapt to whatever you need help with.',
    personality: 'Flexible, adaptable, and easy to work with',
    category: 'friendly'
  },
  {
    id: 'breeze',
    name: 'Breeze',
    description: 'Light and airy',
    openaiVoiceId: 'alloy',
    avatar: '💨',
    color: '#87CEEB',
    sampleText: 'Hello! I\'m Breeze, and I\'m here to make things feel effortless and smooth.',
    personality: 'Light-hearted, refreshing, and easy-going',
    category: 'calm'
  },
  {
    id: 'juniper',
    name: 'Juniper',
    description: 'Natural and grounding',
    openaiVoiceId: 'onyx',
    avatar: '🌿',
    color: '#556B2F',
    sampleText: 'Greetings. I\'m Juniper, and I\'m here to provide natural, grounded guidance.',
    personality: 'Wise, earthy, and deeply understanding',
    category: 'calm'
  },
  {
    id: 'sol',
    name: 'Sol',
    description: 'Bright and energetic',
    openaiVoiceId: 'echo',
    avatar: '☀️',
    color: '#FFD700',
    sampleText: 'Hey there! I\'m Sol, and I\'m here to brighten your day and energize our conversation!',
    personality: 'Vibrant, enthusiastic, and full of life',
    category: 'energetic'
  }
];

// Voice categories for filtering
export const VOICE_CATEGORIES = {
  warm: { name: 'Warm & Friendly', color: '#FF6B35' },
  professional: { name: 'Professional', color: '#4A90E2' },
  energetic: { name: 'Energetic', color: '#FFD700' },
  calm: { name: 'Calm & Soothing', color: '#87CEEB' },
  friendly: { name: 'Friendly', color: '#8FBC8F' }
};

// Helper functions
export const getVoiceById = (id: string): VoicePersonality | undefined => {
  return VOICE_PERSONALITIES.find(voice => voice.id === id);
};

export const getVoicesByCategory = (category: string): VoicePersonality[] => {
  return VOICE_PERSONALITIES.filter(voice => voice.category === category);
};

export const getDefaultVoice = (): VoicePersonality => {
  return VOICE_PERSONALITIES.find(voice => voice.id === 'ember') || VOICE_PERSONALITIES[0];
};
