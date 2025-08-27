import { ClinicalProfile } from './assessment';

export interface UserProfile {
  id: string;
  demographics: Demographics;
  preferences: UserPreferences;
  clinicalProfile: ClinicalProfile;
  behavioralPatterns: BehavioralMetrics;
  goals: Goal[];
  riskAssessment: RiskAssessment;
  engagementStyle: EngagementProfile;
  personalizationVector: number[];
  lastUpdated: Date;
}

export interface BehavioralMetrics {
  avgResponseTime: number;
  hesitationPattern: number[];
  engagementScore: number;
  completionRate: number;
  mouseMovements: MouseMetrics;
  scrollPatterns: ScrollMetrics;
  touchInteractions?: TouchMetrics;
  dropOffPoints: string[];
}

export interface PersonalizationRecommendation {
  contentType: 'intervention' | 'resource' | 'exercise' | 'education';
  recommendations: ContentRecommendation[];
  confidence: number;
  reasoning: string[];
  adaptations: InterfaceAdaptation[];
}

export interface EngagementProfile {
  preferredModality: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  gamificationPreference: number; // 0-1 scale
  narrativeStyle: 'clinical' | 'conversational' | 'metaphorical';
  pacingPreference: 'fast' | 'moderate' | 'slow';
  feedbackFrequency: 'immediate' | 'periodic' | 'completion';
}

// Additional types needed
export interface Demographics {
  age?: number;
  gender?: string;
  location?: string;
  occupation?: string;
  education?: string;
}

export interface UserPreferences {
  communicationStyle: 'direct' | 'empathetic' | 'analytical' | 'creative';
  learningModality: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  supportIntensity: 'minimal' | 'moderate' | 'intensive';
  privacyLevel: 'anonymous' | 'pseudonymous' | 'identified';
}

export interface Goal {
  id: string;
  category: 'mood' | 'anxiety' | 'stress' | 'relationships' | 'productivity' | 'self_care';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  targetDate?: Date;
  interventions?: Intervention[];
  progress?: number;
}

export interface Intervention {
  id: string;
  type: string;
  title: string;
  description: string;
  effectiveness: number;
  duration: number;
  frequency: string;
}

export interface ContentRecommendation {
  id: string;
  type: 'intervention' | 'resource' | 'exercise' | 'education';
  priority: number;
  evidence: string;
  adaptations: any[];
}

export interface InterfaceAdaptation {
  type: string;
  change: string;
  reason: string;
  implementation: any;
}

export interface MouseMetrics {
  totalDistance: number;
  avgVelocity: number;
  clickCount: number;
  maxIdleTime: number;
}

export interface ScrollMetrics {
  totalDistance: number;
  scrollCount: number;
  avgScrollVelocity: number;
}

export interface TouchMetrics {
  touchCount: number;
  avgTouchDuration: number;
  swipePatterns: any[];
}



export interface RiskAssessment {
  overallRisk: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  suicidalIdeation: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  selfHarm: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  substanceUse: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  socialIsolation: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  lastAssessment: Date;
  recommendations: string[];
} 