import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import config from '../../../config';

const prisma = new PrismaClient();

interface JWTPayload {
  userId: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    const jwtSecret = process.env.JWT_SECRET || config.jwt.secret;
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    
    // Fetch user data from database using the userId from token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isCreator: true,
        isAdmin: true,
        isExpert: true,
        isModerator: true,
        subscriptionTier: true,
        jamieAccess: true,
        jamieUsageLimit: true,
        jamieUsageCount: true,
        jamieResetDate: true,
        createdAt: true,
        updatedAt: true,
        securityScore: true,
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Convert subscriptionTier to plan format expected by frontend
    const planMapping = {
      'free': 'FREE',
      'pro': 'PRO', 
      'enterprise': 'ENTERPRISE'
    } as const;

    const plan = planMapping[user.subscriptionTier as keyof typeof planMapping] || 'FREE';
    
    // Return user data in the format expected by AuthContext
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      name: user.name || '',
      plan: plan,
      features: {
        // These will be populated by AuthContext based on plan
        maxTokens: 0,
        maxContextLength: 0,
        customInstructions: false,
        prioritySupport: false,
        teamWorkspace: false,
        adminDashboard: false,
        sso: false,
        soc2Compliance: false,
      },
      // Additional fields for compatibility
      image: user.image,
      isCreator: user.isCreator,
      isAdmin: user.isAdmin,
      isExpert: user.isExpert,
      isModerator: user.isModerator,
      subscriptionTier: user.subscriptionTier,
      jamieAccess: user.jamieAccess,
      jamieUsageLimit: user.jamieUsageLimit,
      jamieUsageCount: user.jamieUsageCount,
      jamieResetDate: user.jamieResetDate?.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      securityScore: user.securityScore,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Auth check failed:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    return res.status(500).json({ message: 'Internal server error' });
  }
}
