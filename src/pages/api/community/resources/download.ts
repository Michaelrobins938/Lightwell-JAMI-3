import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { resourceId } = req.body;
      
      // Get current user (you'll need to implement authentication)
      const userId = 'placeholder-user-id'; // Replace with actual user ID from auth
      
      // Check if resource exists
      const resource = await prisma.sharedResource.findUnique({
        where: { id: resourceId },
      });

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Track download (you can implement a proper download tracking system)
      console.log(`Resource ${resourceId} downloaded by user ${userId}`);

      // For now, we'll just return the resource URL
      // In a real implementation, you might want to track downloads in the database
      res.status(200).json({ 
        message: 'Download tracked successfully',
        url: resource.url,
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
} 