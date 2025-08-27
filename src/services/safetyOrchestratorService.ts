import { CrisisInterventionSystem } from '../ai/crisis_intervention_system';
import { dependencyMonitoringService, DependencyIntervention } from './dependencyMonitoringService';
import { minorsProtectionService, AgeVerificationResult } from './minorsProtectionService';
import { privacyTransparencyService } from './privacyTransparencyService';

export interface SafetyAssessment {
  userId: string;
  sessionId: string;
  timestamp: Date;
  crisisLevel: 'none' | 'low' | 'medium' | 'high' | 'crisis' | 'emergency';
  psychosisDetected: boolean;
  requiresLowAffectMode: boolean;
  dependencyRisk: 'low' | 'medium' | 'high';
  userAge: 'child' | 'teen' | 'young_adult' | 'adult' | 'unknown';
  privacyCompliant: boolean;
  interventions: SafetyIntervention[];
  safetyStatus: 'safe' | 'warning' | 'critical';
  recommendations: string[];
}

export interface SafetyIntervention {
  type: 'crisis_response' | 'psychosis_protocol' | 'dependency_prevention' | 'youth_protection' | 'privacy_notice';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  required: boolean;
  actionRequired: string;
  cooldownPeriod?: number;
}

export interface SafetyResponse {
  safeToContinue: boolean;
  message: string;
  interventions: SafetyIntervention[];
  crisisResources: string[];
  disclaimers: string[];
  nextSteps: string[];
}

export class SafetyOrchestratorService {
  private static instance: SafetyOrchestratorService;
  private crisisSystem: CrisisInterventionSystem;
  
  private constructor() {
    this.crisisSystem = new CrisisInterventionSystem();
  }

  public static getInstance(): SafetyOrchestratorService {
    if (!SafetyOrchestratorService.instance) {
      SafetyOrchestratorService.instance = new SafetyOrchestratorService();
    }
    return SafetyOrchestratorService.instance;
  }

  /**
   * Comprehensive safety assessment for user input
   */
  async assessSafety(
    userId: string,
    sessionId: string,
    userInput: string,
    context?: {
      previousMessages?: string[];
      sessionStartTime?: Date;
      userProfile?: any;
    }
  ): Promise<SafetyAssessment> {
    try {
      // 1. Crisis assessment
      const crisisAssessment = this.crisisSystem.assessCrisis(userInput, context?.userProfile);
      
      // 2. Dependency monitoring
      const dependencyMetrics = await dependencyMonitoringService.getDependencyMetrics(userId);
      
      // 3. Age verification
      const ageVerification = await minorsProtectionService.verifyAge(userId, undefined, [userInput]);
      
      // 4. Privacy compliance check
      const privacyStatus = await privacyTransparencyService.getPrivacyComplianceStatus(userId);
      
      // 5. Generate interventions
      const interventions = await this.generateSafetyInterventions(
        userId,
        crisisAssessment,
        dependencyMetrics,
        ageVerification,
        privacyStatus
      );
      
      // 6. Determine overall safety status
      const safetyStatus = this.determineSafetyStatus(
        crisisAssessment.level,
        crisisAssessment.psychosisDetected,
        dependencyMetrics.dependencyRisk
      );
      
      // 7. Generate recommendations
      const recommendations = this.generateSafetyRecommendations(
        crisisAssessment,
        dependencyMetrics,
        ageVerification,
        privacyStatus
      );
      
      return {
        userId,
        sessionId,
        timestamp: new Date(),
        crisisLevel: crisisAssessment.level,
        psychosisDetected: crisisAssessment.psychosisDetected,
        requiresLowAffectMode: crisisAssessment.requiresLowAffectMode,
        dependencyRisk: dependencyMetrics.dependencyRisk,
        userAge: ageVerification.ageGroup,
        privacyCompliant: privacyStatus.compliant,
        interventions,
        safetyStatus,
        recommendations
      };
    } catch (error) {
      console.error('Error in safety assessment:', error);
      // Return safe default if assessment fails
      return this.getDefaultSafetyAssessment(userId, sessionId);
    }
  }

