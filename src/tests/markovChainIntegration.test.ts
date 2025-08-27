import { MarkovChain } from '../lib/markovChain';
import { ConversationMarkovChain } from '../services/conversationMarkovChain';
import { EmotionalMarkovChain } from '../ai/emotionalMarkovChain';

describe('Markov Chain Integration Tests', () => {
  describe('Core Markov Chain', () => {
    let markovChain: MarkovChain;

    beforeEach(() => {
      markovChain = new MarkovChain({
        states: ['happy', 'sad', 'anxious', 'calm'],
        initialTransitions: [
          { fromState: 'happy', toState: 'calm', probability: 0.6 },
          { fromState: 'happy', toState: 'sad', probability: 0.2 },
          { fromState: 'happy', toState: 'anxious', probability: 0.2 },
          { fromState: 'sad', toState: 'happy', probability: 0.3 },
          { fromState: 'sad', toState: 'calm', probability: 0.4 },
          { fromState: 'sad', toState: 'anxious', probability: 0.3 },
          { fromState: 'anxious', toState: 'calm', probability: 0.5 },
          { fromState: 'anxious', toState: 'sad', probability: 0.3 },
          { fromState: 'anxious', toState: 'happy', probability: 0.2 },
          { fromState: 'calm', toState: 'happy', probability: 0.4 },
          { fromState: 'calm', toState: 'anxious', probability: 0.3 },
          { fromState: 'calm', toState: 'sad', probability: 0.3 }
        ]
      });
    });

    test('should predict next state correctly', () => {
      const predictions = markovChain.predictNextState('happy');
      expect(predictions.length).toBeGreaterThan(0);
      expect(predictions[0].probability).toBeGreaterThan(0);
      expect(predictions[0].id).toBe('calm'); // Should be highest probability
    });

    test('should predict trajectory correctly', () => {
      const trajectory = markovChain.predictTrajectory('happy', 3);
      expect(trajectory.length).toBe(3);
      expect(trajectory[0].state).toBe('calm'); // First prediction
      expect(trajectory[0].confidence).toBeGreaterThan(0);
    });

    test('should update from observations', () => {
      const observations = ['happy', 'calm', 'anxious', 'calm'];
      markovChain.updateFromObservations(observations);
      
      const predictions = markovChain.predictNextState('anxious');
      expect(predictions.some(p => p.id === 'calm')).toBe(true);
    });

    test('should provide chain statistics', () => {
      const stats = markovChain.getChainStatistics();
      expect(stats.totalTransitions).toBeGreaterThanOrEqual(0);
      expect(stats.uniqueStates).toBe(4);
    });
  });

  describe('Conversation Markov Chain', () => {
    let conversationChain: ConversationMarkovChain;

    beforeEach(() => {
      conversationChain = new ConversationMarkovChain();
    });

    test('should predict conversation state transitions', () => {
      const currentState = {
        emotionalState: 'anxious',
        therapeuticPhase: 'assessment',
        userEngagement: 'moderate_engagement',
        crisisLevel: 'none'
      };

      const prediction = conversationChain.predictNextConversationState(currentState);
      
      expect(prediction.nextEmotionalState).toBeDefined();
      expect(prediction.probability).toBeGreaterThan(0);
      expect(prediction.confidence).toBeGreaterThan(0);
      expect(prediction.recommendedIntervention).toBeDefined();
    });

    test('should predict conversation trajectory', () => {
      const startState = {
        emotionalState: 'sad',
        therapeuticPhase: 'intervention',
        userEngagement: 'high_engagement',
        crisisLevel: 'low'
      };

      const trajectory = conversationChain.predictConversationTrajectory(startState, 5);
      
      expect(trajectory.length).toBe(5);
      trajectory.forEach(step => {
        expect(step.emotionalState).toBeDefined();
        expect(step.probability).toBeGreaterThan(0);
        expect(step.recommendedActions.length).toBeGreaterThan(0);
      });
    });

    test('should update from conversation observations', () => {
      const fromState = {
        emotionalState: 'anxious',
        therapeuticPhase: 'assessment',
        userEngagement: 'low_engagement',
        crisisLevel: 'none'
      };

      const toState = {
        emotionalState: 'calm',
        therapeuticPhase: 'intervention',
        userEngagement: 'moderate_engagement',
        crisisLevel: 'none'
      };

      conversationChain.updateFromConversation(fromState, toState);
      
      // Verify the chain learned the transition
      const prediction = conversationChain.predictNextConversationState(fromState);
      expect(prediction.nextEmotionalState).toBe('calm');
    });

    test('should provide chain statistics', () => {
      const stats = conversationChain.getChainStatistics();
      expect(stats.emotional).toBeDefined();
      expect(stats.therapeutic).toBeDefined();
      expect(stats.engagement).toBeDefined();
      expect(stats.crisis).toBeDefined();
    });
  });

  describe('Emotional Markov Chain', () => {
    let emotionalChain: EmotionalMarkovChain;

    beforeEach(() => {
      emotionalChain = new EmotionalMarkovChain();
    });

    test('should predict emotional trajectory', () => {
      const currentState = {
        primaryEmotion: 'anxiety',
        intensity: 7,
        secondaryEmotions: ['fear'],
        valence: 'negative' as const,
        arousal: 'high' as const,
        dominance: 'low' as const
      };

      const trajectory = emotionalChain.predictEmotionalTrajectory(currentState, 5);
      
      expect(trajectory.length).toBe(5);
      trajectory.forEach(step => {
        expect(step.emotionalState).toBeDefined();
        expect(step.intensity).toBeGreaterThan(0);
        expect(step.recommendedInterventions.length).toBeGreaterThan(0);
      });
    });

    test('should predict next emotional state', () => {
      const currentState = {
        primaryEmotion: 'depression',
        intensity: 8,
        secondaryEmotions: ['hopelessness'],
        valence: 'negative' as const,
        arousal: 'low' as const,
        dominance: 'low' as const
      };

      const prediction = emotionalChain.predictNextEmotionalState(currentState);
      
      expect(prediction.nextEmotionalState).toBeDefined();
      expect(prediction.probability).toBeGreaterThan(0);
      expect(prediction.triggers.length).toBeGreaterThan(0);
      expect(prediction.interventions.length).toBeGreaterThan(0);
    });

    test('should update from emotional observations', () => {
      const fromState = {
        primaryEmotion: 'anger',
        intensity: 8,
        secondaryEmotions: ['frustration'],
        valence: 'negative' as const,
        arousal: 'high' as const,
        dominance: 'high' as const
      };

      const toState = {
        primaryEmotion: 'calm',
        intensity: 4,
        secondaryEmotions: ['relief'],
        valence: 'positive' as const,
        arousal: 'low' as const,
        dominance: 'medium' as const
      };

      emotionalChain.updateFromObservation(fromState, toState);
      
      // Verify the chain learned the transition
      const prediction = emotionalChain.predictNextEmotionalState(fromState);
      expect(prediction.nextEmotionalState).toBe('calm');
    });

    test('should provide appropriate interventions for high intensity emotions', () => {
      const currentState = {
        primaryEmotion: 'overwhelmed',
        intensity: 9,
        secondaryEmotions: ['panic'],
        valence: 'negative' as const,
        arousal: 'high' as const,
        dominance: 'low' as const
      };

      const prediction = emotionalChain.predictNextEmotionalState(currentState);
      
      expect(prediction.interventions).toContain('crisis_intervention');
      expect(prediction.interventions).toContain('grounding_techniques');
    });
  });

  describe('Integration Scenarios', () => {
    test('should handle therapeutic conversation flow', () => {
      const conversationChain = new ConversationMarkovChain();
      const emotionalChain = new EmotionalMarkovChain();

      // Simulate a therapeutic conversation
      const conversationStates = [
        { emotional: 'anxious', therapeutic: 'assessment', engagement: 'low_engagement', crisis: 'none' },
        { emotional: 'calm', therapeutic: 'intervention', engagement: 'moderate_engagement', crisis: 'none' },
        { emotional: 'processing', therapeutic: 'intervention', engagement: 'high_engagement', crisis: 'none' },
        { emotional: 'breakthrough', therapeutic: 'consolidation', engagement: 'collaborative', crisis: 'none' }
      ];

      // Update chains with conversation flow
      for (let i = 0; i < conversationStates.length - 1; i++) {
        const fromState = conversationStates[i];
        const toState = conversationStates[i + 1];

        conversationChain.updateFromConversation(
          { 
            emotionalState: fromState.emotional, 
            therapeuticPhase: fromState.therapeutic, 
            userEngagement: fromState.engagement, 
            crisisLevel: fromState.crisis 
          },
          { 
            emotionalState: toState.emotional, 
            therapeuticPhase: toState.therapeutic, 
            userEngagement: toState.engagement, 
            crisisLevel: toState.crisis 
          }
        );
      }

      // Test prediction from anxious state
      const prediction = conversationChain.predictNextConversationState({
        emotionalState: 'anxious',
        therapeuticPhase: 'assessment',
        userEngagement: 'low_engagement',
        crisisLevel: 'none'
      });

      expect(prediction.nextEmotionalState).toBe('calm');
      expect(prediction.recommendedIntervention).toBe('anxiety_reduction');
    });

    test('should predict crisis escalation', () => {
      const conversationChain = new ConversationMarkovChain();

      // Simulate crisis escalation
      const crisisStates = [
        { emotional: 'anxious', therapeutic: 'assessment', engagement: 'moderate_engagement', crisis: 'none' },
        { emotional: 'overwhelmed', therapeutic: 'intervention', engagement: 'low_engagement', crisis: 'low' },
        { emotional: 'despair', therapeutic: 'crisis_intervention', engagement: 'withdrawn', crisis: 'high' }
      ];

      // Update chain with crisis progression
      for (let i = 0; i < crisisStates.length - 1; i++) {
        const fromState = crisisStates[i];
        const toState = crisisStates[i + 1];

        conversationChain.updateFromConversation(
          { 
            emotionalState: fromState.emotional, 
            therapeuticPhase: fromState.therapeutic, 
            userEngagement: fromState.engagement, 
            crisisLevel: fromState.crisis 
          },
          { 
            emotionalState: toState.emotional, 
            therapeuticPhase: toState.therapeutic, 
            userEngagement: toState.engagement, 
            crisisLevel: toState.crisis 
          }
        );
      }

      // Test crisis prediction
      const prediction = conversationChain.predictNextConversationState({
        emotionalState: 'overwhelmed',
        therapeuticPhase: 'intervention',
        userEngagement: 'low_engagement',
        crisisLevel: 'low'
      });

      expect(prediction.recommendedIntervention).toBe('crisis_intervention');
    });

    test('should handle emotional recovery patterns', () => {
      const emotionalChain = new EmotionalMarkovChain();

      // Simulate emotional recovery
      const recoveryStates = [
        { emotion: 'depression', intensity: 8, valence: 'negative', arousal: 'low' },
        { emotion: 'sadness', intensity: 6, valence: 'negative', arousal: 'low' },
        { emotion: 'processing', intensity: 5, valence: 'neutral', arousal: 'medium' },
        { emotion: 'hope', intensity: 4, valence: 'positive', arousal: 'medium' },
        { emotion: 'joy', intensity: 3, valence: 'positive', arousal: 'high' }
      ];

      // Update chain with recovery pattern
      for (let i = 0; i < recoveryStates.length - 1; i++) {
        const fromState = recoveryStates[i];
        const toState = recoveryStates[i + 1];

        emotionalChain.updateFromObservation(
          {
            primaryEmotion: fromState.emotion,
            intensity: fromState.intensity,
            secondaryEmotions: [],
            valence: fromState.valence as 'positive' | 'negative' | 'neutral' | 'mixed',
            arousal: fromState.arousal as 'low' | 'medium' | 'high',
            dominance: 'low'
          },
          {
            primaryEmotion: toState.emotion,
            intensity: toState.intensity,
            secondaryEmotions: [],
            valence: toState.valence as 'positive' | 'negative' | 'neutral' | 'mixed',
            arousal: toState.arousal as 'low' | 'medium' | 'high',
            dominance: 'medium'
          }
        );
      }

      // Test recovery prediction
      const prediction = emotionalChain.predictNextEmotionalState({
        primaryEmotion: 'depression',
        intensity: 8,
        secondaryEmotions: [],
        valence: 'negative',
        arousal: 'low',
        dominance: 'low'
      });

      expect(prediction.nextEmotionalState).toBe('sadness');
      expect(prediction.interventions).toContain('behavioral_activation');
    });
  });

  describe('Performance Tests', () => {
    test('should handle large numbers of transitions efficiently', () => {
      const markovChain = new MarkovChain({
        states: ['state1', 'state2', 'state3', 'state4', 'state5'],
        maxMemory: 10000
      });

      // Add many transitions
      for (let i = 0; i < 1000; i++) {
        markovChain.addTransition({
          fromState: `state${(i % 5) + 1}`,
          toState: `state${((i + 1) % 5) + 1}`,
          probability: 1.0
        });
      }

      const startTime = Date.now();
      const predictions = markovChain.predictNextState('state1');
      const endTime = Date.now();

      expect(predictions.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });

    test('should maintain memory limits', () => {
      const markovChain = new MarkovChain({
        states: ['A', 'B', 'C'],
        maxMemory: 10
      });

      // Add more transitions than memory limit
      for (let i = 0; i < 20; i++) {
        markovChain.addTransition({
          fromState: 'A',
          toState: 'B',
          probability: 1.0
        });
      }

      const stats = markovChain.getChainStatistics();
      expect(stats.totalTransitions).toBeLessThanOrEqual(10);
    });
  });
});
