export interface EmotionalState {
  primaryEmotion: string;
  intensity: number;
  secondaryEmotions: string[];
  triggers: string[];
  somaticSymptoms: string[];
  cognitivePatterns: string[];
  progressIndicator?: 'improving' | 'stable' | 'regressing';
  contextualNotes?: string;
}

export interface TherapeuticIntervention {
  type: 'cbt' | 'mindfulness' | 'validation' | 'reframe' | 'crisis' | 'dbt' | 'act';
  technique: string;
  rationale: string;
  effectiveness: number;
  personalization?: string;
  nextSteps?: string[];
}

export interface CrisisLevel {
  level: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  riskFactors: string[];
  immediateActions: string[];
  professionalHelp: boolean;
  baselineChange?: 'improved' | 'stable' | 'worsened';
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

export interface SessionProgress {
  stage: 'introduction' | 'assessment' | 'intervention' | 'closure';
  engagement: number;
  trustLevel: number;
  therapeuticAlliance: number;
  sessionGoals?: string[];
  nextSessionFocus?: string[];
  insights?: string[];
  breakthroughs?: string[];
  resistanceAreas?: string[];
}

export interface EmpathyResponse {
  type: 'emotional' | 'cognitive' | 'compassionate' | 'therapeutic';
  content: string;
  tone: string;
  validationLevel: number;
}

export interface ConversationContext {
  sessionId: string;
  userId: string;
  userProfile: UserProfile;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    emotionalState?: EmotionalState;
    therapeuticIntervention?: TherapeuticIntervention;
  }>;
  sessionProgress: SessionProgress;
  longTermMemory: LongTermMemory;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences?: any;
  settings?: any;
  therapeuticGoals?: string[];
  triggers?: string[];
  copingStrategies?: string[];
  progressAreas?: string[];
  challenges?: string[];
}

export interface LongTermMemory {
  keyInsights: string[];
  recurringThemes: string[];
  progressMilestones: string[];
  therapeuticTechniques: string[];
  userPreferences: any;
}

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

export interface EmotionalRegulationTechnique {
  name: string;
  description: string;
  steps: string[];
  duration: number;
  effectiveness: number;
  personalization?: string;
}

export interface CrisisAssessment {
  riskLevel: 'low' | 'moderate' | 'high';
  immediateDanger: boolean;
  supportNeeded: string[];
  professionalReferral: boolean;
  emergencyContacts: string[];
  historicalContext?: string[];
}

export interface AIResponseMetadata {
  processingTime: number;
  confidence: number;
  modelUsed: string;
  contextSize?: number;
  memoryRetrieved?: number;
  emotionalComplexity?: number;
  therapeuticAlignment?: number;
}

export interface EnhancedAIResponse {
  response: string;
  sessionId: string;
  emotionalAssessment: EmotionalState;
  therapeuticIntervention: TherapeuticIntervention;
  crisisLevel: CrisisLevel;
  sessionProgress: SessionProgress;
  empathyResponse: EmpathyResponse;
  emotionalRegulationTechnique?: EmotionalRegulationTechnique;
  crisisAssessment?: CrisisAssessment;
  metadata: AIResponseMetadata;
}

export interface ConversationSummary {
  sessionId: string;
  userId: string;
  summary: string;
  keyInsights: string[];
  emotionalTrends: string[];
  therapeuticProgress: string[];
  nextSessionRecommendations: string[];
  createdAt: Date;
}

export interface TherapeuticRelationship {
  userId: string;
  trustLevel: number;
  engagementLevel: number;
  therapeuticAlliance: number;
  communicationStyle: string;
  preferredInterventions: string[];
  progressAreas: string[];
  challenges: string[];
  lastUpdated: Date;
}

export interface EmotionalPattern {
  userId: string;
  pattern: string;
  frequency: number;
  triggers: string[];
  intensity: number;
  copingStrategies: string[];
  effectiveness: number;
  lastObserved: Date;
}

export interface SessionMemory {
  sessionId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    emotionalState?: EmotionalState;
  }>;
  emotionalHistory: EmotionalState[];
  interventionHistory: TherapeuticIntervention[];
  lastUpdated: Date;
}

export interface ProgressTracking {
  userId: string;
  metric: string;
  value: number;
  trend: 'improving' | 'stable' | 'declining';
  confidence: number;
  lastUpdated: Date;
  historicalData: Array<{
    date: Date;
    value: number;
  }>;
} 