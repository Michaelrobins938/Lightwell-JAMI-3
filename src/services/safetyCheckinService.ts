import { prisma } from '../lib/database'; // Placeholder for database interaction

export interface SafetyCheckin {
  id: string;
  userId: string;
  type: 'crisis_followup' | 'dependency_check' | 'wellness_check' | 'safety_reminder';
  status: 'pending' | 'sent' | 'responded' | 'escalated' | 'resolved';
  scheduledFor: Date;
  sentAt?: Date;
  respondedAt?: Date;
  escalatedAt?: Date;
  resolvedAt?: Date;
  message: string;
  userResponse?: string;
  escalationReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckinTemplate {
  type: string;
  title: string;
  message: string;
  followUpActions: string[];
  escalationThreshold: number; // hours before escalation
}

export interface CheckinSchedule {
  userId: string;
  checkinType: string;
  frequency: 'immediate' | '1_hour' | '4_hours' | '24_hours' | '3_days' | '1_week';
  lastSent?: Date;
  nextDue?: Date;
  isActive: boolean;
}

export class SafetyCheckinService {
  private static instance: SafetyCheckinService;
  
  // Checkin templates for different scenarios
  private readonly CHECKIN_TEMPLATES: Record<string, CheckinTemplate> = {
    crisis_followup: {
      type: 'crisis_followup',
      title: 'How are you feeling today?',
      message: `Hi there, I wanted to check in on how you're doing after our recent conversation. 
      
Are you feeling better? Do you have support from friends, family, or a mental health professional?

Remember, if you're still struggling, please reach out to:
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• Your therapist or mental health provider
• Emergency services: 911

Your wellbeing is important to us.`,
      followUpActions: [
        'Schedule follow-up with mental health professional',
        'Connect with support network',
        'Practice self-care activities',
        'Consider crisis resources if needed'
      ],
      escalationThreshold: 24 // 24 hours
    },
    
    dependency_check: {
      type: 'dependency_check',
      title: 'Checking in on your AI usage',
      message: `Hi there, I noticed you've been using Jamie quite frequently lately. 
      
While we're here to support you, it's important to maintain a healthy balance. Consider:
• Taking breaks between sessions
• Connecting with human relationships
• Engaging in offline activities
• Seeking professional help if needed

How are you feeling about your current usage patterns?`,
      followUpActions: [
        'Reduce session frequency',
        'Set healthy boundaries',
        'Connect with human support',
        'Seek professional guidance'
      ],
      escalationThreshold: 72 // 72 hours
    },
    
    wellness_check: {
      type: 'wellness_check',
      title: 'Wellness check-in',
      message: `Hi there! It's been a while since we last connected. 
      
How are you doing overall? Are you:
• Managing stress effectively?
• Maintaining healthy routines?
• Connecting with your support network?
• Practicing self-care?

Remember, we're here when you need support, but your long-term wellbeing benefits from a balanced approach.`,
      followUpActions: [
        'Maintain healthy routines',
        'Connect with support network',
        'Practice self-care',
        'Schedule professional check-in if needed'
      ],
      escalationThreshold: 168 // 1 week
    },
    
    safety_reminder: {
      type: 'safety_reminder',
      title: 'Safety reminder',
      message: `Hi there, I wanted to remind you about some important safety information:
      
• Jamie AI is a supportive tool, not a replacement for professional care
• In crisis situations, always seek human help
• Emergency resources are available 24/7
• Your safety is our top priority

Do you have any questions about when to seek professional help?`,
      followUpActions: [
        'Review safety protocols',
        'Save emergency contacts',
        'Identify support resources',
        'Plan crisis response'
      ],
      escalationThreshold: 48 // 48 hours
    }
  };

  public static getInstance(): SafetyCheckinService {
    if (!SafetyCheckinService.instance) {
      SafetyCheckinService.instance = new SafetyCheckinService();
    }
    return SafetyCheckinService.instance;
  }

  /**
   * Schedule a safety check-in after a crisis episode
   */
  async scheduleCrisisFollowup(
    userId: string, 
    crisisData: any, 
    severity: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<SafetyCheckin> {
    const template = this.CHECKIN_TEMPLATES.crisis_followup;
    
    // Determine follow-up timing based on crisis severity
    const followUpDelay = this.getCrisisFollowUpDelay(severity);
    const scheduledFor = new Date(Date.now() + followUpDelay);
    
    const checkin: Omit<SafetyCheckin, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      type: 'crisis_followup',
      status: 'pending',
      scheduledFor,
      message: this.personalizeMessage(template.message, crisisData),
      metadata: {
        crisisSeverity: severity,
        crisisType: crisisData.type,
        crisisTimestamp: crisisData.timestamp,
        followUpDelay
      }
    };

    // Store in database (placeholder)
    const id = `checkin_${Date.now()}_${userId}`;
    const now = new Date();
    
    return {
      ...checkin,
      id,
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Schedule dependency monitoring check-ins
   */
  async scheduleDependencyCheck(
    userId: string, 
    dependencyMetrics: any
  ): Promise<SafetyCheckin> {
    const template = this.CHECKIN_TEMPLATES.dependency_check;
    
    // Schedule based on dependency risk level
    const delay = this.getDependencyCheckDelay(dependencyMetrics.riskLevel);
    const scheduledFor = new Date(Date.now() + delay);
    
    const checkin: Omit<SafetyCheckin, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      type: 'dependency_check',
      status: 'pending',
      scheduledFor,
      message: this.personalizeMessage(template.message, dependencyMetrics),
      metadata: {
        dependencyRisk: dependencyMetrics.riskLevel,
        sessionFrequency: dependencyMetrics.dailySessions,
        totalTime: dependencyMetrics.dailyTime,
        consecutiveDays: dependencyMetrics.consecutiveDays
      }
    };

    const id = `checkin_${Date.now()}_${userId}`;
    const now = new Date();
    
    return {
      ...checkin,
      id,
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Schedule regular wellness check-ins
   */
  async scheduleWellnessCheck(userId: string): Promise<SafetyCheckin> {
    const template = this.CHECKIN_TEMPLATES.wellness_check;
    
    // Schedule for 1 week from now
    const scheduledFor = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const checkin: Omit<SafetyCheckin, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      type: 'wellness_check',
      status: 'pending',
      scheduledFor,
      message: template.message,
      metadata: {
        checkinType: 'scheduled_wellness',
        frequency: 'weekly'
      }
    };

    const id = `checkin_${Date.now()}_${userId}`;
    const now = new Date();
    
    return {
      ...checkin,
      id,
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Get all pending check-ins for a user
   */
  async getPendingCheckins(userId: string): Promise<SafetyCheckin[]> {
    // Placeholder - would query database
    return [];
  }

  /**
   * Mark a check-in as sent
   */
  async markCheckinSent(checkinId: string): Promise<void> {
    // Placeholder - would update database
    console.log(`Check-in ${checkinId} marked as sent`);
  }

  /**
   * Record user response to check-in
   */
  async recordUserResponse(
    checkinId: string, 
    response: string, 
    requiresEscalation: boolean = false
  ): Promise<void> {
    // Placeholder - would update database
    console.log(`User response recorded for check-in ${checkinId}:`, response);
    
    if (requiresEscalation) {
      await this.escalateCheckin(checkinId, 'User response indicates need for escalation');
    }
  }

  /**
   * Escalate a check-in if needed
   */
  async escalateCheckin(checkinId: string, reason: string): Promise<void> {
    // Placeholder - would update database and trigger human intervention
    console.log(`Check-in ${checkinId} escalated:`, reason);
  }

  /**
   * Check for overdue check-ins that need escalation
   */
  async checkForOverdueCheckins(): Promise<SafetyCheckin[]> {
    const now = new Date();
    const overdueCheckins: SafetyCheckin[] = [];
    
    // Placeholder - would query database for overdue check-ins
    // This would find check-ins that are past their escalation threshold
    
    return overdueCheckins;
  }

  /**
   * Get check-in statistics for monitoring
   */
  async getCheckinStats(userId: string, timeframe: 'day' | 'week' | 'month'): Promise<{
    total: number;
    pending: number;
    sent: number;
    responded: number;
    escalated: number;
    resolved: number;
  }> {
    // Placeholder - would query database
    return {
      total: 0,
      pending: 0,
      sent: 0,
      responded: 0,
      escalated: 0,
      resolved: 0
    };
  }

  /**
   * Personalize check-in messages based on context
   */
  private personalizeMessage(template: string, context: any): string {
    let message = template;
    
    // Replace placeholders with context data
    if (context.userName) {
      message = message.replace(/Hi there/g, `Hi ${context.userName}`);
    }
    
    if (context.crisisType) {
      message = message.replace(/recent conversation/g, `recent ${context.crisisType} situation`);
    }
    
    if (context.dependencyRisk === 'high') {
      message = message.replace(/quite frequently lately/g, 'very frequently lately');
    }
    
    return message;
  }

  /**
   * Determine follow-up delay based on crisis severity
   */
  private getCrisisFollowUpDelay(severity: string): number {
    switch (severity) {
      case 'critical':
        return 1 * 60 * 60 * 1000; // 1 hour
      case 'high':
        return 4 * 60 * 60 * 1000; // 4 hours
      case 'medium':
        return 24 * 60 * 60 * 1000; // 24 hours
      case 'low':
        return 72 * 60 * 60 * 1000; // 3 days
      default:
        return 24 * 60 * 60 * 1000; // Default 24 hours
    }
  }

  /**
   * Determine dependency check delay based on risk level
   */
  private getDependencyCheckDelay(riskLevel: string): number {
    switch (riskLevel) {
      case 'high':
        return 24 * 60 * 60 * 1000; // 24 hours
      case 'medium':
        return 72 * 60 * 60 * 1000; // 3 days
      case 'low':
        return 7 * 24 * 60 * 60 * 1000; // 1 week
      default:
        return 7 * 24 * 60 * 60 * 1000; // Default 1 week
    }
  }

  /**
   * Get check-in template by type
   */
  getCheckinTemplate(type: string): CheckinTemplate | undefined {
    return this.CHECKIN_TEMPLATES[type];
  }

  /**
   * Get all available check-in types
   */
  getAvailableCheckinTypes(): string[] {
    return Object.keys(this.CHECKIN_TEMPLATES);
  }
}

export const safetyCheckinService = SafetyCheckinService.getInstance();
