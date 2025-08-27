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
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Microsoft authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID || '',
        client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/microsoft/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      return res.status(401).json({ error: 'Invalid Microsoft code' });
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Microsoft Graph
    const userInfo = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfo.ok) {
      return res.status(401).json({ error: 'Failed to get Microsoft user info' });
    }

    const microsoftData = await userInfo.json();

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: microsoftData.mail || microsoftData.userPrincipalName }
    });

    if (!user) {
      // Create new user
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);

      user = await prisma.user.create({
        data: {
          email: microsoftData.mail || microsoftData.userPrincipalName,
          name: microsoftData.displayName,
          password: hashedPassword,
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
        isCreator: user.isCreator || false,
        isAdmin: user.isAdmin || false,
        subscriptionTier: user.subscriptionTier || 'free',
        jamieAccess: user.jamieAccess || false,
        jamieUsageLimit: user.jamieUsageLimit || 0,
        jamieUsageCount: user.jamieUsageCount || 0,
        jamieResetDate: user.jamieResetDate?.toISOString()
      },
      token
    });
  } catch (error) {
    console.error('Microsoft authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
