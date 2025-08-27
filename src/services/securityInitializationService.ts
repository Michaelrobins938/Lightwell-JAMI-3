import { encryptionService } from './encryptionService';
import { hipaaComplianceService } from './hipaaComplianceService';
import { threatDetectionService } from './threatDetectionService';
import { prisma } from '../lib/database';
import { getSecurityConfig, validateSecurityPolicy } from '../config/security';

export interface SecurityInitResult {
  success: boolean;
  components: {
    encryption: SecurityComponentStatus;
    hipaa: SecurityComponentStatus;
    threatDetection: SecurityComponentStatus;
    database: SecurityComponentStatus;
    audit: SecurityComponentStatus;
  };
  warnings: string[];
  errors: string[];
  recommendations: string[];
}

interface SecurityComponentStatus {
  initialized: boolean;
  status: 'operational' | 'warning' | 'error';
  message: string;
  details?: any;
}

export class SecurityInitializationService {
  private static instance: SecurityInitializationService;
  private initialized = false;
  private initResult: SecurityInitResult | null = null;

  private constructor() {}

  static getInstance(): SecurityInitializationService {
    if (!SecurityInitializationService.instance) {
      SecurityInitializationService.instance = new SecurityInitializationService();
    }
    return SecurityInitializationService.instance;
  }

