import { NextApiRequest, NextApiResponse } from 'next';
import { openRouterChatCompletion } from '../../../services/openRouterService';
import { EmpathyResponse, EmotionalState, UserProfile } from '../../../types/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userInput, emotionalAssessment, userProfile } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'User input is required' });
    }

    // Enhanced empathy response prompt with clinical expertise
    const empathyPrompt = `You are an expert clinical psychologist specializing in therapeutic empathy and validation. Generate a comprehensive empathy response for the user's input.

User Input: "${userInput}"

Emotional Assessment:
- Primary Emotion: ${emotionalAssessment?.primaryEmotion || 'unknown'}
- Intensity: ${emotionalAssessment?.intensity || 5}/10
- Valence: ${emotionalAssessment?.valence || 'neutral'}
- Arousal: ${emotionalAssessment?.arousal || 'medium'}
- Triggers: ${emotionalAssessment?.triggers?.join(', ') || 'None identified'}

User Profile:
- Therapeutic Style: ${userProfile?.therapeuticStyle || 'Integrative'}
- Cultural Background: ${userProfile?.culturalBackground?.join(', ') || 'General'}
- Trauma History: ${userProfile?.traumaHistory ? 'Yes' : 'No'}
- Communication Preference: ${userProfile?.preferences?.communicationStyle || 'empathetic'}

Please provide a detailed empathy response in the following JSON format:
{
  "validation": "string (acknowledging the validity of their feelings)",
  "reflection": "string (reflecting back their experience)",
  "normalization": "string (normalizing their experience)",
  "hope": "string (providing hope and optimism)",
  "support": "string (expressing support and availability)"
}

Empathy Guidelines:
1. VALIDATION: Acknowledge that their feelings are real, understandable, and valid
2. REFLECTION: Mirror back their experience to show understanding
3. NORMALIZATION: Help them understand their reaction is human and common
4. HOPE: Provide realistic hope and optimism for improvement
5. SUPPORT: Express ongoing support and availability

Consider:
- Cultural sensitivity and appropriateness
- Trauma-informed approach if applicable
- User's communication preferences
- Emotional intensity and valence
- Therapeutic relationship context
- Evidence-based empathy techniques

Respond only with valid JSON.`;

    const response = await openRouterChatCompletion([
      {
        role: 'user',
        content: 'You are an expert clinical psychologist with deep expertise in therapeutic empathy, validation, and trauma-informed care. Provide clinically-informed empathy responses that are culturally sensitive and therapeutically appropriate.'
      },
      {
        role: 'user',
        content: empathyPrompt
      }
    ], 'anthropic/claude-3.5-sonnet', 800, 0.4);

    let empathyResponse: EmpathyResponse;

    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(response.choices[0].message.content);
      empathyResponse = {
        type: parsedResponse.type || 'therapeutic',
        content: parsedResponse.content || 'I understand how difficult this must be for you.',
        tone: parsedResponse.tone || 'compassionate',
        validationLevel: Math.max(0, Math.min(1, parsedResponse.validationLevel || 0.8))
      };
    } catch (parseError) {
      // Fallback empathy response if JSON parsing fails
      console.error('Failed to parse empathy response:', parseError);
      empathyResponse = await generateFallbackEmpathyResponse(userInput, emotionalAssessment, userProfile);
    }

    // Validate and normalize the empathy response
    empathyResponse = validateEmpathyResponse(empathyResponse);

    return res.status(200).json(empathyResponse);
  } catch (error) {
    console.error('Empathy response error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate empathy response',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function generateFallbackEmpathyResponse(
  userInput: string,
  emotionalAssessment: EmotionalState,
  userProfile: UserProfile
): Promise<EmpathyResponse> {
  
  const emotion = emotionalAssessment?.primaryEmotion || 'neutral';
  const intensity = emotionalAssessment?.intensity || 5;
  // Remove valence reference since it doesn't exist in EmotionalState
  
  // Emotion-specific empathy responses
  const empathyResponses = {
    sadness: {
      validation: 'Your sadness is completely valid and understandable. It\'s okay to feel this way.',
      reflection: 'It sounds like you\'re experiencing deep sadness right now, and that must be really difficult.',
      normalization: 'Many people experience periods of sadness, and it\'s a natural human response to difficult situations.',
      hope: 'With support and time, these feelings can ease and you can find moments of relief.',
      support: 'I\'m here to listen and support you through this difficult time.'
    },
    anxiety: {
      validation: 'Your anxiety is real and understandable. It\'s a natural response to stress and uncertainty.',
      reflection: 'It sounds like you\'re feeling very anxious and overwhelmed right now.',
      normalization: 'Anxiety is very common, and many people experience similar feelings when facing challenges.',
      hope: 'There are effective ways to manage anxiety, and you can learn skills to feel more calm.',
      support: 'I\'m here to help you work through these anxious feelings.'
    },
    anger: {
      validation: 'Your anger is completely justified given what you\'ve been through.',
      reflection: 'It sounds like you\'re feeling very angry and frustrated about this situation.',
      normalization: 'Anger is a natural response to unfairness or difficult circumstances.',
      hope: 'With time and support, you can find healthy ways to express and manage these feelings.',
      support: 'I\'m here to help you work through these difficult emotions.'
    },
    fear: {
      validation: 'Your fear is completely understandable given what you\'re facing.',
      reflection: 'It sounds like you\'re feeling very afraid and uncertain right now.',
      normalization: 'Fear is a natural response to threatening or unknown situations.',
      hope: 'You can develop skills to manage fear and feel more safe and secure.',
      support: 'I\'m here to help you work through these fearful feelings.'
    },
    joy: {
      validation: 'Your joy and happiness are wonderful and well-deserved.',
      reflection: 'It sounds like you\'re experiencing genuine joy and contentment right now.',
      normalization: 'It\'s wonderful to experience positive emotions and moments of happiness.',
      hope: 'You can build on these positive feelings and create more moments of joy.',
      support: 'I\'m glad to share in your positive experience and support your continued growth.'
    },
    calm: {
      validation: 'Your sense of calm is valuable and shows your inner strength.',
      reflection: 'It sounds like you\'re feeling peaceful and centered right now.',
      normalization: 'Finding moments of calm is an important part of emotional well-being.',
      hope: 'You can cultivate more of these peaceful moments in your life.',
      support: 'I\'m here to support your continued emotional balance and well-being.'
    }
  };

  // Get emotion-specific response or default
  const response = empathyResponses[emotion as keyof typeof empathyResponses] || {
    validation: 'Your feelings are completely valid and understandable.',
    reflection: `It sounds like you\'re experiencing ${emotion} right now.`,
    normalization: 'Many people experience similar feelings in difficult situations.',
    hope: 'With support and time, things can get better.',
    support: 'I\'m here to listen and support you through this.'
  };

  // Adjust based on intensity
  if (intensity >= 8) {
    response.validation = 'Your intense feelings are completely valid and understandable given what you\'re experiencing.';
    response.reflection = `It sounds like you\'re experiencing very intense ${emotion} right now, and that must be overwhelming.`;
  } else if (intensity <= 3) {
    response.validation = 'Your feelings, even if mild, are still valid and worth acknowledging.';
  }

  // Adjust based on emotion type
  if (emotion === 'sadness' || emotion === 'anxiety' || emotion === 'anger' || emotion === 'fear') {
    response.hope = 'With support and time, these difficult feelings can ease and you can find moments of relief.';
  } else if (emotion === 'joy' || emotion === 'calm') {
    response.hope = 'You can build on these positive feelings and create more moments of joy and contentment.';
  }

  return {
    type: 'therapeutic',
    content: response.validation + ' ' + response.reflection,
    tone: 'compassionate',
    validationLevel: intensity >= 8 ? 0.9 : intensity >= 5 ? 0.7 : 0.5
  };
}

function validateEmpathyResponse(empathyResponse: EmpathyResponse): EmpathyResponse {
  return {
    type: empathyResponse.type || 'therapeutic',
    content: empathyResponse.content || 'Your feelings are completely valid and understandable.',
    tone: empathyResponse.tone || 'compassionate',
    validationLevel: empathyResponse.validationLevel || 0.7
  };
} 