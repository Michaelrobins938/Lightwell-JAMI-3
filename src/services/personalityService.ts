import { prisma } from '../lib/database';

export interface PersonalityConfig {
  id: string;
  name: string;
  description?: string;
  category: string;
  therapeuticApproach?: string;
  specialization?: string;
  coreInstructions: string;
  safetyProtocols: string;
  therapeuticTechniques?: string;
  boundarySettings?: string;
  crisisIntervention?: string;
  communicationStyle?: string;
  responseLength?: string;
  empathyLevel?: string;
  directiveLevel?: string;
  safetyChecks?: string[];
  crisisKeywords?: string[];
  escalationProtocols?: string;
  disclaimers?: string;
}

export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedKeywords: string[];
  recommendedAction: string;
  shouldEscalate: boolean;
  escalationReason?: string;
}

export interface SafetyCheckResult {
  passed: boolean;
  warnings: string[];
  blockedContent: string[];
  recommendations: string[];
}

export class PersonalityService {
  private static instance: PersonalityService;
  private crisisKeywords: Set<string> = new Set([
    // Self-harm and suicide
    'kill myself', 'suicide', 'end my life', 'want to die', 'hurt myself',
    'self-harm', 'cutting', 'overdose', 'no reason to live', 'better off dead',
    'plan to die', 'suicidal', 'self-destructive', 'harm myself',
    
    // Violence
    'hurt someone', 'kill someone', 'attack', 'violent', 'weapon',
    'gun', 'knife', 'bomb', 'threaten', 'revenge', 'harm others',
    
    // Acute crisis
    'emergency', 'crisis', 'immediate help', 'right now', 'urgent',
    'can\'t take it anymore', 'breaking point', 'losing control',
    
    // Substance abuse
    'overdose', 'drugs', 'alcohol poisoning', 'substance abuse',
    
    // Mental health crisis
    'psychotic', 'hallucinations', 'delusions', 'paranoid',
    'manic episode', 'severe depression', 'catatonic'
  ]);

  private escalationTriggers: Set<string> = new Set([
    'suicide plan', 'specific method', 'lethal means', 'immediate danger',
    'active self-harm', 'current crisis', 'right now', 'tonight',
    'this moment', 'can\'t wait', 'emergency'
  ]);

  public static getInstance(): PersonalityService {
    if (!PersonalityService.instance) {
      PersonalityService.instance = new PersonalityService();
    }
    return PersonalityService.instance;
  }

