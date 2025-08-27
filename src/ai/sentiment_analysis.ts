import { openRouterChatCompletion } from '../services/openRouterService';

export interface AdvancedSentimentAnalysis {
  primaryEmotion: string;
  secondaryEmotions: string[];
  intensity: number;
  valence: 'positive' | 'negative' | 'neutral' | 'mixed';
  arousal: 'low' | 'medium' | 'high';
  dominance: 'low' | 'medium' | 'high';
  confidence: number;
  emotionalComplexity: number;
  sentimentShifts: SentimentShift[];
  contextualFactors: ContextualFactor[];
  therapeuticImplications: TherapeuticImplication[];
}

export interface SentimentShift {
  from: string;
  to: string;
  trigger: string;
  intensity: number;
}

export interface ContextualFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export interface TherapeuticImplication {
  implication: string;
  priority: 'high' | 'medium' | 'low';
  intervention: string;
  rationale: string;
}

export class AdvancedSentimentAnalyzer {
  private emotionLexicon: Map<string, { valence: number; arousal: number; dominance: number }>;
  private therapeuticPatterns: Map<string, string[]>;

  constructor() {
    this.emotionLexicon = this.initializeEmotionLexicon();
    this.therapeuticPatterns = this.initializeTherapeuticPatterns();
  }

  async analyzeSentiment(text: string, context?: any): Promise<AdvancedSentimentAnalysis> {
    const prompt = `
    Perform advanced sentiment analysis on this text: "${text}"
    
    ${context ? `Context: ${JSON.stringify(context)}` : ''}
    
    Analyze for:
    1. Primary and secondary emotions with confidence scores
    2. Emotional intensity (1-10 scale)
    3. Valence (positive/negative/neutral/mixed)
    4. Arousal level (low/medium/high)
    5. Dominance level (low/medium/high)
    6. Emotional complexity (number of distinct emotions)
    7. Sentiment shifts within the text
    8. Contextual factors affecting emotion
    9. Therapeutic implications
    
    Return as JSON:
    {
      "primaryEmotion": "string",
      "secondaryEmotions": ["string"],
      "intensity": number,
      "valence": "positive|negative|neutral|mixed",
      "arousal": "low|medium|high",
      "dominance": "low|medium|high",
      "confidence": number,
      "emotionalComplexity": number,
      "sentimentShifts": [
        {
          "from": "string",
          "to": "string",
          "trigger": "string",
          "intensity": number
        }
      ],
      "contextualFactors": [
        {
          "factor": "string",
          "impact": "positive|negative|neutral",
          "confidence": number
        }
      ],
      "therapeuticImplications": [
        {
          "implication": "string",
          "priority": "high|medium|low",
          "intervention": "string",
          "rationale": "string"
        }
      ]
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const analysis = JSON.parse(content);
      
      return {
        primaryEmotion: analysis.primaryEmotion || 'unknown',
        secondaryEmotions: analysis.secondaryEmotions || [],
        intensity: analysis.intensity || 5,
        valence: analysis.valence || 'neutral',
        arousal: analysis.arousal || 'medium',
        dominance: analysis.dominance || 'medium',
        confidence: analysis.confidence || 0.5,
        emotionalComplexity: analysis.emotionalComplexity || 1,
        sentimentShifts: analysis.sentimentShifts || [],
        contextualFactors: analysis.contextualFactors || [],
        therapeuticImplications: analysis.therapeuticImplications || []
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return this.getFallbackAnalysis();
    }
  }

  async detectEmotionalPatterns(conversationHistory: string[]): Promise<{
    patterns: string[];
    triggers: string[];
    copingStrategies: string[];
    progressIndicators: string[];
  }> {
    const prompt = `
    Analyze this conversation history for emotional patterns:
    ${conversationHistory.join('\n')}
    
    Identify:
    1. Recurring emotional patterns
    2. Common triggers
    3. Effective coping strategies mentioned
    4. Progress indicators
    
    Return as JSON:
    {
      "patterns": ["string"],
      "triggers": ["string"],
      "copingStrategies": ["string"],
      "progressIndicators": ["string"]
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      return JSON.parse(content);
    } catch (error) {
      return {
        patterns: [],
        triggers: [],
        copingStrategies: [],
        progressIndicators: []
      };
    }
  }

