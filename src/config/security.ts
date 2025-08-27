// Comprehensive Security Configuration
export const securityConfig = {
  // Encryption Settings
  encryption: {
    algorithm: 'aes-256-gcm',
    keySize: 256,
    ivSize: 128,
    authTagSize: 128,
    pbkdf2Iterations: 100000,
    pbkdf2Digest: 'sha512',
    saltSize: 32,
    keyDerivationIterations: 200000,
  },

  // JWT Settings
  jwt: {
    algorithm: 'HS256',
    expiresIn: '24h',
    refreshExpiresIn: '7d',
    issuer: 'luna-web',
    audience: 'luna-web-users',
    maxRefreshTokens: 5,
  },

  // Session Settings
  session: {
    maxConcurrentSessions: 3,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    absoluteTimeout: 24 * 60 * 60 * 1000, // 24 hours
    regenerateId: true,
    rolling: true,
  },

  // Password Policy
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    historyCount: 5,
    lockoutThreshold: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: {
      anonymous: 100,
      authenticated: 1000,
      premium: 5000,
      enterprise: 10000,
    },
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },

  // Threat Detection
  threatDetection: {
    enabled: true,
    sqlInjection: {
      enabled: true,
      severity: 'critical',
      action: 'block',
    },
    xss: {
      enabled: true,
      severity: 'high',
      action: 'block',
    },
    csrf: {
      enabled: true,
      severity: 'medium',
      action: 'log',
    },
    bruteForce: {
      enabled: true,
      threshold: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      action: 'block',
    },
    suspiciousActivity: {
      enabled: true,
      riskThreshold: 0.7,
      action: 'flag',
    },
  },

  // HIPAA Compliance
  hipaa: {
    enabled: true,
    dataRetention: {
      phi: 2555, // 7 years
      chatHistory: 730, // 2 years
      assessments: 1825, // 5 years
      analytics: 365, // 1 year
      auditLogs: 2555, // 7 years
    },
    encryption: {
      atRest: true,
      inTransit: true,
      endToEnd: true,
    },
    auditLogging: {
      enabled: true,
      logLevel: 'detailed',
      retentionPeriod: 2555, // 7 years
    },
    accessControl: {
      roleBased: true,
      leastPrivilege: true,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
    },
    breachNotification: {
      required: true,
      timeframe: 60, // 60 hours
      authorities: ['HHS', 'State Attorney General'],
    },
  },

  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; '),
  },

  // CORS Settings
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  // Input Validation
  validation: {
    maxInputLength: 10000,
    allowedFileTypes: ['.txt', '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    sanitizeHtml: true,
    validateJson: true,
  },

  // Monitoring and Alerting
  monitoring: {
    enabled: true,
    logLevel: 'info',
    alertThresholds: {
      failedLogins: 10,
      suspiciousActivity: 5,
      securityThreats: 3,
      dataBreaches: 1,
    },
    notificationChannels: ['email', 'slack', 'sms'],
  },

  // Backup and Recovery
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30, // days
    encryption: true,
    compression: true,
    verifyIntegrity: true,
  },

  // Incident Response
  incidentResponse: {
    enabled: true,
    escalationLevels: [
      { level: 1, response: 'automated', timeframe: '5m' },
      { level: 2, response: 'oncall', timeframe: '15m' },
      { level: 3, response: 'management', timeframe: '1h' },
      { level: 4, response: 'executive', timeframe: '4h' },
    ],
    playbooks: {
      dataBreach: 'data-breach-response.md',
      securityIncident: 'security-incident-response.md',
      systemCompromise: 'system-compromise-response.md',
    },
  },

  // Compliance Reporting
  compliance: {
    enabled: true,
    reports: {
      hipaa: { frequency: 'quarterly', autoGenerate: true },
      gdpr: { frequency: 'annually', autoGenerate: true },
      sox: { frequency: 'quarterly', autoGenerate: false },
    },
    auditTrail: {
      enabled: true,
      retention: 2555, // 7 years
      encryption: true,
      integrity: true,
    },
  },

  // Development and Testing
  development: {
    bypassSecurity: false,
    debugMode: false,
    testMode: false,
    mockEncryption: false,
    allowInsecureConnections: false,
  },
};

// Environment-specific overrides
export const getSecurityConfig = () => {
  const config = { ...securityConfig };

  if (process.env.NODE_ENV === 'development') {
    config.development.debugMode = true;
    config.development.testMode = true;
    config.monitoring.logLevel = 'debug';
  }

  if (process.env.NODE_ENV === 'test') {
    config.development.testMode = true;
    config.development.mockEncryption = true;
    config.encryption.pbkdf2Iterations = 1000; // Faster for testing
  }

  if (process.env.SECURITY_LEVEL === 'high') {
    config.encryption.pbkdf2Iterations = 300000;
    config.password.minLength = 16;
    config.session.maxConcurrentSessions = 1;
    // Note: threatDetection.action is set per-threat-type, not globally
  }

  return config;
};

// Security policy validation
export const validateSecurityPolicy = (policy: any): boolean => {
  const requiredFields = [
    'encryption.algorithm',
    'encryption.keySize',
    'jwt.algorithm',
    'password.minLength',
    'hipaa.enabled',
    'threatDetection.enabled',
  ];

  for (const field of requiredFields) {
    const value = field.split('.').reduce((obj, key) => obj?.[key], policy);
    if (value === undefined || value === null) {
      console.error(`Missing required security policy field: ${field}`);
      return false;
    }
  }

  return true;
};

// Export default configuration
export default getSecurityConfig();
