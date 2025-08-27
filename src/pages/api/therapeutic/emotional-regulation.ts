import { NextApiRequest, NextApiResponse } from 'next';
import { openRouterChatCompletion } from '../../../services/openRouterService';
import { EmotionalRegulationTechnique, EmotionalState, CrisisLevel, UserProfile } from '../../../types/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emotionalAssessment, crisisLevel, userProfile } = req.body;

    if (!emotionalAssessment) {
      return res.status(400).json({ error: 'Emotional assessment is required' });
    }

    // Enhanced emotional regulation prompt with clinical expertise
    const regulationPrompt = `You are an expert clinical psychologist specializing in emotional regulation and distress tolerance techniques. Generate an appropriate emotional regulation technique based on the following context.

Emotional Assessment:
- Primary Emotion: ${emotionalAssessment.primaryEmotion}
- Intensity: ${emotionalAssessment.intensity}/10
- Valence: ${emotionalAssessment.valence}
- Arousal: ${emotionalAssessment.arousal}
- Somatic Symptoms: ${emotionalAssessment.somaticSymptoms?.join(', ') || 'None reported'}

Crisis Level: ${crisisLevel?.level || 'none'}

User Profile:
- Therapeutic Style: ${userProfile?.therapeuticStyle || 'Integrative'}
- Trauma History: ${userProfile?.traumaHistory ? 'Yes' : 'No'}
- Current Diagnoses: ${userProfile?.currentDiagnoses?.join(', ') || 'None specified'}

Please provide a detailed emotional regulation technique in the following JSON format:
{
  "name": "string (name of the technique)",
  "description": "string (detailed description of the technique)",
  "steps": ["array of step-by-step instructions"],
  "duration": "number (estimated minutes)",
  "effectiveness": "number 0-1 (estimated effectiveness)",
  "personalization": "string (optional: specific user needs)"
}

Technique Guidelines:
1. CRISIS: Immediate safety and stabilization techniques
2. HIGH INTENSITY: Distress tolerance and immediate relief techniques
3. MEDIUM INTENSITY: Regulation and coping techniques
4. LOW INTENSITY: Prevention and maintenance techniques

Consider:
- Evidence-based techniques (DBT, CBT, ACT, Mindfulness)
- Cultural sensitivity and appropriateness
- Trauma-informed approach if applicable
- User's physical and mental health status
- Accessibility and ease of use
- Safety and risk management

Respond only with valid JSON.`;

    const response = await openRouterChatCompletion([
      {
        role: 'user',
        content: 'You are an expert clinical psychologist with deep expertise in emotional regulation, distress tolerance, and evidence-based therapeutic techniques. Provide clinically-informed, safe, and effective emotional regulation techniques.'
      },
      {
        role: 'user',
        content: regulationPrompt
      }
    ], 'anthropic/claude-3.5-sonnet', 800, 0.3);

    let regulationTechnique: EmotionalRegulationTechnique;

    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(response.choices[0].message.content);
      regulationTechnique = {
        name: parsedResponse.name || 'Deep Breathing',
        description: parsedResponse.description || 'A simple breathing technique to help regulate emotions',
        steps: parsedResponse.steps || ['Breathe in slowly', 'Hold for 4 seconds', 'Breathe out slowly'],
        duration: parsedResponse.duration || 5,
        effectiveness: Math.max(0, Math.min(1, parsedResponse.effectiveness || 0.7)),
        personalization: parsedResponse.personalization
      };
    } catch (parseError) {
      // Fallback technique if JSON parsing fails
      console.error('Failed to parse emotional regulation response:', parseError);
      regulationTechnique = {
        name: 'Deep Breathing',
        description: 'Simple breathing technique to calm the nervous system',
        steps: ['Breathe in slowly', 'Hold for 4 seconds', 'Breathe out slowly'],
        duration: 5,
        effectiveness: 0.7,
        personalization: undefined
      };
    }

    return res.status(200).json(regulationTechnique);
  } catch (error) {
    console.error('Emotional regulation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate emotional regulation technique',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 