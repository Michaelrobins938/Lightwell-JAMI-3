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
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const groups = await prisma.supportGroup.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              image: true,
              isExpert: true,
              isModerator: true,
            },
          },
          members: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          meetings: {
            where: {
              startTime: {
                gte: new Date(),
              },
            },
            orderBy: { startTime: 'asc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      });

      const total = await prisma.supportGroup.count({ where });

      res.status(200).json({
        groups: groups.map(group => ({
          ...group,
          memberCount: group.members.length,
          nextMeeting: group.meetings[0]?.startTime,
          tags: JSON.parse(group.tags || '[]'),
        })),
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } else if (req.method === 'POST') {
      const { name, description, category, isPrivate, maxMembers, tags } = req.body;
      
      // Get current user (you'll need to implement authentication)
      const userId = 'placeholder-user-id'; // Replace with actual user ID from auth
      
      const group = await prisma.supportGroup.create({
        data: {
          name,
          description,
          category,
          isPrivate,
          maxMembers,
          tags: JSON.stringify(tags),
          creatorId: userId,
        },
        include: {
          creator: {
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
        group: {
          ...group,
          memberCount: 0,
          tags: JSON.parse(group.tags || '[]'),
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