  /**
   * Generate comprehensive safety response
   */
  async generateSafetyResponse(assessment: SafetyAssessment): Promise<SafetyResponse> {
    const interventions = assessment.interventions;
    const crisisResources = this.getCrisisResources(assessment);
    const disclaimers = this.getSafetyDisclaimers(assessment);
    const nextSteps = this.getNextSteps(assessment);
    
    // Determine if it's safe to continue
    const safeToContinue = this.isSafeToContinue(assessment);
    
    // Generate main message
    const message = this.generateSafetyMessage(assessment);
    
    return {
      safeToContinue,
      message,
      interventions,
      crisisResources,
      disclaimers,
      nextSteps
    };
  }

  /**
   * Check if session can start safely
   */
  async checkSessionStart(
    userId: string,
    sessionId: string
  ): Promise<{
    allowed: boolean;
    reason?: string;
    interventions?: SafetyIntervention[];
  }> {
    try {
      // Check dependency limits
      const dependencyCheck = await dependencyMonitoringService.startSession(userId, sessionId);
      
      if (!dependencyCheck.allowed) {
        return {
          allowed: false,
          reason: 'Daily session limit reached or dependency risk too high',
          interventions: dependencyCheck.intervention ? [{
            type: 'dependency_prevention',
            priority: 'high',
            message: dependencyCheck.intervention.message,
            required: true,
            actionRequired: 'Take a break and return later'
          }] : undefined
        };
      }
      
      // Check if user needs privacy notice
      const needsPrivacyReminder = await privacyTransparencyService.needsPrivacyReminder(userId);
      
      if (needsPrivacyReminder) {
        return {
          allowed: true,
          reason: 'Session allowed but privacy notice required',
          interventions: [{
            type: 'privacy_notice',
            priority: 'medium',
            message: 'Please review and acknowledge our updated privacy policy',
            required: true,
            actionRequired: 'Acknowledge privacy notice'
          }]
        };
      }
      
      return { allowed: true };
    } catch (error) {
      console.error('Error checking session start:', error);
      return { allowed: true }; // Default to allowing if check fails
    }
  }

  /**
   * Apply psychosis safety protocols
   */
  applyPsychosisProtocols(
    userInput: string,
    requiresLowAffectMode: boolean
  ): {
    response: string;
    safetyFlags: string[];
    resources: string[];
  } {
    if (!requiresLowAffectMode) {
      return {
        response: userInput,
        safetyFlags: [],
        resources: []
      };
    }
    
    // Apply low-affect mode
    const lowAffectResponse = this.generateLowAffectResponse(userInput);
    const safetyFlags = ['psychosis_detected', 'low_affect_mode_active'];
    const resources = [
      'Mental Health Crisis Services: 988 or local crisis center',
      'Professional mental health evaluation recommended',
      'Focus on safety and grounding techniques'
    ];
    
    return {
      response: lowAffectResponse,
      safetyFlags,
      resources
    };
  }

  /**
   * Generate safety interventions
   */
  private async generateSafetyInterventions(
    userId: string,
    crisisAssessment: any,
    dependencyMetrics: any,
    ageVerification: AgeVerificationResult,
    privacyStatus: any
  ): Promise<SafetyIntervention[]> {
    const interventions: SafetyIntervention[] = [];
    
    // Crisis interventions
    if (crisisAssessment.level === 'crisis' || crisisAssessment.level === 'emergency') {
      interventions.push({
        type: 'crisis_response',
        priority: 'critical',
        message: 'Immediate crisis intervention required',
        required: true,
        actionRequired: 'Provide crisis resources and professional referral'
      });
    }
    
    // Psychosis interventions
    if (crisisAssessment.psychosisDetected) {
      interventions.push({
        type: 'psychosis_protocol',
        priority: 'critical',
        message: 'Psychosis detected - activate low-affect mode',
        required: true,
        actionRequired: 'Use neutral language, focus on safety, refer to professional'
      });
    }
    
    // Dependency interventions
    if (dependencyMetrics.dependencyRisk === 'high') {
      interventions.push({
        type: 'dependency_prevention',
        priority: 'high',
        message: 'High dependency risk detected',
        required: true,
        actionRequired: 'Implement step-back protocol and encourage professional help'
      });
    }
    
    // Youth protection interventions
    if (ageVerification.ageGroup === 'child' || ageVerification.ageGroup === 'teen') {
      interventions.push({
        type: 'youth_protection',
        priority: 'high',
        message: `Youth protection protocols for ${ageVerification.ageGroup}`,
        required: true,
        actionRequired: 'Apply age-appropriate restrictions and involve trusted adults if needed'
      });
    }
    
    // Privacy interventions
    if (!privacyStatus.compliant) {
      interventions.push({
        type: 'privacy_notice',
        priority: 'medium',
        message: 'Privacy compliance required',
        required: true,
        actionRequired: 'Complete required privacy notices and settings'
      });
    }
    
    return interventions;
  }

  /**
   * Determine overall safety status
   */
  private determineSafetyStatus(
    crisisLevel: string,
    psychosisDetected: boolean,
    dependencyRisk: string
  ): 'safe' | 'warning' | 'critical' {
    if (crisisLevel === 'emergency' || psychosisDetected) {
      return 'critical';
    }
    
    if (crisisLevel === 'crisis' || crisisLevel === 'high' || dependencyRisk === 'high') {
      return 'warning';
    }
    
    return 'safe';
  }

  /**
   * Generate safety recommendations
   */
  private generateSafetyRecommendations(
    crisisAssessment: any,
    dependencyMetrics: any,
    ageVerification: AgeVerificationResult,
    privacyStatus: any
  ): string[] {
    const recommendations: string[] = [];
    
    // Crisis recommendations
    if (crisisAssessment.level === 'crisis' || crisisAssessment.level === 'emergency') {
      recommendations.push('Immediate professional intervention required');
      recommendations.push('Provide crisis resources and safety planning');
    }
    
    // Psychosis recommendations
    if (crisisAssessment.psychosisDetected) {
      recommendations.push('Maintain low-affect mode throughout interaction');
      recommendations.push('Focus on safety and professional referral');
      recommendations.push('Avoid validating delusional content');
    }
    
    // Dependency recommendations
    if (dependencyMetrics.dependencyRisk === 'high') {
      recommendations.push('Implement mandatory step-back period');
      recommendations.push('Encourage professional help and human connection');
      recommendations.push('Limit session frequency and duration');
    }
    
    // Youth recommendations
    if (ageVerification.ageGroup === 'child' || ageVerification.ageGroup === 'teen') {
      recommendations.push('Apply age-appropriate content restrictions');
      recommendations.push('Encourage trusted adult involvement for serious concerns');
      recommendations.push('Use youth-specific crisis resources');
    }
    
    // Privacy recommendations
    if (!privacyStatus.compliant) {
      recommendations.push('Complete required privacy notices');
      recommendations.push('Review and update privacy settings');
      recommendations.push('Acknowledge data use policies');
    }
    
    return recommendations;
  }

  /**
   * Get crisis resources based on assessment
   */
  private getCrisisResources(assessment: SafetyAssessment): string[] {
    const resources: string[] = [];
    
    if (assessment.crisisLevel === 'crisis' || assessment.crisisLevel === 'emergency') {
      resources.push('988 Suicide & Crisis Lifeline');
      resources.push('Crisis Text Line: Text HOME to 741741');
      resources.push('911 for immediate emergencies');
    }
    
    if (assessment.psychosisDetected) {
      resources.push('Mental Health Crisis Services');
      resources.push('Professional psychiatric evaluation');
      resources.push('Local crisis intervention team');
    }
    
    if (assessment.userAge === 'child' || assessment.userAge === 'teen') {
      resources.push('Teen Line: 310-855-4673');
      resources.push('School counselor or trusted adult');
      resources.push('Youth-specific crisis resources');
    }
    
    return resources;
  }

  /**
   * Get safety disclaimers
   */
  private getSafetyDisclaimers(assessment: SafetyAssessment): string[] {
    const disclaimers: string[] = [];
    
    // General disclaimers
    disclaimers.push('I\'m an AI companion, not a licensed therapist');
    disclaimers.push('For serious mental health concerns, please consult a professional');
    
    // Crisis disclaimers
    if (assessment.crisisLevel === 'crisis' || assessment.crisisLevel === 'emergency') {
      disclaimers.push('In emergencies, contact 911 or go to your nearest emergency room');
    }
    
    // Psychosis disclaimers
    if (assessment.psychosisDetected) {
      disclaimers.push('If you report hallucinations or unusual experiences, I\'ll encourage you to talk to a clinician');
    }
    
    // Youth disclaimers
    if (assessment.userAge === 'child' || assessment.userAge === 'teen') {
      disclaimers.push('For serious concerns, please talk to a trusted adult or professional');
      disclaimers.push('Your safety is the most important thing');
    }
    
    // Privacy disclaimers
    disclaimers.push('This chat isn\'t therapy-confidential. See our Privacy Policy for data practices');
    
    return disclaimers;
  }

