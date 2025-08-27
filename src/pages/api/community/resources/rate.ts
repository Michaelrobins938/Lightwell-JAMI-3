import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { resourceId, rating } = req.body;
      
      // Get current user (you'll need to implement authentication)
      const userId = 'placeholder-user-id'; // Replace with actual user ID from auth
      
      // Validate rating
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      
      // Check if resource exists
      const resource = await prisma.sharedResource.findUnique({
        where: { id: resourceId },
        include: { ratings: true },
      });

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Check if user already rated this resource
      const existingRating = await prisma.resourceRating.findUnique({
        where: {
          resourceId_userId: { resourceId, userId },
        },
      });

      if (existingRating) {
        // Update existing rating
        await prisma.resourceRating.update({
          where: {
            resourceId_userId: { resourceId, userId },
          },
          data: {
            rating,
          },
        });
      } else {
        // Create new rating
        await prisma.resourceRating.create({
          data: {
            resourceId,
            userId,
            rating,
          },
        });
      }

      // Recalculate average rating
      const allRatings = await prisma.resourceRating.findMany({
        where: { resourceId },
      });

      const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

      await prisma.sharedResource.update({
        where: { id: resourceId },
        data: {
          averageRating,
        },
      });

      res.status(200).json({ 
        message: 'Rating submitted successfully',
        averageRating,
        totalRatings: allRatings.length,
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