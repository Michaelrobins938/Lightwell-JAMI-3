import { openRouterChatCompletion } from '../services/openRouterService';
import { EnhancedEmotionalIntelligence } from './enhanced_emotional_intelligence';
import { AdvancedCrisisDetection } from './advanced_crisis_detection';
import { CONVERSATION_TECHNIQUES, TherapeuticTechniqueSelector } from './therapeutic_technique_selector';
import { EmotionalState, TherapeuticIntervention, CrisisLevel, EnhancedAIResponse } from '../types/ai';

interface SessionContext {
  sessionId: string;
  userId: string;
  messageCount: number;
  startTime: Date;
  lastInteraction: Date;
  sessionGoals: string[];
  progress: {
    emotionalRegulation: number;
    insight: number;
    copingSkills: number;
    therapeuticAlliance: number;
  };
  interventionsUsed: string[];
  userEngagement: number;
  riskLevel: string;
}

interface ContextualMemory {
  immediateContext: {
    lastFewMessages: string[];
    emotionalTrajectory: EmotionalState[];
    interventionEffectiveness: number[];
  };
  sessionMemory: {
    keyInsights: string[];
    breakthroughs: string[];
    resistanceAreas: string[];
    effectiveTechniques: string[];
  };
  longTermMemory: {
    therapeuticRelationship: {
      trustLevel: number;
      communication: string;
      preferences: string[];
      boundaries: string[];
    };
    emotionalPatterns: Array<{
      pattern: string;
      triggers: string[];
      frequency: number;
      progression: string;
    }>;
    progressHistory: Array<{
      date: Date;
      metric: string;
      value: number;
      trend: string;
    }>;
    crisisHistory: Array<{
      date: Date;
      level: string;
      triggers: string[];
      interventions: string[];
      outcome: string;
    }>;
  };
}

interface ResponseStrategy {
  approach: 'supportive' | 'exploratory' | 'interventional' | 'crisis' | 'maintenance';
  tone: 'warm' | 'professional' | 'gentle' | 'direct' | 'encouraging';
  length: 'brief' | 'moderate' | 'detailed';
  focus: string[];
  techniques: string[];
  followUp: string[];
}

export class UltraRobustJamie {
  private emotionalIntelligence: EnhancedEmotionalIntelligence;
  private crisisDetection: AdvancedCrisisDetection;
  private techniqueSelector: TherapeuticTechniqueSelector;

  constructor() {
    this.emotionalIntelligence = new EnhancedEmotionalIntelligence();
    this.crisisDetection = new AdvancedCrisisDetection();
    this.techniqueSelector = new TherapeuticTechniqueSelector();
  }

