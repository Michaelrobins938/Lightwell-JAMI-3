import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    // Verify the Google ID token
    const googleResponse = await fetch('https://oauth2.googleapis.com/tokeninfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `id_token=${credential}`,
    });

    if (!googleResponse.ok) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const googleData = await googleResponse.json();

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: googleData.email }
    });

    if (!user) {
      // Create new user
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
      
      user = await prisma.user.create({
        data: {
          email: googleData.email,
          name: googleData.name,
          password: hashedPassword,
          image: googleData.picture
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return user data
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        isCreator: user.isCreator || false,
        isAdmin: user.isAdmin || false,
        subscriptionTier: user.subscriptionTier || 'free',
        jamieAccess: user.jamieAccess || false,
        jamieUsageLimit: user.jamieUsageLimit || 0,
        jamieUsageCount: user.jamieUsageCount || 0,
        jamieResetDate: user.jamieResetDate?.toISOString()
      }
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
