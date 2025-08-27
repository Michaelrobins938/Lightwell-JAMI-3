import { prisma } from '../lib/database';
import { encryptionService } from './encryptionService';
import { hipaaComplianceService } from './hipaaComplianceService';
import { threatDetectionService } from './threatDetectionService';
import { getSecurityConfig } from '../config/security';

export interface SecurityAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  category: 'threat' | 'compliance' | 'system' | 'user';
  title: string;
  message: string;
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface SecurityMetrics {
  activeUsers: number;
  failedLogins: number;
  suspiciousActivities: number;
  securityThreats: number;
  dataBreaches: number;
  encryptionKeys: number;
  auditLogs: number;
  complianceScore: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export interface MonitoringThresholds {
  failedLogins: number;
  suspiciousActivity: number;
  securityThreats: number;
  dataBreaches: number;
  systemErrors: number;
  responseTime: number; // milliseconds
}

export class SecurityMonitoringService {
  private static instance: SecurityMonitoringService;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alertCallbacks: ((alert: SecurityAlert) => void)[] = [];
  private metrics: SecurityMetrics | null = null;
  private lastCheck: Date = new Date();

  private constructor() {}

  static getInstance(): SecurityMonitoringService {
    if (!SecurityMonitoringService.instance) {
      SecurityMonitoringService.instance = new SecurityMonitoringService();
    }
    return SecurityMonitoringService.instance;
  }

  async startMonitoring(): Promise<void> {
    if (this.monitoringInterval) {
      return; // Already monitoring
    }

    console.log('🔍 Starting security monitoring...');
    
    // Initial metrics collection
    await this.collectMetrics();
    
    // Start periodic monitoring (every 30 seconds)
    this.monitoringInterval = setInterval(async () => {
      await this.monitorSecurity();
    }, 30000);

    console.log('✅ Security monitoring started');
  }

  async stopMonitoring(): Promise<void> {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('⏹️ Security monitoring stopped');
    }
  }

  async monitorSecurity(): Promise<void> {
    try {
      const previousMetrics = this.metrics;
      await this.collectMetrics();
      
      if (previousMetrics) {
        await this.analyzeChanges(previousMetrics, this.metrics!);
      }
      
      await this.checkThresholds();
      await this.performHealthChecks();
      
      this.lastCheck = new Date();
    } catch (error) {
      console.error('Security monitoring error:', error);
      await this.createAlert({
        level: 'critical',
        category: 'system',
        title: 'Security Monitoring Failure',
        message: `Security monitoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: { error: error instanceof Error ? error.stack : 'Unknown error' }
      });
    }
  }

  async collectMetrics(): Promise<SecurityMetrics> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const [
      activeUsers,
      failedLogins,
      suspiciousActivities,
      securityThreats,
      dataBreaches,
      encryptionKeys,
      auditLogs,
      systemHealth
    ] = await Promise.all([
      // Active users in last hour
      prisma.user.count({
        where: {
          updatedAt: { gte: oneHourAgo }
        }
      }),
      // Failed login attempts in last 24 hours
      prisma.hIPAAAuditLog.count({
        where: {
          action: 'login_failed',
          timestamp: { gte: oneDayAgo }
        }
      }),
      // Suspicious activities in last 24 hours
      prisma.securityThreatLog.count({
        where: {
          timestamp: { gte: oneDayAgo }
        }
      }),
      // Security threats in last 24 hours
      prisma.securityThreatLog.count({
        where: {
          severity: { in: ['high', 'critical'] },
          timestamp: { gte: oneDayAgo }
        }
      }),
      // Data breaches in last 24 hours (using security incidents instead)
      prisma.securityIncident.count({
        where: {
          severity: { in: ['high', 'critical'] },
          timestamp: { gte: oneDayAgo }
        }
      }),
      // Active encryption keys
      prisma.encryptionKey.count({
        where: { isActive: true }
      }),
      // Audit logs in last 24 hours
      prisma.hIPAAAuditLog.count({
        where: {
          timestamp: { gte: oneDayAgo }
        }
      }),
      // System health check
      this.checkSystemHealth()
    ]);

    // Calculate compliance score
    const complianceScore = await this.calculateComplianceScore();

    this.metrics = {
      activeUsers,
      failedLogins,
      suspiciousActivities,
      securityThreats,
      dataBreaches,
      encryptionKeys,
      auditLogs,
      complianceScore,
      systemHealth
    };

    return this.metrics;
  }

  async analyzeChanges(previous: SecurityMetrics, current: SecurityMetrics): Promise<void> {
    const config = getSecurityConfig();
    const thresholds = config.monitoring.alertThresholds;

    // Check for significant changes
    const changes = {
      failedLogins: current.failedLogins - previous.failedLogins,
      suspiciousActivities: current.suspiciousActivities - previous.suspiciousActivities,
      securityThreats: current.securityThreats - previous.securityThreats,
      dataBreaches: current.dataBreaches - previous.dataBreaches
    };

    // Alert on significant increases
    if (changes.failedLogins > 5) {
      await this.createAlert({
        level: 'warning',
        category: 'user',
        title: 'Increased Failed Login Attempts',
        message: `Failed login attempts increased by ${changes.failedLogins} in the last monitoring cycle`,
        metadata: { change: changes.failedLogins, current: current.failedLogins }
      });
    }

    if (changes.suspiciousActivities > 3) {
      await this.createAlert({
        level: 'warning',
        category: 'threat',
        title: 'Increased Suspicious Activity',
        message: `Suspicious activities increased by ${changes.suspiciousActivities} in the last monitoring cycle`,
        metadata: { change: changes.suspiciousActivities, current: current.suspiciousActivities }
      });
    }

    if (changes.securityThreats > 0) {
      await this.createAlert({
        level: 'critical',
        category: 'threat',
        title: 'New Security Threats Detected',
        message: `${changes.securityThreats} new security threats detected in the last monitoring cycle`,
        metadata: { change: changes.securityThreats, current: current.securityThreats }
      });
    }

    if (changes.dataBreaches > 0) {
      await this.createAlert({
        level: 'critical',
        category: 'compliance',
        title: 'New Data Breaches Detected',
        message: `${changes.dataBreaches} new data breaches detected in the last monitoring cycle`,
        metadata: { change: changes.dataBreaches, current: current.dataBreaches }
      });
    }
  }

  async checkThresholds(): Promise<void> {
    if (!this.metrics) return;

    const config = getSecurityConfig();
    const thresholds = config.monitoring.alertThresholds;

    // Check failed logins threshold
    if (this.metrics.failedLogins >= thresholds.failedLogins) {
      await this.createAlert({
        level: 'warning',
        category: 'user',
        title: 'High Number of Failed Logins',
        message: `Failed login attempts (${this.metrics.failedLogins}) have exceeded the threshold (${thresholds.failedLogins})`,
        metadata: { current: this.metrics.failedLogins, threshold: thresholds.failedLogins }
      });
    }

    // Check suspicious activity threshold
    if (this.metrics.suspiciousActivities >= thresholds.suspiciousActivity) {
      await this.createAlert({
        level: 'warning',
        category: 'threat',
        title: 'High Number of Suspicious Activities',
        message: `Suspicious activities (${this.metrics.suspiciousActivities}) have exceeded the threshold (${thresholds.suspiciousActivity})`,
        metadata: { current: this.metrics.suspiciousActivities, threshold: thresholds.suspiciousActivity }
      });
    }

    // Check security threats threshold
    if (this.metrics.securityThreats >= thresholds.securityThreats) {
      await this.createAlert({
        level: 'critical',
        category: 'threat',
        title: 'High Number of Security Threats',
        message: `Security threats (${this.metrics.securityThreats}) have exceeded the threshold (${thresholds.securityThreats})`,
        metadata: { current: this.metrics.securityThreats, threshold: thresholds.securityThreats }
      });
    }

    // Check data breaches threshold
    if (this.metrics.dataBreaches >= thresholds.dataBreaches) {
      await this.createAlert({
        level: 'critical',
        category: 'compliance',
        title: 'Data Breaches Detected',
        message: `Data breaches (${this.metrics.dataBreaches}) have exceeded the threshold (${thresholds.dataBreaches})`,
        metadata: { current: this.metrics.dataBreaches, threshold: thresholds.dataBreaches }
      });
    }
  }

  async performHealthChecks(): Promise<void> {
    // Check encryption service health
    try {
      const testData = 'health_check';
      const encrypted = await encryptionService.encryptUserData(testData, 'health_check', 'test');
      const decrypted = await encryptionService.decryptUserData(encrypted.encryptedData, 'health_check', 'test');
      
      if (decrypted !== testData) {
        await this.createAlert({
          level: 'critical',
          category: 'system',
          title: 'Encryption Service Failure',
          message: 'Encryption service health check failed - encryption/decryption test unsuccessful',
          metadata: { testData, decrypted }
        });
      }
    } catch (error) {
      await this.createAlert({
        level: 'critical',
        category: 'system',
        title: 'Encryption Service Error',
        message: `Encryption service health check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: { error: error instanceof Error ? error.stack : 'Unknown error' }
      });
    }

    // Check database connectivity
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      await this.createAlert({
        level: 'critical',
        category: 'system',
        title: 'Database Connectivity Issue',
        message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: { error: error instanceof Error ? error.stack : 'Unknown error' }
      });
    }

    // Check encryption keys health
    const expiredKeys = await prisma.encryptionKey.count({
      where: {
        isActive: true,
        expiresAt: { lt: new Date() }
      }
    });

    if (expiredKeys > 0) {
      await this.createAlert({
        level: 'warning',
        category: 'system',
        title: 'Expired Encryption Keys',
        message: `${expiredKeys} encryption keys have expired and need to be rotated`,
        metadata: { expiredKeys }
      });
    }
  }

  private async checkSystemHealth(): Promise<'healthy' | 'warning' | 'critical'> {
    try {
      // Check if all critical services are operational
      const checks = await Promise.allSettled([
        prisma.$queryRaw`SELECT 1`,
        encryptionService.encryptUserData('test', 'test', 'test'),
        hipaaComplianceService.containsPHI('test'),
        threatDetectionService.analyzeRequest({ body: { message: 'test' } } as any, 'test')
      ]);

      const failedChecks = checks.filter(check => check.status === 'rejected').length;
      
      if (failedChecks === 0) {
        return 'healthy';
      } else if (failedChecks <= 2) {
        return 'warning';
      } else {
        return 'critical';
      }
    } catch (error) {
      return 'critical';
    }
  }

  private async calculateComplianceScore(): Promise<number> {
    try {
      // Calculate compliance score based on various factors
      const factors = await Promise.all([
        this.checkHIPAACompliance(),
        this.checkEncryptionCompliance(),
        this.checkAuditCompliance(),
        this.checkThreatDetectionCompliance()
      ]);

      const totalScore = factors.reduce((sum, factor) => sum + factor, 0);
      return Math.round(totalScore / factors.length);
    } catch (error) {
      console.error('Compliance score calculation error:', error);
      return 0;
    }
  }

  private async checkHIPAACompliance(): Promise<number> {
    try {
      // Check if audit logging is working
      const recentAuditLogs = await prisma.hIPAAAuditLog.count({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
          }
        }
      });

      // Check if PHI detection is working
      const phiTest = hipaaComplianceService.containsPHI('Patient John Doe, SSN: 123-45-6789');
      
      return recentAuditLogs > 0 && phiTest.detected ? 100 : 50;
    } catch (error) {
      return 0;
    }
  }

  private async checkEncryptionCompliance(): Promise<number> {
    try {
      const activeKeys = await prisma.encryptionKey.count({
        where: { isActive: true }
      });

      const expiredKeys = await prisma.encryptionKey.count({
        where: {
          isActive: true,
          expiresAt: { lt: new Date() }
        }
      });

      if (activeKeys === 0) return 0;
      if (expiredKeys > 0) return 75;
      return 100;
    } catch (error) {
      return 0;
    }
  }

  private async checkAuditCompliance(): Promise<number> {
    try {
      const recentLogs = await prisma.hIPAAAuditLog.count({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });

      return recentLogs > 0 ? 100 : 0;
    } catch (error) {
      return 0;
    }
  }

  private async checkThreatDetectionCompliance(): Promise<number> {
    try {
      const recentThreats = await prisma.securityThreatLog.count({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });

      // Having some threat detection activity indicates the system is working
      return recentThreats >= 0 ? 100 : 50;
    } catch (error) {
      return 0;
    }
  }

  async createAlert(alertData: Omit<SecurityAlert, 'id' | 'timestamp' | 'acknowledged' | 'resolved'>): Promise<SecurityAlert> {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...alertData,
      timestamp: new Date(),
      acknowledged: false,
      resolved: false
    };

    // Store alert in database
    await prisma.securityIncident.create({
      data: {
        userId: 'system',
        threatType: 'alert',
        severity: alert.level,
        confidence: 0.9,
        details: JSON.stringify({
          category: alert.category,
          title: alert.title,
          message: alert.message,
          metadata: alert.metadata
        }),
        ipAddress: 'system',
        userAgent: 'security-monitoring-service',
        timestamp: new Date()
      }
    });

    // Trigger alert callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });

    // Log alert
    console.log(`🚨 Security Alert [${alert.level.toUpperCase()}]: ${alert.title} - ${alert.message}`);

    return alert;
  }

  onAlert(callback: (alert: SecurityAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  removeAlertCallback(callback: (alert: SecurityAlert) => void): void {
    const index = this.alertCallbacks.indexOf(callback);
    if (index > -1) {
      this.alertCallbacks.splice(index, 1);
    }
  }

  async getAlerts(limit: number = 50, acknowledged?: boolean, resolved?: boolean): Promise<SecurityAlert[]> {
    const where: any = {};
    
    if (acknowledged !== undefined) {
      where.acknowledged = acknowledged;
    }
    
    if (resolved !== undefined) {
      where.resolved = resolved;
    }

    const alerts = await prisma.securityIncident.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    return alerts.map(alert => ({
      ...alert,
      metadata: alert.details ? JSON.parse(alert.details) : undefined
    }));
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<void> {
    await prisma.securityIncident.update({
      where: { id: alertId },
      data: {
        acknowledged: true,
        acknowledgedBy,
        acknowledgedAt: new Date()
      }
    });
  }

  async resolveAlert(alertId: string, resolvedBy: string): Promise<void> {
    await prisma.securityIncident.update({
      where: { id: alertId },
      data: {
        resolved: true,
        resolvedBy,
        resolvedAt: new Date()
      }
    });
  }

  getMetrics(): SecurityMetrics | null {
    return this.metrics;
  }

  getLastCheck(): Date {
    return this.lastCheck;
  }

  isMonitoring(): boolean {
    return this.monitoringInterval !== null;
  }
}

export const securityMonitoringService = SecurityMonitoringService.getInstance();
