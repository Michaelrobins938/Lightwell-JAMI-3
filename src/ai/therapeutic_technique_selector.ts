// Lightweight therapeutic approach selection for Jamie

export const TECHNIQUE_PROMPT = `
Jamie should choose conversation techniques based on user need:

- If user vents: Reflect feelings back briefly ("That sounds heavy, I can see why you'd feel that way.").
- If user seeks guidance: Offer gentle perspective, not directives.
- If user asks for coping: Suggest everyday grounding or reflection, avoid clinical prescriptions.
- If user is curious: Explore ideas together, ask open-ended follow-ups.
- Keep techniques conversational, not formal therapy scripts.
- Encourage agency: remind user they can choose how to respond to their feelings.

Goal: Conversation should feel fluid, not programmed.
`;

export const CONVERSATION_TECHNIQUES = {
  VENTING: 'Reflect feelings briefly and validate experience',
  GUIDANCE: 'Offer gentle perspective, not directives',
  COPING: 'Suggest everyday grounding, avoid clinical prescriptions',
  EXPLORATION: 'Ask open-ended questions, explore together',
  SUPPORT: 'Show understanding and care without fixing'
};

export const TECHNIQUE_SELECTION_RULES = `
Selection Guidelines:
- Match technique to user's current need
- Keep responses proportional to user's input
- Avoid switching techniques mid-conversation
- Prioritize natural flow over technique adherence
- Use techniques as conversation enhancers, not scripts
`;

export interface TherapeuticTechnique {
  name: string;
  type: 'cbt' | 'psychodynamic' | 'humanistic' | 'trauma' | 'solution-focused' | 'validation';
  description: string;
  steps: string[];
  duration: number;
  effectiveness: {
    successRate: number;
  };
}

export interface UserProfile {
  preferredModalities: string[];
  previouslyEffective: string[];
  avoidedTechniques: string[];
  learningStyle: string;
  attentionSpan: string;
  cognitiveCapacity: string;
  motivationLevel: number;
  resistanceAreas: string[];
  culturalBackground: string;
  accessibility: string[];
}

export interface ContextualFactors {
  timeAvailable: number;
  environment: string;
  resources: string[];
  immediacy: 'low' | 'medium' | 'high';
}

export interface EmotionalStateInput {
  primaryEmotion: string;
  intensity: number;
  secondaryEmotions: string[];
  triggers: string[];
  somaticSymptoms: string[];
  cognitivePatterns: string[];
}

export class TherapeuticTechniqueSelector {
  private techniques: TherapeuticTechnique[] = [
    {
      name: 'Active Listening',
      type: 'validation',
      description: 'Empathetic listening and reflection',
      steps: ['Listen actively', 'Reflect feelings', 'Validate experience'],
      duration: 5,
      effectiveness: { successRate: 0.8 }
    },
    {
      name: 'Grounding Technique',
      type: 'cbt',
      description: '5-4-3-2-1 sensory grounding',
      steps: ['5 things you see', '4 things you hear', '3 things you touch', '2 things you smell', '1 thing you taste'],
      duration: 10,
      effectiveness: { successRate: 0.7 }
    },
    {
      name: 'Breathing Exercise',
      type: 'cbt',
      description: 'Deep breathing for emotional regulation',
      steps: ['Breathe in for 4 counts', 'Hold for 4 counts', 'Breathe out for 6 counts', 'Repeat 4 times'],
      duration: 5,
      effectiveness: { successRate: 0.75 }
    }
  ];

  async selectOptimalTechnique(
    emotionalState: EmotionalStateInput,
    userProfile: UserProfile,
    contextualFactors: ContextualFactors
  ) {
    // Select technique based on emotional intensity and available time
    let selectedTechnique = this.techniques[0]; // Default to active listening
    
    if (emotionalState.intensity > 7 && contextualFactors.timeAvailable >= 10) {
      selectedTechnique = this.techniques[1]; // Grounding
    } else if (emotionalState.intensity > 5) {
      selectedTechnique = this.techniques[2]; // Breathing
    }

    return {
      primary: selectedTechnique,
      rationale: `Selected ${selectedTechnique.name} based on intensity ${emotionalState.intensity} and available time`,
      personalization: `Adapted for ${userProfile.learningStyle} learning style`,
      implementation: {
        guidance: selectedTechnique.steps
      }
    };
  }
}