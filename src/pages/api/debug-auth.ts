import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all users to debug
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        subscriptionTier: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Last 10 users
    });

    // Count total users
    const totalUsers = await prisma.user.count();

    return res.status(200).json({
      totalUsers,
      recentUsers: users,
      message: 'Auth debug info',
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return res.status(500).json({ 
      error: 'Database error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}