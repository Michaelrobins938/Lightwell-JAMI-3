import { MarkovChain, MarkovTransition, MarkovChainConfig } from '../lib/markovChain';

export interface ConversationState {
  emotionalState: string;
  therapeuticPhase: string;
  userEngagement: string;
  crisisLevel: string;
}

export interface ConversationPrediction {
  nextEmotionalState: string;
  probability: number;
  confidence: number;
  recommendedIntervention: string;
  expectedOutcome: string;
  timeframe: string;
}

export interface ConversationTrajectory {
  step: number;
  emotionalState: string;
  therapeuticPhase: string;
  probability: number;
  confidence: number;
  recommendedActions: string[];
}

export class ConversationMarkovChain {
  private emotionalChain: MarkovChain;
  private therapeuticChain: MarkovChain;
  private engagementChain: MarkovChain;
  private crisisChain: MarkovChain;

  constructor() {
    // Initialize emotional state transitions
    this.emotionalChain = new MarkovChain({
      states: [
        'calm', 'anxious', 'sad', 'angry', 'happy', 'fearful', 
        'overwhelmed', 'hopeful', 'frustrated', 'grateful', 'neutral'
      ],
      initialTransitions: this.getDefaultEmotionalTransitions()
    });

    // Initialize therapeutic phase transitions
    this.therapeuticChain = new MarkovChain({
      states: [
        'assessment', 'rapport_building', 'intervention', 'processing', 
        'consolidation', 'crisis_intervention', 'maintenance'
      ],
      initialTransitions: this.getDefaultTherapeuticTransitions()
    });

    // Initialize engagement level transitions
    this.engagementChain = new MarkovChain({
      states: [
        'low_engagement', 'moderate_engagement', 'high_engagement', 
        'resistant', 'collaborative', 'withdrawn'
      ],
      initialTransitions: this.getDefaultEngagementTransitions()
    });

    // Initialize crisis level transitions
    this.crisisChain = new MarkovChain({
      states: [
        'none', 'low', 'medium', 'high', 'critical'
      ],
      initialTransitions: this.getDefaultCrisisTransitions()
    });
  }

  private getDefaultEmotionalTransitions(): MarkovTransition[] {
    return [
      // Calm transitions
      { fromState: 'calm', toState: 'anxious', probability: 0.3 },
      { fromState: 'calm', toState: 'happy', probability: 0.4 },
      { fromState: 'calm', toState: 'neutral', probability: 0.3 },
      
      // Anxious transitions
      { fromState: 'anxious', toState: 'calm', probability: 0.4 },
      { fromState: 'anxious', toState: 'overwhelmed', probability: 0.3 },
      { fromState: 'anxious', toState: 'fearful', probability: 0.2 },
      { fromState: 'anxious', toState: 'angry', probability: 0.1 },
      
      // Sad transitions
      { fromState: 'sad', toState: 'hopeful', probability: 0.3 },
      { fromState: 'sad', toState: 'calm', probability: 0.4 },
      { fromState: 'sad', toState: 'overwhelmed', probability: 0.2 },
      { fromState: 'sad', toState: 'angry', probability: 0.1 },
      
      // Angry transitions
      { fromState: 'angry', toState: 'calm', probability: 0.5 },
      { fromState: 'angry', toState: 'frustrated', probability: 0.3 },
      { fromState: 'angry', toState: 'sad', probability: 0.2 },
      
      // Happy transitions
      { fromState: 'happy', toState: 'calm', probability: 0.6 },
      { fromState: 'happy', toState: 'grateful', probability: 0.3 },
      { fromState: 'happy', toState: 'neutral', probability: 0.1 },
      
      // Fearful transitions
      { fromState: 'fearful', toState: 'anxious', probability: 0.4 },
      { fromState: 'fearful', toState: 'calm', probability: 0.4 },
      { fromState: 'fearful', toState: 'overwhelmed', probability: 0.2 },
      
      // Overwhelmed transitions
      { fromState: 'overwhelmed', toState: 'anxious', probability: 0.3 },
      { fromState: 'overwhelmed', toState: 'calm', probability: 0.4 },
      { fromState: 'overwhelmed', toState: 'sad', probability: 0.3 },
      
      // Hopeful transitions
      { fromState: 'hopeful', toState: 'happy', probability: 0.5 },
      { fromState: 'hopeful', toState: 'calm', probability: 0.4 },
      { fromState: 'hopeful', toState: 'grateful', probability: 0.1 },
      
      // Frustrated transitions
      { fromState: 'frustrated', toState: 'angry', probability: 0.3 },
      { fromState: 'frustrated', toState: 'calm', probability: 0.5 },
      { fromState: 'frustrated', toState: 'sad', probability: 0.2 },
      
      // Grateful transitions
      { fromState: 'grateful', toState: 'happy', probability: 0.6 },
      { fromState: 'grateful', toState: 'calm', probability: 0.3 },
      { fromState: 'grateful', toState: 'hopeful', probability: 0.1 },
      
      // Neutral transitions
      { fromState: 'neutral', toState: 'calm', probability: 0.4 },
      { fromState: 'neutral', toState: 'anxious', probability: 0.3 },
      { fromState: 'neutral', toState: 'happy', probability: 0.3 }
    ];
  }