  /**
   * Get user's active personality profile
   */
  async getActivePersonality(userId: string): Promise<PersonalityConfig | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return null;
      }

      // Get the active personality profile
      const activeProfile = await prisma.personalityProfile.findFirst({
        where: { userId, isActive: true }
      });

      if (!activeProfile) {
        return null;
      }

      return this.formatPersonalityConfig(activeProfile);
    } catch (error) {
      console.error('Failed to get active personality:', error);
      return null;
    }
  }

  /**
   * Get all personality profiles for a user
   */
  async getUserPersonalities(userId: string): Promise<PersonalityConfig[]> {
    try {
      const profiles = await prisma.personalityProfile.findMany({
        where: { userId },
        orderBy: { isActive: 'desc' }
      });

      return profiles.map(profile => this.formatPersonalityConfig(profile));
    } catch (error) {
      console.error('Failed to get user personalities:', error);
      return [];
    }
  }

  /**
   * Get system-provided personalities
   */
  async getSystemPersonalities(): Promise<PersonalityConfig[]> {
    try {
      const systemProfiles = await prisma.systemPersonality.findMany({
        where: { isActive: true },
        orderBy: { isRecommended: 'desc', usageCount: 'desc' }
      });

      return systemProfiles.map(profile => this.formatPersonalityConfig(profile));
    } catch (error) {
      console.error('Failed to get system personalities:', error);
      return [];
    }
  }

  /**
   * Get personality by ID
   */
  async getPersonalityById(personalityId: string): Promise<PersonalityConfig | null> {
    try {
      const profile = await prisma.personalityProfile.findUnique({
        where: { id: personalityId }
      });

      if (!profile) {
        return null;
      }

      return this.formatPersonalityConfig(profile);
    } catch (error) {
      console.error('Failed to get personality by ID:', error);
      return null;
    }
  }

  /**
   * Delete a personality profile
   */
  async deletePersonality(personalityId: string): Promise<void> {
    try {
      await prisma.personalityProfile.delete({
        where: { id: personalityId }
      });
    } catch (error) {
      console.error('Failed to delete personality:', error);
      throw error;
    }
  }

  /**
   * Create a new personality profile
   */
  async createPersonality(userId: string, config: Partial<PersonalityConfig>): Promise<PersonalityConfig> {
    try {
      // Validate safety protocols
      const safetyValidation = this.validateSafetyProtocols(config);
      if (!safetyValidation.passed) {
        throw new Error(`Safety validation failed: ${safetyValidation.warnings.join(', ')}`);
      }

      const profile = await prisma.personalityProfile.create({
        data: {
          userId,
          name: config.name!,
          category: config.category!,
          therapeuticApproach: config.therapeuticApproach,
          specialization: config.specialization,
          coreInstructions: config.coreInstructions!,
          safetyProtocols: config.safetyProtocols!,
          therapeuticTechniques: config.therapeuticTechniques,
          boundarySettings: config.boundarySettings,
          crisisIntervention: config.crisisIntervention,
          communicationStyle: config.communicationStyle,
          responseLength: config.responseLength,
          empathyLevel: config.empathyLevel,
          directiveLevel: config.directiveLevel,
          safetyChecks: config.safetyChecks ? JSON.stringify(config.safetyChecks) : null,
          crisisKeywords: config.crisisKeywords ? JSON.stringify(config.crisisKeywords) : null,
          escalationProtocols: config.escalationProtocols,
          disclaimers: config.disclaimers,
          complianceStatus: 'pending'
        }
      });

      return this.formatPersonalityConfig(profile);
    } catch (error) {
      console.error('Failed to create personality:', error);
      throw error;
    }
  }

  /**
   * Update a personality profile
   */
  async updatePersonality(personalityId: string, config: Partial<PersonalityConfig>): Promise<PersonalityConfig> {
    try {
      // Validate safety protocols
      const safetyValidation = this.validateSafetyProtocols(config);
      if (!safetyValidation.passed) {
        throw new Error(`Safety validation failed: ${safetyValidation.warnings.join(', ')}`);
      }

      const profile = await prisma.personalityProfile.update({
        where: { id: personalityId },
        data: {
          name: config.name,
          category: config.category,
          therapeuticApproach: config.therapeuticApproach,
          specialization: config.specialization,
          coreInstructions: config.coreInstructions,
          safetyProtocols: config.safetyProtocols,
          therapeuticTechniques: config.therapeuticTechniques,
          boundarySettings: config.boundarySettings,
          crisisIntervention: config.crisisIntervention,
          communicationStyle: config.communicationStyle,
          responseLength: config.responseLength,
          empathyLevel: config.empathyLevel,
          directiveLevel: config.directiveLevel,
          safetyChecks: config.safetyChecks ? JSON.stringify(config.safetyChecks) : undefined,
          crisisKeywords: config.crisisKeywords ? JSON.stringify(config.crisisKeywords) : undefined,
          escalationProtocols: config.escalationProtocols,
          disclaimers: config.disclaimers,
          complianceStatus: 'pending',
          lastReviewed: new Date()
        }
      });

      return this.formatPersonalityConfig(profile);
    } catch (error) {
      console.error('Failed to update personality:', error);
      throw error;
    }
  }

  /**
   * Set active personality for a user
   */
  async setActivePersonality(userId: string, personalityId: string): Promise<void> {
    try {
      // Deactivate all other personalities
      await prisma.personalityProfile.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false }
      });

      // Activate the selected personality
      await prisma.personalityProfile.update({
        where: { id: personalityId },
        data: { isActive: true }
      });

      console.log(`Active personality set to ${personalityId} for user ${userId}`);
    } catch (error) {
      console.error('Failed to set active personality:', error);
      throw error;
    }
  }

  /**
   * Detect crisis in user message
   */
  detectCrisis(userMessage: string): CrisisDetectionResult {
    const lowerMessage = userMessage.toLowerCase();
    const detectedKeywords: string[] = [];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let shouldEscalate = false;
    let escalationReason = '';

    // Check for crisis keywords
    for (const keyword of this.crisisKeywords) {
      if (lowerMessage.includes(keyword)) {
        detectedKeywords.push(keyword);
        
        // Determine severity
        if (keyword.includes('suicide') || keyword.includes('kill myself') || keyword.includes('end my life')) {
          severity = 'critical';
          shouldEscalate = true;
          escalationReason = 'Suicidal ideation detected';
        } else if (keyword.includes('hurt someone') || keyword.includes('violence')) {
          severity = 'critical';
          shouldEscalate = true;
          escalationReason = 'Violent ideation detected';
        } else if (keyword.includes('right now') || keyword.includes('immediate') || keyword.includes('emergency')) {
          severity = 'high';
          shouldEscalate = true;
          escalationReason = 'Immediate crisis indicated';
        } else if (severity === 'low') {
          severity = 'medium';
        }
      }
    }

    // Check for escalation triggers
    for (const trigger of this.escalationTriggers) {
      if (lowerMessage.includes(trigger)) {
        shouldEscalate = true;
        escalationReason = 'Specific escalation trigger detected';
        if (severity !== 'critical') {
          severity = 'high';
        }
      }
    }

    const isCrisis = detectedKeywords.length > 0 || shouldEscalate;

    return {
      isCrisis,
      severity,
      detectedKeywords,
      recommendedAction: this.getRecommendedAction(severity, shouldEscalate),
      shouldEscalate,
      escalationReason
    };
  }

  /**
   * Validate safety protocols for personality configuration
   */
  validateSafetyProtocols(config: Partial<PersonalityConfig>): SafetyCheckResult {
    const warnings: string[] = [];
    const blockedContent: string[] = [];
    const recommendations: string[] = [];

    // Check for required safety elements
    if (!config.safetyProtocols || config.safetyProtocols.length < 100) {
      warnings.push('Safety protocols are too brief or missing');
      recommendations.push('Include comprehensive safety protocols with crisis detection and escalation procedures');
    }

    if (!config.crisisIntervention) {
      warnings.push('Crisis intervention protocols are missing');
      recommendations.push('Add specific crisis intervention procedures');
    }

    if (!config.disclaimers) {
      warnings.push('Required disclaimers are missing');
      recommendations.push('Include clear disclaimers about limitations and when to seek professional help');
    }

    if (!config.boundarySettings) {
      warnings.push('Professional boundaries are not defined');
      recommendations.push('Define clear professional boundaries and limitations');
    }

    // Check for dangerous content in instructions
    const dangerousPatterns = [
      'diagnose', 'prescribe', 'medical advice', 'treatment plan',
      'guarantee', 'cure', 'promise', 'always', 'never'
    ];

    const instructions = (config.coreInstructions || '').toLowerCase();
    for (const pattern of dangerousPatterns) {
      if (instructions.includes(pattern)) {
        blockedContent.push(`Contains potentially dangerous term: "${pattern}"`);
      }
    }

    const passed = warnings.length === 0 && blockedContent.length === 0;

    return {
      passed,
      warnings,
      blockedContent,
      recommendations
    };
  }

  /**
   * Generate therapeutic response with safety checks
   */
  async generateTherapeuticResponse(
    personalityId: string,
    userMessage: string,
    conversationContext: string
  ): Promise<{ response: string; safetyFlags: string[]; crisisDetected: boolean }> {
    try {
      const personality = await prisma.personalityProfile.findUnique({
        where: { id: personalityId }
      });

      if (!personality) {
        throw new Error('Personality not found');
      }

      // Crisis detection
      const crisisResult = this.detectCrisis(userMessage);
      
      // Safety validation
      const safetyResult = this.validateSafetyProtocols({
        ...personality,
        description: personality.description || undefined,
        therapeuticTechniques: personality.therapeuticTechniques || undefined,
        therapeuticApproach: personality.therapeuticApproach || undefined,
        specialization: personality.specialization || undefined,
        boundarySettings: personality.boundarySettings || undefined,
        safetyChecks: personality.safetyChecks ? JSON.parse(personality.safetyChecks) : undefined,
        crisisKeywords: personality.crisisKeywords ? JSON.parse(personality.crisisKeywords) : undefined
      });

      let response = '';
      const safetyFlags: string[] = [];

      if (crisisResult.isCrisis) {
        // Crisis response takes priority
        response = this.generateCrisisResponse(crisisResult, personality);
        safetyFlags.push('crisis_detected');
        safetyFlags.push(`severity_${crisisResult.severity}`);
      } else {
        // Normal therapeutic response
        response = this.generateNormalResponse(personality, userMessage, conversationContext);
      }

      // Add safety disclaimers
      if (personality.disclaimers) {
        response += `\n\n${personality.disclaimers}`;
      }

      // Log usage for monitoring
      await this.logPersonalityUsage(personalityId, userMessage, crisisResult.isCrisis);

      return {
        response,
        safetyFlags,
        crisisDetected: crisisResult.isCrisis
      };
    } catch (error) {
      console.error('Failed to generate therapeutic response:', error);
      throw error;
    }
  }

  /**
   * Generate crisis response
   */
  private generateCrisisResponse(crisisResult: CrisisDetectionResult, personality: any): string {
    const baseResponse = `I'm very concerned about what you're sharing with me. Your safety is the most important thing right now.

${personality.crisisIntervention || 'Please consider reaching out to a mental health professional or crisis hotline immediately.'}

If you're in immediate danger, please call emergency services (911 in the US) or a crisis hotline:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency Services: 911

You don't have to go through this alone. There are people who want to help you.`;

    if (crisisResult.shouldEscalate) {
      return `${baseResponse}

IMPORTANT: Based on what you've shared, I strongly recommend speaking with a mental health professional as soon as possible. This conversation cannot replace professional medical or mental health care.`;
    }

    return baseResponse;
  }

  /**
   * Generate normal therapeutic response
   */
  private generateNormalResponse(personality: any, userMessage: string, conversationContext: string): string {
    // This would integrate with the AI model to generate responses
    // For now, return a placeholder that incorporates personality settings
    return `Based on your message, I want to respond in a way that's helpful and supportive. 

${personality.coreInstructions}

I'm here to listen and support you. Remember that while I can provide a listening ear and some guidance, I'm not a replacement for professional mental health care.`;
  }

  /**
   * Get recommended action based on crisis severity
   */
  private getRecommendedAction(severity: string, shouldEscalate: boolean): string {
    switch (severity) {
      case 'critical':
        return 'Immediate escalation to crisis intervention';
      case 'high':
        return 'Urgent referral to mental health professional';
      case 'medium':
        return 'Monitor closely and provide support resources';
      case 'low':
        return 'Continue therapeutic conversation with increased awareness';
      default:
        return 'Continue normal therapeutic conversation';
    }
  }

  /**
   * Log personality usage for monitoring
   */
  private async logPersonalityUsage(personalityId: string, userMessage: string, crisisDetected: boolean, userId?: string): Promise<void> {
    try {
      await prisma.personalityUsage.create({
        data: {
          personalityId,
          userId: userId || 'anonymous',
          messageCount: 1,
          crisisDetected,
          startedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to log personality usage:', error);
    }
  }

  /**
   * Format personality config from database
   */
  private formatPersonalityConfig(profile: any): PersonalityConfig {
    return {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      category: profile.category,
      therapeuticApproach: profile.therapeuticApproach,
      specialization: profile.specialization,
      coreInstructions: profile.coreInstructions,
      safetyProtocols: profile.safetyProtocols,
      therapeuticTechniques: profile.therapeuticTechniques,
      boundarySettings: profile.boundarySettings,
      crisisIntervention: profile.crisisIntervention,
      communicationStyle: profile.communicationStyle,
      responseLength: profile.responseLength,
      empathyLevel: profile.empathyLevel,
      directiveLevel: profile.directiveLevel,
      safetyChecks: profile.safetyChecks ? JSON.parse(profile.safetyChecks) : undefined,
      crisisKeywords: profile.crisisKeywords ? JSON.parse(profile.crisisKeywords) : undefined,
      escalationProtocols: profile.escalationProtocols,
      disclaimers: profile.disclaimers
    };
  }
}

export const personalityService = PersonalityService.getInstance();
