import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Only available in development' });
  }

  try {
    // Find all users with potentially mismatched emails
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      }
    });

    const updates = [];
    
    for (const user of users) {
      const normalizedEmail = user.email.toLowerCase().trim();
      if (user.email !== normalizedEmail) {
        // Check if normalized email already exists
        const existing = await prisma.user.findUnique({
          where: { email: normalizedEmail }
        });
        
        if (!existing) {
          // Safe to update
          await prisma.user.update({
            where: { id: user.id },
            data: { email: normalizedEmail }
          });
          updates.push({
            id: user.id,
            from: user.email,
            to: normalizedEmail,
            action: 'updated'
          });
        } else {
          // Conflict - would need manual resolution
          updates.push({
            id: user.id,
            from: user.email,
            to: normalizedEmail,
            action: 'conflict - manual resolution needed',
            conflictsWith: existing.id
          });
        }
      }
    }

    return res.status(200).json({
      message: 'Email normalization complete',
      totalUsers: users.length,
      updatesProcessed: updates.length,
      updates
    });
  } catch (error) {
    console.error('Fix emails error:', error);
    return res.status(500).json({ 
      error: 'Database error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}