  /**
   * Get next steps
   */
  private getNextSteps(assessment: SafetyAssessment): string[] {
    const steps: string[] = [];
    
    if (assessment.crisisLevel === 'crisis' || assessment.crisisLevel === 'emergency') {
      steps.push('Contact crisis resources immediately');
      steps.push('Seek professional mental health evaluation');
      steps.push('Develop safety plan with trusted individuals');
    }
    
    if (assessment.psychosisDetected) {
      steps.push('Schedule appointment with mental health professional');
      steps.push('Focus on safety and grounding techniques');
      steps.push('Avoid making major decisions until stable');
    }
    
    if (assessment.dependencyRisk === 'high') {
      steps.push('Take mandatory break from AI interactions');
      steps.push('Connect with human support network');
      steps.push('Consider professional therapy for ongoing support');
    }
    
    if (assessment.userAge === 'child' || assessment.userAge === 'teen') {
      steps.push('Involve trusted adult in decision-making');
      steps.push('Use youth-appropriate resources and support');
      steps.push('Build healthy coping skills with guidance');
    }
    
    if (!assessment.privacyCompliant) {
      steps.push('Complete required privacy notices');
      steps.push('Review and update privacy settings');
      steps.push('Understand your data rights and options');
    }
    
    return steps;
  }

  /**
   * Check if it's safe to continue
   */
  private isSafeToContinue(assessment: SafetyAssessment): boolean {
    // Critical safety issues - stop immediately
    if (assessment.safetyStatus === 'critical') {
      return false;
    }
    
    // High dependency risk - require intervention
    if (assessment.dependencyRisk === 'high') {
      return false;
    }
    
    // Crisis level - require immediate attention
    if (assessment.crisisLevel === 'crisis' || assessment.crisisLevel === 'emergency') {
      return false;
    }
    
    return true;
  }

  /**
   * Generate safety message
   */
  private generateSafetyMessage(assessment: SafetyAssessment): string {
    let message = '';
    
    if (assessment.safetyStatus === 'critical') {
      message = '⚠️ CRITICAL SAFETY ALERT: Your safety is our top priority. ';
      if (assessment.psychosisDetected) {
        message += 'I\'ve detected signs that require immediate professional attention. ';
      }
      if (assessment.crisisLevel === 'emergency') {
        message += 'This is an emergency situation requiring immediate help. ';
      }
      message += 'Please contact emergency services or crisis resources right away.';
    } else if (assessment.safetyStatus === 'warning') {
      message = '⚠️ Safety Notice: I\'ve detected some concerning indicators. ';
      if (assessment.psychosisDetected) {
        message += 'I\'ll be using a more neutral approach to keep you safe. ';
      }
      if (assessment.dependencyRisk === 'high') {
        message += 'I\'m concerned about our interaction frequency. ';
      }
      message += 'Let\'s focus on your safety and getting appropriate support.';
    } else {
      message = '✅ Safety Status: Normal. I\'m here to support you within appropriate boundaries.';
    }
    
    return message;
  }

  /**
   * Generate low-affect response for psychosis
   */
  private generateLowAffectResponse(userInput: string): string {
    return `I understand you're experiencing something that feels very real to you. I want to help you stay safe and connected to professional support. What you're describing sounds like it might be related to your mental health, and a mental health professional can help you understand and manage these experiences. Let's focus on keeping you safe right now.`;
  }

  /**
   * Get default safety assessment
   */
  private getDefaultSafetyAssessment(userId: string, sessionId: string): SafetyAssessment {
    return {
      userId,
      sessionId,
      timestamp: new Date(),
      crisisLevel: 'none',
      psychosisDetected: false,
      requiresLowAffectMode: false,
      dependencyRisk: 'low',
      userAge: 'adult',
      privacyCompliant: true,
      interventions: [],
      safetyStatus: 'safe',
      recommendations: []
    };
  }
}

export const safetyOrchestratorService = SafetyOrchestratorService.getInstance();