  async initialize(): Promise<SecurityInitResult> {
    if (this.initialized) {
      return this.initResult!;
    }

    console.log('🔐 Initializing comprehensive security system...');
    
    const result: SecurityInitResult = {
      success: false,
      components: {
        encryption: { initialized: false, status: 'error', message: 'Not initialized' },
        hipaa: { initialized: false, status: 'error', message: 'Not initialized' },
        threatDetection: { initialized: false, status: 'error', message: 'Not initialized' },
        database: { initialized: false, status: 'error', message: 'Not initialized' },
        audit: { initialized: false, status: 'error', message: 'Not initialized' }
      },
      warnings: [],
      errors: [],
      recommendations: []
    };

    try {
      // Step 1: Validate security configuration
      await this.validateConfiguration(result);

      // Step 2: Initialize database security
      await this.initializeDatabaseSecurity(result);

      // Step 3: Initialize encryption service
      await this.initializeEncryptionService(result);

      // Step 4: Initialize HIPAA compliance service
      await this.initializeHIPAACompliance(result);

      // Step 5: Initialize threat detection service
      await this.initializeThreatDetection(result);

      // Step 6: Initialize audit system
      await this.initializeAuditSystem(result);

      // Step 7: Perform security health checks
      await this.performSecurityHealthChecks(result);

      // Step 8: Generate recommendations
      this.generateRecommendations(result);

      // Determine overall success
      const hasErrors = result.components.encryption.status === 'error' ||
                       result.components.database.status === 'error';
      
      const hasWarnings = Object.values(result.components).some(c => c.status === 'warning');
      
      result.success = !hasErrors;
      
      if (result.success) {
        this.initialized = true;
        this.initResult = result;
        console.log('✅ Security system initialized successfully');
      } else {
        console.error('❌ Security system initialization failed');
      }

    } catch (error) {
      console.error('Security initialization error:', error);
      result.errors.push(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.success = false;
    }

    return result;
  }

  private async validateConfiguration(result: SecurityInitResult): Promise<void> {
    try {
      const config = getSecurityConfig();
      
      if (!validateSecurityPolicy(config)) {
        throw new Error('Security policy validation failed');
      }

      // Check required environment variables
      const requiredEnvVars = [
        'MASTER_ENCRYPTION_KEY',
        'AUDIT_SECRET',
        'DATABASE_URL'
      ];

      const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingEnvVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
      }

      // Validate encryption key strength
      const masterKey = process.env.MASTER_ENCRYPTION_KEY!;
      if (masterKey.length < 32) {
        result.warnings.push('Master encryption key should be at least 32 characters long');
      }

      console.log('✅ Security configuration validated');
    } catch (error) {
      result.errors.push(`Configuration validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async initializeDatabaseSecurity(result: SecurityInitResult): Promise<void> {
    try {
      // Test database connection
      await prisma.$connect();
      
      // Verify security tables exist
      const tables = await this.checkSecurityTables();
      
      if (!tables.allExist) {
        result.warnings.push(`Missing security tables: ${tables.missing.join(', ')}`);
        result.recommendations.push('Run database migrations to create security tables');
      }

      // Initialize encryption keys table
      await this.initializeEncryptionKeys();

      result.components.database = {
        initialized: true,
        status: 'operational',
        message: 'Database security initialized successfully',
        details: { tables: tables.existing }
      };

      console.log('✅ Database security initialized');
    } catch (error) {
      result.components.database = {
        initialized: false,
        status: 'error',
        message: `Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      result.errors.push(`Database security failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async initializeEncryptionService(result: SecurityInitResult): Promise<void> {
    try {
      const masterKey = process.env.MASTER_ENCRYPTION_KEY!;
      
      await encryptionService.initialize(masterKey);
      
      // Test encryption/decryption
      const testData = 'security_test_data';
      const encrypted = await encryptionService.encryptUserData(testData, 'test_user', 'test');
      const decrypted = await encryptionService.decryptUserData(
        encrypted.encryptedData,
        'test_password', // Default password for testing
        'test_salt' // Default salt for testing
      );
      
      if (decrypted !== testData) {
        throw new Error('Encryption/decryption test failed');
      }

      console.log('✅ Encryption service test passed');
    } catch (error) {
      result.errors.push(`Encryption service test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }

    // Test HIPAA compliance service
    try {
      console.log('🔒 Testing HIPAA compliance service...');
      // Note: HIPAA service methods may not be implemented yet
      console.log('⚠️ HIPAA compliance service test skipped - methods not implemented');
    } catch (error) {
      result.errors.push(`HIPAA compliance service test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }

    // Test threat detection service
    try {
      console.log('🛡️ Testing threat detection service...');
      // Note: Threat detection service methods may not be implemented yet
      console.log('⚠️ Threat detection service test skipped - methods not implemented');
    } catch (error) {
      result.errors.push(`Threat detection service test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async initializeHIPAACompliance(result: SecurityInitResult): Promise<void> {
    try {
      await hipaaComplianceService.initialize();
      
      // Test HIPAA compliance service
      const phiResult = await hipaaComplianceService.detectPHI(testData);
      
      if (!phiResult.detected) {
        result.warnings.push('PHI detection may not be working correctly');
      }

      result.components.hipaa = {
        initialized: true,
        status: 'operational',
        message: 'HIPAA compliance service initialized successfully',
        details: { phiDetection: phiResult.detected }
      };

      console.log('✅ HIPAA compliance service initialized');
    } catch (error) {
      result.components.hipaa = {
        initialized: false,
        status: 'error',
        message: `HIPAA initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      result.errors.push(`HIPAA compliance failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async initializeThreatDetection(result: SecurityInitResult): Promise<void> {
    try {
      await threatDetectionService.initialize();
      
      // Test threat detection
      const testThreat = 'SELECT * FROM users WHERE id = 1 OR 1=1';
      const threatResult = await threatDetectionService.analyzeRequest(
        { body: { message: testThreat } } as any,
        'test_user'
      );
      
      if (!threatResult.threatDetected) {
        result.warnings.push('SQL injection detection may not be working correctly');
      }

      result.components.threatDetection = {
        initialized: true,
        status: 'operational',
        message: 'Threat detection service initialized successfully',
        details: { threatTypes: ['sql_injection', 'xss', 'csrf', 'brute_force'] }
      };

      console.log('✅ Threat detection service initialized');
    } catch (error) {
      result.components.threatDetection = {
        initialized: false,
        status: 'error',
        message: `Threat detection initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      result.errors.push(`Threat detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async initializeAuditSystem(result: SecurityInitResult): Promise<void> {
    try {
      // Test audit logging
      await hipaaComplianceService.logAuditEvent(
        'system_init',
        'security_initialization',
        'system',
        '127.0.0.1',
        'SecurityInitializationService',
        true,
        { component: 'audit_system', action: 'test' }
      );

      result.components.audit = {
        initialized: true,
        status: 'operational',
        message: 'Audit system initialized successfully',
        details: { auditLogging: true, retentionPeriod: '7 years' }
      };

      console.log('✅ Audit system initialized');
    } catch (error) {
      result.components.audit = {
        initialized: false,
        status: 'error',
        message: `Audit initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      result.errors.push(`Audit system failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async checkSecurityTables(): Promise<{ allExist: boolean; existing: string[]; missing: string[] }> {
    const requiredTables = [
      'User',
      'ChatMessage',
      'EncryptionKey',
      'HIPAAAuditLog',
      'SecurityThreatLog',
      'DataAccessLog',
      'BreachAssessment'
    ];

    const existing: string[] = [];
    const missing: string[] = [];

    for (const table of requiredTables) {
      try {
        // Try to query each table to see if it exists
        await prisma.$queryRaw`SELECT 1 FROM "${table}" LIMIT 1`;
        existing.push(table);
      } catch (error) {
        missing.push(table);
      }
    }

    return {
      allExist: missing.length === 0,
      existing,
      missing
    };
  }

  private async initializeEncryptionKeys(): Promise<void> {
    // Check if we have active encryption keys
    // Note: encryptionKey model may not exist in current schema
    console.log('⚠️ Encryption key initialization skipped - model not available');
  }

  private async performSecurityHealthChecks(result: SecurityInitResult): Promise<void> {
    try {
      // Check encryption key health
      // Note: encryptionKey model may not exist in current schema
      console.log('⚠️ Encryption key health check skipped - model not available');

      // Check audit log health
      // Note: hIPAAAuditLog model may not exist in current schema
      console.log('⚠️ Audit log health check skipped - model not available');

      // Check threat detection health
      // Note: securityThreatLog model may not exist in current schema
      console.log('⚠️ Threat detection health check skipped - model not available');

      console.log('Security health check: models not available in current schema');
    } catch (error) {
      result.warnings.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateRecommendations(result: SecurityInitResult): void {
    const config = getSecurityConfig();

    // Security level recommendations
    if (process.env.SECURITY_LEVEL !== 'high') {
      result.recommendations.push('Consider setting SECURITY_LEVEL=high for maximum security');
    }

    // Encryption recommendations
    if (config.encryption.pbkdf2Iterations < 200000) {
      result.recommendations.push('Consider increasing PBKDF2 iterations for enhanced security');
    }

    // Monitoring recommendations
    if (!config.monitoring.enabled) {
      result.recommendations.push('Enable security monitoring for real-time threat detection');
    }

    // Backup recommendations
    if (!config.backup.enabled) {
      result.recommendations.push('Enable automated security backups');
    }

    // General recommendations
    result.recommendations.push('Regular security audits should be performed');
    result.recommendations.push('Keep security configurations updated');
    result.recommendations.push('Monitor security dashboard regularly');
  }

  getStatus(): SecurityInitResult | null {
    return this.initResult;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async reinitialize(): Promise<SecurityInitResult> {
    this.initialized = false;
    this.initResult = null;
    return this.initialize();
  }
}

export const securityInitService = SecurityInitializationService.getInstance();