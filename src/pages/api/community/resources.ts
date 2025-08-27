import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { type, search, page = '1', limit = '20' } = req.query;
      
      const where: any = {};
      
      if (type && type !== 'all') {
        where.type = type;
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const resources = await prisma.sharedResource.findMany({
        where,
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
          ratings: true,
        },
        orderBy: [
          { isFeatured: 'desc' },
          { averageRating: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      });

      const total = await prisma.sharedResource.count({ where });

      res.status(200).json({
        resources: resources.map(resource => ({
          ...resource,
          tags: JSON.parse(resource.tags || '[]'),
          rating: resource.averageRating,
          reviewCount: resource.ratings.length,
        })),
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } else if (req.method === 'POST') {
      const { title, description, url, type, tags } = req.body;
      
      // Get current user (you'll need to implement authentication)
      const userId = 'placeholder-user-id'; // Replace with actual user ID from auth
      
      const resource = await prisma.sharedResource.create({
        data: {
          title,
          description,
          url,
          type,
          tags: JSON.stringify(tags),
          userId,
          averageRating: 0,
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

      res.status(201).json({ 
        resource: {
          ...resource,
          tags: JSON.parse(resource.tags || '[]'),
          rating: 0,
          reviewCount: 0,
        }
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