import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = new PrismaClient();
    
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    await prisma.$disconnect();
    
    return res.status(200).json({ 
      message: 'Database connection successful',
      userCount: userCount
    });
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({ 
      error: 'Database test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}