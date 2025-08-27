import { prisma } from '../lib/database';

export interface PrivacyNotice {
  id: string;
  userId: string;
  noticeType: 'onboarding' | 'periodic' | 'data_use' | 'crisis' | 'deletion';
  content: string;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface DataUseDisclosure {
  dataTypes: string[];
  purposes: string[];
  retentionPeriod: string;
  sharingPractices: string[];
  userRights: string[];
  contactInfo: string;
}

export interface PrivacySettings {
  userId: string;
  dataCollection: boolean;
  dataAnalysis: boolean;
  dataSharing: boolean;
  crisisIntervention: boolean;
  researchParticipation: boolean;
  marketingCommunications: boolean;
  lastUpdated: Date;
}

export class PrivacyTransparencyService {
  private static instance: PrivacyTransparencyService;
  
  // Privacy notice templates
  private readonly PRIVACY_NOTICES = {
    onboarding: {
      title: 'Privacy and Data Use Information',
      content: `I respect your privacy, but this chat isn't the same as therapy confidentiality. Your messages may be stored and reviewed to improve safety and quality, consistent with our Privacy Policy. I won't share your information beyond that without your consent, unless the product's safety features you've opted into require it. You can request deletion at any time.`,
      required: true
    },
    periodic: {
      title: 'Privacy Reminder',
      content: `Reminder: This chat is not therapy-confidential. Your data helps improve safety and quality. See our Privacy Policy for details on data use, storage, and your rights.`,
      required: false,
      frequency: 30 // days
    },
    data_use: {
      title: 'How Your Data is Used',
      content: `Your conversations help us: 1) Improve AI safety and responses, 2) Detect and prevent crises, 3) Enhance user experience, 4) Train models for better support. Data is encrypted and anonymized where possible.`,
      required: false
    },
    crisis: {
      title: 'Crisis Data Handling',
      content: `If crisis indicators are detected, your data may be used to: 1) Provide immediate safety support, 2) Connect you with crisis resources, 3) Improve crisis detection systems. This prioritizes your safety.`,
      required: true
    },
    deletion: {
      title: 'Data Deletion Rights',
      content: `You have the right to: 1) Request deletion of your data, 2) Export your conversations, 3) Limit data collection, 4) Opt out of research participation. Contact our privacy team for assistance.`,
      required: false
    }
  };

  // Data use disclosure
  private readonly DATA_USE_DISCLOSURE: DataUseDisclosure = {
    dataTypes: [
      'Conversation content and metadata',
      'User preferences and settings',
      'Crisis detection indicators',
      'Usage patterns and analytics',
      'Assessment responses',
      'Feedback and ratings'
    ],
    purposes: [
      'Provide AI mental health support',
      'Improve safety and crisis detection',
      'Enhance user experience and personalization',
      'Train and improve AI models',
      'Conduct research and development',
      'Ensure platform security and compliance'
    ],
    retentionPeriod: '2 years for conversations, 7 years for legal/regulatory requirements',
    sharingPractices: [
      'No sharing with third parties without consent',
      'Aggregated, anonymized data for research',
      'Required sharing for safety and legal compliance',
      'Service providers under strict contracts'
    ],
    userRights: [
      'Access your personal data',
      'Request data correction',
      'Request data deletion',
      'Export your data',
      'Opt out of data collection',
      'Withdraw consent'
    ],
    contactInfo: 'privacy@luna-ai.com or support@luna-ai.com'
  };

  private constructor() {}

  public static getInstance(): PrivacyTransparencyService {
    if (!PrivacyTransparencyService.instance) {
      PrivacyTransparencyService.instance = new PrivacyTransparencyService();
    }
    return PrivacyTransparencyService.instance;
  }

  /**
   * Get privacy notice for user
   */
  async getPrivacyNotice(
    userId: string, 
    noticeType: keyof typeof this.PRIVACY_NOTICES
  ): Promise<PrivacyNotice> {
    try {
      // Check if user has already acknowledged this notice
      const existingNotice = await this.getExistingNotice(userId, noticeType);
      
      if (existingNotice && existingNotice.acknowledged) {
        // Check if notice needs renewal
        if (this.shouldRenewNotice(existingNotice, noticeType)) {
          return this.createRenewalNotice(userId, noticeType);
        }
        return existingNotice;
      }
      
      // Create new notice
      return this.createPrivacyNotice(userId, noticeType);
    } catch (error) {
      console.error('Error getting privacy notice:', error);
      return this.createDefaultNotice(userId, noticeType);
    }
  }

