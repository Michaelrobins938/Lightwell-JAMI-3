import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../services/logger';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;
const MAX_REQUESTS_PER_IP = 50;

// Store for rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Security headers
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';",
};

// Input validation patterns
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  message: /^[\w\s.,!?-]{1,1000}$/,
};

// Threat detection patterns
const THREAT_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /eval\s*\(/gi,
  /document\./gi,
  /window\./gi,
  /alert\s*\(/gi,
  /confirm\s*\(/gi,
  /prompt\s*\(/gi,
];

export function applySecurityHeaders(res: NextApiResponse): void {
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
}

export function rateLimit(req: NextApiRequest, res: NextApiResponse): boolean {
  const clientIP = getClientIP(req);
  const now = Date.now();
  
  // Get or create rate limit entry
  const entry = requestCounts.get(clientIP) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  // Reset if window has passed
  if (now > entry.resetTime) {
    entry.count = 0;
    entry.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  // Check limits
  if (entry.count >= MAX_REQUESTS_PER_IP) {
    logger.warn('Rate limit exceeded', { clientIP, count: entry.count });
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    });
    return false;
  }
  
  // Increment counter
  entry.count++;
  requestCounts.set(clientIP, entry);
  
  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_IP.toString());
  res.setHeader('X-RateLimit-Remaining', (MAX_REQUESTS_PER_IP - entry.count).toString());
  res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
  
  return true;
}

export function validateInput(data: any, schema: Record<string, string>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const [field, pattern] of Object.entries(schema)) {
    const value = data[field];
    
    if (value === undefined || value === null) {
      errors.push(`${field} is required`);
      continue;
    }
    
    if (typeof value !== 'string') {
      errors.push(`${field} must be a string`);
      continue;
    }
    
    const validationPattern = VALIDATION_PATTERNS[pattern as keyof typeof VALIDATION_PATTERNS];
    if (validationPattern && !validationPattern.test(value)) {
      errors.push(`${field} format is invalid`);
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

export function detectThreats(input: string): { isThreat: boolean; threats: string[] } {
  const threats: string[] = [];
  
  THREAT_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(input)) {
      threats.push(`Threat pattern ${index + 1} detected`);
    }
  });
  
  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi,
    /(--|\/\*|\*\/)/g,
    /(\b(exec|execute|xp_|sp_)\b)/gi,
  ];
  
  sqlPatterns.forEach((pattern, index) => {
    if (pattern.test(input)) {
      threats.push(`SQL injection pattern ${index + 1} detected`);
    }
  });
  
  // Check for excessive length
  if (input.length > 10000) {
    threats.push('Input exceeds maximum length');
  }
  
  return { isThreat: threats.length > 0, threats };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

export function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  
  if (typeof realIP === 'string') {
    return realIP;
  }
  
  return req.socket.remoteAddress || 'unknown';
}

export function logSecurityEvent(event: string, details: any): void {
  logger.info('Security event', { event, ...details, timestamp: new Date().toISOString() });
}

export function validateContentType(req: NextApiRequest, allowedTypes: string[]): boolean {
  const contentType = req.headers['content-type'];
  
  if (!contentType) {
    return false;
  }
  
  return allowedTypes.some(type => contentType.includes(type));
}

export function validateOrigin(req: NextApiRequest, allowedOrigins: string[]): boolean {
  const origin = req.headers.origin;
  
  if (!origin) {
    return true; // Allow requests without origin (same-origin)
  }
  
  return allowedOrigins.includes(origin);
}

// Middleware function to apply all security measures
export function securityMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void): void {
  // Apply security headers
  applySecurityHeaders(res);
  
  // Rate limiting
  if (!rateLimit(req, res)) {
    return;
  }
  
  // Log security event
  logSecurityEvent('request', {
    method: req.method,
    url: req.url,
    clientIP: getClientIP(req),
    userAgent: req.headers['user-agent'],
  });
  
  // Threat detection for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
    const body = req.body;
    if (body && typeof body === 'object') {
      const bodyString = JSON.stringify(body);
      const threatCheck = detectThreats(bodyString);
      
      if (threatCheck.isThreat) {
        logger.warn('Threat detected', { threats: threatCheck.threats, clientIP: getClientIP(req) });
        res.status(400).json({
          error: 'Invalid input',
          message: 'Request contains potentially harmful content',
        });
        return;
      }
    }
  }
  
  next();
}

// Export common validation schemas
export const VALIDATION_SCHEMAS = {
  login: {
    email: 'email',
    password: 'password',
  },
  register: {
    email: 'email',
    password: 'password',
    name: 'username',
  },
  message: {
    content: 'message',
  },
} as const; 