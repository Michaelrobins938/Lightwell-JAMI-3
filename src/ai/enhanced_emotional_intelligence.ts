import { openRouterChatCompletion } from '../services/openRouterService';
import { EmotionalState, AdvancedSentimentAnalysis, ContextualFactor, TherapeuticImplication } from '../types/ai';

interface EmotionalContext {
  historicalEmotions: EmotionalState[];
  contextualFactors: ContextualFactor[];
  userPersonality: {
    traits: string[];
    communicationStyle: string;
    responsePreferences: string[];
    avoidancePatterns: string[];
  };
  environmentalFactors: {
    timeOfDay: string;
    dayOfWeek: string;
    seasonalContext: string;
    recentEvents: string[];
  };
}

interface EmotionalPattern {
  pattern: string;
  frequency: number;
  triggers: string[];
  intensity: number;
  progression: 'improving' | 'stable' | 'worsening';
  interventionsUsed: string[];
  effectiveness: number;
}

export class EnhancedEmotionalIntelligence {
  private readonly emotionalVocabulary = {
    primary: ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'trust', 'anticipation'],
    complex: [
      'melancholy', 'euphoria', 'rage', 'terror', 'bewilderment', 'contempt', 
      'admiration', 'vigilance', 'serenity', 'pensiveness', 'annoyance', 'apprehension',
      'distraction', 'boredom', 'acceptance', 'interest', 'ecstasy', 'grief',
      'loathing', 'amazement'
    ],
    therapeutic: [
      'overwhelmed', 'validated', 'supported', 'understood', 'isolated', 'hopeful',
      'resilient', 'vulnerable', 'empowered', 'stuck', 'breakthrough', 'processing'
    ]
  };

  async analyzeAdvancedEmotionalState(
    userInput: string,
    conversationHistory: string[],
    userContext: EmotionalContext
  ): Promise<AdvancedSentimentAnalysis> {
    const prompt = `
    As an advanced emotional intelligence system, analyze this user input with sophisticated psychological understanding:

    Current Input: "${userInput}"
    
    Conversation History: ${conversationHistory.slice(-5).join(' | ')}
    
    User Context:
    - Historical emotional patterns: ${userContext.historicalEmotions.map(e => `${e.primaryEmotion}(${e.intensity})`).join(', ')}
    - Personality traits: ${userContext.userPersonality.traits.join(', ')}
    - Communication style: ${userContext.userPersonality.communicationStyle}
    - Recent contextual factors: ${userContext.contextualFactors.map(f => f.factor).join(', ')}
    
    Provide comprehensive emotional analysis including:
    
    1. PRIMARY & SECONDARY EMOTIONS with intensity (1-10)
    2. EMOTIONAL COMPLEXITY assessment (how many emotions are present)
    3. VALENCE (positive/negative/neutral/mixed) and AROUSAL (low/medium/high)
    4. SENTIMENT SHIFTS within the message
    5. CONTEXTUAL FACTORS affecting emotional state
    6. THERAPEUTIC IMPLICATIONS and recommended interventions
    7. CONFIDENCE in this assessment
    
    Return as structured JSON:
    {
      "primaryEmotion": "string",
      "secondaryEmotions": ["string"],
      "intensity": number,
      "valence": "positive|negative|neutral|mixed",
      "arousal": "low|medium|high",
      "dominance": "low|medium|high",
      "confidence": number,
      "emotionalComplexity": number,
      "sentimentShifts": [{"from": "string", "to": "string", "trigger": "string", "intensity": number}],
      "contextualFactors": [{"factor": "string", "impact": "positive|negative|neutral", "confidence": number}],
      "therapeuticImplications": [{"implication": "string", "priority": "high|medium|low", "intervention": "string", "rationale": "string"}]
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are an advanced emotional intelligence analyzer with deep psychological training.' },
        { role: 'user', content: prompt }
      ]);

      const content = response.choices[0].message.content;
      let analysis;
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        analysis = JSON.parse(jsonStr);
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON, using fallback:', parseError);
        return this.getFallbackAnalysis(userInput);
      }
      
      return {
        primaryEmotion: analysis.primaryEmotion || 'uncertain',
        secondaryEmotions: analysis.secondaryEmotions || [],
        intensity: analysis.intensity || 5,
        valence: analysis.valence || 'neutral',
        arousal: analysis.arousal || 'medium',
        dominance: analysis.dominance || 'medium',
        confidence: analysis.confidence || 0.6,
        emotionalComplexity: analysis.emotionalComplexity || 1,
        sentimentShifts: analysis.sentimentShifts || [],
        contextualFactors: analysis.contextualFactors || [],
        therapeuticImplications: analysis.therapeuticImplications || []
      };
    } catch (error) {
      console.error('Advanced emotional analysis failed:', error);
      return this.getFallbackAnalysis(userInput);
    }
  }

  async detectEmotionalPatterns(
    userHistory: EmotionalState[],
    timeframe: 'week' | 'month' | 'quarter' = 'month'
  ): Promise<EmotionalPattern[]> {
    if (userHistory.length < 5) {
      return [];
    }

    const prompt = `
    Analyze these emotional states to identify patterns:
    ${userHistory.map((state, i) => `${i}: ${state.primaryEmotion}(${state.intensity}) - ${state.triggers.join(', ')}`).join('\n')}
    
    Identify:
    1. Recurring emotional patterns
    2. Common triggers and their frequency
    3. Intensity trends over time
    4. Effectiveness of interventions used
    5. Progress indicators (improving/stable/worsening)
    
    Return as JSON array:
    [
      {
        "pattern": "string description",
        "frequency": number,
        "triggers": ["string"],
        "intensity": number,
        "progression": "improving|stable|worsening",
        "interventionsUsed": ["string"],
        "effectiveness": number
      }
    ]
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a pattern recognition specialist in emotional psychology.' },
        { role: 'user', content: prompt }
      ]);

      const content = response.choices[0].message.content;
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/) || content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        return JSON.parse(jsonStr) || [];
      } catch (error) {
        console.warn('Failed to parse pattern analysis response:', error);
        return [];
      }
    } catch (error) {
      console.error('Pattern detection failed:', error);
      return [];
    }
  }

  async predictEmotionalTrajectory(
    currentState: EmotionalState,
    patterns: EmotionalPattern[],
    contextualFactors: ContextualFactor[]
  ): Promise<{
    nextLikelyEmotion: string;
    intensity: number;
    confidence: number;
    timeframe: string;
    interventionOpportunities: string[];
  }> {
    const prompt = `
    Based on current emotional state and historical patterns, predict emotional trajectory:
    
    Current State: ${currentState.primaryEmotion} (intensity: ${currentState.intensity})
    Recent Triggers: ${currentState.triggers.join(', ')}
    
    Historical Patterns:
    ${patterns.map(p => `- ${p.pattern} (frequency: ${p.frequency}, trend: ${p.progression})`).join('\n')}
    
    Contextual Factors:
    ${contextualFactors.map(f => `- ${f.factor} (${f.impact} impact)`).join('\n')}
    
    Predict:
    1. Most likely next emotional state
    2. Expected intensity level
    3. Confidence in prediction
    4. Timeframe for change
    5. Intervention opportunities to improve trajectory
    
    Return as JSON:
    {
      "nextLikelyEmotion": "string",
      "intensity": number,
      "confidence": number,
      "timeframe": "string",
      "interventionOpportunities": ["string"]
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a predictive emotional analytics specialist.' },
        { role: 'user', content: prompt }
      ]);

      const content = response.choices[0].message.content;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        return JSON.parse(jsonStr);
      } catch (error) {
        console.warn('Failed to parse AI response as JSON, using fallback:', error);
        return {
          nextLikelyEmotion: currentState.primaryEmotion,
          intensity: currentState.intensity,
          confidence: 0.3,
          timeframe: 'unknown',
          interventionOpportunities: []
        };
      }
    } catch (error) {
      console.error('Trajectory prediction failed:', error);
      return {
        nextLikelyEmotion: currentState.primaryEmotion,
        intensity: currentState.intensity,
        confidence: 0.3,
        timeframe: 'unknown',
        interventionOpportunities: []
      };
    }
  }

  async generatePersonalizedValidation(
    emotionalState: EmotionalState,
    userPersonality: any,
    culturalContext?: string
  ): Promise<{
    validation: string;
    tone: string;
    culturalSensitivity: string;
    personalizedElements: string[];
  }> {
    const prompt = `
    Generate a deeply personalized validation response for:
    
    Emotional State: ${emotionalState.primaryEmotion} (intensity: ${emotionalState.intensity})
    Secondary Emotions: ${emotionalState.secondaryEmotions.join(', ')}
    Triggers: ${emotionalState.triggers.join(', ')}
    
    User Personality:
    - Traits: ${userPersonality.traits?.join(', ') || 'unknown'}
    - Communication Style: ${userPersonality.communicationStyle || 'unknown'}
    - Response Preferences: ${userPersonality.responsePreferences?.join(', ') || 'unknown'}
    
    Cultural Context: ${culturalContext || 'general'}
    
    Create validation that:
    1. Acknowledges the specific emotional experience
    2. Validates the complexity of their feelings
    3. Uses language that resonates with their communication style
    4. Shows understanding of their triggers
    5. Is culturally sensitive and appropriate
    
    Return as JSON:
    {
      "validation": "string",
      "tone": "string",
      "culturalSensitivity": "string",
      "personalizedElements": ["string"]
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are an expert in personalized therapeutic validation with cultural competency.' },
        { role: 'user', content: prompt }
      ]);

      const content = response.choices[0].message.content;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        return JSON.parse(jsonStr);
      } catch (error) {
        console.warn('Failed to parse AI response as JSON, using fallback:', error);
        return {
          validation: "I understand that you're experiencing difficult emotions right now, and that's completely valid.",
          tone: 'supportive',
          culturalSensitivity: 'universal approach',
          personalizedElements: ['emotional validation', 'supportive tone']
        };
      }
    } catch (error) {
      console.error('Personalized validation failed:', error);
      return {
        validation: "I understand that you're experiencing difficult emotions right now, and that's completely valid.",
        tone: "warm and supportive",
        culturalSensitivity: "general approach",
        personalizedElements: []
      };
    }
  }

  private getFallbackAnalysis(userInput: string): AdvancedSentimentAnalysis {
    // Basic keyword-based fallback analysis
    const anxietyKeywords = ['anxious', 'worried', 'nervous', 'panic', 'stress'];
    const depressionKeywords = ['sad', 'depressed', 'hopeless', 'empty', 'down'];
    const angerKeywords = ['angry', 'frustrated', 'mad', 'irritated', 'furious'];
    
    const input = userInput.toLowerCase();
    let primaryEmotion = 'uncertain';
    let intensity = 5;
    
    if (anxietyKeywords.some(word => input.includes(word))) {
      primaryEmotion = 'anxiety';
      intensity = 6;
    } else if (depressionKeywords.some(word => input.includes(word))) {
      primaryEmotion = 'sadness';
      intensity = 6;
    } else if (angerKeywords.some(word => input.includes(word))) {
      primaryEmotion = 'anger';
      intensity = 6;
    }

    return {
      primaryEmotion,
      secondaryEmotions: [],
      intensity,
      valence: 'negative',
      arousal: 'medium',
      dominance: 'medium',
      confidence: 0.4,
      emotionalComplexity: 1,
      sentimentShifts: [],
      contextualFactors: [],
      therapeuticImplications: []
    };
  }

  async assessEmotionalRegulationNeeds(
    currentState: EmotionalState,
    userCapabilities: string[],
    environmentalConstraints: string[]
  ): Promise<{
    regulationNeeded: boolean;
    urgency: 'low' | 'medium' | 'high';
    recommendedTechniques: string[];
    adaptations: string[];
    estimatedEffectiveness: number;
  }> {
    if (currentState.intensity < 6) {
      return {
        regulationNeeded: false,
        urgency: 'low',
        recommendedTechniques: [],
        adaptations: [],
        estimatedEffectiveness: 0
      };
    }

    const prompt = `
    Assess emotional regulation needs for:
    
    Current State: ${currentState.primaryEmotion} (intensity: ${currentState.intensity})
    User Capabilities: ${userCapabilities.join(', ')}
    Environmental Constraints: ${environmentalConstraints.join(', ')}
    
    Determine:
    1. Whether regulation is needed
    2. Urgency level
    3. Most suitable techniques for this user
    4. Necessary adaptations for constraints
    5. Estimated effectiveness
    
    Return as JSON:
    {
      "regulationNeeded": boolean,
      "urgency": "low|medium|high",
      "recommendedTechniques": ["string"],
      "adaptations": ["string"],
      "estimatedEffectiveness": number
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are an emotional regulation specialist.' },
        { role: 'user', content: prompt }
      ]);

      const content = response.choices[0].message.content;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        return JSON.parse(jsonStr);
      } catch (error) {
        console.warn('Failed to parse AI response as JSON, using fallback:', error);
        return {
          regulationNeeded: true,
          urgency: 'medium' as const,
          recommendedTechniques: ['deep breathing', 'mindfulness'],
          adaptations: ['simplified techniques'],
          estimatedEffectiveness: 0.6
        };
      }
    } catch (error) {
      return {
        regulationNeeded: true,
        urgency: currentState.intensity > 8 ? 'high' : 'medium',
        recommendedTechniques: ['deep breathing', 'grounding'],
        adaptations: [],
        estimatedEffectiveness: 6
      };
    }
  }
}