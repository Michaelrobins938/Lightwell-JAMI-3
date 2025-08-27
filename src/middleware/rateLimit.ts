import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  clientIP: string, 
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Get current rate limit data for this IP
  const currentData = rateLimitStore.get(clientIP);
  
  if (!currentData || currentData.resetTime < now) {
    // First request or window expired
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + config.windowMs
    });
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    };
  }
  
  // Check if within rate limit
  if (currentData.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentData.resetTime
    };
  }
  
  // Increment count
  currentData.count++;
  rateLimitStore.set(clientIP, currentData);
  
  return {
    allowed: true,
    remaining: config.maxRequests - currentData.count,
    resetTime: currentData.resetTime
  };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute
