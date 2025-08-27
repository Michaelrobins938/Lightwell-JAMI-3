import { prisma } from '../lib/database';

export interface YouthProfile {
  userId: string;
  age: number;
  ageGroup: 'child' | 'teen' | 'young_adult' | 'adult';
  guardianConsent: boolean;
  guardianContact?: string;
  schoolCounselor?: string;
  restrictions: YouthRestrictions;
  lastAgeVerification: Date;
  safetyLevel: 'standard' | 'elevated' | 'high_risk';
}

export interface YouthRestrictions {
  noAdvancedTherapy: boolean;
  noTraumaProcessing: boolean;
  noSubstanceDiscussion: boolean;
  noRomanticAdvice: boolean;
  requireGuardianInvolvement: boolean;
  limitedSessionTime: boolean;
  basicCopingOnly: boolean;
}

export interface AgeVerificationResult {
  verified: boolean;
  ageGroup: 'child' | 'teen' | 'young_adult' | 'adult';
  requiresGuardianConsent: boolean;
  restrictions: YouthRestrictions;
  safetyMessage: string;
}

export class MinorsProtectionService {
  private static instance: MinorsProtectionService;
  
  // Age thresholds
  private readonly CHILD_THRESHOLD = 12;
  private readonly TEEN_THRESHOLD = 17;
  private readonly YOUNG_ADULT_THRESHOLD = 25;
  
  // Session limits for minors
  private readonly MINOR_SESSION_LIMIT = 30 * 60 * 1000; // 30 minutes
  private readonly CHILD_SESSION_LIMIT = 20 * 60 * 1000; // 20 minutes

  private constructor() {}

  public static getInstance(): MinorsProtectionService {
    if (!MinorsProtectionService.instance) {
      MinorsProtectionService.instance = new MinorsProtectionService();
    }
    return MinorsProtectionService.instance;
  }

  /**
   * Verify user age and apply appropriate restrictions
   */
  async verifyAge(userId: string, reportedAge?: number, ageIndicators?: string[]): Promise<AgeVerificationResult> {
    try {
      // Get stored profile if available
      const existingProfile = await this.getYouthProfile(userId);
      
      if (existingProfile && existingProfile.age) {
        return this.createVerificationResult(existingProfile.age, existingProfile.guardianConsent);
      }
      
      // Check for age indicators in text
      const detectedAge = this.detectAgeFromText(ageIndicators || []);
      
      // Use reported age or detected age
      const age = reportedAge || detectedAge || 18; // Default to adult if unclear
      
      // Create verification result
      const result = this.createVerificationResult(age, false);
      
      // Store profile for future reference
      await this.storeYouthProfile(userId, age, result);
      
      return result;
    } catch (error) {
      console.error('Error verifying age:', error);
      // Default to adult restrictions if verification fails
      return this.createVerificationResult(18, false);
    }
  }

  /**
   * Detect age from text indicators
   */
  private detectAgeFromText(indicators: string[]): number | null {
    const text = indicators.join(' ').toLowerCase();
    
    // Explicit age mentions
    const agePatterns = [
      /i\'m (\d{1,2})/i,
      /i am (\d{1,2})/i,
      /age (\d{1,2})/i,
      /(\d{1,2}) years old/i
    ];
    
    for (const pattern of agePatterns) {
      const match = text.match(pattern);
      if (match) {
        const age = parseInt(match[1]);
        if (age >= 8 && age <= 120) { // Reasonable age range
          return age;
        }
      }
    }
    
    // School grade indicators
    if (text.includes('grade 1') || text.includes('first grade')) return 6;
    if (text.includes('grade 2') || text.includes('second grade')) return 7;
    if (text.includes('grade 3') || text.includes('third grade')) return 8;
    if (text.includes('grade 4') || text.includes('fourth grade')) return 9;
    if (text.includes('grade 5') || text.includes('fifth grade')) return 10;
    if (text.includes('grade 6') || text.includes('sixth grade')) return 11;
    if (text.includes('grade 7') || text.includes('seventh grade')) return 12;
    if (text.includes('grade 8') || text.includes('eighth grade')) return 13;
    if (text.includes('grade 9') || text.includes('ninth grade') || text.includes('freshman')) return 14;
    if (text.includes('grade 10') || text.includes('tenth grade') || text.includes('sophomore')) return 15;
    if (text.includes('grade 11') || text.includes('eleventh grade') || text.includes('junior')) return 16;
    if (text.includes('grade 12') || text.includes('twelfth grade') || text.includes('senior')) return 17;
    
    // School level indicators
    if (text.includes('elementary school') || text.includes('primary school')) return 10;
    if (text.includes('middle school') || text.includes('junior high')) return 13;
    if (text.includes('high school')) return 16;
    if (text.includes('college') || text.includes('university')) return 20;
    
    // Other indicators
    if (text.includes('teenager') || text.includes('teen')) return 15;
    if (text.includes('adolescent')) return 14;
    if (text.includes('child') || text.includes('kid')) return 10;
    if (text.includes('adult')) return 25;
    
    return null;
  }

  /**
   * Create verification result based on age
   */
  private createVerificationResult(age: number, guardianConsent: boolean): AgeVerificationResult {
    let ageGroup: 'child' | 'teen' | 'young_adult' | 'adult';
    let requiresGuardianConsent: boolean;
    let restrictions: YouthRestrictions;
    let safetyMessage: string;
    
    if (age <= this.CHILD_THRESHOLD) {
      ageGroup = 'child';
      requiresGuardianConsent = true;
      restrictions = {
        noAdvancedTherapy: true,
        noTraumaProcessing: true,
        noSubstanceDiscussion: true,
        noRomanticAdvice: true,
        requireGuardianInvolvement: true,
        limitedSessionTime: true,
        basicCopingOnly: true
      };
      safetyMessage = 'I\'m here to help, but I need to talk to a trusted adult about serious concerns. Your safety is most important.';
    } else if (age <= this.TEEN_THRESHOLD) {
      ageGroup = 'teen';
      requiresGuardianConsent = age < 16;
      restrictions = {
        noAdvancedTherapy: true,
        noTraumaProcessing: true,
        noSubstanceDiscussion: false,
        noRomanticAdvice: false,
        requireGuardianInvolvement: age < 16,
        limitedSessionTime: true,
        basicCopingOnly: true
      };
      safetyMessage = 'I\'m an AI companion, not a therapist. For serious concerns, please talk to a trusted adult or professional.';
    } else if (age <= this.YOUNG_ADULT_THRESHOLD) {
      ageGroup = 'young_adult';
      requiresGuardianConsent = false;
      restrictions = {
        noAdvancedTherapy: false,
        noTraumaProcessing: false,
        noSubstanceDiscussion: false,
        noRomanticAdvice: false,
        requireGuardianInvolvement: false,
        limitedSessionTime: false,
        basicCopingOnly: false
      };
      safetyMessage = 'I\'m here to support you. Remember that professional help is available for complex concerns.';
    } else {
      ageGroup = 'adult';
      requiresGuardianConsent = false;
      restrictions = {
        noAdvancedTherapy: false,
        noTraumaProcessing: false,
        noSubstanceDiscussion: false,
        noRomanticAdvice: false,
        requireGuardianInvolvement: false,
        limitedSessionTime: false,
        basicCopingOnly: false
      };
      safetyMessage = 'I\'m here to support you. For serious mental health concerns, please consult a professional.';
    }
    
    return {
      verified: true,
      ageGroup,
      requiresGuardianConsent,
      restrictions,
      safetyMessage
    };
  }

  /**
   * Get youth-appropriate crisis resources
   */
  getYouthCrisisResources(ageGroup: 'child' | 'teen' | 'young_adult' | 'adult'): Array<{
    name: string;
    phone: string;
    description: string;
    ageAppropriate: boolean;
  }> {
    const resources = [
      {
        name: 'Crisis Text Line',
        phone: 'Text HOME to 741741',
        description: '24/7 crisis support via text',
        ageAppropriate: true
      },
      {
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        description: '24/7 suicide prevention and crisis support',
        ageAppropriate: true
      },
      {
        name: 'Teen Line',
        phone: '310-855-4673 or text TEEN to 839863',
        description: 'Peer support for teenagers',
        ageAppropriate: ageGroup === 'teen'
      },
      {
        name: 'The Trevor Project (LGBTQ+ Youth)',
        phone: '1-866-488-7386',
        description: 'Crisis support for LGBTQ+ youth',
        ageAppropriate: ageGroup === 'teen' || ageGroup === 'young_adult'
      },
      {
        name: 'Childhelp National Child Abuse Hotline',
        phone: '1-800-422-4453',
        description: 'Support for children experiencing abuse',
        ageAppropriate: ageGroup === 'child' || ageGroup === 'teen'
      },
      {
        name: 'National Eating Disorders Association',
        phone: '1-800-931-2237',
        description: 'Support for eating disorders',
        ageAppropriate: ageGroup === 'teen' || ageGroup === 'young_adult'
      }
    ];
    
    return resources.filter(resource => resource.ageAppropriate);
  }

  /**
   * Get youth-appropriate coping strategies
   */
  getYouthCopingStrategies(ageGroup: 'child' | 'teen' | 'young_adult' | 'adult'): Array<{
    name: string;
    description: string;
    ageAppropriate: boolean;
    complexity: 'basic' | 'intermediate' | 'advanced';
  }> {
    const strategies = [
      {
        name: 'Deep Breathing',
        description: 'Take slow, deep breaths to calm down',
        ageAppropriate: true,
        complexity: 'basic' as const
      },
      {
        name: '5-4-3-2-1 Grounding',
        description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
        ageAppropriate: ageGroup !== 'child',
        complexity: 'basic' as const
      },
      {
        name: 'Progressive Muscle Relaxation',
        description: 'Tense and relax different muscle groups',
        ageAppropriate: ageGroup !== 'child',
        complexity: 'intermediate' as const
      },
      {
        name: 'Mindfulness Meditation',
        description: 'Focus on the present moment without judgment',
        ageAppropriate: ageGroup === 'teen' || ageGroup === 'young_adult' || ageGroup === 'adult',
        complexity: 'intermediate' as const
      },
      {
        name: 'Cognitive Reframing',
        description: 'Challenge negative thoughts with more balanced perspectives',
        ageAppropriate: ageGroup === 'young_adult' || ageGroup === 'adult',
        complexity: 'advanced' as const
      },
      {
        name: 'Emotion Regulation Skills',
        description: 'Learn to identify and manage difficult emotions',
        ageAppropriate: ageGroup === 'teen' || ageGroup === 'young_adult' || ageGroup === 'adult',
        complexity: 'intermediate' as const
      }
    ];
    
    return strategies.filter(strategy => strategy.ageAppropriate);
  }

  /**
   * Check if content is appropriate for youth
   */
  isContentAppropriate(content: string, restrictions: YouthRestrictions): {
    appropriate: boolean;
    reason?: string;
    alternative?: string;
  } {
    const lowerContent = content.toLowerCase();
    
    // Check for advanced therapy content
    if (restrictions.noAdvancedTherapy) {
      const advancedPatterns = [
        'trauma processing', 'exposure therapy', 'emdr', 'cognitive restructuring',
        'schema therapy', 'dialectical behavior therapy', 'acceptance and commitment therapy'
      ];
      
      for (const pattern of advancedPatterns) {
        if (lowerContent.includes(pattern)) {
          return {
            appropriate: false,
            reason: 'Advanced therapeutic techniques are not appropriate for your age',
            alternative: 'Let\'s focus on basic coping skills and safety instead'
          };
        }
      }
    }
    
    // Check for trauma processing content
    if (restrictions.noTraumaProcessing) {
      const traumaPatterns = [
        'process your trauma', 'work through trauma', 'trauma therapy',
        'heal from trauma', 'trauma recovery', 'trauma narrative'
      ];
      
      for (const pattern of traumaPatterns) {
        if (lowerContent.includes(pattern)) {
          return {
            appropriate: false,
            reason: 'Trauma processing requires professional guidance',
            alternative: 'Let\'s focus on staying safe and getting professional help'
          };
        }
      }
    }
    
    // Check for substance discussion
    if (restrictions.noSubstanceDiscussion) {
      const substancePatterns = [
        'substance abuse', 'addiction treatment', 'recovery program',
        'detox', 'withdrawal', 'relapse prevention'
      ];
      
      for (const pattern of substancePatterns) {
        if (lowerContent.includes(pattern)) {
          return {
            appropriate: false,
            reason: 'Substance-related discussions require professional guidance',
            alternative: 'Let\'s focus on staying safe and getting help from professionals'
          };
        }
      }
    }
    
    // Check for romantic advice
    if (restrictions.noRomanticAdvice) {
      const romanticPatterns = [
        'relationship advice', 'dating advice', 'romantic relationship',
        'partner', 'boyfriend', 'girlfriend', 'marriage'
      ];
      
      for (const pattern of romanticPatterns) {
        if (lowerContent.includes(pattern)) {
          return {
            appropriate: false,
            reason: 'Romantic relationship advice is not appropriate for your age',
            alternative: 'Let\'s focus on building healthy friendships and family relationships'
          };
        }
      }
    }
    
    return { appropriate: true };
  }

