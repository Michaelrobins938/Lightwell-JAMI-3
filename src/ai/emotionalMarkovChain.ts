import { MarkovChain, MarkovTransition } from '../lib/markovChain';

export interface EmotionalState {
  primaryEmotion: string;
  intensity: number;
  secondaryEmotions: string[];
  valence: 'positive' | 'negative' | 'neutral' | 'mixed';
  arousal: 'low' | 'medium' | 'high';
  dominance: 'low' | 'medium' | 'high';
}

export interface EmotionalPrediction {
  nextEmotionalState: string;
  probability: number;
  confidence: number;
  timeframe: string;
  triggers: string[];
  interventions: string[];
}

export interface EmotionalTrajectory {
  step: number;
  emotionalState: string;
  intensity: number;
  probability: number;
  confidence: number;
  recommendedInterventions: string[];
}

export class EmotionalMarkovChain {
  private emotionalChain: MarkovChain;
  private intensityChain: MarkovChain;
  private valenceChain: MarkovChain;
  private arousalChain: MarkovChain;

  constructor() {
    // Initialize emotional state transitions with more granular states
    this.emotionalChain = new MarkovChain({
      states: [
        // Core emotions
        'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust',
        // Complex emotions
        'anxiety', 'depression', 'frustration', 'gratitude', 'hope', 'despair',
        'excitement', 'calm', 'overwhelmed', 'content', 'lonely', 'loved',
        // Therapeutic states
        'processing', 'breakthrough', 'resistant', 'open', 'vulnerable', 'defensive'
      ],
      initialTransitions: this.getDefaultEmotionalTransitions()
    });

    // Initialize intensity level transitions
    this.intensityChain = new MarkovChain({
      states: ['low', 'moderate', 'high', 'extreme'],
      initialTransitions: this.getDefaultIntensityTransitions()
    });

    // Initialize valence transitions
    this.valenceChain = new MarkovChain({
      states: ['positive', 'negative', 'neutral', 'mixed'],
      initialTransitions: this.getDefaultValenceTransitions()
    });

    // Initialize arousal level transitions
    this.arousalChain = new MarkovChain({
      states: ['low', 'medium', 'high'],
      initialTransitions: this.getDefaultArousalTransitions()
    });
  }

