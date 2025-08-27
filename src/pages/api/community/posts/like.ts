import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { postId, type = 'like' } = req.body;
      
      // Get current user (you'll need to implement authentication)
      const userId = 'placeholder-user-id'; // Replace with actual user ID from auth
      
      if (!postId) {
        return res.status(400).json({ message: 'PostId is required' });
      }

      // Check if like already exists
      const existingLike = await prisma.like.findFirst({
        where: {
          postId,
          userId,
          // You might want to add a type field to the Like model
        },
      });

      if (existingLike) {
        // Remove like (toggle)
        await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
        
        res.status(200).json({ 
          message: 'Like removed',
          liked: false 
        });
      } else {
        // Add like
        const like = await prisma.like.create({
          data: {
            postId,
            userId,
            // You might want to add a type field to track different like types
          },
        });
        
        res.status(201).json({ 
          message: 'Post liked successfully',
          liked: true,
          like 
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
} 