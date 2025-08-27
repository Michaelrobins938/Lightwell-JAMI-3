import { sendPasswordResetEmail, sendWelcomeEmail } from './emailService';
import { logger } from './logger';

export interface NotificationOptions {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'crisis';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any;
  email?: boolean;
  push?: boolean;
  inApp?: boolean;
}

export interface NotificationTemplate {
  title: string;
  message: string;
  emailSubject?: string;
  emailBody?: string;
}

export class NotificationService {
  private notificationTemplates: Map<string, NotificationTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Crisis intervention notifications
    this.notificationTemplates.set('crisis_detected', {
      title: 'Crisis Support Available',
      message: 'We detected concerning content in your message. Help is available 24/7.',
      emailSubject: 'Important: Crisis Support Available',
      emailBody: 'We want to make sure you have access to immediate support if you need it.'
    });

    // Mood tracking reminders
    this.notificationTemplates.set('mood_reminder', {
      title: 'How are you feeling?',
      message: 'Take a moment to check in with yourself and track your mood.',
      emailSubject: 'Mood Check-in Reminder',
      emailBody: 'It\'s time for your daily mood check-in. How are you feeling today?'
    });

    // Goal progress updates
    this.notificationTemplates.set('goal_progress', {
      title: 'Goal Progress Update',
      message: 'Great job! You\'re making progress on your goals.',
      emailSubject: 'Goal Progress Update',
      emailBody: 'You\'re making excellent progress on your mental health goals!'
    });

    // Journal reminders
    this.notificationTemplates.set('journal_reminder', {
      title: 'Journal Prompt',
      message: 'Ready to reflect? Here\'s a journal prompt for you.',
      emailSubject: 'Journal Prompt',
      emailBody: 'Take some time to reflect with today\'s journal prompt.'
    });

    // Crisis resources
    this.notificationTemplates.set('crisis_resources', {
      title: 'Crisis Resources',
      message: 'If you\'re in crisis, help is available 24/7.',
      emailSubject: 'Crisis Resources Available',
      emailBody: 'Remember: You\'re not alone. Help is always available.'
    });
  }

  async sendNotification(options: NotificationOptions): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      
      // Log the notification
      logger.info('Sending notification', {
        userId: options.userId,
        title: options.title,
        type: options.type,
        priority: options.priority,
        timestamp
      });

      // Send in-app notification (would be stored in database in production)
      if (options.inApp !== false) {
        await this.sendInAppNotification(options);
      }

      // Send email notification
      if (options.email) {
        await this.sendEmailNotification(options);
      }

      // Send push notification (would integrate with push service in production)
      if (options.push) {
        await this.sendPushNotification(options);
      }

      // Track analytics
      await this.trackNotificationAnalytics(options);

    } catch (error) {
      logger.error('Error sending notification', error instanceof Error ? error : new Error(String(error)), {
        userId: options.userId,
        timestamp: new Date().toISOString()
      });
    }
  }

  private async sendInAppNotification(options: NotificationOptions): Promise<void> {
    // In production, this would store the notification in the database
    // for the user to see when they log in
    logger.info('In-app notification queued', {
      userId: options.userId,
      title: options.title,
      type: options.type
    });
  }

  private async sendEmailNotification(options: NotificationOptions): Promise<void> {
    try {
      const emailSubject = options.title;
      const emailBody = options.message;

      await sendWelcomeEmail(
        `user-${options.userId}@luna-ai.com`, // In production, get actual user email
        'User'
      );

      logger.info('Email notification sent', {
        userId: options.userId,
        subject: emailSubject
      });
    } catch (error) {
      logger.error('Error sending email notification', error instanceof Error ? error : new Error(String(error)), {
        userId: options.userId
      });
    }
  }

  private async sendPushNotification(options: NotificationOptions): Promise<void> {
    // In production, this would integrate with a push notification service
    // like Firebase Cloud Messaging or OneSignal
    logger.info('Push notification sent', {
      userId: options.userId,
      title: options.title,
      type: options.type
    });
  }

  private generateEmailHTML(options: NotificationOptions): string {
    const colorMap = {
      info: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      crisis: '#dc2626'
    };

    const color = colorMap[options.type] || '#6b7280';

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: ${color}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">${options.title}</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; font-size: 16px; line-height: 1.5;">${options.message}</p>
          ${options.data ? `<div style="margin-top: 20px; padding: 15px; background-color: white; border-radius: 6px; border-left: 4px solid ${color};">
            <pre style="margin: 0; font-size: 14px; color: #6b7280;">${JSON.stringify(options.data, null, 2)}</pre>
          </div>` : ''}
        </div>
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
          <p>This notification was sent by Luna AI Mental Health Platform</p>
        </div>
      </div>
    `;
  }

  private async trackNotificationAnalytics(options: NotificationOptions): Promise<void> {
    // In production, this would track notification metrics
    logger.info('Notification analytics tracked', {
      userId: options.userId,
      type: options.type,
      priority: options.priority,
      channels: {
        inApp: options.inApp !== false,
        email: options.email,
        push: options.push
      }
    });
  }

  // Convenience methods for common notification types
  async sendCrisisNotification(userId: string, message: string): Promise<void> {
    await this.sendNotification({
      userId,
      title: 'Crisis Support Available',
      message,
      type: 'crisis',
      priority: 'urgent',
      email: true,
      push: true,
      inApp: true
    });
  }

  async sendMoodReminder(userId: string): Promise<void> {
    await this.sendNotification({
      userId,
      title: 'Mood Check-in',
      message: 'How are you feeling today? Take a moment to check in with yourself.',
      type: 'info',
      priority: 'medium',
      email: true,
      inApp: true
    });
  }

  async sendGoalProgressNotification(userId: string, goalTitle: string, progress: number): Promise<void> {
    await this.sendNotification({
      userId,
      title: 'Goal Progress Update',
      message: `Great job! You're ${progress}% complete on your goal: "${goalTitle}"`,
      type: 'success',
      priority: 'low',
      email: true,
      inApp: true,
      data: { goalTitle, progress }
    });
  }

  async sendJournalReminder(userId: string, prompt?: string): Promise<void> {
    const message = prompt 
      ? `Ready to reflect? Here's your journal prompt: "${prompt}"`
      : 'Take some time to reflect and write in your journal today.';

    await this.sendNotification({
      userId,
      title: 'Journal Reminder',
      message,
      type: 'info',
      priority: 'medium',
      email: true,
      inApp: true,
      data: { prompt }
    });
  }

  async sendWeeklyInsightsNotification(userId: string, insights: any): Promise<void> {
    await this.sendNotification({
      userId,
      title: 'Weekly Insights Available',
      message: 'Your weekly mental health insights are ready to view.',
      type: 'success',
      priority: 'low',
      email: true,
      inApp: true,
      data: insights
    });
  }
}