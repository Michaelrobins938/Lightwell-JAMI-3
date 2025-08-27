import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import config from '../../../config';
import { rateLimit } from '../../../middleware/security';
import { validateInput, VALIDATION_SCHEMAS } from '../../../middleware/security';

const prisma = new PrismaClient();

// Rate limiting for login attempts
const loginRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5, // 5 attempts per window
  blockDuration: 30 * 60 * 1000, // 30 minutes block
};

// Track failed login attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply rate limiting
    if (!rateLimit(req, res)) {
      return;
    }

    // Validate input
    const validation = validateInput(req.body, VALIDATION_SCHEMAS.login);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        details: validation.errors 
      });
    }

    const { email, password } = req.body;
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    // Check if IP is blocked
    const ipAttempts = failedAttempts.get(clientIP as string);
    if (ipAttempts?.blockedUntil && Date.now() < ipAttempts.blockedUntil) {
      const remainingTime = Math.ceil((ipAttempts.blockedUntil - Date.now()) / 1000 / 60);
      return res.status(429).json({ 
        error: 'Too many failed attempts', 
        message: `Account temporarily locked. Try again in ${remainingTime} minutes.` 
      });
    }

    // Find user (normalize email consistently)
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Log failed attempt
      logFailedAttempt(clientIP as string, email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user account is locked
    if (user.lastSecurityReview && user.securityScore < 10) {
      return res.status(423).json({ 
        error: 'Account locked', 
        message: 'Account has been locked due to security concerns. Please contact support.' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Log failed attempt
      logFailedAttempt(clientIP as string, email);
      
      // Check if user should be locked
      const userAttempts = failedAttempts.get(email);
      if (userAttempts && userAttempts.count >= 3) {
        // Lock user account
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            securityScore: 0,
            lastSecurityReview: new Date()
          }
        });
        
        return res.status(423).json({ 
          error: 'Account locked', 
          message: 'Too many failed login attempts. Account has been locked for security.' 
        });
      }
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset failed attempts on successful login
    failedAttempts.delete(clientIP as string);
    failedAttempts.delete(email);

    // Update user security score
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        securityScore: Math.min(100, user.securityScore + 10),
        lastSecurityReview: new Date()
      }
    });

    // Generate JWT token with shorter expiration
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      },
      process.env.JWT_SECRET || config.jwt.secret,
      { 
        expiresIn: '24h',
        issuer: 'lightwell-app',
        audience: 'lightwell-users'
      }
    );

    // Log successful login
    console.log(`Successful login: ${email} from IP: ${clientIP}`);

    // Return user data and token in the format expected by AuthContext
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          isCreator: user.isCreator,
          isAdmin: user.isAdmin,
          isExpert: user.isExpert,
          isModerator: user.isModerator,
          subscriptionTier: user.subscriptionTier || 'free',
          jamieAccess: user.jamieAccess || false,
          jamieUsageLimit: user.jamieUsageLimit || 0,
          jamieUsageCount: user.jamieUsageCount || 0,
          jamieResetDate: user.jamieResetDate?.toISOString(),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          securityScore: user.securityScore,
        },
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function logFailedAttempt(identifier: string, email?: string) {
  const now = Date.now();
  const attempts = failedAttempts.get(identifier) || { count: 0, lastAttempt: now };
  
  attempts.count++;
  attempts.lastAttempt = now;
  
  // Block after max attempts
  if (attempts.count >= loginRateLimit.maxAttempts) {
    attempts.blockedUntil = now + loginRateLimit.blockDuration;
  }
  
  failedAttempts.set(identifier, attempts);
  
  // Also track by email
  if (email) {
    const emailAttempts = failedAttempts.get(email) || { count: 0, lastAttempt: now };
    emailAttempts.count++;
    emailAttempts.lastAttempt = now;
    failedAttempts.set(email, emailAttempts);
  }
  
  console.log(`Failed login attempt: ${email || identifier} from IP: ${identifier}`);
}