  async generateEnhancedResponse(
    userId: string,
    userInput: string,
    sessionId?: string
  ): Promise<EnhancedAIResponse> {
    const startTime = Date.now();

    try {
      // 1. Load and update session context
      const sessionContext = await this.loadSessionContext(userId, sessionId);
      const contextualMemory = await this.loadContextualMemory(userId, sessionContext);

      // 2. Advanced emotional analysis
      const emotionalAnalysis = await this.emotionalIntelligence.analyzeAdvancedEmotionalState(
        userInput,
        contextualMemory.immediateContext.lastFewMessages,
        {
          historicalEmotions: contextualMemory.immediateContext.emotionalTrajectory,
          contextualFactors: [],
          userPersonality: {
            traits: contextualMemory.longTermMemory.therapeuticRelationship.preferences,
            communicationStyle: contextualMemory.longTermMemory.therapeuticRelationship.communication,
            responsePreferences: contextualMemory.longTermMemory.therapeuticRelationship.preferences,
            avoidancePatterns: []
          },
          environmentalFactors: {
            timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
            dayOfWeek: new Date().toLocaleDateString('en', { weekday: 'long' }),
            seasonalContext: this.getSeasonalContext(),
            recentEvents: []
          }
        }
      );

      // 3. Crisis detection and risk assessment
      const crisisLevel = this.crisisDetection.assessCrisisLevel(userInput);
      const crisisIndicators = {
        level: crisisLevel,
        responseLevel: this.crisisDetection.getResponseLevel(crisisLevel)
      };

      const riskAssessment = {
        overallRisk: crisisLevel === 'HIGH' ? 'critical' : crisisLevel === 'MEDIUM' ? 'high' : crisisLevel === 'LOW' ? 'moderate' : 'minimal',
        immediateDanger: crisisLevel === 'HIGH',
        interventionPlan: {
          immediate: crisisLevel === 'HIGH' ? ['Crisis intervention', 'Emergency services'] : [],
          professionalReferral: crisisLevel !== 'NONE',
          emergencyServices: crisisLevel === 'HIGH'
        },
        contextualFactors: {
          recentLosses: []
        }
      };

      // 4. Determine response strategy
      const responseStrategy = await this.determineResponseStrategy(
        emotionalAnalysis,
        riskAssessment,
        sessionContext,
        contextualMemory
      );

      // 5. Select therapeutic technique if needed
      const techniqueRecommendation = await this.selectTherapeuticTechnique(
        emotionalAnalysis,
        responseStrategy,
        contextualMemory,
        sessionContext
      );

      // 6. Generate personalized validation
      const personalizedValidation = await this.emotionalIntelligence.generatePersonalizedValidation(
        {
          primaryEmotion: emotionalAnalysis.primaryEmotion,
          intensity: emotionalAnalysis.intensity,
          secondaryEmotions: emotionalAnalysis.secondaryEmotions,
          triggers: [], // Extract from analysis
          somaticSymptoms: [],
          cognitivePatterns: []
        },
        contextualMemory.longTermMemory.therapeuticRelationship
      );

      // 7. Generate main therapeutic response
      const therapeuticResponse = await this.generateMainTherapeuticResponse(
        userInput,
        emotionalAnalysis,
        riskAssessment,
        responseStrategy,
        techniqueRecommendation,
        personalizedValidation,
        contextualMemory,
        sessionContext
      );

      // 8. Update session progress and memory
      await this.updateSessionProgress(sessionContext, emotionalAnalysis, techniqueRecommendation);
      await this.updateContextualMemory(contextualMemory, userInput, therapeuticResponse, emotionalAnalysis);

      // 9. Generate follow-up plan
      const followUpPlan = await this.generateFollowUpPlan(
        emotionalAnalysis,
        riskAssessment,
        sessionContext,
        contextualMemory
      );

      // 10. Assess response quality and confidence
      const responseQuality = await this.assessResponseQuality(
        therapeuticResponse,
        emotionalAnalysis,
        responseStrategy,
        contextualMemory
      );

      return {
        response: therapeuticResponse,
        sessionId: sessionContext.sessionId,
        emotionalAssessment: {
          primaryEmotion: emotionalAnalysis.primaryEmotion,
          intensity: emotionalAnalysis.intensity,
          secondaryEmotions: emotionalAnalysis.secondaryEmotions,
          triggers: [],
          somaticSymptoms: [],
          cognitivePatterns: [],
          progressIndicator: this.assessEmotionalProgress(contextualMemory),
          contextualNotes: `Confidence: ${emotionalAnalysis.confidence}, Complexity: ${emotionalAnalysis.emotionalComplexity}`
        },
        therapeuticIntervention: {
          type: (techniqueRecommendation?.primary?.type === 'psychodynamic' || techniqueRecommendation?.primary?.type === 'humanistic' || techniqueRecommendation?.primary?.type === 'trauma' || techniqueRecommendation?.primary?.type === 'solution-focused') ? 'cbt' : (techniqueRecommendation?.primary?.type || 'validation'),
          technique: techniqueRecommendation?.primary?.name || 'Active listening',
          rationale: techniqueRecommendation?.rationale || 'Providing supportive presence',
          effectiveness: techniqueRecommendation?.primary?.effectiveness?.successRate || 0.7,
          personalization: techniqueRecommendation?.personalization,
          nextSteps: followUpPlan.immediateActions
        },
        crisisLevel: {
          level: riskAssessment.overallRisk === 'critical' ? 'critical' :
                 riskAssessment.overallRisk === 'high' ? 'high' :
                 riskAssessment.overallRisk === 'moderate' ? 'moderate' :
                 riskAssessment.overallRisk === 'low' ? 'low' : 'none',
          riskFactors: riskAssessment.contextualFactors?.recentLosses || [],
          immediateActions: riskAssessment.interventionPlan?.immediate || [],
          professionalHelp: riskAssessment.interventionPlan?.professionalReferral || false,
          urgency: riskAssessment.overallRisk === 'critical' ? 'critical' : 'low'
        },
        sessionProgress: {
          stage: this.determineSessionStage(sessionContext, emotionalAnalysis),
          engagement: sessionContext.userEngagement,
          trustLevel: contextualMemory.longTermMemory.therapeuticRelationship.trustLevel,
          therapeuticAlliance: sessionContext.progress.therapeuticAlliance,
          sessionGoals: sessionContext.sessionGoals,
          insights: contextualMemory.sessionMemory.keyInsights,
          breakthroughs: contextualMemory.sessionMemory.breakthroughs
        },
        empathyResponse: {
          type: 'therapeutic',
          content: personalizedValidation.validation,
          tone: personalizedValidation.tone,
          validationLevel: 8
        },
        emotionalRegulationTechnique: techniqueRecommendation?.primary ? {
          name: techniqueRecommendation.primary.name,
          description: techniqueRecommendation.primary.description,
          steps: techniqueRecommendation.primary.steps,
          duration: techniqueRecommendation.primary.duration,
          effectiveness: techniqueRecommendation.primary.effectiveness.successRate,
          personalization: techniqueRecommendation.personalization
        } : undefined,
        crisisAssessment: riskAssessment.overallRisk !== 'minimal' ? {
          riskLevel: riskAssessment.overallRisk as 'low' | 'moderate' | 'high',
          immediateDanger: riskAssessment.immediateDanger,
          supportNeeded: riskAssessment.interventionPlan?.immediate || [],
          professionalReferral: riskAssessment.interventionPlan?.professionalReferral || false,
          emergencyContacts: riskAssessment.interventionPlan?.emergencyServices ? ['911', '988'] : [],
          historicalContext: contextualMemory.longTermMemory.crisisHistory.map(c => c.triggers.join(', ')).slice(0, 2)
        } : undefined,
        metadata: {
          processingTime: Date.now() - startTime,
          confidence: responseQuality.confidence,
          modelUsed: 'ultra-robust-jamie',
          contextSize: contextualMemory.immediateContext.lastFewMessages.length,
          memoryRetrieved: contextualMemory.longTermMemory.emotionalPatterns.length,
          emotionalComplexity: emotionalAnalysis.emotionalComplexity,
          therapeuticAlignment: responseQuality.therapeuticAlignment
        }
      };

    } catch (error) {
      console.error('Ultra Robust Jamie error:', error);
      return this.generateFallbackResponse(userInput, startTime);
    }
  }

