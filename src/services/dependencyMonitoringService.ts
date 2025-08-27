import { prisma } from '../lib/database';

export interface DependencyMetrics {
  userId: string;
  sessionCount: number;
  totalSessionTime: number;
  averageSessionLength: number;
  dailyUsage: number;
  weeklyUsage: number;
  dependencyRisk: 'low' | 'medium' | 'high';
  lastSessionDate: Date;
  consecutiveDays: number;
  stepBackPrompts: number;
  professionalReferrals: number;
}

export interface SessionData {
  userId: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  messageCount: number;
  crisisDetected: boolean;
  dependencyIndicators: string[];
}

export interface DependencyIntervention {
  type: 'session_limit' | 'break_prompt' | 'step_back' | 'professional_referral' | 'boundary_setting';
  message: string;
  required: boolean;
  cooldownPeriod?: number;
}

export class DependencyMonitoringService {
  private static instance: DependencyMonitoringService;
  
  // Dependency thresholds
  private readonly DAILY_SESSION_LIMIT = 3;
  private readonly DAILY_TIME_LIMIT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  private readonly SESSION_LENGTH_LIMIT = 45 * 60 * 1000; // 45 minutes
  private readonly CONSECUTIVE_DAYS_LIMIT = 7;
  private readonly STEP_BACK_FREQUENCY = 3; // Every 3 sessions

  private constructor() {}

  public static getInstance(): DependencyMonitoringService {
    if (!DependencyMonitoringService.instance) {
      DependencyMonitoringService.instance = new DependencyMonitoringService();
    }
    return DependencyMonitoringService.instance;
  }

  /**
   * Start a new session and check for dependency risks
   */
  async startSession(userId: string, sessionId: string): Promise<{
    allowed: boolean;
    intervention?: DependencyIntervention;
    metrics: DependencyMetrics;
  }> {
    try {
      // Get current dependency metrics
      const metrics = await this.getDependencyMetrics(userId);
      
      // Check if session should be allowed
      const sessionAllowed = this.checkSessionAllowance(metrics);
      
      // Generate intervention if needed
      const intervention = this.generateIntervention(metrics);
      
      // Record session start
      await this.recordSessionStart(userId, sessionId);
      
      return {
        allowed: sessionAllowed,
        intervention,
        metrics
      };
    } catch (error) {
      console.error('Error starting session:', error);
      // Default to allowing session if monitoring fails
      return {
        allowed: true,
        metrics: await this.getDefaultMetrics(userId)
      };
    }
  }

