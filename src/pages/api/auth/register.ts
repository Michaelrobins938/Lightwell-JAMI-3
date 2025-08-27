import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple validation functions
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password: string) => {
  // At least 8 characters, one uppercase, one lowercase, one number, one special char
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!password || !validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        authProvider: 'email',
        emailVerified: new Date(),
        subscriptionTier: 'free',
        jamieAccess: false,
        jamieUsageLimit: 10, // Default free tier limit
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscriptionTier: true,
      },
    });

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        subscriptionTier: user.subscriptionTier 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { 
        userId: user.id, 
        type: 'refresh' 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          subscriptionTier: user.subscriptionTier,
        },
        accessToken,
        refreshToken,
      },
      message: 'Registration successful! Welcome to Lightwell.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 