  private getDefaultEmotionalTransitions(): MarkovTransition[] {
    return [
      // Positive emotion transitions
      { fromState: 'joy', toState: 'content', probability: 0.4 },
      { fromState: 'joy', toState: 'calm', probability: 0.3 },
      { fromState: 'joy', toState: 'gratitude', probability: 0.3 },
      
      { fromState: 'gratitude', toState: 'joy', probability: 0.5 },
      { fromState: 'gratitude', toState: 'content', probability: 0.4 },
      { fromState: 'gratitude', toState: 'hope', probability: 0.1 },
      
      { fromState: 'hope', toState: 'joy', probability: 0.4 },
      { fromState: 'hope', toState: 'excitement', probability: 0.3 },
      { fromState: 'hope', toState: 'calm', probability: 0.3 },
      
      { fromState: 'content', toState: 'calm', probability: 0.6 },
      { fromState: 'content', toState: 'joy', probability: 0.3 },
      { fromState: 'content', toState: 'neutral', probability: 0.1 },
      
      { fromState: 'calm', toState: 'content', probability: 0.4 },
      { fromState: 'calm', toState: 'neutral', probability: 0.3 },
      { fromState: 'calm', toState: 'anxiety', probability: 0.2 },
      { fromState: 'calm', toState: 'joy', probability: 0.1 },
      
      // Negative emotion transitions
      { fromState: 'sadness', toState: 'depression', probability: 0.3 },
      { fromState: 'sadness', toState: 'despair', probability: 0.2 },
      { fromState: 'sadness', toState: 'hope', probability: 0.3 },
      { fromState: 'sadness', toState: 'calm', probability: 0.2 },
      
      { fromState: 'depression', toState: 'sadness', probability: 0.4 },
      { fromState: 'depression', toState: 'despair', probability: 0.3 },
      { fromState: 'depression', toState: 'hope', probability: 0.2 },
      { fromState: 'depression', toState: 'processing', probability: 0.1 },
      
      { fromState: 'despair', toState: 'depression', probability: 0.4 },
      { fromState: 'despair', toState: 'sadness', probability: 0.3 },
      { fromState: 'despair', toState: 'hope', probability: 0.2 },
      { fromState: 'despair', toState: 'processing', probability: 0.1 },
      
      { fromState: 'anger', toState: 'frustration', probability: 0.4 },
      { fromState: 'anger', toState: 'calm', probability: 0.3 },
      { fromState: 'anger', toState: 'sadness', probability: 0.2 },
      { fromState: 'anger', toState: 'processing', probability: 0.1 },
      
      { fromState: 'frustration', toState: 'anger', probability: 0.3 },
      { fromState: 'frustration', toState: 'calm', probability: 0.4 },
      { fromState: 'frustration', toState: 'processing', probability: 0.2 },
      { fromState: 'frustration', toState: 'resistant', probability: 0.1 },
      
      { fromState: 'anxiety', toState: 'fear', probability: 0.3 },
      { fromState: 'anxiety', toState: 'overwhelmed', probability: 0.3 },
      { fromState: 'anxiety', toState: 'calm', probability: 0.3 },
      { fromState: 'anxiety', toState: 'processing', probability: 0.1 },
      
      { fromState: 'fear', toState: 'anxiety', probability: 0.4 },
      { fromState: 'fear', toState: 'overwhelmed', probability: 0.3 },
      { fromState: 'fear', toState: 'calm', probability: 0.2 },
      { fromState: 'fear', toState: 'processing', probability: 0.1 },
      
      { fromState: 'overwhelmed', toState: 'anxiety', probability: 0.3 },
      { fromState: 'overwhelmed', toState: 'calm', probability: 0.4 },
      { fromState: 'overwhelmed', toState: 'processing', probability: 0.2 },
      { fromState: 'overwhelmed', toState: 'vulnerable', probability: 0.1 },
      
      // Therapeutic state transitions
      { fromState: 'processing', toState: 'breakthrough', probability: 0.3 },
      { fromState: 'processing', toState: 'calm', probability: 0.3 },
      { fromState: 'processing', toState: 'open', probability: 0.2 },
      { fromState: 'processing', toState: 'resistant', probability: 0.2 },
      
      { fromState: 'breakthrough', toState: 'joy', probability: 0.4 },
      { fromState: 'breakthrough', toState: 'hope', probability: 0.3 },
      { fromState: 'breakthrough', toState: 'calm', probability: 0.2 },
      { fromState: 'breakthrough', toState: 'content', probability: 0.1 },
      
      { fromState: 'open', toState: 'vulnerable', probability: 0.3 },
      { fromState: 'open', toState: 'processing', probability: 0.3 },
      { fromState: 'open', toState: 'calm', probability: 0.2 },
      { fromState: 'open', toState: 'breakthrough', probability: 0.2 },
      
      { fromState: 'vulnerable', toState: 'open', probability: 0.3 },
      { fromState: 'vulnerable', toState: 'processing', probability: 0.3 },
      { fromState: 'vulnerable', toState: 'defensive', probability: 0.2 },
      { fromState: 'vulnerable', toState: 'breakthrough', probability: 0.2 },
      
      { fromState: 'resistant', toState: 'defensive', probability: 0.4 },
      { fromState: 'resistant', toState: 'frustration', probability: 0.3 },
      { fromState: 'resistant', toState: 'open', probability: 0.2 },
      { fromState: 'resistant', toState: 'processing', probability: 0.1 },
      
      { fromState: 'defensive', toState: 'resistant', probability: 0.4 },
      { fromState: 'defensive', toState: 'anger', probability: 0.3 },
      { fromState: 'defensive', toState: 'vulnerable', probability: 0.2 },
      { fromState: 'defensive', toState: 'open', probability: 0.1 },
      
      // Neutral state transitions
      { fromState: 'neutral', toState: 'calm', probability: 0.4 },
      { fromState: 'neutral', toState: 'anxiety', probability: 0.3 },
      { fromState: 'neutral', toState: 'joy', probability: 0.2 },
      { fromState: 'neutral', toState: 'sadness', probability: 0.1 }
    ];
  }

