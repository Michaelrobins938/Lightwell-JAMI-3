import { NextApiRequest, NextApiResponse } from 'next';
import { openRouterChatCompletion } from '../../../services/openRouterService';
import { CrisisLevel, EmotionalState, UserProfile } from '../../../types/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userInput, emotionalAssessment, userProfile } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'User input is required' });
    }

    // Enhanced crisis assessment prompt with clinical expertise
    const assessmentPrompt = `You are an expert crisis intervention specialist and clinical psychologist. Assess the following user input for crisis risk and provide a comprehensive crisis assessment.

User Input: "${userInput}"

Emotional Assessment Context:
- Primary Emotion: ${emotionalAssessment?.primaryEmotion || 'unknown'}
- Intensity: ${emotionalAssessment?.intensity || 5}/10
- Valence: ${emotionalAssessment?.valence || 'neutral'}
- Arousal: ${emotionalAssessment?.arousal || 'medium'}

User Profile Context:
- Trauma History: ${userProfile?.traumaHistory ? 'Yes' : 'No'}
- Current Diagnoses: ${userProfile?.currentDiagnoses?.join(', ') || 'None specified'}
- Medications: ${userProfile?.medications?.join(', ') || 'None specified'}

Please provide a detailed crisis assessment in the following JSON format:
{
  "level": "none|low|medium|high|critical",
  "riskFactors": ["array of identified risk factors"],
  "protectiveFactors": ["array of protective factors"],
  "immediateActions": ["array of immediate actions needed"],
  "escalationRequired": "boolean",
  "humanInterventionNeeded": "boolean",
  "emergencyContacts": ["array of emergency contact numbers"]
}

Crisis Assessment Guidelines:
1. CRITICAL: Immediate risk of harm to self or others, active suicidal ideation with plan/intent
2. HIGH: Suicidal ideation without immediate plan, severe self-harm risk, acute psychosis
3. MEDIUM: Moderate distress, some risk factors present, but no immediate danger
4. LOW: Mild distress, minimal risk factors
5. NONE: No crisis indicators present

Risk Factors to Consider:
- Suicidal ideation, planning, or intent
- Self-harm behaviors or thoughts
- Homicidal ideation or violent thoughts
- Acute psychosis or severe dissociation
- Substance abuse or overdose risk
- Domestic violence or abuse
- Severe emotional distress with poor coping
- Social isolation or lack of support
- Access to lethal means
- Previous suicide attempts or self-harm

Protective Factors to Consider:
- Strong social support network
- Access to mental health care
- Positive coping skills
- Future-oriented thinking
- Religious/spiritual beliefs
- Children or dependents
- Employment or meaningful activities
- Previous successful crisis management

Respond only with valid JSON.`;

    const response = await openRouterChatCompletion([
      {
        role: 'user',
        content: 'You are an expert crisis intervention specialist with extensive experience in suicide prevention, risk assessment, and emergency mental health protocols. Provide accurate, clinically-informed crisis assessments with appropriate safety recommendations.'
      },
      {
        role: 'user',
        content: assessmentPrompt
      }
    ], 'anthropic/claude-3.5-sonnet', 1000, 0.2);

    let crisisAssessment: CrisisLevel;

    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(response.choices[0].message.content);
      crisisAssessment = {
        level: parsedResponse.level || 'low',
        riskFactors: parsedResponse.riskFactors || [],
        immediateActions: parsedResponse.immediateActions || [],
        professionalHelp: parsedResponse.professionalHelp || false,
        baselineChange: parsedResponse.baselineChange,
        urgency: parsedResponse.urgency || 'low'
      };
    } catch (parseError) {
      // Fallback assessment if JSON parsing fails
      console.error('Failed to parse crisis assessment response:', parseError);
      crisisAssessment = await performFallbackCrisisAssessment(userInput, emotionalAssessment, userProfile);
    }

    // Determine risk level based on detected factors
    const lowerText = userInput.toLowerCase();
    let level: 'low' | 'none' | 'moderate' | 'high' | 'critical' = 'low';
    
    if (crisisAssessment.riskFactors.length >= 3 || lowerText.includes('suicide') || lowerText.includes('kill myself')) {
      level = 'critical';
    } else if (crisisAssessment.riskFactors.length >= 2 || lowerText.includes('want to die')) {
      level = 'high';
    } else if (crisisAssessment.riskFactors.length >= 1) {
      level = 'moderate';
    }

    // Validate and normalize the crisis assessment
    crisisAssessment = {
      level: level,
      riskFactors: crisisAssessment.riskFactors,
      immediateActions: crisisAssessment.immediateActions,
      professionalHelp: crisisAssessment.professionalHelp,
      baselineChange: crisisAssessment.baselineChange,
      urgency: crisisAssessment.urgency
    };

    // Log high-risk assessments for monitoring
    if (crisisAssessment.level === 'high' || crisisAssessment.level === 'critical') {
      console.warn('HIGH RISK CRISIS DETECTED:', {
        level: crisisAssessment.level,
        userInput: userInput.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json(crisisAssessment);
  } catch (error) {
    console.error('Crisis assessment error:', error);
    return res.status(500).json({ 
      error: 'Failed to assess crisis level',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function performFallbackCrisisAssessment(
  userInput: string, 
  emotionalAssessment: EmotionalState, 
  userProfile: UserProfile
): Promise<CrisisLevel> {
  const lowerText = userInput.toLowerCase();
  
  // Crisis keywords with severity levels
  const crisisKeywords = {
    critical: [
      'kill myself', 'suicide', 'end my life', 'want to die', 'no reason to live',
      'better off dead', 'everyone would be better off', 'going to kill myself',
      'plan to die', 'suicidal', 'ending it all', 'final goodbye'
    ],
    high: [
      'want to die', 'don\'t want to live', 'life is not worth living',
      'no point in living', 'better off without me', 'hurt myself',
      'self harm', 'cut myself', 'overdose', 'take pills'
    ],
    medium: [
      'hopeless', 'helpless', 'worthless', 'burden', 'failure',
      'no future', 'can\'t go on', 'tired of living', 'give up'
    ]
  };

  // Check for crisis keywords
  let level: 'none' | 'low' | 'moderate' | 'high' | 'critical' = 'none';
  const riskFactors: string[] = [];
  const protectiveFactors: string[] = [];

  // Check for critical risk
  if (crisisKeywords.critical.some(keyword => lowerText.includes(keyword))) {
    level = 'critical';
    riskFactors.push('Suicidal ideation with intent');
    riskFactors.push('Active suicide planning');
  }
  // Check for high risk
  else if (crisisKeywords.high.some(keyword => lowerText.includes(keyword))) {
    level = 'high';
    riskFactors.push('Suicidal ideation');
    riskFactors.push('Self-harm risk');
  }
  // Check for moderate risk
  else if (crisisKeywords.medium.some(keyword => lowerText.includes(keyword))) {
    level = 'moderate';
    riskFactors.push('Hopelessness');
    riskFactors.push('Depressive thoughts');
  }
  // Check emotional intensity
  else if (emotionalAssessment.intensity >= 8) {
    level = 'low';
    riskFactors.push('High emotional distress');
  }

  // Additional risk factors based on content
  if (lowerText.includes('gun') || lowerText.includes('weapon') || lowerText.includes('knife')) {
    riskFactors.push('Access to lethal means');
    if (level === 'none') level = 'low';
  }

  if (lowerText.includes('alone') || lowerText.includes('no one') || lowerText.includes('isolated')) {
    riskFactors.push('Social isolation');
  }

  if (lowerText.includes('alcohol') || lowerText.includes('drugs') || lowerText.includes('substance')) {
    riskFactors.push('Substance use');
  }

  // Protective factors
  if (lowerText.includes('family') || lowerText.includes('children') || lowerText.includes('kids')) {
    protectiveFactors.push('Family responsibility');
  }

  if (lowerText.includes('help') || lowerText.includes('support') || lowerText.includes('therapy')) {
    protectiveFactors.push('Willingness to seek help');
  }

  if (lowerText.includes('future') || lowerText.includes('hope') || lowerText.includes('better')) {
    protectiveFactors.push('Future-oriented thinking');
  }

  // Determine escalation requirements
  const escalationRequired = level === 'critical' || level === 'high';
  const humanInterventionNeeded = level === 'critical' || (level === 'high' && riskFactors.length > 2);

  // Immediate actions based on level
  const immediateActions: string[] = [];
  if (level === 'critical') {
    immediateActions.push('Call 911 immediately');
    immediateActions.push('Stay with the person');
    immediateActions.push('Remove access to lethal means');
  } else if (level === 'high') {
    immediateActions.push('Call crisis hotline (988)');
    immediateActions.push('Contact mental health professional');
    immediateActions.push('Ensure safety');
  } else if (level === 'moderate') {
    immediateActions.push('Schedule therapy session');
    immediateActions.push('Practice coping skills');
    immediateActions.push('Reach out to support network');
  }

  return {
    level: level,
    riskFactors: riskFactors,
    immediateActions: immediateActions,
    professionalHelp: level === 'high' || level === 'critical',
    baselineChange: 'stable',
    urgency: level === 'critical' ? 'critical' : level === 'high' ? 'high' : 'low'
  };
}

// function validateCrisisAssessment(assessment: CrisisLevel): CrisisLevel {
//   const validLevels = ['none', 'low', 'medium', 'high', 'critical'];
//   
//   return {
//     level: validLevels.includes(assessment.level) ? assessment.level : 'low',
//     riskFactors: Array.isArray(assessment.riskFactors) ? assessment.riskFactors : [],
//     protectiveFactors: Array.isArray(assessment.protectiveFactors) ? assessment.protectiveFactors : [],
//     immediateActions: Array.isArray(assessment.immediateActions) ? assessment.immediateActions : [],
//     escalationRequired: Boolean(assessment.escalationRequired),
//     humanInterventionNeeded: Boolean(assessment.humanInterventionNeeded),
//     emergencyContacts: Array.isArray(assessment.emergencyContacts) ? assessment.emergencyContacts : ['988', '911']
//   };
// } 