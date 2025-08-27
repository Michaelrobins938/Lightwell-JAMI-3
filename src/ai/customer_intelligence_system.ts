import { openRouterChatCompletion } from '../services/openRouterService';

interface DemographicData {
  age?: number;
  gender?: string;
  location?: string;
  occupation?: string;
  education?: string;
  income?: string;
  familyStatus?: string;
}

interface BehavioralData {
  sessionFrequency: number;
  averageSessionDuration: number;
  preferredTopics: string[];
  engagementLevel: number;
  responseTime: number;
  crisisFrequency: number;
  therapeuticProgress: number;
}

interface EmotionalData {
  primaryEmotions: string[];
  emotionalTriggers: string[];
  copingMechanisms: string[];
  stressLevels: number[];
  moodTrends: string[];
}

interface CustomerProfile {
  userId: string;
  demographicData?: DemographicData;
  behavioralData: BehavioralData;
  emotionalData: EmotionalData;
  preferences: {
    communicationStyle: string;
    therapeuticApproach: string;
    interventionTypes: string[];
    privacyLevel: string;
  };
  riskFactors: string[];
  protectiveFactors: string[];
  goals: string[];
  progress: {
    overall: number;
    emotional: number;
    behavioral: number;
    social: number;
  };
}

interface CustomerInsight {
  type: 'behavioral' | 'emotional' | 'therapeutic' | 'risk' | 'opportunity';
  insight: string;
  confidence: number;
  actionable: boolean;
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface PersonalizationStrategy {
  approach: string;
  techniques: string[];
  adaptations: string[];
  expectedOutcome: string;
  monitoringMetrics: string[];
}

export default class CustomerIntelligenceSystem {
  private customerProfiles: Map<string, CustomerProfile> = new Map();
  private insightsHistory: Map<string, CustomerInsight[]> = new Map();

  async createCustomerProfile(
    userId: string,
    data: {
      demographicData?: DemographicData;
      behavioralData: BehavioralData;
      emotionalData: EmotionalData;
    }
  ): Promise<CustomerProfile> {
    const prompt = `
    Create comprehensive customer profile for user ${userId} with data:
    ${JSON.stringify(data)}
    
    Analyze and create profile including:
    - Demographics analysis
    - Behavioral patterns
    - Emotional patterns
    - Risk and protective factors
    - Therapeutic preferences
    - Progress tracking
    
    Return as JSON:
    {
      "userId": "string",
      "demographicData": {...},
      "behavioralData": {...},
      "emotionalData": {...},
      "preferences": {
        "communicationStyle": "string",
        "therapeuticApproach": "string",
        "interventionTypes": ["string"],
        "privacyLevel": "string"
      },
      "riskFactors": ["string"],
      "protectiveFactors": ["string"],
      "goals": ["string"],
      "progress": {
        "overall": number,
        "emotional": number,
        "behavioral": number,
        "social": number
      }
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const profile = JSON.parse(content);
      
      const customerProfile: CustomerProfile = {
        userId,
        demographicData: data.demographicData,
        behavioralData: data.behavioralData,
        emotionalData: data.emotionalData,
        preferences: profile.preferences || {
          communicationStyle: 'supportive',
          therapeuticApproach: 'cbt',
          interventionTypes: ['cbt', 'mindfulness'],
          privacyLevel: 'standard'
        },
        riskFactors: profile.riskFactors || [],
        protectiveFactors: profile.protectiveFactors || [],
        goals: profile.goals || ['improve_emotional_wellbeing'],
        progress: profile.progress || {
          overall: 0.5,
          emotional: 0.5,
          behavioral: 0.5,
          social: 0.5
        }
      };

      this.customerProfiles.set(userId, customerProfile);
      return customerProfile;
    } catch (error) {
      const customerProfile: CustomerProfile = {
        userId,
        demographicData: data.demographicData,
        behavioralData: data.behavioralData,
        emotionalData: data.emotionalData,
        preferences: {
          communicationStyle: 'supportive',
          therapeuticApproach: 'cbt',
          interventionTypes: ['cbt', 'mindfulness'],
          privacyLevel: 'standard'
        },
        riskFactors: [],
        protectiveFactors: [],
        goals: ['improve_emotional_wellbeing'],
        progress: {
          overall: 0.5,
          emotional: 0.5,
          behavioral: 0.5,
          social: 0.5
        }
      };

      this.customerProfiles.set(userId, customerProfile);
      return customerProfile;
    }
  }

  async analyzeCustomerBehavior(
    userId: string,
    sessionData: any,
    emotionalState: any
  ): Promise<CustomerInsight[]> {
    const profile = this.customerProfiles.get(userId);
    if (!profile) {
      return [];
    }

    const prompt = `
    Analyze customer behavior for user ${userId}:
    Profile: ${JSON.stringify(profile)}
    Session data: ${JSON.stringify(sessionData)}
    Emotional state: ${JSON.stringify(emotionalState)}
    
    Generate insights about:
    - Behavioral patterns
    - Emotional trends
    - Therapeutic progress
    - Risk factors
    - Opportunities for improvement
    
    Return as JSON array:
    [
      {
        "type": "behavioral" | "emotional" | "therapeutic" | "risk" | "opportunity",
        "insight": "string",
        "confidence": number,
        "actionable": boolean,
        "recommendations": ["string"],
        "priority": "low" | "medium" | "high" | "critical"
      }
    ]
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const insights = JSON.parse(content);
      
      const customerInsights: CustomerInsight[] = Array.isArray(insights) ? insights : [{
        type: 'behavioral',
        insight: 'User shows consistent engagement patterns',
        confidence: 0.7,
        actionable: true,
        recommendations: ['Continue current approach', 'Monitor engagement levels'],
        priority: 'medium'
      }];

      // Store insights
      const userInsights = this.insightsHistory.get(userId) || [];
      userInsights.push(...customerInsights);
      this.insightsHistory.set(userId, userInsights);

      return customerInsights;
    } catch (error) {
      return [{
        type: 'behavioral',
        insight: 'User shows consistent engagement patterns',
        confidence: 0.7,
        actionable: true,
        recommendations: ['Continue current approach', 'Monitor engagement levels'],
        priority: 'medium'
      }];
    }
  }