  private async loadSessionContext(userId: string, sessionId?: string): Promise<SessionContext> {
    // Mock session context loading - in production, this would load from database
    return {
      sessionId: sessionId || `session_${Date.now()}`,
      userId,
      messageCount: 1,
      startTime: new Date(),
      lastInteraction: new Date(),
      sessionGoals: ['emotional support', 'skill building'],
      progress: {
        emotionalRegulation: 5,
        insight: 5,
        copingSkills: 5,
        therapeuticAlliance: 7
      },
      interventionsUsed: [],
      userEngagement: 7,
      riskLevel: 'low'
    };
  }

  private async loadContextualMemory(userId: string, sessionContext: SessionContext): Promise<ContextualMemory> {
    // Mock memory loading - in production, this would load from sophisticated memory system
    return {
      immediateContext: {
        lastFewMessages: [],
        emotionalTrajectory: [],
        interventionEffectiveness: []
      },
      sessionMemory: {
        keyInsights: [],
        breakthroughs: [],
        resistanceAreas: [],
        effectiveTechniques: []
      },
      longTermMemory: {
        therapeuticRelationship: {
          trustLevel: 7,
          communication: 'warm and direct',
          preferences: ['empathetic responses', 'practical techniques'],
          boundaries: ['no medical advice', 'crisis escalation when needed']
        },
        emotionalPatterns: [],
        progressHistory: [],
        crisisHistory: []
      }
    };
  }

