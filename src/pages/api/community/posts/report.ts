import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { postId, reason } = req.body;
      
      // Get current user (you'll need to implement authentication)
      const userId = 'placeholder-user-id'; // Replace with actual user ID from auth
      
      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Create report (you'll need to add a Report model to your schema)
      // For now, we'll just mark the post as reported
      await prisma.post.update({
        where: { id: postId },
        data: {
          isModerated: true,
        },
      });

      // Log the report (you can implement a proper reporting system)
      console.log(`Post ${postId} reported by user ${userId} for reason: ${reason}`);

      res.status(200).json({ message: 'Post reported successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
} 