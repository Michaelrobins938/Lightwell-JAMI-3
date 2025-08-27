import { prisma } from '../lib/database';
import { encryptionService } from './encryptionService';
import { hipaaComplianceService } from './hipaaComplianceService';

// Threat types and severity levels
export enum ThreatType {
  BRUTE_FORCE = 'brute_force',
  SQL_INJECTION = 'sql_injection',
  XSS_ATTACK = 'xss_attack',
  CSRF_ATTACK = 'csrf_attack',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  PHI_ACCESS_VIOLATION = 'phi_access_violation',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  DATA_EXFILTRATION = 'data_exfiltration',
  MALICIOUS_PAYLOAD = 'malicious_payload'
}

export enum ThreatSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Threat detection patterns
export interface ThreatPattern {
  type: ThreatType;
  pattern: RegExp | string;
  severity: ThreatSeverity;
  description: string;
  mitigation: string;
}

// Threat detection result
export interface ThreatDetectionResult {
  threatDetected: boolean;
  threatType?: ThreatType;
  severity?: ThreatSeverity;
  confidence: number;
  details: string;
  recommendations: string[];
  requiresImmediateAction: boolean;
}

// Suspicious activity indicators
export interface SuspiciousActivity {
  userId: string;
  activity: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  riskScore: number;
  indicators: string[];
}

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
  keyGenerator: (req: any) => string;
}

export class ThreatDetectionService {
  private static instance: ThreatDetectionService;
  private threatPatterns: ThreatPattern[] = [];
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
  private suspiciousActivities: Map<string, SuspiciousActivity[]> = new Map();

  private constructor() {
    this.initializeThreatPatterns();
  }

  public static getInstance(): ThreatDetectionService {
    if (!ThreatDetectionService.instance) {
      ThreatDetectionService.instance = new ThreatDetectionService();
    }
    return ThreatDetectionService.instance;
  }