  private async determineResponseStrategy(
    emotionalAnalysis: any,
    riskAssessment: any,
    sessionContext: SessionContext,
    contextualMemory: ContextualMemory
  ): Promise<ResponseStrategy> {
    if (riskAssessment.overallRisk === 'critical' || riskAssessment.overallRisk === 'high') {
      return {
        approach: 'crisis',
        tone: 'direct',
        length: 'detailed',
        focus: ['safety', 'support', 'resources'],
        techniques: ['crisis intervention', 'safety planning'],
        followUp: ['immediate safety check', 'professional referral']
      };
    }

    if (emotionalAnalysis.intensity >= 8) {
      return {
        approach: 'interventional',
        tone: 'gentle',
        length: 'moderate',
        focus: ['emotional regulation', 'immediate support'],
        techniques: ['grounding', 'breathing', 'validation'],
        followUp: ['technique practice', 'emotion check-in']
      };
    }

    if (sessionContext.messageCount <= 3) {
      return {
        approach: 'supportive',
        tone: 'warm',
        length: 'moderate',
        focus: ['rapport building', 'assessment', 'validation'],
        techniques: ['active listening', 'reflection'],
        followUp: ['explore further', 'assess needs']
      };
    }

    return {
      approach: 'exploratory',
      tone: 'encouraging',
      length: 'moderate',
      focus: ['insight', 'skill building', 'progress'],
      techniques: ['reflection', 'reframing', 'skill practice'],
      followUp: ['homework assignment', 'progress review']
    };
  }

  private async selectTherapeuticTechnique(
    emotionalAnalysis: any,
    responseStrategy: ResponseStrategy,
    contextualMemory: ContextualMemory,
    sessionContext: SessionContext
  ) {
    if (responseStrategy.approach === 'crisis' || emotionalAnalysis.intensity < 6) {
      return null;
    }

    return await this.techniqueSelector.selectOptimalTechnique(
      {
        primaryEmotion: emotionalAnalysis.primaryEmotion,
        intensity: emotionalAnalysis.intensity,
        secondaryEmotions: emotionalAnalysis.secondaryEmotions,
        triggers: [],
        somaticSymptoms: [],
        cognitivePatterns: []
      },
      {
        preferredModalities: contextualMemory.longTermMemory.therapeuticRelationship.preferences,
        previouslyEffective: contextualMemory.sessionMemory.effectiveTechniques,
        avoidedTechniques: [],
        learningStyle: 'mixed',
        attentionSpan: 'medium',
        cognitiveCapacity: 'moderate',
        motivationLevel: sessionContext.userEngagement,
        resistanceAreas: contextualMemory.sessionMemory.resistanceAreas,
        culturalBackground: 'general',
        accessibility: []
      },
      {
        timeAvailable: 15,
        environment: 'digital',
        resources: ['text', 'audio'],
        immediacy: emotionalAnalysis.intensity > 7 ? 'high' : 'medium'
      }
    );
  }

