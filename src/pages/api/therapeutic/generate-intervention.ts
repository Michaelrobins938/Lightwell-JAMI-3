import { NextApiRequest, NextApiResponse } from 'next';
import { openRouterChatCompletion } from '../../../services/openRouterService';
import { TherapeuticIntervention, EmotionalState, CrisisLevel, UserProfile, SessionMemory } from '../../../types/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emotionalAssessment, crisisLevel, userProfile, sessionMemory } = req.body;

    if (!emotionalAssessment) {
      return res.status(400).json({ error: 'Emotional assessment is required' });
    }

    // Enhanced therapeutic intervention prompt with clinical expertise
    const interventionPrompt = `You are an expert clinical psychologist specializing in evidence-based therapeutic interventions. Generate an appropriate therapeutic intervention based on the following context.

Emotional Assessment:
- Primary Emotion: ${emotionalAssessment.primaryEmotion}
- Intensity: ${emotionalAssessment.intensity}/10
- Valence: ${emotionalAssessment.valence}
- Arousal: ${emotionalAssessment.arousal}
- Triggers: ${emotionalAssessment.triggers.join(', ') || 'None identified'}

Crisis Level: ${crisisLevel?.level || 'none'}

User Profile:
- Therapeutic Style: ${userProfile?.therapeuticStyle || 'Integrative'}
- Cultural Background: ${userProfile?.culturalBackground?.join(', ') || 'General'}
- Trauma History: ${userProfile?.traumaHistory ? 'Yes' : 'No'}
- Communication Preference: ${userProfile?.preferences?.communicationStyle || 'empathetic'}

Session Context: ${sessionMemory ? `${sessionMemory.messages.length} previous messages` : 'New session'}

Please provide a detailed therapeutic intervention in the following JSON format:
{
  "technique": "string (specific therapeutic technique name)",
  "modality": "CBT|DBT|ACT|Mindfulness|Humanistic|Crisis",
  "description": "string (detailed description of the technique)",
  "rationale": "string (why this technique is appropriate)",
  "expectedOutcome": "string (what we hope to achieve)",
  "homework": "string (optional homework assignment)",
  "duration": "number (estimated minutes)",
  "confidence": "number 0-1 (confidence in this intervention)"
}

Therapeutic Guidelines:
1. CRISIS: Immediate safety and stabilization techniques
2. CBT: Cognitive restructuring, thought challenging, behavioral activation
3. DBT: Distress tolerance, emotion regulation, mindfulness, interpersonal effectiveness
4. ACT: Acceptance, defusion, values clarification, committed action
5. Mindfulness: Present-moment awareness, breathing, body scans, meditation
6. Humanistic: Empathetic listening, validation, unconditional positive regard

Consider:
- Cultural sensitivity and appropriateness
- Trauma-informed approach if applicable
- User's therapeutic preferences and style
- Session progression and previous interventions
- Evidence-based practice guidelines
- Safety and risk management

Respond only with valid JSON.`;

    const response = await openRouterChatCompletion([
      {
        role: 'user',
        content: 'You are an expert clinical psychologist with deep expertise in evidence-based therapeutic interventions including CBT, DBT, ACT, Mindfulness, and Humanistic approaches. Provide clinically-informed, culturally-sensitive therapeutic interventions.'
      },
      {
        role: 'user',
        content: interventionPrompt
      }
    ], 'anthropic/claude-3.5-sonnet', 1000, 0.3);

    let therapeuticIntervention: TherapeuticIntervention;

    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(response.choices[0].message.content);
      therapeuticIntervention = {
        type: parsedResponse.modality?.toLowerCase() || 'mindfulness',
        technique: parsedResponse.technique || 'Mindfulness Breathing',
        rationale: parsedResponse.rationale || 'To help regulate current emotional state',
        effectiveness: Math.max(0, Math.min(1, parsedResponse.confidence || 0.7)),
        personalization: parsedResponse.description || 'Gentle breathing exercise for emotional regulation',
        nextSteps: parsedResponse.homework ? [parsedResponse.homework] : undefined
      };
    } catch (parseError) {
      // Fallback intervention if JSON parsing fails
      console.error('Failed to parse therapeutic intervention response:', parseError);
      therapeuticIntervention = await performFallbackIntervention(emotionalAssessment, crisisLevel, userProfile);
    }

    // Validate and normalize the intervention
    therapeuticIntervention = validateTherapeuticIntervention(therapeuticIntervention);

    return res.status(200).json(therapeuticIntervention);
  } catch (error) {
    console.error('Therapeutic intervention error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate therapeutic intervention',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function performFallbackIntervention(
  emotionalAssessment: EmotionalState,
  crisisLevel: CrisisLevel,
  userProfile: UserProfile
): Promise<TherapeuticIntervention> {
  
  // Crisis interventions take priority
  if (crisisLevel.level === 'critical' || crisisLevel.level === 'high') {
    return {
      type: 'crisis',
      technique: 'Crisis Safety Planning',
      rationale: 'Ensuring user safety is the primary concern during crisis situations',
      effectiveness: 0.9,
      personalization: 'Immediate safety assessment and crisis intervention to ensure user safety and provide support',
      nextSteps: ['Contact emergency services if needed', 'Connect with crisis support resources']
    };
  }

  // Emotion-specific interventions
  const emotionInterventions: Record<string, TherapeuticIntervention> = {
    anxiety: {
      type: 'mindfulness',
      technique: 'Progressive Muscle Relaxation',
      rationale: 'Anxiety often manifests as physical tension; this technique addresses both physical and mental symptoms',
      effectiveness: 0.8,
      personalization: 'Systematic tensing and relaxing of muscle groups to reduce physical tension and anxiety',
      nextSteps: ['Practice progressive muscle relaxation daily for 10 minutes']
    },
    sadness: {
      type: 'cbt',
      technique: 'Behavioral Activation',
      rationale: 'Depression often leads to withdrawal; behavioral activation helps break this cycle',
      effectiveness: 0.8,
      personalization: 'Gradually increasing engagement in positive activities to improve mood and energy',
      nextSteps: ['Schedule and complete 3 pleasant activities daily']
    },
    anger: {
      type: 'dbt',
      technique: 'Anger Management: STOP Technique',
      rationale: 'Anger can be overwhelming; this technique provides immediate tools for regulation',
      effectiveness: 0.8,
      personalization: 'Stop, Take a step back, Observe, Proceed mindfully when experiencing anger',
      nextSteps: ['Practice STOP technique when feeling angry']
    },
    fear: {
      type: 'mindfulness',
      technique: 'Grounding Exercise: 5-4-3-2-1',
      rationale: 'Fear can cause dissociation; grounding brings attention to the present moment',
      effectiveness: 0.9,
      personalization: 'Identify 5 things you see, 4 things you touch, 3 things you hear, 2 things you smell, 1 thing you taste',
      nextSteps: ['Practice grounding exercise when feeling afraid']
    },
    joy: {
      type: 'validation',
      technique: 'Gratitude Journaling',
      rationale: 'Building on positive emotions can enhance overall well-being',
      effectiveness: 0.8,
      personalization: 'Reflect on and write about things you are grateful for',
      nextSteps: ['Write 3 things you are grateful for daily']
    }
  };

  // Select intervention based on primary emotion
  const intervention = emotionInterventions[emotionalAssessment.primaryEmotion as keyof typeof emotionInterventions];
  
  if (intervention) {
    return intervention;
  }

  // Default intervention for neutral or unrecognized emotions
  return {
    type: 'mindfulness',
    technique: 'Mindful Breathing',
    rationale: 'Breathing exercises are universally beneficial for emotional regulation',
    effectiveness: 0.7,
    personalization: 'Focus on your breath, inhaling and exhaling slowly and deeply',
    nextSteps: ['Practice mindful breathing for 5 minutes daily']
  };
}

function validateTherapeuticIntervention(intervention: TherapeuticIntervention): TherapeuticIntervention {
  const validTypes = ['cbt', 'mindfulness', 'validation', 'reframe', 'crisis', 'dbt', 'act'];
  
  return {
    type: validTypes.includes(intervention.type) ? intervention.type : 'mindfulness',
    technique: intervention.technique || 'Mindful Breathing',
    rationale: intervention.rationale || 'To help regulate current emotional state',
    effectiveness: Math.max(0, Math.min(1, intervention.effectiveness || 0.7)),
    personalization: intervention.personalization || 'Gentle breathing exercise for emotional regulation',
    nextSteps: intervention.nextSteps || ['Practice mindful breathing for 5 minutes daily']
  };
} 