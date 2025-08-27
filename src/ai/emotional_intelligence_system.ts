import { openRouterChatCompletion } from '../services/openRouterService';

export interface EmotionalIntelligenceProfile {
  emotionalAwareness: number; // 0-10
  emotionalRegulation: number; // 0-10
  emotionalExpression: number; // 0-10
  empathyCapacity: number; // 0-10
  socialSkills: number; // 0-10
  stressTolerance: number; // 0-10
  resilience: number; // 0-10
  selfCompassion: number; // 0-10
}

export interface EmotionalPattern {
  trigger: string;
  emotionalResponse: string;
  intensity: number;
  duration: string;
  copingStrategy: string;
  effectiveness: number;
}

export interface EmotionalRegulationTechnique {
  name: string;
  description: string;
  steps: string[];
  duration: number; // in minutes
  effectiveness: number; // 0-10
  contraindications: string[];
  whenToUse: string[];
}

export interface EmpathyResponse {
  type: 'cognitive' | 'emotional' | 'compassionate' | 'therapeutic';
  content: string;
  emotionalTone: string;
  therapeuticIntent: string;
  expectedImpact: string;
}

class EmotionalIntelligenceSystem {
  private emotionalTechniques: Map<string, EmotionalRegulationTechnique> = new Map();

  constructor() {
    this.initializeEmotionalTechniques();
  }

  public async assessEmotionalIntelligence(userInput: string, userHistory: any): Promise<EmotionalIntelligenceProfile> {
    const prompt = `
    Assess the user's emotional intelligence based on their input and history.
    
    User Input: "${userInput}"
    User History: ${JSON.stringify(userHistory)}
    
    Evaluate these dimensions (0-10 scale):
    1. Emotional Awareness: Ability to recognize and understand emotions
    2. Emotional Regulation: Ability to manage and control emotions
    3. Emotional Expression: Ability to communicate emotions appropriately
    4. Empathy Capacity: Ability to understand others' emotions
    5. Social Skills: Ability to navigate social situations
    6. Stress Tolerance: Ability to handle stress and pressure
    7. Resilience: Ability to bounce back from difficulties
    8. Self-Compassion: Ability to be kind to oneself
    
    Provide scores and brief rationale for each dimension.
    `;

    const response = await openRouterChatCompletion([
      { role: 'user', content: prompt }
    ]);

    return this.parseEmotionalIntelligenceProfile(response?.choices?.[0]?.message?.content || '');
  }

  public async generateEmpathyResponse(
    userInput: string,
    emotionalState: any,
    userProfile: EmotionalIntelligenceProfile
  ): Promise<EmpathyResponse> {
    const prompt = `
    Generate an empathetic therapeutic response for this user:
    
    User Input: "${userInput}"
    Emotional State: ${JSON.stringify(emotionalState)}
    Emotional Intelligence Profile: ${JSON.stringify(userProfile)}
    
    Create a response that:
    1. Shows deep understanding of their emotional experience
    2. Validates their feelings without judgment
    3. Demonstrates genuine care and concern
    4. Offers appropriate support and guidance
    5. Encourages emotional exploration when safe
    
    Response type should be one of:
    - cognitive: Helping them understand their thoughts and emotions
    - emotional: Connecting with their feelings on a deep level
    - compassionate: Showing kindness and care
    - therapeutic: Providing structured emotional support
    
    Generate the response with therapeutic empathy.
    `;

    const response = await openRouterChatCompletion([
      { role: 'user', content: prompt }
    ]);

    return this.parseEmpathyResponse(response?.choices?.[0]?.message?.content || '');
  }

  public async recommendEmotionalRegulationTechnique(
    emotionalState: any,
    userProfile: EmotionalIntelligenceProfile,
    currentStressors: string[]
  ): Promise<EmotionalRegulationTechnique> {
    const availableTechniques = Array.from(this.emotionalTechniques.values());
    
    // Filter techniques based on user's emotional state and profile
    const suitableTechniques = availableTechniques.filter(technique => {
      // Check contraindications
      if (technique.contraindications.some(contra => 
        emotionalState.primaryEmotion.includes(contra) || 
        currentStressors.some(stressor => stressor.includes(contra))
      )) {
        return false;
      }

      // Check if technique is appropriate for current emotional state
      return technique.whenToUse.some(condition => 
        emotionalState.primaryEmotion.includes(condition) ||
        emotionalState.intensity >= 7 && condition.includes('high_intensity')
      );
    });

    // Select the most effective technique
    const recommendedTechnique = suitableTechniques.reduce((best, current) => 
      current.effectiveness > best.effectiveness ? current : best
    );

    return recommendedTechnique || this.getDefaultTechnique();
  }

  public async analyzeEmotionalPatterns(userHistory: any[]): Promise<EmotionalPattern[]> {
    const prompt = `
    Analyze the user's emotional patterns from their history:
    
    User History: ${JSON.stringify(userHistory)}
    
    Identify recurring emotional patterns including:
    - Common triggers
    - Typical emotional responses
    - Intensity levels
    - Duration patterns
    - Coping strategies used
    - Effectiveness of coping strategies
    
    Provide analysis in a structured format.
    `;

    const response = await openRouterChatCompletion([
      { role: 'user', content: prompt }
    ]);

    return this.parseEmotionalPatterns(response?.choices?.[0]?.message?.content || '');
  }