  private async generateMainTherapeuticResponse(
    userInput: string,
    emotionalAnalysis: any,
    riskAssessment: any,
    responseStrategy: ResponseStrategy,
    techniqueRecommendation: any,
    personalizedValidation: any,
    contextualMemory: ContextualMemory,
    sessionContext: SessionContext
  ): Promise<string> {
    const prompt = `
    As Jamie, an advanced AI therapist, generate a comprehensive therapeutic response:

    User Input: "${userInput}"

    Analysis Context:
    - Primary emotion: ${emotionalAnalysis.primaryEmotion} (intensity: ${emotionalAnalysis.intensity}/10)
    - Emotional complexity: ${emotionalAnalysis.emotionalComplexity}
    - Risk level: ${riskAssessment.overallRisk}
    - Response strategy: ${responseStrategy.approach} (${responseStrategy.tone} tone)

    Personalized Validation: ${personalizedValidation.validation}

    Session Context:
    - Message count: ${sessionContext.messageCount}
    - User engagement: ${sessionContext.userEngagement}/10
    - Trust level: ${contextualMemory.longTermMemory.therapeuticRelationship.trustLevel}/10
    - Previous insights: ${contextualMemory.sessionMemory.keyInsights.join(', ')}

    ${techniqueRecommendation ? `
    Recommended Technique: ${techniqueRecommendation.primary.name}
    Rationale: ${techniqueRecommendation.rationale}
    Implementation: ${techniqueRecommendation.implementation.guidance.join(', ')}
    ` : ''}

    Generate a response that:
    1. Incorporates the personalized validation naturally
    2. Addresses the emotional state with appropriate depth
    3. ${responseStrategy.approach === 'crisis' ? 'Prioritizes safety and provides crisis resources' : ''}
    4. ${techniqueRecommendation ? 'Introduces the therapeutic technique appropriately' : 'Provides supportive guidance'}
    5. Maintains the established therapeutic relationship
    6. Uses ${responseStrategy.tone} tone with ${responseStrategy.length} length
    7. Focuses on: ${responseStrategy.focus.join(', ')}
    8. Encourages ${responseStrategy.followUp.join(' and ')}

    Response Guidelines:
    - Be authentic and genuinely caring
    - Show understanding of emotional complexity
    - Provide hope without minimizing struggles
    - Offer concrete support while respecting autonomy
    - Maintain professional boundaries
    - Be culturally sensitive and inclusive

    Generate Jamie's therapeutic response:
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are Jamie, an advanced AI therapist with deep clinical training and empathetic understanding.' },
        { role: 'user', content: prompt }
      ]);

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Main response generation failed:', error);
      return this.generateFallbackTherapeuticResponse(emotionalAnalysis, personalizedValidation);
    }
  }

  private async updateSessionProgress(
    sessionContext: SessionContext,
    emotionalAnalysis: any,
    techniqueRecommendation: any
  ) {
    // Update session metrics based on interaction
    sessionContext.messageCount++;
    sessionContext.lastInteraction = new Date();
    
    if (techniqueRecommendation) {
      sessionContext.interventionsUsed.push(techniqueRecommendation.primary.name);
    }

    // Adjust engagement based on emotional openness
    if (emotionalAnalysis.intensity > 6) {
      sessionContext.userEngagement = Math.min(10, sessionContext.userEngagement + 1);
    }

    // Update progress metrics
    sessionContext.progress.therapeuticAlliance = Math.min(10, sessionContext.progress.therapeuticAlliance + 0.1);
  }

  private async updateContextualMemory(
    contextualMemory: ContextualMemory,
    userInput: string,
    response: string,
    emotionalAnalysis: any
  ) {
    // Update immediate context
    contextualMemory.immediateContext.lastFewMessages.push(userInput);
    if (contextualMemory.immediateContext.lastFewMessages.length > 5) {
      contextualMemory.immediateContext.lastFewMessages.shift();
    }

    contextualMemory.immediateContext.emotionalTrajectory.push({
      primaryEmotion: emotionalAnalysis.primaryEmotion,
      intensity: emotionalAnalysis.intensity,
      secondaryEmotions: emotionalAnalysis.secondaryEmotions,
      triggers: [],
      somaticSymptoms: [],
      cognitivePatterns: []
    });
  }

  private async generateFollowUpPlan(
    emotionalAnalysis: any,
    riskAssessment: any,
    sessionContext: SessionContext,
    contextualMemory: ContextualMemory
  ) {
    return {
      immediateActions: ['Practice the suggested technique', 'Monitor emotional state'],
      nextSession: ['Review technique effectiveness', 'Explore progress'],
      longTerm: ['Build coping skill toolkit', 'Track emotional patterns']
    };
  }

  private async assessResponseQuality(
    response: string,
    emotionalAnalysis: any,
    responseStrategy: ResponseStrategy,
    contextualMemory: ContextualMemory
  ) {
    // Simple quality assessment - in production, this would be more sophisticated
    const confidence = Math.min(0.95, 
      0.3 + (emotionalAnalysis.confidence * 0.4) + 
      (contextualMemory.longTermMemory.therapeuticRelationship.trustLevel / 10 * 0.3)
    );

    return {
      confidence,
      therapeuticAlignment: 8.5,
      culturalSensitivity: 8.0,
      ethicalCompliance: 9.0
    };
  }

  private determineSessionStage(sessionContext: SessionContext, emotionalAnalysis: any): 'introduction' | 'assessment' | 'intervention' | 'closure' {
    if (sessionContext.messageCount <= 2) return 'introduction';
    if (emotionalAnalysis.intensity > 7) return 'intervention';
    if (sessionContext.messageCount > 10) return 'closure';
    return 'assessment';
  }

  private assessEmotionalProgress(contextualMemory: ContextualMemory): 'improving' | 'stable' | 'regressing' {
    const trajectory = contextualMemory.immediateContext.emotionalTrajectory;
    if (trajectory.length < 2) return 'stable';
    
    const recent = trajectory.slice(-2);
    if (recent[1].intensity < recent[0].intensity) return 'improving';
    if (recent[1].intensity > recent[0].intensity) return 'regressing';
    return 'stable';
  }

  private getSeasonalContext(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  private generateFallbackTherapeuticResponse(emotionalAnalysis: any, personalizedValidation: any): string {
    return `${personalizedValidation.validation} I can sense that you're experiencing ${emotionalAnalysis.primaryEmotion} with significant intensity right now. That takes courage to share, and I want you to know that your feelings are completely valid. Let's work together to understand what you're going through and find ways to support you. What feels most important for us to focus on right now?`;
  }

