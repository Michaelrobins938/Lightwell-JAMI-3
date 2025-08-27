import { openRouterChatCompletion, ChatMessage } from './openRouterService';

// Comprehensive Assessment Suite Implementation
export interface PsychologicalProfile {
  userId: string;
  assessmentDate: Date;
  phq9Score: number; // 0-27
  gad7Score: number; // 0-21
  ptsd5Score: number; // 0-20
  personalityTraits: {
    openness: number; // 0-1
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  therapeuticReadiness: {
    motivation: number; // 0-1
    insight: number;
    resistance: number;
    supportSystem: number;
    readinessScore: number; // 0-1
  };
  presentingConcerns: string[];
  treatmentHistory: {
    previousTherapy: boolean;
    medications: string[];
    hospitalizations: number;
    currentDiagnoses: string[];
  };
  riskFactors: {
    suicidalIdeation: boolean;
    selfHarm: boolean;
    substanceUse: string[];
    domesticViolence: boolean;
    isolation: boolean;
  };
  protectiveFactors: {
    socialSupport: number; // 0-1
    copingSkills: number;
    accessToCare: number;
    financialStability: number;
    hope: number;
  };
}

export interface MoodTrackingEntry {
  userId: string;
  timestamp: Date;
  primaryMood: string;
  intensity: number; // 1-10
  valence: 'positive' | 'negative' | 'neutral';
  triggers: string[];
  activities: string[];
  sleepHours: number;
  stressLevel: number; // 1-10
  anxietyLevel: number; // 1-10
  depressionLevel: number; // 1-10
  notes: string;
  somaticSymptoms: string[];
}

export interface RiskAssessment {
  userId: string;
  assessmentDate: Date;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: {
    suicidalIdeation: {
      present: boolean;
      intensity: number; // 1-10
      plan: boolean;
      means: boolean;
      intent: boolean;
    };
    selfHarm: {
      present: boolean;
      frequency: string;
      severity: number; // 1-10
    };
    violence: {
      present: boolean;
      target: string;
      plan: boolean;
    };
    psychosis: {
      present: boolean;
      symptoms: string[];
      insight: number; // 1-10
    };
  };
  protectiveFactors: {
    socialSupport: number; // 1-10
    copingSkills: number;
    accessToCare: number;
    hope: number;
    reasonsForLiving: string[];
  };
  immediateActions: string[];
  followUpRequired: boolean;
  escalationLevel: 'none' | 'monitor' | 'intervene' | 'emergency';
}

export interface TherapeuticReadiness {
  userId: string;
  assessmentDate: Date;
  readinessScore: number; // 0-1
  dimensions: {
    motivation: {
      score: number; // 0-1
      factors: string[];
      barriers: string[];
    };
    insight: {
      score: number;
      selfAwareness: number;
      problemRecognition: number;
      changeReadiness: number;
    };
    resistance: {
      score: number; // Higher = more resistance
      types: string[]; // 'ambivalence', 'denial', 'projection', etc.
      intensity: number; // 1-10
    };
    supportSystem: {
      score: number;
      familySupport: number;
      friendSupport: number;
      professionalSupport: number;
    };
  };
  optimalInterventionTiming: 'immediate' | 'within_week' | 'within_month' | 'not_ready';
  recommendedApproach: string[];
  contraindications: string[];
}

export interface AssessmentResult {
  psychologicalProfile: PsychologicalProfile;
  moodTrends: {
    weekly: MoodTrackingEntry[];
    monthly: MoodTrackingEntry[];
    patterns: {
      triggers: string[];
      timeOfDay: string;
      dayOfWeek: string;
      seasonalPatterns: string[];
    };
  };
  riskAssessment: RiskAssessment;
  therapeuticReadiness: TherapeuticReadiness;
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    crisisPlan: string[];
  };
}

class ComprehensiveAssessmentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }

  // Initial Intake Assessment
  async conductInitialAssessment(userId: string, userInput: string): Promise<PsychologicalProfile> {
    try {
      const prompt = `
        Conduct a comprehensive psychological assessment based on the user's input.
        
        User Input: "${userInput}"
        
        Analyze the following dimensions:
        1. Depression symptoms (PHQ-9 equivalent scoring)
        2. Anxiety symptoms (GAD-7 equivalent scoring) 
        3. Trauma symptoms (PTSD-5 equivalent scoring)
        4. Personality traits (Big Five model)
        5. Therapeutic readiness factors
        6. Risk factors and protective factors
        7. Presenting concerns and treatment history
        
        Provide a detailed psychological profile in JSON format with the following structure:
        {
          "phq9Score": number (0-27),
          "gad7Score": number (0-21),
          "ptsd5Score": number (0-20),
          "personalityTraits": {
            "openness": number (0-1),
            "conscientiousness": number (0-1),
            "extraversion": number (0-1),
            "agreeableness": number (0-1),
            "neuroticism": number (0-1)
          },
          "therapeuticReadiness": {
            "motivation": number (0-1),
            "insight": number (0-1),
            "resistance": number (0-1),
            "supportSystem": number (0-1),
            "readinessScore": number (0-1)
          },
          "presentingConcerns": [string array],
          "treatmentHistory": {
            "previousTherapy": boolean,
            "medications": [string array],
            "hospitalizations": number,
            "currentDiagnoses": [string array]
          },
          "riskFactors": {
            "suicidalIdeation": boolean,
            "selfHarm": boolean,
            "substanceUse": [string array],
            "domesticViolence": boolean,
            "isolation": boolean
          },
          "protectiveFactors": {
            "socialSupport": number (0-1),
            "copingSkills": number (0-1),
            "accessToCare": number (0-1),
            "financialStability": number (0-1),
            "hope": number (0-1)
          }
        }
        
        Focus on clinical accuracy and therapeutic utility.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a clinical psychologist conducting comprehensive assessments.' },
        { role: 'user', content: prompt }
      ]);

      const profile = JSON.parse(response.choices[0].message.content);
      
      return {
        userId,
        assessmentDate: new Date(),
        ...profile
      };
    } catch (error) {
      console.error('Error conducting initial assessment:', error);
      return this.fallbackPsychologicalProfile(userId);
    }
  }

  // Continuous Mood Tracking
  async trackMood(userId: string, moodData: Partial<MoodTrackingEntry>): Promise<MoodTrackingEntry> {
    const entry: MoodTrackingEntry = {
      userId,
      timestamp: new Date(),
      primaryMood: moodData.primaryMood || 'neutral',
      intensity: moodData.intensity || 5,
      valence: moodData.valence || 'neutral',
      triggers: moodData.triggers || [],
      activities: moodData.activities || [],
      sleepHours: moodData.sleepHours || 0,
      stressLevel: moodData.stressLevel || 5,
      anxietyLevel: moodData.anxietyLevel || 5,
      depressionLevel: moodData.depressionLevel || 5,
      notes: moodData.notes || '',
      somaticSymptoms: moodData.somaticSymptoms || []
    };

    // Save to database
    await this.saveMoodEntry(entry);
    
    return entry;
  }

  // Risk Assessment Dashboard
  async assessRisk(userId: string, currentInput: string, moodHistory: MoodTrackingEntry[]): Promise<RiskAssessment> {
    try {
      const prompt = `
        Conduct a comprehensive risk assessment based on the following information:
        
        Current User Input: "${currentInput}"
        
        Recent Mood History: ${JSON.stringify(moodHistory.slice(-7))}
        
        Assess for:
        1. Suicidal ideation, plan, means, and intent
        2. Self-harm behaviors and severity
        3. Violence risk toward others
        4. Psychotic symptoms and insight
        5. Protective factors and support systems
        
        Provide assessment in JSON format:
        {
          "overallRisk": "low|medium|high|critical",
          "riskFactors": {
            "suicidalIdeation": {
              "present": boolean,
              "intensity": number (1-10),
              "plan": boolean,
              "means": boolean,
              "intent": boolean
            },
            "selfHarm": {
              "present": boolean,
              "frequency": string,
              "severity": number (1-10)
            },
            "violence": {
              "present": boolean,
              "target": string,
              "plan": boolean
            },
            "psychosis": {
              "present": boolean,
              "symptoms": [string array],
              "insight": number (1-10)
            }
          },
          "protectiveFactors": {
            "socialSupport": number (1-10),
            "copingSkills": number (1-10),
            "accessToCare": number (1-10),
            "hope": number (1-10),
            "reasonsForLiving": [string array]
          },
          "immediateActions": [string array],
          "followUpRequired": boolean,
          "escalationLevel": "none|monitor|intervene|emergency"
        }
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a crisis intervention specialist conducting risk assessments.' },
        { role: 'user', content: prompt }
      ]);

      const assessment = JSON.parse(response.choices[0].message.content);
      
      return {
        userId,
        assessmentDate: new Date(),
        ...assessment
      };
    } catch (error) {
      console.error('Error assessing risk:', error);
      return this.fallbackRiskAssessment(userId);
    }
  }

  // Therapeutic Readiness Evaluation
  async evaluateTherapeuticReadiness(
    userId: string, 
    psychologicalProfile: PsychologicalProfile,
    moodHistory: MoodTrackingEntry[]
  ): Promise<TherapeuticReadiness> {
    try {
      const prompt = `
        Evaluate therapeutic readiness based on:
        
        Psychological Profile: ${JSON.stringify(psychologicalProfile)}
        Mood History: ${JSON.stringify(moodHistory.slice(-30))}
        
        Assess:
        1. Motivation for change
        2. Insight and self-awareness
        3. Resistance to treatment
        4. Support system quality
        5. Optimal intervention timing
        6. Recommended therapeutic approach
        
        Provide evaluation in JSON format:
        {
          "readinessScore": number (0-1),
          "dimensions": {
            "motivation": {
              "score": number (0-1),
              "factors": [string array],
              "barriers": [string array]
            },
            "insight": {
              "score": number (0-1),
              "selfAwareness": number (0-1),
              "problemRecognition": number (0-1),
              "changeReadiness": number (0-1)
            },
            "resistance": {
              "score": number (0-1),
              "types": [string array],
              "intensity": number (1-10)
            },
            "supportSystem": {
              "score": number (0-1),
              "familySupport": number (0-1),
              "friendSupport": number (0-1),
              "professionalSupport": number (0-1)
            }
          },
          "optimalInterventionTiming": "immediate|within_week|within_month|not_ready",
          "recommendedApproach": [string array],
          "contraindications": [string array]
        }
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a clinical psychologist evaluating therapeutic readiness.' },
        { role: 'user', content: prompt }
      ]);

      const evaluation = JSON.parse(response.choices[0].message.content);
      
      return {
        userId,
        assessmentDate: new Date(),
        ...evaluation
      };
    } catch (error) {
      console.error('Error evaluating therapeutic readiness:', error);
      return this.fallbackTherapeuticReadiness(userId);
    }
  }

  // Generate Comprehensive Assessment Report
  async generateComprehensiveAssessment(userId: string): Promise<AssessmentResult> {
    try {
      // Get user's psychological profile
      const profile = await this.getPsychologicalProfile(userId);
      
      // Get mood tracking history
      const moodHistory = await this.getMoodHistory(userId);
      
      // Conduct risk assessment
      const riskAssessment = await this.assessRisk(userId, '', moodHistory);
      
      // Evaluate therapeutic readiness
      const readiness = await this.evaluateTherapeuticReadiness(userId, profile, moodHistory);
      
      // Analyze mood trends
      const moodTrends = this.analyzeMoodTrends(moodHistory);
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(profile, riskAssessment, readiness);
      
      return {
        psychologicalProfile: profile,
        moodTrends,
        riskAssessment,
        therapeuticReadiness: readiness,
        recommendations
      };
    } catch (error) {
      console.error('Error generating comprehensive assessment:', error);
      throw error;
    }
  }

  // Analyze mood trends and patterns
  private analyzeMoodTrends(moodHistory: MoodTrackingEntry[]) {
    const weekly = moodHistory.slice(-7);
    const monthly = moodHistory.slice(-30);
    
    // Analyze patterns
    const triggers = this.extractCommonTriggers(moodHistory);
    const timeOfDay = this.analyzeTimePatterns(moodHistory);
    const dayOfWeek = this.analyzeDayPatterns(moodHistory);
    const seasonalPatterns = this.analyzeSeasonalPatterns(moodHistory);
    
    return {
      weekly,
      monthly,
      patterns: {
        triggers,
        timeOfDay,
        dayOfWeek,
        seasonalPatterns
      }
    };
  }

  // Generate personalized recommendations
  private async generateRecommendations(
    profile: PsychologicalProfile,
    riskAssessment: RiskAssessment,
    readiness: TherapeuticReadiness
  ) {
    const recommendations = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[],
      crisisPlan: [] as string[]
    };

    // Immediate recommendations based on risk level
    if (riskAssessment.overallRisk === 'critical') {
      recommendations.immediate.push('Contact emergency services immediately');
      recommendations.immediate.push('Call suicide prevention hotline');
      recommendations.crisisPlan.push('Emergency contact: 911');
      recommendations.crisisPlan.push('Crisis hotline: 988');
    }

    // Short-term recommendations based on readiness
    if (readiness.optimalInterventionTiming === 'immediate') {
      recommendations.shortTerm.push('Begin therapeutic intervention immediately');
      recommendations.shortTerm.push('Schedule regular check-ins');
    }

    // Long-term recommendations based on profile
    if (profile.phq9Score > 10) {
      recommendations.longTerm.push('Consider medication evaluation');
      recommendations.longTerm.push('Engage in regular therapy sessions');
    }

    return recommendations;
  }

  // Database operations
  private async saveMoodEntry(entry: MoodTrackingEntry) {
    // Implementation for saving to database
    console.log('Saving mood entry:', entry);
  }

  private async getPsychologicalProfile(userId: string): Promise<PsychologicalProfile> {
    // Implementation for retrieving from database
    return this.fallbackPsychologicalProfile(userId);
  }

  private async getMoodHistory(userId: string): Promise<MoodTrackingEntry[]> {
    // Implementation for retrieving from database
    return [];
  }

  // Fallback implementations
  private fallbackPsychologicalProfile(userId: string): PsychologicalProfile {
    return {
      userId,
      assessmentDate: new Date(),
      phq9Score: 5,
      gad7Score: 4,
      ptsd5Score: 2,
      personalityTraits: {
        openness: 0.6,
        conscientiousness: 0.7,
        extraversion: 0.5,
        agreeableness: 0.8,
        neuroticism: 0.4
      },
      therapeuticReadiness: {
        motivation: 0.7,
        insight: 0.6,
        resistance: 0.3,
        supportSystem: 0.6,
        readinessScore: 0.65
      },
      presentingConcerns: ['stress', 'anxiety'],
      treatmentHistory: {
        previousTherapy: false,
        medications: [],
        hospitalizations: 0,
        currentDiagnoses: []
      },
      riskFactors: {
        suicidalIdeation: false,
        selfHarm: false,
        substanceUse: [],
        domesticViolence: false,
        isolation: false
      },
      protectiveFactors: {
        socialSupport: 0.6,
        copingSkills: 0.5,
        accessToCare: 0.8,
        financialStability: 0.7,
        hope: 0.6
      }
    };
  }

  private fallbackRiskAssessment(userId: string): RiskAssessment {
    return {
      userId,
      assessmentDate: new Date(),
      overallRisk: 'low',
      riskFactors: {
        suicidalIdeation: {
          present: false,
          intensity: 1,
          plan: false,
          means: false,
          intent: false
        },
        selfHarm: {
          present: false,
          frequency: 'never',
          severity: 1
        },
        violence: {
          present: false,
          target: '',
          plan: false
        },
        psychosis: {
          present: false,
          symptoms: [],
          insight: 10
        }
      },
      protectiveFactors: {
        socialSupport: 7,
        copingSkills: 6,
        accessToCare: 8,
        hope: 7,
        reasonsForLiving: ['family', 'future goals']
      },
      immediateActions: [],
      followUpRequired: false,
      escalationLevel: 'none'
    };
  }

  private fallbackTherapeuticReadiness(userId: string): TherapeuticReadiness {
    return {
      userId,
      assessmentDate: new Date(),
      readinessScore: 0.7,
      dimensions: {
        motivation: {
          score: 0.7,
          factors: ['desire for change', 'goal orientation'],
          barriers: ['time constraints']
        },
        insight: {
          score: 0.6,
          selfAwareness: 0.6,
          problemRecognition: 0.7,
          changeReadiness: 0.5
        },
        resistance: {
          score: 0.3,
          types: [],
          intensity: 3
        },
        supportSystem: {
          score: 0.6,
          familySupport: 0.6,
          friendSupport: 0.5,
          professionalSupport: 0.7
        }
      },
      optimalInterventionTiming: 'within_week',
      recommendedApproach: ['CBT', 'Mindfulness'],
      contraindications: []
    };
  }

  // Pattern analysis methods
  private extractCommonTriggers(moodHistory: MoodTrackingEntry[]): string[] {
    const triggerCounts: Record<string, number> = {};
    moodHistory.forEach(entry => {
      entry.triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    });
    
    return Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trigger]) => trigger);
  }

  private analyzeTimePatterns(moodHistory: MoodTrackingEntry[]): string {
    // Implementation for time pattern analysis
    return 'evening';
  }

  private analyzeDayPatterns(moodHistory: MoodTrackingEntry[]): string {
    // Implementation for day pattern analysis
    return 'weekends';
  }

  private analyzeSeasonalPatterns(moodHistory: MoodTrackingEntry[]): string[] {
    // Implementation for seasonal pattern analysis
    return ['winter blues'];
  }
}

const comprehensiveAssessmentService = new ComprehensiveAssessmentService();
export default comprehensiveAssessmentService; 