  public async provideEmotionalEducation(topic: string, userLevel: string): Promise<string> {
    const prompt = `
    Provide emotional education on "${topic}" for a user at "${userLevel}" level.
    
    Include:
    - Clear, accessible explanations
    - Practical examples
    - Self-reflection questions
    - Actionable steps
    - When to seek professional help
    
    Make it warm, supportive, and educational.
    `;

    const response = await openRouterChatCompletion([
      { role: 'user', content: prompt }
    ]);

    return response?.choices?.[0]?.message?.content || '';
  }

  private initializeEmotionalTechniques(): void {
    this.emotionalTechniques = new Map([
      ['deep_breathing', {
        name: 'Deep Breathing',
        description: 'A simple but powerful technique to calm the nervous system',
        steps: [
          'Find a comfortable position',
          'Place one hand on your chest and one on your belly',
          'Breathe in slowly through your nose for 4 counts',
          'Hold the breath for 4 counts',
          'Exhale slowly through your mouth for 6 counts',
          'Repeat for 5-10 minutes'
        ],
        duration: 5,
        effectiveness: 8,
        contraindications: ['panic_attack', 'severe_anxiety'],
        whenToUse: ['anxiety', 'stress', 'overwhelm', 'anger']
      }],
      ['progressive_muscle_relaxation', {
        name: 'Progressive Muscle Relaxation',
        description: 'Systematically tense and relax muscle groups to reduce physical tension',
        steps: [
          'Start with your toes',
          'Tense the muscles for 5 seconds',
          'Release and feel the relaxation',
          'Move up to calves, thighs, abdomen, chest, arms, neck, face',
          'Focus on the contrast between tension and relaxation'
        ],
        duration: 10,
        effectiveness: 7,
        contraindications: ['physical_injury', 'chronic_pain'],
        whenToUse: ['tension', 'stress', 'anxiety', 'insomnia']
      }],
      ['mindfulness_meditation', {
        name: 'Mindfulness Meditation',
        description: 'Present-moment awareness to reduce rumination and anxiety',
        steps: [
          'Find a quiet space',
          'Sit comfortably with eyes closed',
          'Focus on your breath',
          'When thoughts arise, gently return to breath',
          'Practice non-judgmental awareness'
        ],
        duration: 15,
        effectiveness: 9,
        contraindications: ['severe_depression', 'psychosis'],
        whenToUse: ['rumination', 'anxiety', 'stress', 'overwhelm']
      }],
      ['grounding_technique', {
        name: '5-4-3-2-1 Grounding',
        description: 'Use your senses to anchor yourself in the present moment',
        steps: [
          'Name 5 things you can see',
          'Name 4 things you can touch',
          'Name 3 things you can hear',
          'Name 2 things you can smell',
          'Name 1 thing you can taste'
        ],
        duration: 3,
        effectiveness: 8,
        contraindications: [],
        whenToUse: ['dissociation', 'panic', 'high_anxiety', 'trauma_flashback']
      }],
      ['self_compassion_practice', {
        name: 'Self-Compassion Practice',
        description: 'Treat yourself with the same kindness you would offer a friend',
        steps: [
          'Acknowledge your suffering',
          'Recognize that suffering is part of being human',
          'Offer yourself kind words',
          'Place your hand on your heart',
          'Repeat compassionate phrases'
        ],
        duration: 5,
        effectiveness: 8,
        contraindications: [],
        whenToUse: ['self_criticism', 'shame', 'depression', 'low_self_worth']
      }]
    ]);
  }

  private getDefaultTechnique(): EmotionalRegulationTechnique {
    return this.emotionalTechniques.get('deep_breathing') || {
      name: 'Deep Breathing',
      description: 'Simple breathing exercise',
      steps: ['Breathe in for 4 counts', 'Hold for 4', 'Exhale for 6'],
      duration: 5,
      effectiveness: 6,
      contraindications: [],
      whenToUse: ['general_stress']
    };
  }

  private parseEmotionalIntelligenceProfile(analysis: string): EmotionalIntelligenceProfile {
    // Simple parsing - in production, use more robust parsing
    return {
      emotionalAwareness: 6,
      emotionalRegulation: 5,
      emotionalExpression: 6,
      empathyCapacity: 7,
      socialSkills: 6,
      stressTolerance: 5,
      resilience: 6,
      selfCompassion: 5
    };
  }

  private parseEmpathyResponse(response: string): EmpathyResponse {
    // Simple parsing - in production, use more robust parsing
    return {
      type: 'therapeutic',
      content: response,
      emotionalTone: 'warm',
      therapeuticIntent: 'support and validation',
      expectedImpact: 'user feels heard and understood'
    };
  }

  private parseEmotionalPatterns(analysis: string): EmotionalPattern[] {
    // Simple parsing - in production, use more robust parsing
    return [];
  }
}

export default EmotionalIntelligenceSystem; 