  private generateFallbackResponse(userInput: string, startTime: number): EnhancedAIResponse {
    return {
      response: "I understand you're reaching out, and I'm here to support you. Could you share a bit more about what you're experiencing right now?",
      sessionId: `fallback_${Date.now()}`,
      emotionalAssessment: {
        primaryEmotion: 'uncertain',
        intensity: 5,
        secondaryEmotions: [],
        triggers: [],
        somaticSymptoms: [],
        cognitivePatterns: [],
        progressIndicator: 'stable'
      },
      therapeuticIntervention: {
        type: 'validation',
        technique: 'Active listening',
        rationale: 'Providing supportive presence',
        effectiveness: 0.7
      },
      crisisLevel: {
        level: 'none',
        riskFactors: [],
        immediateActions: [],
        professionalHelp: false
      },
      sessionProgress: {
        stage: 'assessment',
        engagement: 5,
        trustLevel: 5,
        therapeuticAlliance: 5
      },
      empathyResponse: {
        type: 'therapeutic',
        content: 'I understand and I\'m here to help',
        tone: 'warm',
        validationLevel: 7
      },
      metadata: {
        processingTime: Date.now() - startTime,
        confidence: 0.3,
        modelUsed: 'fallback-jamie',
        therapeuticAlignment: 7
      }
    };
  }
}