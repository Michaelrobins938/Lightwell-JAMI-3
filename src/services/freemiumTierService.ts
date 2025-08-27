import { openRouterChatCompletion, ChatMessage } from './openRouterService';

// Freemium Tier Management Implementation
export interface TierStructure {
  free: TierLimits;
  premium: TierLimits;
  professional: TierLimits;
  enterprise: TierLimits;
}

export interface TierLimits {
  dailySessions: number | 'unlimited';
  sessionLength: number | 'unlimited'; // minutes
  advancedFeatures: string[];
  aiPersonality: 'standard' | 'fully_customizable';
  crisisSupport: 'unlimited' | 'priority_human_backup';
  progressReports: 'weekly' | 'real_time';
  meditationSessions: number | 'unlimited'; // per week
  cbtWorksheets: number | 'unlimited'; // per month
  activeGoals: number | 'unlimited';
  communityAccess: 'read_only' | 'full_participation';
  humanConsultation: number | 'unlimited'; // sessions per month
  familyIntegration: boolean;
  whiteLabel: boolean;
  apiAccess: boolean;
  dedicatedSupport: boolean;
  customBranding: boolean;
  hipaaCompliance: boolean;
  multiUserManagement: boolean;
  advancedAnalytics: boolean;
}

export interface UserTierStatus {
  userId: string;
  currentTier: 'free' | 'premium' | 'professional' | 'enterprise';
  usage: TierUsage;
  limits: TierLimits;
  conversionReadiness: ConversionReadiness;
  billingInfo: BillingInfo;
  upgradeHistory: UpgradeEvent[];
}

export interface TierUsage {
  dailySessions: number;
  sessionLength: number;
  featureUsage: Record<string, number>;
  lastSessionDate: Date;
  meditationSessionsUsed: number;
  cbtWorksheetsUsed: number;
  activeGoalsCount: number;
  communityParticipation: number;
  humanConsultationsUsed: number;
}

export interface ConversionReadiness {
  emotionalState: 'breakthrough_moment' | 'stable' | 'crisis';
  engagement: 'high' | 'medium' | 'low';
  frustration: 'feature_limitation' | 'none';
  resistance: 'low' | 'medium' | 'high';
  curiosity: 'high' | 'medium' | 'low';
  progressSatisfaction: number; // 0-1
  therapeuticAlliance: number; // 0-1
  featureUtilization: number; // 0-1
  emotionalAttachment: number; // 0-1
  communityParticipation: number; // 0-1
}

export interface BillingInfo {
  plan: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: Date;
  paymentMethod: string;
  autoRenew: boolean;
  discountApplied?: {
    type: string;
    amount: number;
    reason: string;
  };
}

export interface UpgradeEvent {
  id: string;
  fromTier: string;
  toTier: string;
  date: Date;
  trigger: string;
  amount: number;
  currency: string;
  success: boolean;
}

export interface ConversionOpportunity {
  trigger: string;
  message: string;
  timing: 'immediate' | 'end_of_session' | 'next_session';
  psychologicalFrame: string;
  offer?: {
    discount?: string;
    trial?: string;
    feature?: string;
  };
  confidence: number; // 0-1
}

export interface PricingStrategy {
  basePrice: number;
  currency: string;
  discounts: Discount[];
  paymentOptions: PaymentOption[];
  billingCycles: BillingCycle[];
}

export interface Discount {
  type: 'percentage' | 'fixed' | 'trial';
  value: number;
  conditions: string[];
  duration: string;
  maxUses: number;
}

export interface PaymentOption {
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  enabled: boolean;
  processingFee?: number;
}

export interface BillingCycle {
  type: 'monthly' | 'annual';
  price: number;
  savings?: number;
  popular: boolean;
}

export interface EthicalFramework {
  alwaysFreeFeatures: string[];
  vulnerabilityProtection: VulnerabilityProtection;
  transparencyRequirements: TransparencyRequirement[];
  accessibilityInitiatives: AccessibilityInitiative[];
}