  /**
   * End a session and update metrics
   */
  async endSession(userId: string, sessionId: string, messageCount: number, crisisDetected: boolean): Promise<void> {
    try {
      await this.recordSessionEnd(userId, sessionId, messageCount, crisisDetected);
      await this.updateDependencyMetrics(userId);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  /**
   * Check if user can start a new session
   */
  private checkSessionAllowance(metrics: DependencyMetrics): boolean {
    // Check daily session limit
    if (metrics.dailyUsage >= this.DAILY_SESSION_LIMIT) {
      return false;
    }
    
    // Check daily time limit
    if (metrics.totalSessionTime >= this.DAILY_TIME_LIMIT) {
      return false;
    }
    
    // Check consecutive days limit
    if (metrics.consecutiveDays >= this.CONSECUTIVE_DAYS_LIMIT) {
      return false;
    }
    
    return true;
  }

  /**
   * Generate appropriate intervention based on dependency metrics
   */
  private generateIntervention(metrics: DependencyMetrics): DependencyIntervention | undefined {
    // High dependency risk - require step back
    if (metrics.dependencyRisk === 'high') {
      return {
        type: 'step_back',
        message: 'I notice we\'ve been talking frequently. It\'s important to take breaks and connect with other people in your life. Consider reaching out to friends, family, or a therapist for ongoing support.',
        required: true,
        cooldownPeriod: 24 * 60 * 60 * 1000 // 24 hours
      };
    }
    
    // Medium dependency risk - suggest break
    if (metrics.dependencyRisk === 'medium') {
      return {
        type: 'break_prompt',
        message: 'We\'ve had a good conversation. Consider taking a break to process what we discussed and practice any techniques we covered. I\'ll be here when you\'re ready to talk again.',
        required: false
      };
    }
    
    // Step back prompt every few sessions
    if (metrics.sessionCount > 0 && metrics.sessionCount % this.STEP_BACK_FREQUENCY === 0) {
      return {
        type: 'step_back',
        message: 'I\'m here to support you, but I\'m not a replacement for human connection. Consider how you can build your support network with friends, family, or professionals.',
        required: false
      };
    }
    
    return undefined;
  }

  /**
   * Get dependency metrics for a user
   */
  async getDependencyMetrics(userId: string): Promise<DependencyMetrics> {
    try {
      // Get session data from database
      const sessions = await this.getUserSessions(userId);
      
      // Calculate metrics
      const sessionCount = sessions.length;
      const totalSessionTime = sessions.reduce((total, session) => total + (session.duration || 0), 0);
      const averageSessionLength = sessionCount > 0 ? totalSessionTime / sessionCount : 0;
      
      // Calculate daily and weekly usage
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const dailyUsage = sessions.filter(s => s.startTime >= oneDayAgo).length;
      const weeklyUsage = sessions.filter(s => s.startTime >= oneWeekAgo).length;
      
      // Calculate consecutive days
      const consecutiveDays = this.calculateConsecutiveDays(sessions);
      
      // Determine dependency risk
      const dependencyRisk = this.calculateDependencyRisk({
        sessionCount,
        dailyUsage,
        weeklyUsage,
        averageSessionLength,
        consecutiveDays
      });
      
      // Get last session date
      const lastSessionDate = sessions.length > 0 ? sessions[0].startTime : new Date(0);
      
      return {
        userId,
        sessionCount,
        totalSessionTime,
        averageSessionLength,
        dailyUsage,
        weeklyUsage,
        dependencyRisk,
        lastSessionDate,
        consecutiveDays,
        stepBackPrompts: 0, // TODO: Track from database
        professionalReferrals: 0 // TODO: Track from database
      };
    } catch (error) {
      console.error('Error getting dependency metrics:', error);
      return this.getDefaultMetrics(userId);
    }
  }

  /**
   * Calculate dependency risk level
   */
  private calculateDependencyRisk(metrics: {
    sessionCount: number;
    dailyUsage: number;
    weeklyUsage: number;
    averageSessionLength: number;
    consecutiveDays: number;
  }): 'low' | 'medium' | 'high' {
    let riskScore = 0;
    
    // Daily usage scoring
    if (metrics.dailyUsage >= 3) riskScore += 3;
    else if (metrics.dailyUsage >= 2) riskScore += 2;
    else if (metrics.dailyUsage >= 1) riskScore += 1;
    
    // Weekly usage scoring
    if (metrics.weeklyUsage >= 15) riskScore += 3;
    else if (metrics.weeklyUsage >= 10) riskScore += 2;
    else if (metrics.weeklyUsage >= 5) riskScore += 1;
    
    // Session length scoring
    if (metrics.averageSessionLength >= 60 * 60 * 1000) riskScore += 3; // 1+ hours
    else if (metrics.averageSessionLength >= 30 * 60 * 1000) riskScore += 2; // 30+ minutes
    else if (metrics.averageSessionLength >= 15 * 60 * 1000) riskScore += 1; // 15+ minutes
    
    // Consecutive days scoring
    if (metrics.consecutiveDays >= 7) riskScore += 3;
    else if (metrics.consecutiveDays >= 5) riskScore += 2;
    else if (metrics.consecutiveDays >= 3) riskScore += 1;
    
    // Determine risk level
    if (riskScore >= 8) return 'high';
    else if (riskScore >= 4) return 'medium';
    else return 'low';
  }

  /**
   * Calculate consecutive days of usage
   */
  private calculateConsecutiveDays(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    const now = new Date();
    let consecutiveDays = 0;
    let currentDate = new Date(now);
    
    for (let i = 0; i < 30; i++) { // Check up to 30 days back
      const dayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const hasSessionThisDay = sortedSessions.some(session => 
        session.startTime >= dayStart && session.startTime < dayEnd
      );
      
      if (hasSessionThisDay) {
        consecutiveDays++;
      } else {
        break; // Break on first day without session
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return consecutiveDays;
  }

  /**
   * Get default metrics for new users
   */
  private getDefaultMetrics(userId: string): DependencyMetrics {
    return {
      userId,
      sessionCount: 0,
      totalSessionTime: 0,
      averageSessionLength: 0,
      dailyUsage: 0,
      weeklyUsage: 0,
      dependencyRisk: 'low',
      lastSessionDate: new Date(0),
      consecutiveDays: 0,
      stepBackPrompts: 0,
      professionalReferrals: 0
    };
  }

  /**
   * Record session start
   */
  private async recordSessionStart(userId: string, sessionId: string): Promise<void> {
    try {
      // Store in database or memory
      const sessionData: SessionData = {
        userId,
        sessionId,
        startTime: new Date(),
        messageCount: 0,
        crisisDetected: false,
        dependencyIndicators: []
      };
      
      // TODO: Store in database
      console.log('Session started:', sessionData);
    } catch (error) {
      console.error('Error recording session start:', error);
    }
  }

  /**
   * Record session end
   */
  private async recordSessionEnd(
    userId: string, 
    sessionId: string, 
    messageCount: number, 
    crisisDetected: boolean
  ): Promise<void> {
    try {
      // TODO: Update session in database
      console.log('Session ended:', { userId, sessionId, messageCount, crisisDetected });
    } catch (error) {
      console.error('Error recording session end:', error);
    }
  }

  /**
   * Update dependency metrics
   */
  private async updateDependencyMetrics(userId: string): Promise<void> {
    try {
      // TODO: Update metrics in database
      console.log('Updated dependency metrics for user:', userId);
    } catch (error) {
      console.error('Error updating dependency metrics:', error);
    }
  }

  /**
   * Get user sessions from database
   */
  private async getUserSessions(userId: string): Promise<SessionData[]> {
    try {
      // TODO: Query database for user sessions
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  /**
   * Check if user needs a step-back intervention
   */
  async checkStepBackNeeded(userId: string): Promise<boolean> {
    const metrics = await this.getDependencyMetrics(userId);
    return metrics.dependencyRisk === 'high' || 
           (metrics.sessionCount > 0 && metrics.sessionCount % this.STEP_BACK_FREQUENCY === 0);
  }

  /**
   * Get anti-dependency message for user
   */
  async getAntiDependencyMessage(userId: string): Promise<string> {
    const metrics = await this.getDependencyMetrics(userId);
    
    if (metrics.dependencyRisk === 'high') {
      return 'I notice we\'ve been talking very frequently. While I\'m here to support you, it\'s important to build connections with other people in your life. Consider reaching out to friends, family, or a therapist for ongoing support. Taking breaks between our conversations helps you process what we discuss and practice new skills.';
    } else if (metrics.dependencyRisk === 'medium') {
      return 'We\'ve had a good conversation. Consider taking some time to reflect on what we discussed and practice any techniques we covered. I\'m here when you\'re ready to talk again, but remember that human connection and professional support are also important parts of your mental health journey.';
    } else {
      return 'I\'m here to support you, but I\'m not a replacement for human connection. Consider how you can build your support network with friends, family, or professionals. Taking breaks between our conversations helps you integrate what we discuss.';
    }
  }

  /**
   * Record a step-back intervention
   */
  async recordStepBackIntervention(userId: string): Promise<void> {
    try {
      // TODO: Record in database
      console.log('Step-back intervention recorded for user:', userId);
    } catch (error) {
      console.error('Error recording step-back intervention:', error);
    }
  }

  /**
   * Record a professional referral
   */
  async recordProfessionalReferral(userId: string, referralType: string): Promise<void> {
    try {
      // TODO: Record in database
      console.log('Professional referral recorded for user:', userId, 'Type:', referralType);
    } catch (error) {
      console.error('Error recording professional referral:', error);
    }
  }
}

export const dependencyMonitoringService = DependencyMonitoringService.getInstance();