  private getDefaultIntensityTransitions(): MarkovTransition[] {
    return [
      { fromState: 'low', toState: 'moderate', probability: 0.4 },
      { fromState: 'low', toState: 'low', probability: 0.6 },
      
      { fromState: 'moderate', toState: 'low', probability: 0.3 },
      { fromState: 'moderate', toState: 'high', probability: 0.4 },
      { fromState: 'moderate', toState: 'moderate', probability: 0.3 },
      
      { fromState: 'high', toState: 'moderate', probability: 0.5 },
      { fromState: 'high', toState: 'extreme', probability: 0.3 },
      { fromState: 'high', toState: 'high', probability: 0.2 },
      
      { fromState: 'extreme', toState: 'high', probability: 0.6 },
      { fromState: 'extreme', toState: 'moderate', probability: 0.3 },
      { fromState: 'extreme', toState: 'extreme', probability: 0.1 }
    ];
  }

  private getDefaultValenceTransitions(): MarkovTransition[] {
    return [
      { fromState: 'positive', toState: 'positive', probability: 0.6 },
      { fromState: 'positive', toState: 'neutral', probability: 0.3 },
      { fromState: 'positive', toState: 'mixed', probability: 0.1 },
      
      { fromState: 'negative', toState: 'negative', probability: 0.5 },
      { fromState: 'negative', toState: 'neutral', probability: 0.3 },
      { fromState: 'negative', toState: 'mixed', probability: 0.2 },
      
      { fromState: 'neutral', toState: 'positive', probability: 0.3 },
      { fromState: 'neutral', toState: 'negative', probability: 0.3 },
      { fromState: 'neutral', toState: 'neutral', probability: 0.4 },
      
      { fromState: 'mixed', toState: 'positive', probability: 0.3 },
      { fromState: 'mixed', toState: 'negative', probability: 0.3 },
      { fromState: 'mixed', toState: 'neutral', probability: 0.4 }
    ];
  }

  private getDefaultArousalTransitions(): MarkovTransition[] {
    return [
      { fromState: 'low', toState: 'medium', probability: 0.4 },
      { fromState: 'low', toState: 'low', probability: 0.6 },
      
      { fromState: 'medium', toState: 'low', probability: 0.3 },
      { fromState: 'medium', toState: 'high', probability: 0.4 },
      { fromState: 'medium', toState: 'medium', probability: 0.3 },
      
      { fromState: 'high', toState: 'medium', probability: 0.5 },
      { fromState: 'high', toState: 'low', probability: 0.3 },
      { fromState: 'high', toState: 'high', probability: 0.2 }
    ];
  }

  public predictEmotionalTrajectory(
    currentState: EmotionalState,
    steps: number = 5,
    context?: Record<string, any>
  ): EmotionalTrajectory[] {
    const trajectory: EmotionalTrajectory[] = [];
    let currentEmotion = currentState.primaryEmotion;
    let currentIntensity = this.mapIntensityToLevel(currentState.intensity);

    for (let step = 1; step <= steps; step++) {
      // Predict next emotional state
      const emotionalPredictions = this.emotionalChain.predictNextState(currentEmotion, context);
      const nextEmotion = emotionalPredictions[0]?.id || currentEmotion;
      
      // Predict next intensity
      const intensityPredictions = this.intensityChain.predictNextState(currentIntensity, context);
      const nextIntensity = intensityPredictions[0]?.id || currentIntensity;
      
      trajectory.push({
        step,
        emotionalState: nextEmotion,
        intensity: this.mapLevelToIntensity(nextIntensity),
        probability: emotionalPredictions[0]?.probability || 0,
        confidence: (emotionalPredictions[0]?.probability || 0) * (intensityPredictions[0]?.probability || 0),
        recommendedInterventions: this.getRecommendedInterventions(nextEmotion, nextIntensity)
      });

      currentEmotion = nextEmotion;
      currentIntensity = nextIntensity;
    }

    return trajectory;
  }

  public predictNextEmotionalState(
    currentState: EmotionalState,
    context?: Record<string, any>
  ): EmotionalPrediction {
    const emotionalPredictions = this.emotionalChain.predictNextState(currentState.primaryEmotion, context);
    const intensityPredictions = this.intensityChain.predictNextState(
      this.mapIntensityToLevel(currentState.intensity), 
      context
    );
    const valencePredictions = this.valenceChain.predictNextState(currentState.valence, context);
    const arousalPredictions = this.arousalChain.predictNextState(currentState.arousal, context);

    const nextEmotion = emotionalPredictions[0]?.id || currentState.primaryEmotion;
    const nextIntensity = intensityPredictions[0]?.id || this.mapIntensityToLevel(currentState.intensity);
    const nextValence = valencePredictions[0]?.id || currentState.valence;
    const nextArousal = arousalPredictions[0]?.id || currentState.arousal;

    const confidence = (
      (emotionalPredictions[0]?.probability || 0) +
      (intensityPredictions[0]?.probability || 0) +
      (valencePredictions[0]?.probability || 0) +
      (arousalPredictions[0]?.probability || 0)
    ) / 4;

    return {
      nextEmotionalState: nextEmotion,
      probability: emotionalPredictions[0]?.probability || 0,
      confidence,
      timeframe: 'short_term',
      triggers: this.getPotentialTriggers(nextEmotion, context),
      interventions: this.getRecommendedInterventions(nextEmotion, nextIntensity)
    };
  }

