import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import config from '../../../config';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers to prevent issues
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Signup request received:', { 
      body: req.body, 
      headers: req.headers['content-type'] 
    });

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists (normalize email to lowercase)
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with default values
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        subscriptionTier: 'free',
        jamieAccess: true,
        jamieUsageLimit: 10,
        jamieUsageCount: 0,
        jamieResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || config.jwt.secret,
      { expiresIn: '7d' }
    );

    // Return user data and token in the format expected by AuthContext
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
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
        },
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Full error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : null,
      name: error instanceof Error ? error.name : null
    });

    return res.status(500).json({ 
      error: 'Internal server error',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}