  /**
   * Initialize threat detection patterns
   */
  private initializeThreatPatterns(): void {
    this.threatPatterns = [
      // SQL Injection patterns
      {
        type: ThreatType.SQL_INJECTION,
        pattern: /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script)\b.*\b(from|into|where|set|table|database)\b)/i,
        severity: ThreatSeverity.CRITICAL,
        description: 'Potential SQL injection attempt detected',
        mitigation: 'Block request and log for investigation'
      },
      {
        type: ThreatType.SQL_INJECTION,
        pattern: /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script)\b.*\b(from|into|where|set|table|database)\b)/i,
        severity: ThreatSeverity.CRITICAL,
        description: 'Potential SQL injection attempt detected',
        mitigation: 'Block request and log for investigation'
      },
      // XSS Attack patterns
      {
        type: ThreatType.XSS_ATTACK,
        pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        severity: ThreatSeverity.HIGH,
        description: 'Potential XSS attack detected',
        mitigation: 'Sanitize input and log for investigation'
      },
      {
        type: ThreatType.XSS_ATTACK,
        pattern: /javascript:/gi,
        severity: ThreatSeverity.HIGH,
        description: 'Potential XSS attack detected',
        mitigation: 'Sanitize input and log for investigation'
      },
      // CSRF Attack patterns
      {
        type: ThreatType.CSRF_ATTACK,
        pattern: /(referer|origin).*null/i,
        severity: ThreatSeverity.MEDIUM,
        description: 'Potential CSRF attack detected',
        mitigation: 'Validate referer and origin headers'
      },
      // Malicious payload patterns
      {
        type: ThreatType.MALICIOUS_PAYLOAD,
        pattern: /eval\s*\(/gi,
        severity: ThreatSeverity.CRITICAL,
        description: 'Potential code execution attempt detected',
        mitigation: 'Block request and log for investigation'
      },
      {
        type: ThreatType.MALICIOUS_PAYLOAD,
        pattern: /document\./gi,
        severity: ThreatSeverity.HIGH,
        description: 'Potential DOM manipulation attempt detected',
        mitigation: 'Sanitize input and log for investigation'
      }
    ];
  }

  /**
   * Analyze request for potential threats
   */
  public async analyzeRequest(
    req: any,
    userId?: string
  ): Promise<ThreatDetectionResult> {
    const threats: ThreatDetectionResult[] = [];
    let maxSeverity = ThreatSeverity.LOW;
    let totalConfidence = 0;

    // Check for SQL injection
    const sqlInjectionResult = this.detectSQLInjection(req);
    if (sqlInjectionResult.threatDetected) {
      threats.push(sqlInjectionResult);
      maxSeverity = this.getHigherSeverity(maxSeverity, sqlInjectionResult.severity!);
      totalConfidence += sqlInjectionResult.confidence;
    }

    // Check for XSS attacks
    const xssResult = this.detectXSSAttack(req);
    if (xssResult.threatDetected) {
      threats.push(xssResult);
      maxSeverity = this.getHigherSeverity(maxSeverity, xssResult.severity!);
      totalConfidence += xssResult.confidence;
    }

    // Check for CSRF attacks
    const csrfResult = this.detectCSRFAttack(req);
    if (csrfResult.threatDetected) {
      threats.push(csrfResult);
      maxSeverity = this.getHigherSeverity(maxSeverity, csrfResult.severity!);
      totalConfidence += csrfResult.confidence;
    }

    // Check for malicious payloads
    const payloadResult = this.detectMaliciousPayload(req);
    if (payloadResult.threatDetected) {
      threats.push(payloadResult);
      maxSeverity = this.getHigherSeverity(maxSeverity, payloadResult.severity!);
      totalConfidence += payloadResult.confidence;
    }

    // Check rate limiting
    const rateLimitResult = await this.checkRateLimit(req, userId);
    if (rateLimitResult.threatDetected) {
      threats.push(rateLimitResult);
      maxSeverity = this.getHigherSeverity(maxSeverity, rateLimitResult.severity!);
      totalConfidence += rateLimitResult.confidence;
    }

    // Check for suspicious activity
    const suspiciousResult = await this.detectSuspiciousActivity(req, userId);
    if (suspiciousResult.threatDetected) {
      threats.push(suspiciousResult);
      maxSeverity = this.getHigherSeverity(maxSeverity, suspiciousResult.severity!);
      totalConfidence += suspiciousResult.confidence;
    }

    // If threats detected, return the highest severity result
    if (threats.length > 0) {
      const avgConfidence = totalConfidence / threats.length;
      const requiresImmediateAction = maxSeverity === ThreatSeverity.CRITICAL || maxSeverity === ThreatSeverity.HIGH;

      // Log the threat for audit purposes
      if (userId) {
        await this.logThreatEvent(userId, threats, req);
      }

      return {
        threatDetected: true,
        threatType: threats[0].threatType,
        severity: maxSeverity,
        confidence: avgConfidence,
        details: `Multiple threats detected: ${threats.map(t => t.details).join('; ')}`,
        recommendations: threats.flatMap(t => t.recommendations),
        requiresImmediateAction
      };
    }

    return {
      threatDetected: false,
      confidence: 1.0,
      details: 'No threats detected',
      recommendations: [],
      requiresImmediateAction: false
    };
  }

  /**
   * Detect SQL injection attempts
   */
  private detectSQLInjection(req: any): ThreatDetectionResult {
    const body = JSON.stringify(req.body || {});
    const query = req.query ? JSON.stringify(req.query) : '';
    const params = req.params ? JSON.stringify(req.params) : '';

    const combinedInput = `${body} ${query} ${params}`.toLowerCase();

    for (const pattern of this.threatPatterns.filter(p => p.type === ThreatType.SQL_INJECTION)) {
      if (pattern.pattern instanceof RegExp && pattern.pattern.test(combinedInput)) {
        return {
          threatDetected: true,
          threatType: ThreatType.SQL_INJECTION,
          severity: pattern.severity,
          confidence: 0.95,
          details: pattern.description,
          recommendations: [pattern.mitigation, 'Implement input validation', 'Use parameterized queries'],
          requiresImmediateAction: true
        };
      }
    }

    return {
      threatDetected: false,
      confidence: 1.0,
      details: 'No SQL injection detected',
      recommendations: [],
      requiresImmediateAction: false
    };
  }

  /**
   * Detect XSS attacks
   */
  private detectXSSAttack(req: any): ThreatDetectionResult {
    const body = JSON.stringify(req.body || {});
    const query = req.query ? JSON.stringify(req.query) : '';
    const params = req.params ? JSON.stringify(req.params) : '';

    const combinedInput = `${body} ${query} ${params}`;

    for (const pattern of this.threatPatterns.filter(p => p.type === ThreatType.XSS_ATTACK)) {
      if (pattern.pattern instanceof RegExp && pattern.pattern.test(combinedInput)) {
        return {
          threatDetected: true,
          threatType: ThreatType.XSS_ATTACK,
          severity: pattern.severity,
          confidence: 0.90,
          details: pattern.description,
          recommendations: [pattern.mitigation, 'Implement input sanitization', 'Use CSP headers'],
          requiresImmediateAction: true
        };
      }
    }

    return {
      threatDetected: false,
      confidence: 1.0,
      details: 'No XSS attack detected',
      recommendations: [],
      requiresImmediateAction: false
    };
  }

  /**
   * Detect CSRF attacks
   */
  private detectCSRFAttack(req: any): ThreatDetectionResult {
    const referer = req.headers.referer;
    const origin = req.headers.origin;
    const method = req.method;

    // Check for missing or suspicious referer/origin headers on state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      if (!referer && !origin) {
        return {
          threatDetected: true,
          threatType: ThreatType.CSRF_ATTACK,
          severity: ThreatSeverity.MEDIUM,
          confidence: 0.70,
          details: 'Missing referer/origin headers on state-changing request',
          recommendations: ['Validate referer and origin headers', 'Implement CSRF tokens', 'Log for investigation'],
          requiresImmediateAction: false
        };
      }

      // Check for suspicious referer patterns
      if (referer && referer.includes('null') || referer === 'about:blank') {
        return {
          threatDetected: true,
          threatType: ThreatType.CSRF_ATTACK,
          severity: ThreatSeverity.MEDIUM,
          confidence: 0.80,
          details: 'Suspicious referer header detected',
          recommendations: ['Validate referer header', 'Implement CSRF tokens', 'Log for investigation'],
          requiresImmediateAction: false
        };
      }
    }

    return {
      threatDetected: false,
      confidence: 1.0,
      details: 'No CSRF attack detected',
      recommendations: [],
      requiresImmediateAction: false
    };
  }

  /**
   * Detect malicious payloads
   */
  private detectMaliciousPayload(req: any): ThreatDetectionResult {
    const body = JSON.stringify(req.body || {});
    const query = req.query ? JSON.stringify(req.query) : '';
    const params = req.params ? JSON.stringify(req.params) : '';

    const combinedInput = `${body} ${query} ${params}`;

    for (const pattern of this.threatPatterns.filter(p => p.type === ThreatType.MALICIOUS_PAYLOAD)) {
      if (pattern.pattern instanceof RegExp && pattern.pattern.test(combinedInput)) {
        return {
          threatDetected: true,
          threatType: ThreatType.MALICIOUS_PAYLOAD,
          severity: pattern.severity,
          confidence: 0.85,
          details: pattern.description,
          recommendations: [pattern.mitigation, 'Implement input validation', 'Use content security policies'],
          requiresImmediateAction: true
        };
      }
    }

    return {
      threatDetected: false,
      confidence: 1.0,
      details: 'No malicious payload detected',
      recommendations: [],
      requiresImmediateAction: false
    };
  }

  /**
   * Check rate limiting
   */
  private async checkRateLimit(req: any, userId?: string): Promise<ThreatDetectionResult> {
    const key = userId || req.ip || 'anonymous';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = userId ? 1000 : 100; // Higher limit for authenticated users

    const current = this.rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
      this.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return {
        threatDetected: false,
        confidence: 1.0,
        details: 'Rate limit check passed',
        recommendations: [],
        requiresImmediateAction: false
      };
    }

    if (current.count >= maxRequests) {
      return {
        threatDetected: true,
        threatType: ThreatType.RATE_LIMIT_EXCEEDED,
        severity: ThreatSeverity.MEDIUM,
        confidence: 1.0,
        details: `Rate limit exceeded: ${current.count} requests in ${windowMs / 1000 / 60} minutes`,
        recommendations: ['Implement exponential backoff', 'Contact support if legitimate use case'],
        requiresImmediateAction: false
      };
    }

    current.count++;
    return {
      threatDetected: false,
      confidence: 1.0,
      details: 'Rate limit check passed',
      recommendations: [],
      requiresImmediateAction: false
    };
  }

  /**
   * Detect suspicious activity patterns
   */
  private async detectSuspiciousActivity(req: any, userId?: string): Promise<ThreatDetectionResult> {
    if (!userId) {
      return {
        threatDetected: false,
        confidence: 1.0,
        details: 'No user ID for suspicious activity detection',
        recommendations: [],
        requiresImmediateAction: false
      };
    }

    const userActivities = this.suspiciousActivities.get(userId) || [];
    const now = new Date();
    const recentActivities = userActivities.filter(
      activity => now.getTime() - activity.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    // Calculate risk score based on various factors
    let riskScore = 0;
    const indicators: string[] = [];

    // Multiple failed login attempts
    const failedLogins = recentActivities.filter(a => 
      a.activity.includes('login_failed') && a.riskScore > 0.5
    ).length;
    if (failedLogins > 5) {
      riskScore += 0.3;
      indicators.push(`Multiple failed login attempts: ${failedLogins}`);
    }

    // Unusual access patterns
    const unusualAccess = recentActivities.filter(a => 
      a.activity.includes('unusual_access') || a.activity.includes('suspicious_ip')
    ).length;
    if (unusualAccess > 0) {
      riskScore += 0.4;
      indicators.push(`Unusual access patterns detected: ${unusualAccess}`);
    }

    // PHI access violations
    const phiViolations = recentActivities.filter(a => 
      a.activity.includes('phi_access_violation')
    ).length;
    if (phiViolations > 0) {
      riskScore += 0.5;
      indicators.push(`PHI access violations: ${phiViolations}`);
    }

    // High-risk activities
    const highRiskActivities = recentActivities.filter(a => a.riskScore > 0.7);
    if (highRiskActivities.length > 3) {
      riskScore += 0.3;
      indicators.push(`Multiple high-risk activities: ${highRiskActivities.length}`);
    }

    if (riskScore > 0.7) {
      return {
        threatDetected: true,
        threatType: ThreatType.SUSPICIOUS_ACTIVITY,
        severity: ThreatSeverity.HIGH,
        confidence: riskScore,
        details: `Suspicious activity detected with risk score: ${riskScore.toFixed(2)}`,
        recommendations: [
          'Review user activity logs',
          'Implement additional authentication factors',
          'Consider temporary account suspension',
          'Contact user for verification'
        ],
        requiresImmediateAction: true
      };
    }

    return {
      threatDetected: false,
      confidence: 1.0 - riskScore,
      details: 'No suspicious activity detected',
      recommendations: [],
      requiresImmediateAction: false
    };
  }

  /**
   * Log threat event for audit purposes
   */
  private async logThreatEvent(userId: string, threats: ThreatDetectionResult[], req: any): Promise<void> {
    try {
      const threatData = {
        userId,
        threats: threats.map(t => ({
          type: t.threatType,
          severity: t.severity,
          confidence: t.confidence,
          details: t.details
        })),
        timestamp: new Date(),
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        requestMethod: req.method,
        requestUrl: req.url,
        requestBody: req.body ? JSON.stringify(req.body) : null
      };

      // Log to database
      await prisma.securityThreatLog.create({
        data: {
          userId,
          threatType: threats[0].threatType!,
          severity: threats[0].severity!,
          confidence: threats[0].confidence,
          details: JSON.stringify(threatData),
          ipAddress: req.ip || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown',
          timestamp: new Date()
        }
      });

      // Log to HIPAA audit system
      await hipaaComplianceService.logAuditEvent(
        userId,
        'security_threat_detected',
        'system_security',
        req.ip || 'unknown',
        req.headers['user-agent'] || 'unknown',
        false,
        threatData
      );

    } catch (error) {
      console.error('Failed to log threat event:', error);
    }
  }

  /**
   * Get higher severity level
   */
  private getHigherSeverity(severity1: ThreatSeverity, severity2: ThreatSeverity): ThreatSeverity {
    const severityOrder = [ThreatSeverity.LOW, ThreatSeverity.MEDIUM, ThreatSeverity.HIGH, ThreatSeverity.CRITICAL];
    const index1 = severityOrder.indexOf(severity1);
    const index2 = severityOrder.indexOf(severity2);
    return index1 > index2 ? severity1 : severity2;
  }

  /**
   * Add suspicious activity
   */
  public addSuspiciousActivity(activity: Omit<SuspiciousActivity, 'timestamp'>): void {
    const userId = activity.userId;
    const userActivities = this.suspiciousActivities.get(userId) || [];
    
    userActivities.push({
      ...activity,
      timestamp: new Date()
    });

    // Keep only last 100 activities per user
    if (userActivities.length > 100) {
      userActivities.splice(0, userActivities.length - 100);
    }

    this.suspiciousActivities.set(userId, userActivities);
  }

  /**
   * Get threat statistics
   */
  public async getThreatStatistics(): Promise<{
    totalThreats: number;
    threatsByType: Record<ThreatType, number>;
    threatsBySeverity: Record<ThreatSeverity, number>;
    recentThreats: number;
  }> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const totalThreats = await prisma.securityThreatLog.count();
    const recentThreats = await prisma.securityThreatLog.count({
      where: {
        timestamp: {
          gte: oneDayAgo
        }
      }
    });

    const threatsByType = await prisma.securityThreatLog.groupBy({
      by: ['threatType'],
      _count: {
        threatType: true
      }
    });

    const threatsBySeverity = await prisma.securityThreatLog.groupBy({
      by: ['severity'],
      _count: {
        severity: true
      }
    });

    return {
      totalThreats,
      threatsByType: threatsByType.reduce((acc, item) => {
        acc[item.threatType as ThreatType] = item._count.threatType;
        return acc;
      }, {} as Record<ThreatType, number>),
      threatsBySeverity: threatsBySeverity.reduce((acc, item) => {
        acc[item.severity as ThreatSeverity] = item._count.severity;
        return acc;
      }, {} as Record<ThreatSeverity, number>),
      recentThreats
    };
  }
}

// Export singleton instance
export const threatDetectionService = ThreatDetectionService.getInstance();

// Export utility functions
export const {
  analyzeRequest,
  addSuspiciousActivity,
  getThreatStatistics
} = threatDetectionService;