  private getDefaultTherapeuticTransitions(): MarkovTransition[] {
    return [
      { fromState: 'assessment', toState: 'rapport_building', probability: 0.6 },
      { fromState: 'assessment', toState: 'crisis_intervention', probability: 0.4 },
      
      { fromState: 'rapport_building', toState: 'intervention', probability: 0.7 },
      { fromState: 'rapport_building', toState: 'assessment', probability: 0.3 },
      
      { fromState: 'intervention', toState: 'processing', probability: 0.6 },
      { fromState: 'intervention', toState: 'crisis_intervention', probability: 0.2 },
      { fromState: 'intervention', toState: 'rapport_building', probability: 0.2 },
      
      { fromState: 'processing', toState: 'consolidation', probability: 0.5 },
      { fromState: 'processing', toState: 'intervention', probability: 0.3 },
      { fromState: 'processing', toState: 'assessment', probability: 0.2 },
      
      { fromState: 'consolidation', toState: 'maintenance', probability: 0.6 },
      { fromState: 'consolidation', toState: 'intervention', probability: 0.4 },
      
      { fromState: 'crisis_intervention', toState: 'assessment', probability: 0.4 },
      { fromState: 'crisis_intervention', toState: 'rapport_building', probability: 0.6 },
      
      { fromState: 'maintenance', toState: 'intervention', probability: 0.3 },
      { fromState: 'maintenance', toState: 'assessment', probability: 0.4 },
      { fromState: 'maintenance', toState: 'consolidation', probability: 0.3 }
    ];
  }

  private getDefaultEngagementTransitions(): MarkovTransition[] {
    return [
      { fromState: 'low_engagement', toState: 'moderate_engagement', probability: 0.4 },
      { fromState: 'low_engagement', toState: 'withdrawn', probability: 0.3 },
      { fromState: 'low_engagement', toState: 'resistant', probability: 0.3 },
      
      { fromState: 'moderate_engagement', toState: 'high_engagement', probability: 0.5 },
      { fromState: 'moderate_engagement', toState: 'low_engagement', probability: 0.3 },
      { fromState: 'moderate_engagement', toState: 'collaborative', probability: 0.2 },
      
      { fromState: 'high_engagement', toState: 'collaborative', probability: 0.6 },
      { fromState: 'high_engagement', toState: 'moderate_engagement', probability: 0.4 },
      
      { fromState: 'resistant', toState: 'moderate_engagement', probability: 0.4 },
      { fromState: 'resistant', toState: 'low_engagement', probability: 0.4 },
      { fromState: 'resistant', toState: 'withdrawn', probability: 0.2 },
      
      { fromState: 'collaborative', toState: 'high_engagement', probability: 0.7 },
      { fromState: 'collaborative', toState: 'moderate_engagement', probability: 0.3 },
      
      { fromState: 'withdrawn', toState: 'low_engagement', probability: 0.5 },
      { fromState: 'withdrawn', toState: 'resistant', probability: 0.3 },
      { fromState: 'withdrawn', toState: 'moderate_engagement', probability: 0.2 }
    ];
  }