  async assessEmotionalRegulation(text: string): Promise<{
    regulationLevel: 'poor' | 'fair' | 'good' | 'excellent';
    strategies: string[];
    challenges: string[];
    recommendations: string[];
  }> {
    const prompt = `
    Assess emotional regulation in this text: "${text}"
    
    Evaluate:
    1. Regulation level (poor/fair/good/excellent)
    2. Regulation strategies used
    3. Regulation challenges
    4. Recommendations for improvement
    
    Return as JSON:
    {
      "regulationLevel": "poor|fair|good|excellent",
      "strategies": ["string"],
      "challenges": ["string"],
      "recommendations": ["string"]
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      return JSON.parse(content);
    } catch (error) {
      return {
        regulationLevel: 'fair',
        strategies: [],
        challenges: [],
        recommendations: []
      };
    }
  }

  async detectCrisisSignals(text: string): Promise<{
    crisisLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
    signals: string[];
    riskFactors: string[];
    immediateActions: string[];
    professionalHelp: boolean;
  }> {
    const prompt = `
    Detect crisis signals in this text: "${text}"
    
    Look for:
    1. Suicidal ideation
    2. Self-harm mentions
    3. Hopelessness
    4. Isolation
    5. Substance abuse
    6. Violence towards self or others
    
    Return as JSON:
    {
      "crisisLevel": "none|low|moderate|high|critical",
      "signals": ["string"],
      "riskFactors": ["string"],
      "immediateActions": ["string"],
      "professionalHelp": boolean
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      return JSON.parse(content);
    } catch (error) {
      return {
        crisisLevel: 'none',
        signals: [],
        riskFactors: [],
        immediateActions: [],
        professionalHelp: false
      };
    }
  }

  private initializeEmotionLexicon(): Map<string, { valence: number; arousal: number; dominance: number }> {
    const lexicon = new Map();
    
    // Positive emotions
    lexicon.set('joy', { valence: 0.9, arousal: 0.7, dominance: 0.6 });
    lexicon.set('happiness', { valence: 0.8, arousal: 0.5, dominance: 0.6 });
    lexicon.set('contentment', { valence: 0.7, arousal: 0.3, dominance: 0.5 });
    lexicon.set('excitement', { valence: 0.8, arousal: 0.9, dominance: 0.7 });
    lexicon.set('gratitude', { valence: 0.8, arousal: 0.4, dominance: 0.5 });
    
    // Negative emotions
    lexicon.set('sadness', { valence: -0.7, arousal: -0.3, dominance: -0.4 });
    lexicon.set('anger', { valence: -0.6, arousal: 0.8, dominance: 0.3 });
    lexicon.set('fear', { valence: -0.8, arousal: 0.7, dominance: -0.6 });
    lexicon.set('anxiety', { valence: -0.5, arousal: 0.6, dominance: -0.4 });
    lexicon.set('depression', { valence: -0.8, arousal: -0.5, dominance: -0.7 });
    lexicon.set('hopelessness', { valence: -0.9, arousal: -0.6, dominance: -0.8 });
    
    // Neutral emotions
    lexicon.set('curiosity', { valence: 0.2, arousal: 0.4, dominance: 0.3 });
    lexicon.set('confusion', { valence: -0.1, arousal: 0.3, dominance: -0.2 });
    lexicon.set('surprise', { valence: 0.0, arousal: 0.8, dominance: 0.0 });
    
    return lexicon;
  }

  private initializeTherapeuticPatterns(): Map<string, string[]> {
    const patterns = new Map();
    
    patterns.set('cognitive_distortions', [
      'all-or-nothing thinking',
      'overgeneralization',
      'mental filter',
      'disqualifying the positive',
      'jumping to conclusions',
      'catastrophizing',
      'emotional reasoning',
      'should statements',
      'labeling',
      'personalization'
    ]);
    
    patterns.set('coping_mechanisms', [
      'avoidance',
      'rumination',
      'substance use',
      'self-harm',
      'social withdrawal',
      'emotional eating',
      'exercise',
      'meditation',
      'journaling',
      'social support'
    ]);
    
    patterns.set('therapeutic_progress', [
      'increased self-awareness',
      'improved emotional regulation',
      'better coping strategies',
      'reduced symptoms',
      'increased hope',
      'better relationships',
      'improved functioning'
    ]);
    
    return patterns;
  }

  private getFallbackAnalysis(): AdvancedSentimentAnalysis {
    return {
      primaryEmotion: 'uncertain',
      secondaryEmotions: [],
      intensity: 5,
      valence: 'neutral',
      arousal: 'medium',
      dominance: 'medium',
      confidence: 0.3,
      emotionalComplexity: 1,
      sentimentShifts: [],
      contextualFactors: [],
      therapeuticImplications: []
    };
  }
}

export default AdvancedSentimentAnalyzer;