  /**
   * Acknowledge privacy notice
   */
  async acknowledgePrivacyNotice(userId: string, noticeId: string): Promise<void> {
    try {
      await this.updateNoticeAcknowledgement(userId, noticeId);
      console.log('Privacy notice acknowledged for user:', userId);
    } catch (error) {
      console.error('Error acknowledging privacy notice:', error);
    }
  }

  /**
   * Get data use disclosure
   */
  getDataUseDisclosure(): DataUseDisclosure {
    return this.DATA_USE_DISCLOSURE;
  }

  /**
   * Get privacy settings for user
   */
  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      const settings = await this.getUserPrivacySettings(userId);
      return settings || this.getDefaultPrivacySettings(userId);
    } catch (error) {
      console.error('Error getting privacy settings:', error);
      return this.getDefaultPrivacySettings(userId);
    }
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<void> {
    try {
      await this.saveUserPrivacySettings(userId, settings);
      console.log('Privacy settings updated for user:', userId);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  }

  /**
   * Get transparency message for specific context
   */
  getTransparencyMessage(context: 'chat_start' | 'crisis_detected' | 'data_collection' | 'general'): string {
    switch (context) {
      case 'chat_start':
        return 'I respect your privacy, but this chat isn\'t the same as therapy confidentiality. Your messages help improve safety and quality. See our Privacy Policy for details.';
      
      case 'crisis_detected':
        return 'For your safety, crisis-related data may be used to provide immediate support and improve our crisis response systems. This prioritizes your well-being.';
      
      case 'data_collection':
        return 'We collect conversation data to improve AI responses and safety. You can control what data is collected in your privacy settings.';
      
      case 'general':
        return 'This chat isn\'t therapy-confidential. Your data helps improve safety and quality. You can request deletion at any time.';
      
      default:
        return 'I respect your privacy. See our Privacy Policy for how your data is used and protected.';
    }
  }

  /**
   * Check if user needs privacy reminder
   */
  async needsPrivacyReminder(userId: string): Promise<boolean> {
    try {
      const lastNotice = await this.getLastPrivacyNotice(userId);
      if (!lastNotice) return true;
      
      const daysSinceLastNotice = (Date.now() - lastNotice.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLastNotice >= 30; // 30 days
    } catch (error) {
      console.error('Error checking privacy reminder:', error);
      return true;
    }
  }

  /**
   * Get privacy compliance status
   */
  async getPrivacyComplianceStatus(userId: string): Promise<{
    compliant: boolean;
    missingItems: string[];
    recommendations: string[];
  }> {
    try {
      const settings = await this.getPrivacySettings(userId);
      const notices = await this.getUserNotices(userId);
      
      const missingItems: string[] = [];
      const recommendations: string[] = [];
      
      // Check required notices
      const requiredNotices = Object.entries(this.PRIVACY_NOTICES)
        .filter(([_, notice]) => notice.required)
        .map(([type, _]) => type);
      
      for (const noticeType of requiredNotices) {
        const hasNotice = notices.some(n => n.noticeType === noticeType && n.acknowledged);
        if (!hasNotice) {
          missingItems.push(`Missing ${noticeType} privacy notice acknowledgment`);
          recommendations.push(`Complete the ${noticeType} privacy notice`);
        }
      }
      
      // Check privacy settings
      if (!settings.dataCollection) {
        missingItems.push('Data collection preferences not set');
        recommendations.push('Review and set your data collection preferences');
      }
      
      const compliant = missingItems.length === 0;
      
      return {
        compliant,
        missingItems,
        recommendations
      };
    } catch (error) {
      console.error('Error getting privacy compliance status:', error);
      return {
        compliant: false,
        missingItems: ['Unable to verify privacy compliance'],
        recommendations: ['Contact support for privacy compliance verification']
      };
    }
  }

  /**
   * Create privacy notice
   */
  private createPrivacyNotice(userId: string, noticeType: keyof typeof this.PRIVACY_NOTICES): PrivacyNotice {
    const notice = this.PRIVACY_NOTICES[noticeType];
    const expiresAt = notice && typeof notice === 'object' && 'frequency' in notice && typeof notice.frequency === 'number' 
      ? new Date(Date.now() + notice.frequency * 24 * 60 * 60 * 1000) 
      : undefined;
    
    return {
      id: `notice_${userId}_${noticeType}_${Date.now()}`,
      userId,
      noticeType,
      content: notice.content,
      acknowledged: false,
      createdAt: new Date(),
      expiresAt
    };
  }

  /**
   * Create renewal notice
   */
  private createRenewalNotice(userId: string, noticeType: keyof typeof this.PRIVACY_NOTICES): PrivacyNotice {
    const notice = this.PRIVACY_NOTICES[noticeType];
    const expiresAt = notice && typeof notice === 'object' && 'frequency' in notice && typeof notice.frequency === 'number' 
      ? new Date(Date.now() + notice.frequency * 24 * 60 * 60 * 1000) 
      : undefined;
    
    return {
      id: `renewal_${userId}_${noticeType}_${Date.now()}`,
      userId,
      noticeType,
      content: `Renewal: ${notice.content}`,
      acknowledged: false,
      createdAt: new Date(),
      expiresAt
    };
  }

  /**
   * Create default notice
   */
  private createDefaultNotice(userId: string, noticeType: keyof typeof this.PRIVACY_NOTICES): PrivacyNotice {
    return {
      id: `default_${userId}_${noticeType}_${Date.now()}`,
      userId,
      noticeType,
      content: 'Privacy notice content unavailable. Please contact support.',
      acknowledged: false,
      createdAt: new Date()
    };
  }

  /**
   * Get default privacy settings
   */
  private getDefaultPrivacySettings(userId: string): PrivacySettings {
    return {
      userId,
      dataCollection: true,
      dataAnalysis: true,
      dataSharing: false,
      crisisIntervention: true,
      researchParticipation: false,
      marketingCommunications: false,
      lastUpdated: new Date()
    };
  }

  /**
   * Check if notice needs renewal
   */
  private shouldRenewNotice(notice: PrivacyNotice, noticeType: keyof typeof this.PRIVACY_NOTICES): boolean {
    if (!notice.expiresAt) return false;
    
    const noticeConfig = this.PRIVACY_NOTICES[noticeType];
    if (!noticeConfig || typeof noticeConfig !== 'object' || !('frequency' in noticeConfig) || typeof noticeConfig.frequency !== 'number') return false;
    
    return Date.now() >= notice.expiresAt.getTime();
  }

  /**
   * Get existing notice from database
   */
  private async getExistingNotice(userId: string, noticeType: string): Promise<PrivacyNotice | null> {
    try {
      // TODO: Query database
      return null;
    } catch (error) {
      console.error('Error getting existing notice:', error);
      return null;
    }
  }

  /**
   * Update notice acknowledgement
   */
  private async updateNoticeAcknowledgement(userId: string, noticeId: string): Promise<void> {
    try {
      // TODO: Update database
      console.log('Notice acknowledgement updated:', { userId, noticeId });
    } catch (error) {
      console.error('Error updating notice acknowledgement:', error);
    }
  }

  /**
   * Get user privacy settings from database
   */
  private async getUserPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    try {
      // TODO: Query database
      return null;
    } catch (error) {
      console.error('Error getting user privacy settings:', error);
      return null;
    }
  }

  /**
   * Save user privacy settings to database
   */
  private async saveUserPrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<void> {
    try {
      // TODO: Save to database
      console.log('Privacy settings saved:', { userId, settings });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    }
  }

  /**
   * Get last privacy notice for user
   */
  private async getLastPrivacyNotice(userId: string): Promise<PrivacyNotice | null> {
    try {
      // TODO: Query database
      return null;
    } catch (error) {
      console.error('Error getting last privacy notice:', error);
      return null;
    }
  }

  /**
   * Get all user notices
   */
  private async getUserNotices(userId: string): Promise<PrivacyNotice[]> {
    try {
      // TODO: Query database
      return [];
    } catch (error) {
      console.error('Error getting user notices:', error);
      return [];
    }
  }

  /**
   * Replace confidential language with transparent language
   */
  replaceConfidentialLanguage(text: string): string {
    const replacements = [
      {
        from: /confidential/gi,
        to: 'private but not therapy-confidential'
      },
      {
        from: /completely confidential/gi,
        to: 'private within our data use policies'
      },
      {
        from: /therapy confidentiality/gi,
        to: 'therapy privacy standards'
      },
      {
        from: /HIPAA protected/gi,
        to: 'protected by our privacy policies'
      },
      {
        from: /doctor-patient confidentiality/gi,
        to: 'professional privacy standards'
      }
    ];
    
    let result = text;
    for (const replacement of replacements) {
      result = result.replace(replacement.from, replacement.to);
    }
    
    return result;
  }

  /**
   * Add transparency footer to messages
   */
  addTransparencyFooter(message: string, context?: string): string {
    const footer = this.getTransparencyMessage('general');
    return `${message}\n\n---\n${footer}`;
  }
}

export const privacyTransparencyService = PrivacyTransparencyService.getInstance();