  private getDefaultCrisisTransitions(): MarkovTransition[] {
    return [
      { fromState: 'none', toState: 'low', probability: 0.3 },
      { fromState: 'none', toState: 'none', probability: 0.7 },
      
      { fromState: 'low', toState: 'none', probability: 0.5 },
      { fromState: 'low', toState: 'medium', probability: 0.3 },
      { fromState: 'low', toState: 'low', probability: 0.2 },
      
      { fromState: 'medium', toState: 'low', probability: 0.4 },
      { fromState: 'medium', toState: 'high', probability: 0.3 },
      { fromState: 'medium', toState: 'medium', probability: 0.3 },
      
      { fromState: 'high', toState: 'medium', probability: 0.4 },
      { fromState: 'high', toState: 'critical', probability: 0.3 },
      { fromState: 'high', toState: 'high', probability: 0.3 },
      
      { fromState: 'critical', toState: 'high', probability: 0.5 },
      { fromState: 'critical', toState: 'critical', probability: 0.5 }
    ];
  }

  public predictNextConversationState(
    currentState: ConversationState,
    context?: Record<string, any>
  ): ConversationPrediction {
    // Predict next emotional state
    const emotionalPredictions = this.emotionalChain.predictNextState(currentState.emotionalState, context);
    const nextEmotionalState = emotionalPredictions[0]?.id || currentState.emotionalState;
    
    // Predict next therapeutic phase
    const therapeuticPredictions = this.therapeuticChain.predictNextState(currentState.therapeuticPhase, context);
    const nextTherapeuticPhase = therapeuticPredictions[0]?.id || currentState.therapeuticPhase;
    
    // Predict next engagement level
    const engagementPredictions = this.engagementChain.predictNextState(currentState.userEngagement, context);
    const nextEngagement = engagementPredictions[0]?.id || currentState.userEngagement;
    
    // Predict next crisis level
    const crisisPredictions = this.crisisChain.predictNextState(currentState.crisisLevel, context);
    const nextCrisisLevel = crisisPredictions[0]?.id || currentState.crisisLevel;

    // Calculate overall confidence
    const confidence = (
      (emotionalPredictions[0]?.probability || 0) +
      (therapeuticPredictions[0]?.probability || 0) +
      (engagementPredictions[0]?.probability || 0) +
      (crisisPredictions[0]?.probability || 0)
    ) / 4;

    // Determine recommended intervention based on predictions
    const recommendedIntervention = this.getRecommendedIntervention(
      nextEmotionalState,
      nextTherapeuticPhase,
      nextEngagement,
      nextCrisisLevel
    );

    return {
      nextEmotionalState,
      probability: emotionalPredictions[0]?.probability || 0,
      confidence,
      recommendedIntervention,
      expectedOutcome: this.getExpectedOutcome(nextEmotionalState, nextTherapeuticPhase),
      timeframe: 'immediate'
    };
  }

  public predictConversationTrajectory(
    startState: ConversationState,
    steps: number = 5,
    context?: Record<string, any>
  ): ConversationTrajectory[] {
    const trajectory: ConversationTrajectory[] = [];
    let currentState = startState;

    for (let step = 1; step <= steps; step++) {
      const prediction = this.predictNextConversationState(currentState, context);
      
      trajectory.push({
        step,
        emotionalState: prediction.nextEmotionalState,
        therapeuticPhase: currentState.therapeuticPhase, // Will be updated in next iteration
        probability: prediction.probability,
        confidence: prediction.confidence,
        recommendedActions: this.getRecommendedActions(prediction)
      });

      // Update current state for next iteration
      currentState = {
        emotionalState: prediction.nextEmotionalState,
        therapeuticPhase: currentState.therapeuticPhase,
        userEngagement: currentState.userEngagement,
        crisisLevel: currentState.crisisLevel
      };
    }

    return trajectory;
  }

