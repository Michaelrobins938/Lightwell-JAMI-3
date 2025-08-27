import { NextApiRequest, NextApiResponse } from 'next';
import { openRouterChatCompletion } from '../../../services/openRouterService';
import { EmotionalState, TherapeuticIntervention, EmpathyResponse, UserProfile } from '../../../types/ai';

// Prompt wrapper for therapeutic response generation

export const GENERATE_RESPONSE_PROMPT = `
You are Jamie, an AI conversational companion.
- Focus on the user's immediate input; do not repeat disclaimers each time.
- Provide thoughtful, empathetic responses that are proportional in length.
- Use reflection and open-ended curiosity more than advice-giving.
- If crisisFlag is true, append ONE crisis safety message at the end of the response.
- If crisisFlag is false, do not include hotlines, disclaimers, or emergency info.
- Never claim to be a licensed therapist or professional.
`;

export const RESPONSE_GENERATION_RULES = `
Response Guidelines:
- Keep responses conversational and warm
- Match the user's energy and length preference
- Use natural language, avoid clinical jargon
- Focus on emotional support and validation
- Encourage user agency and choice
`;

export const CRISIS_HANDLING = `
Crisis Response Rules:
- Only include crisis resources when explicitly flagged
- Provide resources once, then return to conversation
- Use warm, caring language, not clinical detachment
- Maintain conversational flow while ensuring safety
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      message, 
      userInput, 
      conversationHistory, 
      userId, 
      sessionId, 
      emotionalContext, 
      requireAnalysis,
      emotionalAssessment, 
      therapeuticIntervention, 
      empathyResponse, 
      userProfile 
    } = req.body;

    const input = message || userInput;
    if (!input) {
      return res.status(400).json({ error: 'User input is required' });
    }

    // Enhanced emotional analysis if required
    let enhancedEmotionalAssessment = emotionalAssessment;
    let crisisAssessment = null;
    let therapeuticInterventionPlan = null;
    let empathyResponsePlan = null;

    if (requireAnalysis) {
      // Generate comprehensive emotional analysis
      const analysisPrompt = `As an expert clinical psychologist, analyze the following user input for emotional state, crisis indicators, and therapeutic needs.

User Input: "${input}"

