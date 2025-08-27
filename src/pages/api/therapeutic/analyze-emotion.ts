import { NextApiRequest, NextApiResponse } from 'next';
import { openRouterChatCompletion } from '../../../services/openRouterService';
import { EmotionalState, UserProfile } from '../../../types/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, userProfile } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Enhanced emotional analysis prompt with therapeutic context
    const analysisPrompt = `You are an expert clinical psychologist specializing in emotional assessment and therapeutic interventions. Analyze the following text for emotional content and provide a comprehensive emotional assessment.

Text to analyze: "${text}"

User Profile Context:
- Therapeutic Style: ${userProfile?.therapeuticStyle || 'Integrative'}
- Cultural Background: ${userProfile?.culturalBackground?.join(', ') || 'General'}
- Trauma History: ${userProfile?.traumaHistory ? 'Yes' : 'No'}
- Communication Preference: ${userProfile?.preferences?.communicationStyle || 'empathetic'}

Please provide a detailed emotional assessment in the following JSON format:
{
  "primaryEmotion": "string (one of: joy, sadness, anxiety, anger, fear, surprise, disgust, calm, neutral)",
  "secondaryEmotions": ["array of additional emotions detected"],
  "intensity": "number 1-10",
  "valence": "positive|negative|neutral",
  "arousal": "low|medium|high",
  "confidence": "number 0-1",
  "triggers": ["array of potential emotional triggers identified"],
  "somaticSymptoms": ["array of physical symptoms mentioned or implied"]
}

Consider:
1. Cultural context and communication style
2. Trauma-informed perspective if applicable
3. Therapeutic relationship context
4. Subtle emotional cues and implications
5. Somatic manifestations of emotions
6. Potential triggers and stressors

Respond only with valid JSON.`;

    const response = await openRouterChatCompletion([
      {
        role: 'user',
        content: 'You are an expert clinical psychologist with deep expertise in emotional assessment, cultural competency, and trauma-informed care. Provide accurate, clinically-informed emotional assessments.'
      },
      {
        role: 'user',
        content: analysisPrompt
      }
    ], 'anthropic/claude-3.5-sonnet', 1000, 0.3);

    let emotionalAssessment: EmotionalState;

    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(response.choices[0].message.content);
      emotionalAssessment = {
        primaryEmotion: parsedResponse.primaryEmotion || 'neutral',
        secondaryEmotions: parsedResponse.secondaryEmotions || [],
        intensity: Math.max(1, Math.min(10, parsedResponse.intensity || 5)),
        triggers: parsedResponse.triggers || [],
        somaticSymptoms: parsedResponse.somaticSymptoms || [],
        cognitivePatterns: parsedResponse.cognitivePatterns || [],
        progressIndicator: parsedResponse.progressIndicator,
        contextualNotes: parsedResponse.contextualNotes
      };
    } catch (parseError) {
      // Fallback analysis if JSON parsing fails
      console.error('Failed to parse emotional analysis response:', parseError);
      emotionalAssessment = await performFallbackAnalysis(text, userProfile);
    }

    // Validate and normalize the assessment
    emotionalAssessment = validateEmotionalAssessment(emotionalAssessment);

    return res.status(200).json(emotionalAssessment);
  } catch (error) {
    console.error('Emotional analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze emotional state',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function performFallbackAnalysis(text: string, userProfile: UserProfile): Promise<EmotionalState> {
  // Simple keyword-based fallback analysis
  const lowerText = text.toLowerCase();
  
  let primaryEmotion = 'neutral';
  let intensity = 5;
  let valence: 'positive' | 'negative' | 'neutral' = 'neutral';
  let arousal: 'low' | 'medium' | 'high' = 'medium';
  const triggers: string[] = [];
  const somaticSymptoms: string[] = [];

  // Emotion detection patterns
  const emotionPatterns = {
    joy: {
      keywords: ['happy', 'joy', 'excited', 'thrilled', 'delighted', 'pleased', 'great', 'wonderful', 'amazing'],
      intensity: 7,
      valence: 'positive' as const,
      arousal: 'high' as const
    },
    sadness: {
      keywords: ['sad', 'depressed', 'hopeless', 'melancholy', 'grief', 'sorrow', 'down', 'blue', 'miserable'],
      intensity: 8,
      valence: 'negative' as const,
      arousal: 'low' as const
    },
    anxiety: {
      keywords: ['anxious', 'worried', 'nervous', 'scared', 'fearful', 'panicked', 'stressed', 'tense', 'overwhelmed'],
      intensity: 7,
      valence: 'negative' as const,
      arousal: 'high' as const
    },
    anger: {
      keywords: ['angry', 'furious', 'mad', 'irritated', 'frustrated', 'enraged', 'livid', 'outraged'],
      intensity: 8,
      valence: 'negative' as const,
      arousal: 'high' as const
    },
    fear: {
      keywords: ['afraid', 'terrified', 'frightened', 'scared', 'horrified', 'petrified', 'alarmed'],
      intensity: 8,
      valence: 'negative' as const,
      arousal: 'high' as const
    },
    calm: {
      keywords: ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed', 'content', 'at ease'],
      intensity: 4,
      valence: 'positive' as const,
      arousal: 'low' as const
    }
  };

  // Check for emotion patterns
  for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
    if (pattern.keywords.some(keyword => lowerText.includes(keyword))) {
      primaryEmotion = emotion;
      intensity = pattern.intensity;
      valence = pattern.valence;
      arousal = pattern.arousal;
      break;
    }
  }

  // Detect triggers
  const triggerKeywords = [
    'work', 'job', 'boss', 'colleague', 'family', 'partner', 'relationship', 'money', 'financial',
    'health', 'illness', 'doctor', 'hospital', 'school', 'exam', 'test', 'deadline', 'meeting',
    'social', 'party', 'event', 'travel', 'moving', 'change', 'loss', 'death', 'divorce'
  ];

  triggerKeywords.forEach(trigger => {
    if (lowerText.includes(trigger)) {
      triggers.push(trigger);
    }
  });

  // Detect somatic symptoms
  const somaticKeywords = [
    'headache', 'stomach', 'nausea', 'dizzy', 'tired', 'exhausted', 'sweating', 'shaking',
    'heart racing', 'chest pain', 'shortness of breath', 'muscle tension', 'back pain'
  ];

  somaticKeywords.forEach(symptom => {
    if (lowerText.includes(symptom)) {
      somaticSymptoms.push(symptom);
    }
  });

  return {
    primaryEmotion,
    secondaryEmotions: [],
    intensity,
    triggers,
    somaticSymptoms,
    cognitivePatterns: [],
    progressIndicator: undefined,
    contextualNotes: undefined
  };
}

function validateEmotionalAssessment(assessment: EmotionalState): EmotionalState {
  // Ensure all required fields are present and valid
  const validEmotions = ['joy', 'sadness', 'anxiety', 'anger', 'fear', 'surprise', 'disgust', 'calm', 'neutral'];
  const validValences = ['positive', 'negative', 'neutral'];
  const validArousals = ['low', 'medium', 'high'];

  return {
    primaryEmotion: validEmotions.includes(assessment.primaryEmotion) ? assessment.primaryEmotion : 'neutral',
    secondaryEmotions: Array.isArray(assessment.secondaryEmotions) ? assessment.secondaryEmotions : [],
    intensity: Math.max(1, Math.min(10, assessment.intensity || 5)),
    triggers: Array.isArray(assessment.triggers) ? assessment.triggers : [],
    somaticSymptoms: Array.isArray(assessment.somaticSymptoms) ? assessment.somaticSymptoms : [],
    cognitivePatterns: Array.isArray(assessment.cognitivePatterns) ? assessment.cognitivePatterns : [],
    progressIndicator: assessment.progressIndicator,
    contextualNotes: assessment.contextualNotes
  };
} 