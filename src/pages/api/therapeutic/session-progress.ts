import { NextApiRequest, NextApiResponse } from 'next';
import { openRouterChatCompletion } from '../../../services/openRouterService';
import { SessionProgress, EmotionalState, TherapeuticIntervention, UserProfile } from '../../../types/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, emotionalAssessment, therapeuticIntervention, userProfile } = req.body;

    if (!emotionalAssessment) {
      return res.status(400).json({ error: 'Emotional assessment is required' });
    }

    // Enhanced session progress prompt with clinical expertise
    const progressPrompt = `You are an expert clinical psychologist specializing in therapeutic progress tracking and outcome measurement. Assess the current session progress based on the following context.

Emotional Assessment:
- Primary Emotion: ${emotionalAssessment.primaryEmotion}
- Intensity: ${emotionalAssessment.intensity}/10
- Valence: ${emotionalAssessment.valence}
- Arousal: ${emotionalAssessment.arousal}

Therapeutic Intervention:
- Technique: ${therapeuticIntervention?.technique || 'Mindful Breathing'}
- Modality: ${therapeuticIntervention?.modality || 'Mindfulness'}
- Expected Outcome: ${therapeuticIntervention?.expectedOutcome || 'Emotional regulation'}

User Profile:
- Therapeutic Style: ${userProfile?.therapeuticStyle || 'Integrative'}
- Session Length Preference: ${userProfile?.preferences?.sessionLength || 30} minutes
- Homework Preference: ${userProfile?.preferences?.homeworkPreference ? 'Yes' : 'No'}

Session Context: ${sessionId ? 'Ongoing session' : 'New session'}

Please provide a detailed session progress assessment in the following JSON format:
{
  "therapeuticAlliance": "number 1-10 (strength of therapeutic relationship)",
  "sessionGoals": ["array of current session goals"],
  "goalProgress": "number 0-1 (progress toward goals)",
  "insights": ["array of therapeutic insights gained"],
  "breakthroughs": ["array of significant breakthroughs"],
  "resistanceAreas": ["array of areas of resistance or difficulty"],
  "nextSessionFocus": ["array of focus areas for next session"]
}

Progress Assessment Guidelines:
1. THERAPEUTIC ALLIANCE: Assess rapport, trust, and collaboration
2. SESSION GOALS: Identify current therapeutic objectives
3. GOAL PROGRESS: Measure advancement toward goals (0-1 scale)
4. INSIGHTS: Capture new understanding or awareness
5. BREAKTHROUGHS: Note significant therapeutic moments
6. RESISTANCE: Identify areas of difficulty or resistance
7. NEXT FOCUS: Plan for future sessions

Consider:
- Evidence-based progress indicators
- Therapeutic relationship quality
- Goal attainment and barriers
- User engagement and motivation
- Cultural and individual factors
- Session context and timing

Respond only with valid JSON.`;

    const response = await openRouterChatCompletion([
      {
        role: 'user',
        content: 'You are an expert clinical psychologist with deep expertise in therapeutic progress tracking, outcome measurement, and evidence-based practice. Provide clinically-informed session progress assessments.'
      },
      {
        role: 'user',
        content: progressPrompt
      }
    ], 'anthropic/claude-3.5-sonnet', 800, 0.3);

    let sessionProgress: SessionProgress;

    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(response.choices[0].message.content);
      sessionProgress = {
        stage: parsedResponse.stage || 'intervention',
        engagement: Math.max(1, Math.min(10, parsedResponse.engagement || 7)),
        trustLevel: Math.max(1, Math.min(10, parsedResponse.trustLevel || 7)),
        therapeuticAlliance: Math.max(1, Math.min(10, parsedResponse.therapeuticAlliance || 7)),
        sessionGoals: Array.isArray(parsedResponse.sessionGoals) ? parsedResponse.sessionGoals : ['Emotional regulation', 'Understanding triggers'],
        insights: Array.isArray(parsedResponse.insights) ? parsedResponse.insights : ['Recognizing emotional patterns'],
        breakthroughs: Array.isArray(parsedResponse.breakthroughs) ? parsedResponse.breakthroughs : [],
        resistanceAreas: Array.isArray(parsedResponse.resistanceAreas) ? parsedResponse.resistanceAreas : [],
        nextSessionFocus: Array.isArray(parsedResponse.nextSessionFocus) ? parsedResponse.nextSessionFocus : ['Building coping skills']
      };
    } catch (parseError) {
      // Fallback progress assessment if JSON parsing fails
      console.error('Failed to parse session progress response:', parseError);
      sessionProgress = await generateFallbackSessionProgress(emotionalAssessment, therapeuticIntervention, userProfile);
    }

    // Validate and normalize the session progress
    sessionProgress = validateSessionProgress(sessionProgress);

    return res.status(200).json(sessionProgress);
  } catch (error) {
    console.error('Session progress error:', error);
    return res.status(500).json({ 
      error: 'Failed to assess session progress',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function generateFallbackSessionProgress(
  emotionalAssessment: EmotionalState,
  therapeuticIntervention: TherapeuticIntervention,
  userProfile: UserProfile
): Promise<SessionProgress> {
  
  const emotion = emotionalAssessment.primaryEmotion;
  const intensity = emotionalAssessment.intensity;
  // Remove valence reference since it doesn't exist in EmotionalState
  
  // Base therapeutic alliance score
  let therapeuticAlliance = 7; // Default moderate alliance
  
  // Adjust alliance based on emotional intensity
  if (intensity >= 8) {
    therapeuticAlliance -= 1;
  } else if (intensity <= 3) {
    therapeuticAlliance += 1;
  }
  
  // Adjust based on intervention effectiveness
  if (therapeuticIntervention.effectiveness >= 0.8) {
    therapeuticAlliance += 0.5;
  }
  
  // Session goals based on emotional state
  const sessionGoals = [];
  if (emotion === 'anxiety') {
    sessionGoals.push('Reduce anxiety symptoms');
    sessionGoals.push('Develop coping strategies');
  } else if (emotion === 'sadness') {
    sessionGoals.push('Improve mood');
    sessionGoals.push('Increase positive activities');
  } else if (emotion === 'anger') {
    sessionGoals.push('Manage anger responses');
    sessionGoals.push('Develop healthy expression');
  } else {
    sessionGoals.push('Emotional regulation');
    sessionGoals.push('Understanding triggers');
  }
  
  // Engagement based on intervention effectiveness
  const engagement = Math.min(10, therapeuticIntervention.effectiveness * 10 + 5);
  
  // Insights based on emotional awareness
  const insights = [];
  if (intensity >= 7) {
    insights.push('Recognizing high emotional intensity');
  }
  if (emotionalAssessment.triggers.length > 0) {
    insights.push('Identifying emotional triggers');
  }
  if (emotion === 'sadness' || emotion === 'anxiety' || emotion === 'anger' || emotion === 'fear') {
    insights.push('Acknowledging difficult emotions');
  }
  
  // Breakthroughs (usually empty for new sessions)
  const breakthroughs: string[] = [];
  
  // Resistance areas
  const resistanceAreas: string[] = [];
  if (intensity >= 8) {
    resistanceAreas.push('High emotional distress');
  }
  if (therapeuticIntervention.effectiveness < 0.6) {
    resistanceAreas.push('Intervention resistance');
  }
  
  // Next session focus
  const nextSessionFocus: string[] = [];
  if (emotion === 'anxiety') {
    nextSessionFocus.push('Anxiety management techniques');
    nextSessionFocus.push('Stress reduction strategies');
  } else if (emotion === 'sadness') {
    nextSessionFocus.push('Mood improvement strategies');
    nextSessionFocus.push('Behavioral activation');
  } else if (emotion === 'anger') {
    nextSessionFocus.push('Anger management skills');
    nextSessionFocus.push('Communication techniques');
  } else {
    nextSessionFocus.push('Building coping skills');
    nextSessionFocus.push('Emotional awareness');
  }
  
  return {
    stage: 'intervention',
    engagement: Math.max(1, Math.min(10, engagement)),
    trustLevel: Math.max(1, Math.min(10, therapeuticAlliance - 1)),
    therapeuticAlliance: Math.max(1, Math.min(10, therapeuticAlliance)),
    sessionGoals,
    insights,
    breakthroughs,
    resistanceAreas,
    nextSessionFocus
  };
}

function validateSessionProgress(progress: SessionProgress): SessionProgress {
  return {
    stage: progress.stage || 'intervention',
    engagement: Math.max(1, Math.min(10, progress.engagement || 7)),
    trustLevel: Math.max(1, Math.min(10, progress.trustLevel || 7)),
    therapeuticAlliance: Math.max(1, Math.min(10, progress.therapeuticAlliance || 7)),
    sessionGoals: Array.isArray(progress.sessionGoals) && progress.sessionGoals.length > 0 ? progress.sessionGoals : ['Emotional regulation', 'Understanding triggers'],
    insights: Array.isArray(progress.insights) ? progress.insights : ['Recognizing emotional patterns'],
    breakthroughs: Array.isArray(progress.breakthroughs) ? progress.breakthroughs : [],
    resistanceAreas: Array.isArray(progress.resistanceAreas) ? progress.resistanceAreas : [],
    nextSessionFocus: Array.isArray(progress.nextSessionFocus) && progress.nextSessionFocus.length > 0 ? progress.nextSessionFocus : ['Building coping skills']
  };
} 