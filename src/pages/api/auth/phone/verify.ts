import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Simple test endpoint
    return res.status(200).json({
      message: 'Phone verification API is working',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== Phone Verification API Called ===');
    console.log('Request method:', req.method);
    console.log('Request body:', req.body);
    console.log('Request headers:', {
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent']
    });

    const { phoneNumber, code } = req.body;

    // Check environment and database connection
    console.log('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    });

    console.log('Phone verification attempt:', { phoneNumber, code });

    if (!phoneNumber || !code) {
      console.log('Missing phone number or code');
      return res.status(400).json({ error: 'Phone number and verification code are required' });
    }

    // For development/demo purposes, accept any 6-digit code
    // In production, you'd verify against the stored code
    console.log('Code validation:', {
      code: code,
      length: code.length,
      isSixDigits: /^\d{6}$/.test(code),
      trimmedCode: code.trim()
    });

    // Trim whitespace and check format
    const trimmedCode = code.trim();
    if (trimmedCode.length !== 6 || !/^\d{6}$/.test(trimmedCode)) {
      console.log('Invalid code format:', { original: code, trimmed: trimmedCode });
      return res.status(400).json({
        error: 'Invalid verification code',
        details: `Code must be exactly 6 digits. Received: "${code}" (length: ${code.length})`
      });
    }

    // Special development mode check - accept common dev codes
    if (process.env.NODE_ENV === 'development' && ['199667', '123456', '000000'].includes(trimmedCode)) {
      console.log('Development mode: accepting known dev code:', trimmedCode);
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: accepting any 6-digit code:', trimmedCode);
    } else {
      console.log('Production mode: would verify code against database');
    }

    // Check if user exists by phone number
    let user;
    try {
      user = await prisma.user.findFirst({
        where: { phone: phoneNumber }
      });

      console.log('User lookup result:', user ? 'Found existing user' : 'No user found, creating new one');

      if (!user) {
        // Create new user for phone authentication
        const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);

        user = await prisma.user.create({
          data: {
            email: `${phoneNumber}@phone.jamie3.com`, // Temporary email for phone users
            name: `Phone User ${phoneNumber.slice(-4)}`,
            password: hashedPassword,
            phone: phoneNumber,
          }
        });

        console.log('Created new phone user:', { id: user.id, email: user.email, phone: user.phone });
      }
    } catch (dbError) {
      console.error('Database error during user lookup/creation:', dbError);

      // Create a mock user object for development when database is not available
      user = {
        id: `temp-${Date.now()}`,
        email: `${phoneNumber}@phone.jamie3.com`,
        name: `Phone User ${phoneNumber.slice(-4)}`,
        phone: phoneNumber
      };

      console.log('Using mock user due to database error:', user);
    }

    // Generate JWT token with required fields
    const jwtPayload = {
      userId: user.id,
      email: user.email,
      firstName: user.name.split(' ')[0] || 'Phone',
      lastName: user.name.split(' ').slice(1).join(' ') || 'User'
    };

    console.log('JWT payload:', jwtPayload);

    const token = jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    console.log('JWT token generated successfully');

    const responseData = {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isCreator: user.isCreator || false,
        isAdmin: user.isAdmin || false,
        subscriptionTier: user.subscriptionTier || 'free',
        jamieAccess: user.jamieAccess || false,
        jamieUsageLimit: user.jamieUsageLimit || 0,
        jamieUsageCount: user.jamieUsageCount || 0,
        jamieResetDate: user.jamieResetDate?.toISOString()
      },
      token
    };

    console.log('Sending response:', { success: responseData.success, userId: user.id });

    // Return user data
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Phone verification error:', error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    // Check if it's a Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Database error code:', error.code);
    }

    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