export interface VulnerabilityProtection {
  crisisDetection: boolean;
  emergencyContacts: boolean;
  basicCopingTools: boolean;
  riskAssessment: boolean;
  safetyPlanning: boolean;
  neverPaywall: boolean;
}

export interface TransparencyRequirement {
  feature: string;
  requirement: string;
  verification: string;
}

export interface AccessibilityInitiative {
  type: 'sliding_scale' | 'student_discount' | 'senior_discount' | 'crisis_access' | 'partnership';
  description: string;
  eligibility: string[];
  implementation: string[];
}

class FreemiumTierService {
  private baseUrl: string;
  private tierStructure: TierStructure;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    this.tierStructure = this.initializeTierStructure();
  }

  // Initialize tier structure
  private initializeTierStructure(): TierStructure {
    return {
      free: {
        dailySessions: 1,
        sessionLength: 20,
        advancedFeatures: ['basic_cbt', 'mood_tracking', 'crisis_detection'],
        aiPersonality: 'standard',
        crisisSupport: 'unlimited',
        progressReports: 'weekly',
        meditationSessions: 3,
        cbtWorksheets: 5,
        activeGoals: 3,
        communityAccess: 'read_only',
        humanConsultation: 0,
        familyIntegration: false,
        whiteLabel: false,
        apiAccess: false,
        dedicatedSupport: false,
        customBranding: false,
        hipaaCompliance: false,
        multiUserManagement: false,
        advancedAnalytics: false
      },
      premium: {
        dailySessions: 'unlimited',
        sessionLength: 'unlimited',
        advancedFeatures: ['all_therapeutic_modalities', 'advanced_analytics', 'personalized_insights'],
        aiPersonality: 'fully_customizable',
        crisisSupport: 'priority_human_backup',
        progressReports: 'real_time',
        meditationSessions: 'unlimited',
        cbtWorksheets: 'unlimited',
        activeGoals: 'unlimited',
        communityAccess: 'full_participation',
        humanConsultation: 0,
        familyIntegration: true,
        whiteLabel: false,
        apiAccess: false,
        dedicatedSupport: false,
        customBranding: false,
        hipaaCompliance: false,
        multiUserManagement: false,
        advancedAnalytics: true
      },
      professional: {
        dailySessions: 'unlimited',
        sessionLength: 'unlimited',
        advancedFeatures: ['all_therapeutic_modalities', 'advanced_analytics', 'specialized_modules'],
        aiPersonality: 'fully_customizable',
        crisisSupport: 'priority_human_backup',
        progressReports: 'real_time',
        meditationSessions: 'unlimited',
        cbtWorksheets: 'unlimited',
        activeGoals: 'unlimited',
        communityAccess: 'full_participation',
        humanConsultation: 1,
        familyIntegration: true,
        whiteLabel: true,
        apiAccess: false,
        dedicatedSupport: true,
        customBranding: false,
        hipaaCompliance: true,
        multiUserManagement: false,
        advancedAnalytics: true
      },
      enterprise: {
        dailySessions: 'unlimited',
        sessionLength: 'unlimited',
        advancedFeatures: ['all_therapeutic_modalities', 'advanced_analytics', 'custom_integrations'],
        aiPersonality: 'fully_customizable',
        crisisSupport: 'priority_human_backup',
        progressReports: 'real_time',
        meditationSessions: 'unlimited',
        cbtWorksheets: 'unlimited',
        activeGoals: 'unlimited',
        communityAccess: 'full_participation',
        humanConsultation: 'unlimited',
        familyIntegration: true,
        whiteLabel: true,
        apiAccess: true,
        dedicatedSupport: true,
        customBranding: true,
        hipaaCompliance: true,
        multiUserManagement: true,
        advancedAnalytics: true
      }
    };
  }

  // Get user's current tier status
  async getUserTierStatus(userId: string): Promise<UserTierStatus> {
    try {
      // Implementation for getting user tier status from database
      const tierStatus: UserTierStatus = {
        userId,
        currentTier: 'free',
        usage: {
          dailySessions: 1,
          sessionLength: 15,
          featureUsage: {
            'mood_tracking': 7,
            'cbt_worksheets': 2,
            'meditation': 1
          },
          lastSessionDate: new Date(),
          meditationSessionsUsed: 1,
          cbtWorksheetsUsed: 2,
          activeGoalsCount: 2,
          communityParticipation: 0,
          humanConsultationsUsed: 0
        },
        limits: this.tierStructure.free,
        conversionReadiness: {
          emotionalState: 'stable',
          engagement: 'medium',
          frustration: 'none',
          resistance: 'low',
          curiosity: 'high',
          progressSatisfaction: 0.7,
          therapeuticAlliance: 0.6,
          featureUtilization: 0.5,
          emotionalAttachment: 0.6,
          communityParticipation: 0.3
        },
        billingInfo: {
          plan: 'Free',
          amount: 0,
          currency: 'USD',
          billingCycle: 'monthly',
          nextBillingDate: new Date(),
          paymentMethod: 'none',
          autoRenew: false
        },
        upgradeHistory: []
      };

      return tierStatus;
    } catch (error) {
      console.error('Error getting user tier status:', error);
      throw error;
    }
  }

  // Check if user can perform action based on tier
  async enforceTierLimit(userId: string, action: string): Promise<{
    allowed: boolean;
    gracefulDegradation?: boolean;
    message?: string;
    upgradeIncentive?: string;
    psychologicalFraming?: string;
    reason?: string;
  }> {
    try {
      const userStatus = await this.getUserTierStatus(userId);
      const currentTier = this.tierStructure[userStatus.currentTier];
      const usage = userStatus.usage;

      // Never block crisis-related actions
      if (action === 'crisis_session' || action === 'emergency_contact') {
        return {
          allowed: true,
          reason: 'crisis_override'
        };
      }

      // Check daily session limit
      if (action === 'start_session') {
        if (currentTier.dailySessions !== 'unlimited' && usage.dailySessions >= currentTier.dailySessions) {
          return {
            allowed: false,
            gracefulDegradation: true,
            message: "You've had a productive therapy day! Tomorrow's session will help you process today's insights.",
            upgradeIncentive: "Premium users can continue conversations anytime",
            psychologicalFraming: 'self_care_pacing',
            reason: 'daily_session_limit'
          };
        }
      }

      // Check session length limit
      if (action === 'extend_session') {
        if (currentTier.sessionLength !== 'unlimited' && usage.sessionLength >= currentTier.sessionLength) {
          return {
            allowed: false,
            gracefulDegradation: true,
            message: "This has been a meaningful session. Let's continue our work tomorrow.",
            upgradeIncentive: "Premium users enjoy unlimited session length",
            psychologicalFraming: 'therapeutic_pacing',
            reason: 'session_length_limit'
          };
        }
      }

      // Check feature access
      if (action === 'advanced_feature' && !currentTier.advancedFeatures.includes('advanced_analytics')) {
        return {
          allowed: false,
          gracefulDegradation: true,
          message: "This advanced feature can help accelerate your progress.",
          upgradeIncentive: "Upgrade to Premium for advanced therapeutic tools",
          psychologicalFraming: 'progress_acceleration',
          reason: 'feature_not_available'
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error enforcing tier limit:', error);
      return { allowed: true };
    }
  }

  // Analyze conversion opportunities
  async analyzeConversionOpportunity(userId: string): Promise<ConversionOpportunity | null> {
    try {
      const userStatus = await this.getUserTierStatus(userId);
      const readiness = userStatus.conversionReadiness;

      // Check for breakthrough moments
      if (readiness.emotionalState === 'breakthrough_moment' && readiness.engagement === 'high') {
        return {
          trigger: 'breakthrough_moment',
          message: "This breakthrough is incredible! Premium tools can help you build on this momentum and accelerate your growth.",
          timing: 'end_of_session',
          psychologicalFrame: 'progress_amplification',
          offer: {
            discount: '25%',
            trial: '7_day_free_trial'
          },
          confidence: 0.85
        };
      }

      // Check for feature limitation frustration
      if (readiness.frustration === 'feature_limitation' && readiness.curiosity === 'high') {
        return {
          trigger: 'feature_curiosity',
          message: "I can see you're ready for more advanced tools. Let me show you what's possible with Premium features.",
          timing: 'immediate',
          psychologicalFrame: 'capability_expansion',
          offer: {
            trial: '3_day_premium_preview'
          },
          confidence: 0.75
        };
      }

      // Check for high engagement and progress satisfaction
      if (readiness.engagement === 'high' && readiness.progressSatisfaction > 0.7) {
        return {
          trigger: 'high_engagement',
          message: "You're making excellent progress! Premium features can help you achieve even more meaningful breakthroughs.",
          timing: 'next_session',
          psychologicalFrame: 'achievement_recognition',
          offer: {
            discount: '30%',
            trial: '14_day_free_trial'
          },
          confidence: 0.7
        };
      }

      return null;
    } catch (error) {
      console.error('Error analyzing conversion opportunity:', error);
      return null;
    }
  }

  // Generate personalized pricing offers
  async generatePersonalizedOffer(userId: string): Promise<{
    discount: string;
    messaging: string;
    urgency: string;
    frame: string;
  } | null> {
    try {
      const userStatus = await this.getUserTierStatus(userId);
      const readiness = userStatus.conversionReadiness;

      // Loss aversion for high-engagement users
      if (readiness.engagement === 'high' && readiness.emotionalAttachment > 0.7) {
        return {
          discount: '40%',
          messaging: "Don't lose the progress you've built - upgrade now to continue your therapeutic journey",
          urgency: 'limited_time',
          frame: 'loss_aversion'
        };
      }

      // Achievement motivation for progress-oriented users
      if (readiness.progressSatisfaction > 0.8) {
        return {
          discount: '25%',
          messaging: "Unlock your next level of growth with Premium features",
          urgency: 'achievement_moment',
          frame: 'progress_acceleration'
        };
      }

      // Social proof for community-oriented users
      if (readiness.communityParticipation > 0.5) {
        return {
          discount: '30%',
          messaging: "Join thousands who've transformed their mental health with Premium",
          urgency: 'community_connection',
          frame: 'social_validation'
        };
      }

      return null;
    } catch (error) {
      console.error('Error generating personalized offer:', error);
      return null;
    }
  }

  // Process tier upgrade
  async processUpgrade(userId: string, newTier: string, paymentInfo: any): Promise<{
    success: boolean;
    message: string;
    nextSteps: string[];
  }> {
    try {
      // Implementation for processing tier upgrade
      console.log('Processing upgrade:', { userId, newTier, paymentInfo });

      const upgradeEvent: UpgradeEvent = {
        id: `upgrade_${Date.now()}`,
        fromTier: 'free',
        toTier: newTier,
        date: new Date(),
        trigger: 'user_initiated',
        amount: this.getTierPrice(newTier),
        currency: 'USD',
        success: true
      };

      // Update user tier status
      // Implementation for updating database

      return {
        success: true,
        message: `Successfully upgraded to ${newTier} tier!`,
        nextSteps: [
          'Explore new Premium features',
          'Schedule your first unlimited session',
          'Set up advanced analytics',
          'Join the community'
        ]
      };
    } catch (error) {
      console.error('Error processing upgrade:', error);
      return {
        success: false,
        message: 'Upgrade failed. Please try again.',
        nextSteps: ['Contact support if issue persists']
      };
    }
  }

  // Get tier pricing
  private getTierPrice(tier: string): number {
    const pricing = {
      premium: 19.99,
      professional: 39.99,
      enterprise: 99.99
    };
    return pricing[tier as keyof typeof pricing] || 0;
  }

  // Ethical framework validation
  async validateEthicalCompliance(action: string, userTier: string): Promise<{
    compliant: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const ethicalFramework = this.getEthicalFramework();
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check if safety features are being paywalled
      if (ethicalFramework.alwaysFreeFeatures.includes(action) && userTier === 'free') {
        issues.push('Safety feature should not be paywalled');
        recommendations.push('Ensure crisis detection remains free');
      }

      // Check vulnerability protection
      if (action === 'crisis_intervention' && userTier === 'free') {
        if (!ethicalFramework.vulnerabilityProtection.crisisDetection) {
          issues.push('Crisis detection should be free for all users');
          recommendations.push('Implement free crisis detection for all tiers');
        }
      }

      return {
        compliant: issues.length === 0,
        issues,
        recommendations
      };
    } catch (error) {
      console.error('Error validating ethical compliance:', error);
      return {
        compliant: true,
        issues: [],
        recommendations: []
      };
    }
  }

  // Get ethical framework
  private getEthicalFramework(): EthicalFramework {
    return {
      alwaysFreeFeatures: [
        'crisis_detection',
        'emergency_contacts',
        'basic_coping_tools',
        'risk_assessment',
        'safety_planning'
      ],
      vulnerabilityProtection: {
        crisisDetection: true,
        emergencyContacts: true,
        basicCopingTools: true,
        riskAssessment: true,
        safetyPlanning: true,
        neverPaywall: true
      },
      transparencyRequirements: [
        {
          feature: 'premium_features',
          requirement: 'Clear value proposition',
          verification: 'User testing shows understanding'
        },
        {
          feature: 'pricing',
          requirement: 'Transparent pricing structure',
          verification: 'No hidden fees'
        }
      ],
      accessibilityInitiatives: [
        {
          type: 'sliding_scale',
          description: 'Income-based pricing for financial accessibility',
          eligibility: ['Income verification', 'Financial hardship'],
          implementation: ['Income assessment', 'Flexible payment plans']
        },
        {
          type: 'student_discount',
          description: 'Reduced pricing for students',
          eligibility: ['Student ID', 'Enrollment verification'],
          implementation: ['Student verification', 'Academic pricing']
        },
        {
          type: 'crisis_access',
          description: 'Temporary premium access during crisis',
          eligibility: ['Crisis assessment', 'Immediate need'],
          implementation: ['Crisis evaluation', 'Temporary upgrade']
        }
      ]
    };
  }

  // A/B testing for conversion optimization
  async runConversionExperiment(userId: string, experimentConfig: any): Promise<{
    variant: string;
    message: string;
    timing: string;
    pricing: string;
  }> {
    try {
      const variants = {
        control: {
          message: "Upgrade to premium for more features",
          timing: 'end_of_session',
          pricing: '$19.99/month'
        },
        progress_focused: {
          message: "Continue building on your breakthrough with advanced tools",
          timing: 'breakthrough_moment',
          pricing: '$19.99/month'
        },
        social_proof: {
          message: "Join thousands who've transformed their mental health with premium",
          timing: 'high_engagement',
          pricing: '$19.99/month'
        },
        scarcity: {
          message: "Limited time: Unlock your full therapeutic potential",
          timing: 'feature_limitation',
          pricing: '$19.99/month'
        },
        collaborative: {
          message: "Let's explore what's possible with premium tools together",
          timing: 'therapeutic_alliance_high',
          pricing: '$19.99/month'
        }
      };

      // Simple A/B test implementation
      const variantKeys = Object.keys(variants);
      const selectedVariant = variantKeys[Math.floor(Math.random() * variantKeys.length)];
      
      return {
        variant: selectedVariant,
        ...variants[selectedVariant as keyof typeof variants]
      };
    } catch (error) {
      console.error('Error running conversion experiment:', error);
      return {
        variant: 'control',
        message: "Upgrade to premium for more features",
        timing: 'end_of_session',
        pricing: '$19.99/month'
      };
    }
  }

  // Track conversion metrics
  async trackConversionMetrics(userId: string, event: string, data: any): Promise<void> {
    try {
      // Implementation for tracking conversion metrics
      console.log('Tracking conversion metrics:', { userId, event, data });
      
      // Track events like:
      // - upgrade_attempted
      // - upgrade_completed
      // - upgrade_cancelled
      // - feature_limitation_hit
      // - conversion_opportunity_shown
    } catch (error) {
      console.error('Error tracking conversion metrics:', error);
    }
  }
}

const freemiumTierService = new FreemiumTierService();
export default freemiumTierService; 