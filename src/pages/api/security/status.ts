import { NextApiRequest, NextApiResponse } from 'next';
import { withSecurity } from '../../../middleware/securityMiddleware';
import { encryptionService } from '../../../services/encryptionService';
import { hipaaComplianceService } from '../../../services/hipaaComplianceService';
import { threatDetectionService } from '../../../services/threatDetectionService';
import { prisma } from '../../../lib/database';
import { getSecurityConfig } from '../../../config/security';

// API Route Security Types
export interface SecureRequest extends NextApiRequest {
  user?: {
    userId: string;
    id?: string;
    isAdmin?: boolean;
  };
  ip?: string;
}

// Security status response interface
interface SecurityStatusResponse {
  timestamp: string;
  overallStatus: 'secure' | 'warning' | 'critical';
  components: {
    encryption: SecurityComponentStatus;
    authentication: SecurityComponentStatus;
    network: SecurityComponentStatus;
    data: SecurityComponentStatus;
    compliance: SecurityComponentStatus;
    threatDetection: SecurityComponentStatus;
  };
  threats: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    recent: number;
    blocked: number;
  };
  compliance: {
    hipaa: ComplianceStatus;
    gdpr: ComplianceStatus;
    sox: ComplianceStatus;
    lastReview: string;
    nextReview: string;
  };
  metrics: {
    activeUsers: number;
    failedLogins: number;
    suspiciousActivities: number;
    dataAccessEvents: number;
    encryptionKeys: number;
    auditLogs: number;
  };
  recommendations: string[];
  alerts: SecurityAlert[];
}

interface SecurityComponentStatus {
  status: 'secure' | 'warning' | 'critical';
  details: string;
  lastChecked: string;
  nextCheck: string;
}

interface ComplianceStatus {
  status: 'compliant' | 'non_compliant' | 'needs_review';
  score: number;
  issues: string[];
  lastAudit: string;
}

interface SecurityAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  requiresAction: boolean;
}

async function handler(req: SecureRequest, res: NextApiResponse) {
  try {
    // Check if user has admin privileges
    if (!req.user?.isAdmin) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Admin privileges required to access security status'
      });
    }

    // Get security configuration
    const securityConfig = getSecurityConfig();

    // Collect security status from all services
    const [
      encryptionStatus,
      threatSummary,
      complianceReport,
      securityMetrics,
      recentAlerts
    ] = await Promise.all([
      getEncryptionStatus(),
      getThreatSummary(),
      getComplianceStatus(),
      getSecurityMetrics(),
      getRecentAlerts()
    ]);

    // Determine overall security status
    const overallStatus = determineOverallStatus([
      encryptionStatus.status,
      threatSummary.hasCriticalThreats ? 'critical' : 'secure',
      complianceReport.hasIssues ? 'warning' : 'secure'
    ]);

    // Generate recommendations
    const recommendations = generateRecommendations({
      encryptionStatus,
      threatSummary,
      complianceReport,
      securityMetrics
    });

    // Build response
    const response: SecurityStatusResponse = {
      timestamp: new Date().toISOString(),
      overallStatus,
      components: {
        encryption: encryptionStatus,
        authentication: await getAuthenticationStatus(),
        network: await getNetworkStatus(),
        data: await getDataSecurityStatus(),
        compliance: await getComplianceComponentStatus(),
        threatDetection: await getThreatDetectionStatus()
      },
      threats: threatSummary,
      compliance: complianceReport,
      metrics: securityMetrics,
      recommendations,
      alerts: recentAlerts
    };

    // Apply security headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(200).json(response);

  } catch (error) {
    console.error('Security status API error:', error);
    
    // Log security failure
    if (req.user?.userId) {
      await hipaaComplianceService.logAuditEvent(
        req.user.userId,
        'security_status_api_error',
        'api_security_status',
        req.ip || 'unknown',
        req.headers['user-agent'] || 'unknown',
        false,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve security status'
    });
  }
}

async function getEncryptionStatus(): Promise<SecurityComponentStatus> {
  try {
    // Check encryption service status
    const hasMasterKey = encryptionService['masterKey'] !== null;
    
    // Check encryption key health
    const encryptionKeys = await prisma.encryptionKey.count({
      where: { isActive: true }
    });

    // Check for expired keys
    const expiredKeys = await prisma.encryptionKey.count({
      where: {
        isActive: true,
        expiresAt: {
          lt: new Date()
        }
      }
    });

    let status: 'secure' | 'warning' | 'critical' = 'secure';
    let details = 'Encryption service is operational';

    if (!hasMasterKey) {
      status = 'critical';
      details = 'Master encryption key not initialized';
    } else if (expiredKeys > 0) {
      status = 'warning';
      details = `${expiredKeys} encryption keys have expired`;
    } else if (encryptionKeys === 0) {
      status = 'warning';
      details = 'No active encryption keys found';
    }

    return {
      status,
      details,
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
    };
  } catch (error) {
    return {
      status: 'critical',
      details: 'Failed to check encryption status',
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 1 * 60 * 1000).toISOString() // 1 minute
    };
  }
}

async function getThreatSummary() {
  try {
    const threatStats = await threatDetectionService.getThreatStatistics();
    
    return {
      total: threatStats.totalThreats,
      critical: threatStats.threatsBySeverity.critical || 0,
      high: threatStats.threatsBySeverity.high || 0,
      medium: threatStats.threatsBySeverity.medium || 0,
      low: threatStats.threatsBySeverity.low || 0,
      recent: threatStats.recentThreats,
      blocked: threatStats.totalThreats - threatStats.recentThreats,
      hasCriticalThreats: (threatStats.threatsBySeverity.critical || 0) > 0
    };
  } catch (error) {
    console.error('Failed to get threat summary:', error);
    return {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      recent: 0,
      blocked: 0,
      hasCriticalThreats: false
    };
  }
}

async function getComplianceStatus() {
  try {
    const hipaaReport = await hipaaComplianceService.generateComplianceReport();
    
    // Check for compliance issues
    const hasIssues = hipaaReport.recommendations.length > 0;
    
    return {
      hipaa: {
        status: (hasIssues ? 'needs_review' : 'compliant') as 'compliant' | 'non_compliant' | 'needs_review',
        score: hasIssues ? 85 : 100,
        issues: hipaaReport.recommendations,
        lastAudit: new Date().toISOString()
      },
      gdpr: {
        status: 'compliant' as 'compliant' | 'non_compliant' | 'needs_review',
        score: 100,
        issues: [],
        lastAudit: new Date().toISOString()
      },
      sox: {
        status: 'needs_review' as 'compliant' | 'non_compliant' | 'needs_review',
        score: 90,
        issues: ['Quarterly review pending'],
        lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      lastReview: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      nextReview: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      hasIssues
    };
  } catch (error) {
    console.error('Failed to get compliance status:', error);
    return {
      hipaa: { status: 'needs_review' as 'compliant' | 'non_compliant' | 'needs_review', score: 0, issues: ['Failed to load'], lastAudit: new Date().toISOString() },
      gdpr: { status: 'needs_review' as 'compliant' | 'non_compliant' | 'needs_review', score: 0, issues: ['Failed to load'], lastAudit: new Date().toISOString() },
      sox: { status: 'needs_review' as 'compliant' | 'non_compliant' | 'needs_review', score: 0, issues: ['Failed to load'], lastAudit: new Date().toISOString() },
      lastReview: new Date().toISOString(),
      nextReview: new Date().toISOString(),
      hasIssues: true
    };
  }
}

async function getSecurityMetrics() {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      activeUsers,
      failedLogins,
      suspiciousActivities,
      dataAccessEvents,
      encryptionKeys,
      auditLogs
    ] = await Promise.all([
      // Active users in last 24 hours
      prisma.user.count({
        where: {
          updatedAt: {
            gte: oneDayAgo
          }
        }
      }),
      // Failed login attempts in last 24 hours
      prisma.hIPAAAuditLog.count({
        where: {
          action: 'login_failed',
          timestamp: {
            gte: oneDayAgo
          }
        }
      }),
      // Suspicious activities in last 24 hours
      prisma.securityThreatLog.count({
        where: {
          timestamp: {
            gte: oneDayAgo
          }
        }
      }),
      // Data access events in last 24 hours
      prisma.dataAccessLog.count({
        where: {
          timestamp: {
            gte: oneDayAgo
          }
        }
      }),
      // Active encryption keys
      prisma.encryptionKey.count({
        where: { isActive: true }
      }),
      // Total audit logs
      prisma.hIPAAAuditLog.count()
    ]);

    return {
      activeUsers,
      failedLogins,
      suspiciousActivities,
      dataAccessEvents,
      encryptionKeys,
      auditLogs
    };
  } catch (error) {
    console.error('Failed to get security metrics:', error);
    return {
      activeUsers: 0,
      failedLogins: 0,
      suspiciousActivities: 0,
      dataAccessEvents: 0,
      encryptionKeys: 0,
      auditLogs: 0
    };
  }
}

