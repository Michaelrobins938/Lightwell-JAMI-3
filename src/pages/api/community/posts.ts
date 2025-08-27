import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { category, search, page = '1', limit = '20' } = req.query;
      
      const where: any = {};
      
      if (category && category !== 'all') {
        where.category = category;
      }
      
      if (search) {
        where.OR = [
          { content: { contains: search as string, mode: 'insensitive' } },
          { author: { name: { contains: search as string, mode: 'insensitive' } } },
        ];
      }

      const posts = await prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              isExpert: true,
              isModerator: true,
              joinDate: true,
              postCount: true,
              helpfulCount: true,
            },
          },
          comments: {
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
            orderBy: { createdAt: 'desc' },
          },
          likes: true,
        },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      });

      const total = await prisma.post.count({ where });

      res.status(200).json({
        posts,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } else if (req.method === 'POST') {
      const { content, isAnonymous = false, category = 'general', tags = [] } = req.body;
      
      // Get current user (you'll need to implement authentication)
      const userId = 'placeholder-user-id'; // Replace with actual user ID from auth
      
      const post = await prisma.post.create({
        data: {
          content,
          authorId: userId,
          category,
          tags: JSON.stringify(tags),
          isAnonymous,
          isModerated: false,
          isPinned: false,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              isExpert: true,
              isModerator: true,
              joinDate: true,
              postCount: true,
              helpfulCount: true,
            },
          },
        },
      });

      res.status(201).json({ post });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
} 