export interface IRTQuestion {
  id: string;
  content: string;
  category: AssessmentCategory;
  difficulty: number; // IRT θ parameter (-4 to +4)
  discrimination: number; // IRT α parameter (0.5 to 3.0)
  guessing: number; // IRT c parameter (0 to 0.35)
  responseOptions: ResponseOption[];
  conditionalLogic: ConditionalLogic[];
  estimatedTime: number;
  clinicalScale?: 'PHQ9' | 'GAD7' | 'PCL5' | 'AUDIT' | 'PSQI' | 'PSS' | 'CUSTOM';
  scaleItem?: number;
  reverseCoded?: boolean;

}

export interface ResponseOption {
  id: string;
  text: string;
  value: number;
  severity?: 'minimal' | 'mild' | 'moderate' | 'severe';
  crisisFlag?: boolean;
}

export interface AssessmentResponse {
  questionId: string;
  selectedValue: number;
  responseTime: number;
  confidence: number;
  behavioralMetrics: BehavioralMetrics;
  timestamp: Date;
}

export interface ClinicalProfile {
  depressionScore: number;
  anxietyScore: number;
  stressLevel: number;
  cognitivePatterns: CognitivePattern[];
  riskFactors: RiskFactor[];
  protectiveFactors: ProtectiveFactor[];
  currentTheta: number; // IRT ability estimate
  standardError: number;
  // Additional clinical scores
  traumaScore?: number;
  substanceUseScore?: number;
  sleepQualityScore?: number;
  socialFunctioningScore?: number;
  functionalImpairmentScore?: number;
}

export interface RiskAssessment {
  suicidalIdeation: RiskLevel;
  selfHarm: RiskLevel;
  substanceUse: RiskLevel;
  socialIsolation: RiskLevel;
  overallRisk: RiskLevel;
  immediateIntervention: boolean;
  escalationRequired: boolean;
}

export type RiskLevel = 'none' | 'low' | 'moderate' | 'high' | 'severe';
export type AssessmentCategory = 'mood' | 'anxiety' | 'cognition' | 'social' | 'behavioral' | 'trauma' | 'substance';

// Additional types needed for the system
export interface CognitivePattern {
  type: string;
  frequency: number;
  severity: number;
}

export interface RiskFactor {
  type: string;
  severity: number;
  duration: string;
}

export interface ProtectiveFactor {
  type: string;
  strength: number;
  availability: boolean;
}

export interface ConditionalLogic {
  condition: string;
  followUpQuestions: string[];
}

// Clinical scoring interfaces
export interface ClinicalScores {
  depression: {
    score: number;
    severity: 'minimal' | 'mild' | 'moderate' | 'severe';
    subscales: {
      somaticSymptoms: number;
      cognitiveSymptoms: number;
      affectiveSymptoms: number;
    };
  };
  anxiety: {
    score: number;
    severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  };
  trauma: {
    score: number;
    severity: 'minimal' | 'mild' | 'moderate' | 'severe';
    clusterScores: {
      intrusion: number;
      avoidance: number;
      negativeMood: number;
      arousal: number;
    };
  };
  functionalImpairment: number;
  protectiveFactors: number;
  riskFactors: number;
}

export interface BehavioralMetrics {
  responseTime: number;
  confidence: number;
  attentionSpan: number;
  engagementLevel: number;
} 