  public updateFromObservation(
    fromState: EmotionalState,
    toState: EmotionalState,
    context?: Record<string, any>
  ): void {
    // Update emotional state chain
    this.emotionalChain.addTransition({
      fromState: fromState.primaryEmotion,
      toState: toState.primaryEmotion,
      probability: 1.0,
      context
    });

    // Update intensity chain
    this.intensityChain.addTransition({
      fromState: this.mapIntensityToLevel(fromState.intensity),
      toState: this.mapIntensityToLevel(toState.intensity),
      probability: 1.0,
      context
    });

    // Update valence chain
    this.valenceChain.addTransition({
      fromState: fromState.valence,
      toState: toState.valence,
      probability: 1.0,
      context
    });

    // Update arousal chain
    this.arousalChain.addTransition({
      fromState: fromState.arousal,
      toState: toState.arousal,
      probability: 1.0,
      context
    });
  }

  private mapIntensityToLevel(intensity: number): string {
    if (intensity <= 3) return 'low';
    if (intensity <= 6) return 'moderate';
    if (intensity <= 8) return 'high';
    return 'extreme';
  }

  private mapLevelToIntensity(level: string): number {
    switch (level) {
      case 'low': return 2;
      case 'moderate': return 5;
      case 'high': return 7;
      case 'extreme': return 9;
      default: return 5;
    }
  }

  private getRecommendedInterventions(emotion: string, intensity: string): string[] {
    const interventions: string[] = [];

    // High intensity emotions need immediate intervention
    if (intensity === 'high' || intensity === 'extreme') {
      interventions.push('crisis_intervention', 'grounding_techniques', 'safety_assessment');
    }

    // Emotion-specific interventions
    switch (emotion) {
      case 'anxiety':
      case 'fear':
        interventions.push('breathing_exercises', 'progressive_relaxation', 'cognitive_reframing');
        break;
      case 'depression':
      case 'despair':
        interventions.push('behavioral_activation', 'compassion_practice', 'social_connection');
        break;
      case 'anger':
      case 'frustration':
        interventions.push('timeout_technique', 'cognitive_restructuring', 'communication_skills');
        break;
      case 'overwhelmed':
        interventions.push('grounding_techniques', 'prioritization', 'support_system');
        break;
      case 'processing':
      case 'breakthrough':
        interventions.push('validation', 'reflection', 'consolidation');
        break;
      case 'resistant':
      case 'defensive':
        interventions.push('rapport_building', 'validation', 'pace_matching');
        break;
      default:
        interventions.push('active_listening', 'validation', 'general_support');
    }

    return interventions;
  }

  private getPotentialTriggers(emotion: string, context?: Record<string, any>): string[] {
    const triggerMap: Record<string, string[]> = {
      'anxiety': ['uncertainty', 'deadlines', 'social_situations', 'health_concerns'],
      'depression': ['loss', 'isolation', 'failure', 'rejection'],
      'anger': ['injustice', 'frustration', 'boundary_violation', 'disrespect'],
      'fear': ['threat', 'unknown', 'past_trauma', 'safety_concerns'],
      'overwhelmed': ['too_many_demands', 'lack_of_control', 'uncertainty', 'change'],
      'joy': ['success', 'connection', 'achievement', 'positive_events'],
      'gratitude': ['kindness', 'support', 'positive_experiences', 'reflection']
    };

    return triggerMap[emotion] || ['general_stressors'];
  }

  public getChainStatistics(): {
    emotional: any;
    intensity: any;
    valence: any;
    arousal: any;
  } {
    return {
      emotional: this.emotionalChain.getChainStatistics(),
      intensity: this.intensityChain.getChainStatistics(),
      valence: this.valenceChain.getChainStatistics(),
      arousal: this.arousalChain.getChainStatistics()
    };
  }
}