  async generatePersonalizationStrategy(
    userId: string,
    therapeuticGoal: string
  ): Promise<PersonalizationStrategy> {
    const profile = this.customerProfiles.get(userId);
    if (!profile) {
      return {
        approach: 'standard',
        techniques: ['cbt', 'mindfulness'],
        adaptations: ['flexible_scheduling'],
        expectedOutcome: 'improved_emotional_wellbeing',
        monitoringMetrics: ['engagement', 'satisfaction']
      };
    }

    const prompt = `
    Generate personalization strategy for user ${userId}:
    Profile: ${JSON.stringify(profile)}
    Therapeutic goal: ${therapeuticGoal}
    
    Create strategy including:
    - Therapeutic approach
    - Specific techniques
    - Adaptations needed
    - Expected outcomes
    - Monitoring metrics
    
    Return as JSON:
    {
      "approach": "string",
      "techniques": ["string"],
      "adaptations": ["string"],
      "expectedOutcome": "string",
      "monitoringMetrics": ["string"]
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const strategy = JSON.parse(content);
      
      return {
        approach: strategy.approach || 'personalized',
        techniques: strategy.techniques || ['cbt', 'mindfulness'],
        adaptations: strategy.adaptations || ['flexible_scheduling'],
        expectedOutcome: strategy.expectedOutcome || 'improved_emotional_wellbeing',
        monitoringMetrics: strategy.monitoringMetrics || ['engagement', 'satisfaction']
      };
    } catch (error) {
      return {
        approach: 'personalized',
        techniques: ['cbt', 'mindfulness'],
        adaptations: ['flexible_scheduling'],
        expectedOutcome: 'improved_emotional_wellbeing',
        monitoringMetrics: ['engagement', 'satisfaction']
      };
    }
  }

  async predictCustomerNeeds(
    userId: string,
    timeframe: string
  ): Promise<any> {
    const profile = this.customerProfiles.get(userId);
    if (!profile) {
      return {
        predictedNeeds: [],
        confidence: 0.5,
        timeframe
      };
    }

    const prompt = `
    Predict customer needs for user ${userId}:
    Profile: ${JSON.stringify(profile)}
    Timeframe: ${timeframe}
    
    Predict:
    - Upcoming challenges
    - Support needs
    - Intervention requirements
    - Risk factors
    - Opportunities
    
    Return as JSON:
    {
      "predictedNeeds": ["string"],
      "confidence": number,
      "timeframe": "string",
      "interventions": ["string"],
      "riskFactors": ["string"]
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const prediction = JSON.parse(content);
      
      return {
        predictedNeeds: prediction.predictedNeeds || [],
        confidence: prediction.confidence || 0.6,
        timeframe,
        interventions: prediction.interventions || [],
        riskFactors: prediction.riskFactors || []
      };
    } catch (error) {
      return {
        predictedNeeds: ['emotional_support', 'coping_skills'],
        confidence: 0.6,
        timeframe,
        interventions: ['cbt_sessions', 'mindfulness_practice'],
        riskFactors: []
      };
    }
  }

  async updateCustomerProfile(
    userId: string,
    updates: Partial<CustomerProfile>
  ): Promise<CustomerProfile> {
    const existingProfile = this.customerProfiles.get(userId);
    if (!existingProfile) {
      throw new Error(`Customer profile not found for user ${userId}`);
    }

    const updatedProfile: CustomerProfile = {
      ...existingProfile,
      ...updates
    };

    this.customerProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  async getCustomerInsights(userId: string): Promise<CustomerInsight[]> {
    return this.insightsHistory.get(userId) || [];
  }

  async getCustomerProfile(userId: string): Promise<CustomerProfile | null> {
    return this.customerProfiles.get(userId) || null;
  }

  async getCustomerAnalytics(userId: string): Promise<any> {
    const profile = this.customerProfiles.get(userId);
    const insights = this.insightsHistory.get(userId) || [];

    if (!profile) {
      return {
        profile: null,
        insights: [],
        analytics: {
          totalInsights: 0,
          averageConfidence: 0,
          mostCommonType: 'none'
        }
      };
    }

    const analytics = {
      totalInsights: insights.length,
      averageConfidence: insights.length > 0 ? 
        insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length : 0,
      mostCommonType: insights.length > 0 ? 
        insights.reduce((a, b) => 
          insights.filter(i => i.type === a.type).length > 
          insights.filter(i => i.type === b.type).length ? a : b
        ).type : 'none'
    };

    return {
      profile,
      insights,
      analytics
    };
  }
} 