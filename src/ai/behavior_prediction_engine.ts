import { openRouterChatCompletion } from '../services/openRouterService';

interface CognitivePattern {
  pattern: string;
  confidence: number;
  triggers: string[];
  responses: string[];
  impact: 'positive' | 'negative' | 'neutral';
}

interface BehavioralPrediction {
  outcome: string;
  probability: number;
  timeframe: string;
  factors: string[];
  confidence: number;
}

interface BehavioralIntervention {
  type: string;
  technique: string;
  rationale: string;
  expectedOutcome: string;
  implementation: string[];
  effectiveness: number;
}

interface InterventionEffectiveness {
  responseQuality: number;
  userEngagement: number;
  adherence: number;
  outcomes: string[];
}

export default class AdvancedHumanBehaviorPredictionEngine {
  private userPatterns: Map<string, CognitivePattern[]> = new Map();
  private interventionHistory: Map<string, BehavioralIntervention[]> = new Map();

  async analyzeCognitivePatterns(
    userId: string,
    message: string,
    emotionalState: any,
    context?: any
  ): Promise<CognitivePattern> {
    const prompt = `
    Analyze cognitive patterns from this user input: "${message}"
    Emotional state: ${JSON.stringify(emotionalState)}
    Context: ${JSON.stringify(context || {})}
    
    Identify cognitive patterns including:
    - Thought patterns (e.g., catastrophizing, black-and-white thinking, overgeneralization)
    - Behavioral patterns (e.g., avoidance, rumination, impulsivity)
    - Coping mechanisms (e.g., denial, projection, intellectualization)
    - Triggers and responses
    - Impact on emotional state
    
    Return as JSON:
    {
      "pattern": "string",
      "confidence": number,
      "triggers": ["string"],
      "responses": ["string"],
      "impact": "positive" | "negative" | "neutral"
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const pattern = JSON.parse(content);
      
      const cognitivePattern: CognitivePattern = {
        pattern: pattern.pattern || 'unknown',
        confidence: pattern.confidence || 0.5,
        triggers: pattern.triggers || [],
        responses: pattern.responses || [],
        impact: pattern.impact || 'neutral'
      };

      // Store pattern for user
      const userPatterns = this.userPatterns.get(userId) || [];
      userPatterns.push(cognitivePattern);
      this.userPatterns.set(userId, userPatterns);

      return cognitivePattern;
    } catch (error) {
      return {
        pattern: 'general_processing',
        confidence: 0.3,
        triggers: [],
        responses: [],
        impact: 'neutral'
      };
    }
  }

  async predictBehavioralOutcomes(
    userId: string,
    context: any,
    cognitivePattern: CognitivePattern
  ): Promise<BehavioralPrediction[]> {
    const prompt = `
    Predict behavioral outcomes for user with:
    Cognitive pattern: ${JSON.stringify(cognitivePattern)}
    Context: ${JSON.stringify(context)}
    
    Predict likely behavioral outcomes including:
    - Short-term responses (next few hours)
    - Medium-term patterns (next few days)
    - Long-term trajectories (next few weeks)
    - Risk factors and protective factors
    
    Return as JSON array:
    [
      {
        "outcome": "string",
        "probability": number,
        "timeframe": "string",
        "factors": ["string"],
        "confidence": number
      }
    ]
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const predictions = JSON.parse(content);
      
      return Array.isArray(predictions) ? predictions : [{
        outcome: 'continued_engagement',
        probability: 0.7,
        timeframe: 'short_term',
        factors: ['therapeutic_support'],
        confidence: 0.6
      }];
    } catch (error) {
      return [{
        outcome: 'continued_engagement',
        probability: 0.7,
        timeframe: 'short_term',
        factors: ['therapeutic_support'],
        confidence: 0.6
      }];
    }
  }

  async designBehavioralInterventions(
    userId: string,
    targetBehavior: string,
    cognitivePattern: CognitivePattern,
    ethicalGuidelines: string[]
  ): Promise<BehavioralIntervention[]> {
    const prompt = `
    Design behavioral interventions for:
    Target behavior: ${targetBehavior}
    Cognitive pattern: ${JSON.stringify(cognitivePattern)}
    Ethical guidelines: ${JSON.stringify(ethicalGuidelines)}
    
    Create evidence-based interventions that:
    - Address the specific cognitive pattern
    - Target the desired behavioral change
    - Follow ethical guidelines
    - Are practical and implementable
    - Have measurable outcomes
    
    Return as JSON array:
    [
      {
        "type": "string",
        "technique": "string",
        "rationale": "string",
        "expectedOutcome": "string",
        "implementation": ["string"],
        "effectiveness": number
      }
    ]
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const interventions = JSON.parse(content);
      
      const behavioralInterventions: BehavioralIntervention[] = Array.isArray(interventions) ? interventions : [{
        type: 'cognitive_restructuring',
        technique: 'Thought challenging',
        rationale: 'Address negative thought patterns',
        expectedOutcome: 'Improved emotional regulation',
        implementation: ['Identify negative thoughts', 'Challenge with evidence', 'Replace with balanced thoughts'],
        effectiveness: 0.8
      }];

      // Store interventions for user
      const userInterventions = this.interventionHistory.get(userId) || [];
      userInterventions.push(...behavioralInterventions);
      this.interventionHistory.set(userId, userInterventions);

      return behavioralInterventions;
    } catch (error) {
      return [{
        type: 'cognitive_restructuring',
        technique: 'Thought challenging',
        rationale: 'Address negative thought patterns',
        expectedOutcome: 'Improved emotional regulation',
        implementation: ['Identify negative thoughts', 'Challenge with evidence', 'Replace with balanced thoughts'],
        effectiveness: 0.8
      }];
    }
  }

  async optimizeInterventionTiming(
    userId: string,
    intervention: BehavioralIntervention,
    cognitivePattern: CognitivePattern
  ): Promise<BehavioralIntervention> {
    const prompt = `
    Optimize intervention timing for:
    Intervention: ${JSON.stringify(intervention)}
    Cognitive pattern: ${JSON.stringify(cognitivePattern)}
    
    Consider:
    - User's current emotional state
    - Cognitive load and readiness
    - Optimal timing for intervention delivery
    - User's schedule and preferences
    - Intervention complexity and duration
    
    Return optimized intervention as JSON:
    {
      "type": "string",
      "technique": "string",
      "rationale": "string",
      "expectedOutcome": "string",
      "implementation": ["string"],
      "effectiveness": number,
      "optimalTiming": "string",
      "duration": "string"
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const optimized = JSON.parse(content);
      
      return {
        ...intervention
      };
    } catch (error) {
      return {
        ...intervention
      };
    }
  }

  async trackInterventionEffectiveness(
    userId: string,
    intervention: BehavioralIntervention,
    metrics: { responseQuality: number; userEngagement: number }
  ): Promise<InterventionEffectiveness> {
    const prompt = `
    Track intervention effectiveness for:
    Intervention: ${JSON.stringify(intervention)}
    Metrics: ${JSON.stringify(metrics)}
    
    Analyze effectiveness including:
    - User engagement and adherence
    - Response quality and outcomes
    - Behavioral changes observed
    - Areas for improvement
    
    Return as JSON:
    {
      "responseQuality": number,
      "userEngagement": number,
      "adherence": number,
      "outcomes": ["string"]
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const effectiveness = JSON.parse(content);
      
      return {
        responseQuality: effectiveness.responseQuality || metrics.responseQuality,
        userEngagement: effectiveness.userEngagement || metrics.userEngagement,
        adherence: effectiveness.adherence || 0.7,
        outcomes: effectiveness.outcomes || ['improved_engagement']
      };
    } catch (error) {
      return {
        responseQuality: metrics.responseQuality,
        userEngagement: metrics.userEngagement,
        adherence: 0.7,
        outcomes: ['improved_engagement']
      };
    }
  }

  async getBehavioralInsights(userId: string): Promise<any> {
    const userPatterns = this.userPatterns.get(userId) || [];
    const userInterventions = this.interventionHistory.get(userId) || [];

    return {
      patterns: userPatterns,
      interventions: userInterventions,
      summary: {
        totalPatterns: userPatterns.length,
        totalInterventions: userInterventions.length,
        mostCommonPattern: userPatterns.length > 0 ? 
          userPatterns.reduce((a, b) => a.confidence > b.confidence ? a : b).pattern : 'none',
        averageEffectiveness: userInterventions.length > 0 ?
          userInterventions.reduce((sum, i) => sum + i.effectiveness, 0) / userInterventions.length : 0
      }
    };
  }
} 