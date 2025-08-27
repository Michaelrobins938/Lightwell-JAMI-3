import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from './rateLimit';
import { sanitizeOutput } from './outputSanitization';
import { validateInput } from './inputValidation';

// Security configuration
const SECURITY_CONFIG = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },
  
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': ["'self'", 'https://api.openai.com', 'https://api.anthropic.com', 'https://api.groq.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'object-src': ["'none'"],
    'media-src': ["'self'"],
    'frame-src': ["'none'"],
    'worker-src': ["'self'"],
    'manifest-src': ["'self'"]
  },
  
  // Security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  }
};

// Input validation patterns
const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  sanitizedText: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
  apiKey: /^sk-[a-zA-Z0-9]{32,}$/
};

// Malicious patterns to block
const MALICIOUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /eval\s*\(/gi,
  /exec\s*\(/gi,
  /spawn\s*\(/gi,
  /child_process/gi,
  /document\.write/gi,
  /innerHTML/gi,
  /outerHTML/gi,
  /insertAdjacentHTML/gi,
  /setAttribute\s*\(\s*['"]on/gi,
  /addEventListener\s*\(\s*['"]load/gi,
  /setTimeout\s*\(\s*['"]javascript/gi,
  /setInterval\s*\(\s*['"]javascript/gi
];

// Pages Router version of validateInput
async function validateInputPages(
  request: NextApiRequest,
  patterns: typeof VALIDATION_PATTERNS,
  maliciousPatterns: RegExp[]
): Promise<{ valid: boolean; reasons: string[] }> {
  const reasons: string[] = [];
  
  try {
    // Validate URL parameters
    const url = new URL(request.url || '');
    for (const [key, value] of Array.from(url.searchParams.entries())) {
      if (!validateParameter(key, value, patterns, maliciousPatterns)) {
        reasons.push(`Invalid URL parameter: ${key}`);
      }
    }
    
    // Validate request body for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method || '')) {
      const contentType = request.headers['content-type'];
      
      if (contentType?.includes('application/json') && request.body) {
        const bodyValidation = validateObject(request.body, patterns, maliciousPatterns);
        if (!bodyValidation.valid) {
          reasons.push(...bodyValidation.reasons);
        }
      }
    }
    
    // Validate headers
    const userAgent = request.headers['user-agent'];
    if (userAgent && maliciousPatterns.some(pattern => pattern.test(userAgent))) {
      reasons.push('Malicious User-Agent detected');
    }
    
    return {
      valid: reasons.length === 0,
      reasons
    };
    
  } catch (error) {
    console.error('Input validation error:', error);
    return {
      valid: false,
      reasons: ['Input validation failed']
    };
  }
}

function validateParameter(
  key: string,
  value: string,
  patterns: typeof VALIDATION_PATTERNS,
  maliciousPatterns: RegExp[]
): boolean {
  // Check for malicious patterns first
  if (maliciousPatterns.some(pattern => pattern.test(value))) {
    return false;
  }
  
  // Validate based on parameter type
  switch (key.toLowerCase()) {
    case 'email':
      return patterns.email.test(value);
    case 'username':
      return patterns.username.test(value);
    case 'password':
      return patterns.password.test(value);
    case 'id':
    case 'userid':
    case 'sessionid':
      return patterns.uuid.test(value);
    case 'apikey':
    case 'api_key':
      return patterns.apiKey.test(value);
    default:
      // For unknown parameters, use sanitized text pattern
      return patterns.sanitizedText.test(value) && value.length <= 1000;
  }
}

function validateObject(
  obj: any,
  patterns: typeof VALIDATION_PATTERNS,
  maliciousPatterns: RegExp[],
  path: string = ''
): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'string') {
      if (!validateParameter(key, value, patterns, maliciousPatterns)) {
        reasons.push(`Invalid field: ${currentPath}`);
      }
    } else if (typeof value === 'object' && value !== null) {
      const nestedValidation = validateObject(value, patterns, maliciousPatterns, currentPath);
      if (!nestedValidation.valid) {
        reasons.push(...nestedValidation.reasons);
      }
    }
  }
  
  return {
    valid: reasons.length === 0,
    reasons
  };
}

// API Route Security Types
export interface SecureRequest extends NextApiRequest {
  user?: {
    userId: string;
    id?: string;
  };
}

// API Route Security Middleware
export const withSecurity = (handler: (req: SecureRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: SecureRequest, res: NextApiResponse) => {
    const startTime = Date.now();
    const clientIP = (req as any).ip || req.headers['x-forwarded-for'] as string || 'unknown';
    
    try {
      // 1. Rate limiting
      const rateLimitResult = await rateLimit(clientIP, SECURITY_CONFIG.rateLimit);
      if (!rateLimitResult.allowed) {
        console.warn(`Rate limit exceeded for IP: ${clientIP}`);
        return res.status(429).json({ error: SECURITY_CONFIG.rateLimit.message });
      }

      // 2. Input validation
      const validationResult = await validateInputPages(req, VALIDATION_PATTERNS, MALICIOUS_PATTERNS);
      if (!validationResult.valid) {
        console.warn(`Invalid input detected from IP: ${clientIP}`, validationResult.reasons);
        return res.status(400).json({ error: 'Invalid input detected' });
      }

      // 3. Add security headers
      Object.entries(SECURITY_CONFIG.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      // 4. Call the handler
      await handler(req, res);

      // 5. Sanitize output if needed
      if (res.statusCode === 200 && typeof res.getHeader('content-type') === 'string' && (res.getHeader('content-type') as string).includes('application/json')) {
        const originalJson = res.json;
        res.json = function(data: any) {
          const sanitizedData = sanitizeOutput(data);
          return originalJson.call(this, sanitizedData);
        };
      }

    } catch (error) {
      console.error('Security middleware error:', error);
      return res.status(500).json({ error: 'Internal security error' });
    }
  };
};

export async function securityMiddleware(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    // 1. Rate limiting
    const rateLimitResult = await rateLimit(clientIP, SECURITY_CONFIG.rateLimit);
    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new NextResponse(
        JSON.stringify({ error: SECURITY_CONFIG.rateLimit.message }),
        { 
          status: 429, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 2. Input validation
    const validationResult = await validateInput(request, VALIDATION_PATTERNS, MALICIOUS_PATTERNS);
    if (!validationResult.valid) {
      console.warn(`Invalid input detected from IP: ${clientIP}`, validationResult.reasons);
      return new NextResponse(
        JSON.stringify({ error: 'Invalid input detected' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 3. Continue with the request
    const response = NextResponse.next();

    // 4. Add security headers
    Object.entries(SECURITY_CONFIG.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // 5. Add Content Security Policy
    const cspString = Object.entries(SECURITY_CONFIG.csp)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');
    response.headers.set('Content-Security-Policy', cspString);

    // 6. Log security event
    const duration = Date.now() - startTime;
    console.log(`Security middleware processed request from ${clientIP} in ${duration}ms`);

    return response;

  } catch (error) {
    console.error('Security middleware error:', error);
    
    // Return a generic error response without exposing internal details
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Export validation patterns for use in other parts of the application
export { VALIDATION_PATTERNS, MALICIOUS_PATTERNS };