Context from conversation history: ${conversationHistory ? conversationHistory.slice(-3).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') : 'No prior context'}

Provide a comprehensive analysis in JSON format with the following structure:
{
  "emotionalAssessment": {
    "primaryEmotion": "emotion_name",
    "secondaryEmotions": ["emotion1", "emotion2"],
    "intensity": number (1-10),
    "triggers": ["trigger1", "trigger2"],
    "somaticSymptoms": ["symptom1", "symptom2"],
    "cognitivePatterns": ["pattern1", "pattern2"]
  },
  "crisisAssessment": {
    "level": "none|low|medium|high|critical",
    "confidence": number (0-1),
    "triggers": ["trigger1", "trigger2"],
    "recommendations": ["rec1", "rec2"]
  },
  "therapeuticIntervention": {
    "primaryTechnique": "technique_name",
    "approach": "CBT|DBT|ACT|Mindfulness|Humanistic",
    "rationale": "reason for this intervention",
    "immediateAction": "what to do right now",
    "notes": "clinical notes"
  },
  "empathyResponse": {
    "validation": "validating statement",
    "reflection": "reflective response",
    "support": "supportive statement",
    "tone": "warm|gentle|concerned|encouraging"
  }
}

Focus on:
- Accurate emotional identification
- VERY conservative crisis risk assessment (only flag if explicit self-harm mentioned)
- Evidence-based therapeutic interventions  
- Culturally sensitive and trauma-informed responses
- Practical immediate support

IMPORTANT: Only set crisis level to 'high' or 'critical' if user explicitly mentions suicide, self-harm, or immediate danger. Normal sadness, anxiety, or stress should be 'none' or 'low' at most.`;

      try {
        const analysisResponse = await openRouterChatCompletion([
          {
            role: 'system',
            content: 'You are an expert clinical psychologist specializing in emotional assessment, crisis intervention, and therapeutic planning. Provide comprehensive, evidence-based psychological analysis.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ], 'openai/gpt-4o', 800, 0.3);

        const rawContent = analysisResponse.choices[0].message.content;
        // Clean markdown formatting if present
        const cleanContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const analysisResult = JSON.parse(cleanContent);
        enhancedEmotionalAssessment = analysisResult.emotionalAssessment;
        crisisAssessment = analysisResult.crisisAssessment;
        therapeuticInterventionPlan = analysisResult.therapeuticIntervention;
        empathyResponsePlan = analysisResult.empathyResponse;

      } catch (analysisError) {
        console.error('Emotional analysis failed:', analysisError);
        // Fallback to basic analysis
        enhancedEmotionalAssessment = {
          primaryEmotion: 'neutral',
          secondaryEmotions: [],
          intensity: 5,
          triggers: [],
          somaticSymptoms: [],
          cognitivePatterns: []
        };
        crisisAssessment = {
          level: 'none',
          confidence: 0.5,
          triggers: [],
          recommendations: []
        };
      }
    }

    // Enhanced therapeutic response prompt with clinical expertise
    const responsePrompt = `You are Jamie, a warm and authentic AI therapist who speaks like a real person. Be conversational, genuine, and helpful without sounding clinical or robotic. Avoid overused therapy phrases like "your feelings are valid" unless truly appropriate.

User Input: "${input}"

${requireAnalysis && enhancedEmotionalAssessment ? `
Enhanced Emotional Assessment:
- Primary Emotion: ${enhancedEmotionalAssessment.primaryEmotion}
- Secondary Emotions: ${enhancedEmotionalAssessment.secondaryEmotions?.join(', ') || 'None'}
- Intensity: ${enhancedEmotionalAssessment.intensity}/10
- Triggers: ${enhancedEmotionalAssessment.triggers?.join(', ') || 'None identified'}
- Somatic Symptoms: ${enhancedEmotionalAssessment.somaticSymptoms?.join(', ') || 'None noted'}
- Cognitive Patterns: ${enhancedEmotionalAssessment.cognitivePatterns?.join(', ') || 'None identified'}

Crisis Assessment:
- Level: ${crisisAssessment?.level || 'none'}
- Confidence: ${crisisAssessment?.confidence || 0}
- Crisis Triggers: ${crisisAssessment?.triggers?.join(', ') || 'None'}

Therapeutic Intervention Plan:
- Primary Technique: ${therapeuticInterventionPlan?.primaryTechnique || 'Active listening'}
- Approach: ${therapeuticInterventionPlan?.approach || 'Humanistic'}
- Rationale: ${therapeuticInterventionPlan?.rationale || 'Provide emotional support'}
- Immediate Action: ${therapeuticInterventionPlan?.immediateAction || 'Validate and listen'}

Empathy Response Framework:
- Validation: ${empathyResponsePlan?.validation || 'Your feelings are valid'}
- Reflection: ${empathyResponsePlan?.reflection || 'I hear your experience'}
- Support: ${empathyResponsePlan?.support || 'I\'m here to support you'}
- Tone: ${empathyResponsePlan?.tone || 'warm'}` : `
Emotional Assessment:
- Primary Emotion: ${emotionalAssessment?.primaryEmotion || 'unknown'}
- Intensity: ${emotionalAssessment?.intensity || 5}/10
- Valence: ${emotionalAssessment?.valence || 'neutral'}
- Arousal: ${emotionalAssessment?.arousal || 'medium'}

Therapeutic Intervention:
- Technique: ${therapeuticIntervention?.technique || 'Mindful Breathing'}
- Modality: ${therapeuticIntervention?.modality || 'Mindfulness'}
- Expected Outcome: ${therapeuticIntervention?.expectedOutcome || 'Emotional regulation'}

Empathy Response:
- Validation: ${empathyResponse?.validation || 'Your feelings are valid'}
- Reflection: ${empathyResponse?.reflection || 'I hear your experience'}
- Support: ${empathyResponse?.support || 'I\'m here to support you'}`}

User Profile:
- Therapeutic Style: ${userProfile?.therapeuticStyle || 'Integrative'}
- Communication Preference: ${userProfile?.preferences?.communicationStyle || 'empathetic'}
- Cultural Background: ${userProfile?.culturalBackground?.join(', ') || 'General'}

Please generate a response that:
1. Sounds like a natural, caring conversation
2. Responds directly to what the user said
3. Is helpful and supportive without being preachy
4. Avoids repetitive therapy clichés
5. Shows genuine interest and curiosity
6. Is brief and to the point (1-3 sentences max)

Be human, authentic, and conversational. Don't sound like a therapy textbook.

Respond with only the response text, no additional formatting or explanations.`;

    const response = await openRouterChatCompletion([
      {
        role: 'system',
        content: 'You are Jamie, a caring AI therapist who speaks naturally and authentically. Avoid clinical jargon and repetitive therapy phrases. Be conversational, genuine, and helpful like a real person would be.'
      },
      {
        role: 'user',
        content: responsePrompt
      }
    ], 'openai/gpt-4o-mini', 300, 0.7);

    let therapeuticResponse: string;

    try {
      // Clean up the response
      therapeuticResponse = response.choices[0].message.content.trim();
      
      // Remove any markdown formatting or quotes
      therapeuticResponse = therapeuticResponse.replace(/^["']|["']$/g, '');
      therapeuticResponse = therapeuticResponse.replace(/^```|```$/g, '');
      
      // Ensure the response is appropriate length
      if (therapeuticResponse.length < 50) {
        therapeuticResponse = await generateFallbackResponse(userInput, emotionalAssessment, therapeuticIntervention, userProfile);
      }
    } catch (parseError) {
      console.error('Failed to parse therapeutic response:', parseError);
      therapeuticResponse = await generateFallbackResponse(userInput, emotionalAssessment, therapeuticIntervention, userProfile);
    }

    return res.status(200).json({ 
      response: therapeuticResponse,
      ...(requireAnalysis && {
        emotionalAssessment: enhancedEmotionalAssessment,
        crisisAssessment,
        therapeuticIntervention: therapeuticInterventionPlan,
        empathyResponse: empathyResponsePlan
      })
    });
  } catch (error) {
    console.error('Therapeutic response generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate therapeutic response',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function generateFallbackResponse(
  userInput: string,
  emotionalAssessment: EmotionalState,
  therapeuticIntervention: TherapeuticIntervention,
  userProfile: UserProfile
): Promise<string> {
  
  const lowerInput = userInput.toLowerCase();
  const emotion = emotionalAssessment?.primaryEmotion || 'neutral';
  const intensity = emotionalAssessment?.intensity || 5;
  
  // Crisis response
  if (lowerInput.includes('suicide') || lowerInput.includes('kill myself') || lowerInput.includes('want to die')) {
    return "I'm really worried about you right now. What you're going through sounds overwhelming. Can you tell me more about what's happening? I'm here to listen.";
  }
  
  // High intensity negative emotions
  if (intensity >= 8 && (emotion === 'sadness' || emotion === 'anxiety' || emotion === 'anger')) {
    return `That sounds really tough. What's been going on?`;
  }
  
  // Medium intensity emotions
  if (intensity >= 6) {
    return `That sounds challenging. Want to talk about what's happening?`;
  }
  
  // Positive emotions
  if (emotion === 'joy' || emotion === 'calm') {
    return `I'm glad you're feeling good! What's been going well?`;
  }
  
  // Default response
  return "I'm listening. What's on your mind?";
} 