  /**
   * Get session time limit for minors
   */
  getSessionTimeLimit(ageGroup: 'child' | 'teen' | 'young_adult' | 'adult'): number {
    if (ageGroup === 'child') {
      return this.CHILD_SESSION_LIMIT;
    } else if (ageGroup === 'teen') {
      return this.MINOR_SESSION_LIMIT;
    }
    return Infinity; // No limit for adults
  }

  /**
   * Store youth profile in database
   */
  private async storeYouthProfile(
    userId: string, 
    age: number, 
    verification: AgeVerificationResult
  ): Promise<void> {
    try {
      const profile: YouthProfile = {
        userId,
        age,
        ageGroup: verification.ageGroup,
        guardianConsent: verification.requiresGuardianConsent,
        restrictions: verification.restrictions,
        lastAgeVerification: new Date(),
        safetyLevel: 'standard'
      };
      
      // TODO: Store in database
      console.log('Youth profile stored:', profile);
    } catch (error) {
      console.error('Error storing youth profile:', error);
    }
  }

  /**
   * Get youth profile from database
   */
  private async getYouthProfile(userId: string): Promise<YouthProfile | null> {
    try {
      // TODO: Query database
      return null;
    } catch (error) {
      console.error('Error getting youth profile:', error);
      return null;
    }
  }

  /**
   * Update guardian consent status
   */
  async updateGuardianConsent(userId: string, hasConsent: boolean): Promise<void> {
    try {
      // TODO: Update in database
      console.log('Guardian consent updated for user:', userId, 'Consent:', hasConsent);
    } catch (error) {
      console.error('Error updating guardian consent:', error);
    }
  }

  /**
   * Get youth safety disclaimer
   */
  getYouthSafetyDisclaimer(ageGroup: 'child' | 'teen' | 'young_adult' | 'adult'): string {
    if (ageGroup === 'child') {
      return 'I\'m here to help you feel better, but I\'m not a doctor or therapist. If you\'re feeling very sad, scared, or unsafe, please tell a trusted adult like a parent, teacher, or school counselor. Your safety is the most important thing.';
    } else if (ageGroup === 'teen') {
      return 'I\'m an AI companion, not a therapist. I can help with basic support and coping skills, but for serious mental health concerns, please talk to a trusted adult, school counselor, or mental health professional. Your safety and well-being matter.';
    } else {
      return 'I\'m here to support you. For serious mental health concerns, please consult a professional. Remember that asking for help is a sign of strength.';
    }
  }

  /**
   * Check if user needs guardian involvement
   */
  async requiresGuardianInvolvement(userId: string): Promise<boolean> {
    try {
      const profile = await this.getYouthProfile(userId);
      return profile?.restrictions.requireGuardianInvolvement || false;
    } catch (error) {
      console.error('Error checking guardian involvement requirement:', error);
      return false;
    }
  }
}

export const minorsProtectionService = MinorsProtectionService.getInstance();
