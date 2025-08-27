import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { postId, content, parentId } = req.body;
      
      // Get current user (you'll need to implement authentication)
      const userId = 'placeholder-user-id'; // Replace with actual user ID from auth
      
      if (!content || !postId) {
        return res.status(400).json({ message: 'Content and postId are required' });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
          isExpert: false, // Would be determined from user role
          isModerated: false,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              isExpert: true,
              isModerator: true,
            },
          },
        },
      });

      res.status(201).json({ comment });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
} 