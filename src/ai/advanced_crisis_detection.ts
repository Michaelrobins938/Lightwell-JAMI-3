// Advanced keyword/context detection for crisis situations

export const CRISIS_DETECTION_PROMPT = `
You are responsible for identifying when Jamie should shift into crisis mode.

Rules:
- Flag HIGH risk if user mentions intent, plans, or immediate self-harm.
- Flag MEDIUM risk if user expresses hopelessness or wishing to disappear.
- Flag LOW risk for sadness or overwhelm without danger language.

Responses:
- HIGH → trigger crisis_intervention_system.ts (hotlines + emergency guidance).
- MEDIUM → stay supportive, encourage seeking professional or trusted support, 
  but no hotlines unless user asks.
- LOW → no special intervention needed, just warmth.

DO NOT trigger crisis response unless threshold is clearly met.
Over-triggering makes conversation feel repetitive and unhelpful.
`;

export const CRISIS_KEYWORDS = {
  HIGH_RISK: [
    'kill myself', 'suicide', 'end my life', 'want to die', 'plan to die',
    'hurt myself', 'self-harm', 'cut myself', 'overdose', 'take pills'
  ],
  MEDIUM_RISK: [
    'hopeless', 'wish I was dead', 'better off dead', 'no reason to live',
    'disappear', 'run away', 'give up', 'can\'t take it anymore'
  ],
  LOW_RISK: [
    'sad', 'depressed', 'overwhelmed', 'stressed', 'anxious', 'lonely',
    'family member die', 'family member died', 'lost someone', 'grief', 'mourning'
  ]
};

export const CRISIS_RESPONSE_LEVELS = {
  HIGH: 'Trigger crisis intervention with emergency resources',
  MEDIUM: 'Stay supportive, encourage professional help, no hotlines',
  LOW: 'Normal supportive conversation, no special intervention'
};

export class AdvancedCrisisDetection {
  /**
   * Assess crisis level based on user input
   */
  assessCrisisLevel(userInput: string): 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' {
    const input = userInput.toLowerCase();
    
    // Check for HIGH risk indicators
    for (const keyword of CRISIS_KEYWORDS.HIGH_RISK) {
      if (input.includes(keyword)) {
        return 'HIGH';
      }
    }
    
    // Check for MEDIUM risk indicators
    for (const keyword of CRISIS_KEYWORDS.MEDIUM_RISK) {
      if (input.includes(keyword)) {
        return 'MEDIUM';
      }
    }
    
    // Check for LOW risk indicators
    for (const keyword of CRISIS_KEYWORDS.LOW_RISK) {
      if (input.includes(keyword)) {
        return 'LOW';
      }
    }
    
    return 'NONE';
  }
  
  /**
   * Get appropriate response level for crisis detection
   */
  getResponseLevel(crisisLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'): string {
    switch (crisisLevel) {
      case 'HIGH':
        return CRISIS_RESPONSE_LEVELS.HIGH;
      case 'MEDIUM':
        return CRISIS_RESPONSE_LEVELS.MEDIUM;
      case 'LOW':
        return CRISIS_RESPONSE_LEVELS.LOW;
      default:
        return 'No crisis detected, continue normal conversation';
    }
  }
}