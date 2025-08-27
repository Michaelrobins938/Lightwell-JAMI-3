import { NextRequest } from 'next/server';

interface ValidationPatterns {
  email: RegExp;
  username: RegExp;
  password: RegExp;
  uuid: RegExp;
  sanitizedText: RegExp;
  apiKey: RegExp;
}

interface ValidationResult {
  valid: boolean;
  reasons: string[];
}

export async function validateInput(
  request: NextRequest,
  patterns: ValidationPatterns,
  maliciousPatterns: RegExp[]
): Promise<ValidationResult> {
  const reasons: string[] = [];
  
  try {
    // Validate URL parameters
    const url = new URL(request.url);
    for (const [key, value] of url.searchParams.entries()) {
      if (!validateParameter(key, value, patterns, maliciousPatterns)) {
        reasons.push(`Invalid URL parameter: ${key}`);
      }
    }
    
    // Validate request body for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const body = await request.json();
        const bodyValidation = validateObject(body, patterns, maliciousPatterns);
        if (!bodyValidation.valid) {
          reasons.push(...bodyValidation.reasons);
        }
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        for (const [key, value] of formData.entries()) {
          if (!validateParameter(key, value.toString(), patterns, maliciousPatterns)) {
            reasons.push(`Invalid form data: ${key}`);
          }
        }
      }
    }
    
    // Validate headers
    const userAgent = request.headers.get('user-agent');
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
  patterns: ValidationPatterns,
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
  patterns: ValidationPatterns,
  maliciousPatterns: RegExp[],
  path: string = ''
): ValidationResult {
  const reasons: string[] = [];
  
  if (typeof obj === 'string') {
    if (maliciousPatterns.some(pattern => pattern.test(obj))) {
      reasons.push(`Malicious content detected at ${path}`);
    }
    return { valid: reasons.length === 0, reasons };
  }
  
  if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        if (!validateParameter(key, value, patterns, maliciousPatterns)) {
          reasons.push(`Invalid value at ${currentPath}`);
        }
      } else if (typeof value === 'object' && value !== null) {
        const nestedValidation = validateObject(value, patterns, maliciousPatterns, currentPath);
        reasons.push(...nestedValidation.reasons);
      }
    }
  }
  
  return { valid: reasons.length === 0, reasons };
}

// Additional validation functions
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

export function validatePassword(password: string): boolean {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
}