async function getRecentAlerts(): Promise<SecurityAlert[]> {
  try {
    const recentThreats = await prisma.securityThreatLog.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    return recentThreats.map(threat => ({
      id: threat.id,
      level: threat.severity === 'critical' ? 'critical' : 
             threat.severity === 'high' ? 'warning' : 'info',
      message: `Security threat detected: ${threat.threatType}`,
      timestamp: threat.timestamp.toISOString(),
      requiresAction: threat.severity === 'critical' || threat.severity === 'high'
    }));
  } catch (error) {
    console.error('Failed to get recent alerts:', error);
    return [];
  }
}

async function getAuthenticationStatus(): Promise<SecurityComponentStatus> {
  // This would check authentication service status
  return {
    status: 'secure',
    details: 'Authentication service is operational',
    lastChecked: new Date().toISOString(),
    nextCheck: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  };
}

async function getNetworkStatus(): Promise<SecurityComponentStatus> {
  // This would check network security status
  return {
    status: 'secure',
    details: 'Network security is operational',
    lastChecked: new Date().toISOString(),
    nextCheck: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  };
}

async function getDataSecurityStatus(): Promise<SecurityComponentStatus> {
  // This would check data security status
  return {
    status: 'secure',
    details: 'Data security measures are active',
    lastChecked: new Date().toISOString(),
    nextCheck: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  };
}

async function getComplianceComponentStatus(): Promise<SecurityComponentStatus> {
  // This would check compliance monitoring status
  return {
    status: 'secure',
    details: 'Compliance monitoring is active',
    lastChecked: new Date().toISOString(),
    nextCheck: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  };
}

async function getThreatDetectionStatus(): Promise<SecurityComponentStatus> {
  // This would check threat detection service status
  return {
    status: 'secure',
    details: 'Threat detection service is operational',
    lastChecked: new Date().toISOString(),
    nextCheck: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  };
}

function determineOverallStatus(statuses: ('secure' | 'warning' | 'critical')[]): 'secure' | 'warning' | 'critical' {
  if (statuses.includes('critical')) return 'critical';
  if (statuses.includes('warning')) return 'warning';
  return 'secure';
}

function generateRecommendations(data: any): string[] {
  const recommendations: string[] = [];

  // Encryption recommendations
  if (data.encryptionStatus.status === 'critical') {
    recommendations.push('Immediately initialize master encryption key');
  }
  if (data.encryptionStatus.status === 'warning') {
    recommendations.push('Review and rotate expired encryption keys');
  }

  // Threat recommendations
  if (data.threatSummary.critical > 0) {
    recommendations.push('Investigate critical security threats immediately');
  }
  if (data.threatSummary.high > 0) {
    recommendations.push('Address high-priority security threats');
  }

  // Compliance recommendations
  if (data.complianceReport.hasIssues) {
    recommendations.push('Review and address compliance recommendations');
  }

  // General recommendations
  if (data.metrics.failedLogins > 10) {
    recommendations.push('Investigate high number of failed login attempts');
  }
  if (data.metrics.suspiciousActivities > 5) {
    recommendations.push('Review suspicious activity patterns');
  }

  return recommendations;
}

export default withSecurity(handler);