  public updateFromConversation(
    fromState: ConversationState,
    toState: ConversationState,
    context?: Record<string, any>
  ): void {
    // Update all chains with the observed transition
    this.emotionalChain.addTransition({
      fromState: fromState.emotionalState,
      toState: toState.emotionalState,
      probability: 1.0,
      context
    });

    this.therapeuticChain.addTransition({
      fromState: fromState.therapeuticPhase,
      toState: toState.therapeuticPhase,
      probability: 1.0,
      context
    });

    this.engagementChain.addTransition({
      fromState: fromState.userEngagement,
      toState: toState.userEngagement,
      probability: 1.0,
      context
    });

    this.crisisChain.addTransition({
      fromState: fromState.crisisLevel,
      toState: toState.crisisLevel,
      probability: 1.0,
      context
    });
  }

  private getRecommendedIntervention(
    emotionalState: string,
    therapeuticPhase: string,
    engagement: string,
    crisisLevel: string
  ): string {
    // Crisis takes priority
    if (crisisLevel === 'critical' || crisisLevel === 'high') {
      return 'crisis_intervention';
    }

    // Low engagement requires rapport building
    if (engagement === 'low_engagement' || engagement === 'withdrawn') {
      return 'rapport_building';
    }

    // Emotional state specific interventions
    switch (emotionalState) {
      case 'anxious':
        return 'anxiety_reduction';
      case 'sad':
        return 'mood_elevation';
      case 'angry':
        return 'anger_management';
      case 'overwhelmed':
        return 'grounding_techniques';
      case 'fearful':
        return 'safety_establishment';
      default:
        return 'general_support';
    }
  }

  private getExpectedOutcome(emotionalState: string, therapeuticPhase: string): string {
    const outcomes: Record<string, string> = {
      'calm': 'increased emotional regulation',
      'happy': 'positive mood maintenance',
      'hopeful': 'increased optimism',
      'grateful': 'enhanced positive perspective',
      'neutral': 'emotional stability',
      'anxious': 'reduced anxiety',
      'sad': 'improved mood',
      'angry': 'decreased anger',
      'fearful': 'increased safety',
      'overwhelmed': 'better coping',
      'frustrated': 'increased patience'
    };

    return outcomes[emotionalState] || 'emotional improvement';
  }

  private getRecommendedActions(prediction: ConversationPrediction): string[] {
    const actions: string[] = [];

    // Add intervention-specific actions
    switch (prediction.recommendedIntervention) {
      case 'crisis_intervention':
        actions.push('assess_safety', 'provide_immediate_support', 'escalate_if_needed');
        break;
      case 'anxiety_reduction':
        actions.push('breathing_exercise', 'progressive_relaxation', 'cognitive_reframing');
        break;
      case 'mood_elevation':
        actions.push('positive_activity_scheduling', 'gratitude_practice', 'social_connection');
        break;
      case 'anger_management':
        actions.push('timeout_technique', 'cognitive_restructuring', 'communication_skills');
        break;
      case 'grounding_techniques':
        actions.push('five_senses_exercise', 'body_scan', 'present_moment_focus');
        break;
      case 'safety_establishment':
        actions.push('safety_planning', 'coping_strategy_development', 'support_system_activation');
        break;
      case 'rapport_building':
        actions.push('active_listening', 'validation', 'empathy_expression');
        break;
      default:
        actions.push('general_support', 'active_listening', 'validation');
    }

    return actions;
  }

  public getChainStatistics(): {
    emotional: any;
    therapeutic: any;
    engagement: any;
    crisis: any;
  } {
    return {
      emotional: this.emotionalChain.getChainStatistics(),
      therapeutic: this.therapeuticChain.getChainStatistics(),
      engagement: this.engagementChain.getChainStatistics(),
      crisis: this.crisisChain.getChainStatistics()
    };
  }
}
