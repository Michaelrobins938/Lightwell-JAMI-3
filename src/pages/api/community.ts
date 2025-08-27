import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const posts = await prisma.post.findMany({
        include: {
          author: true,
          comments: true,
          likes: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      res.status(200).json({ posts })
    } else if (req.method === 'POST') {
      const { content, authorId, tags = '[]' } = req.body
      const post = await prisma.post.create({
        data: { 
          content, 
          authorId,
          tags: JSON.stringify(tags)
        },
      })
      res.status(201).json({ post })
    } else if (req.method === 'PUT') {
      const { postId, userId } = req.body
      const like = await prisma.like.create({
        data: { postId, userId },
      })
      res.status(200).json({ like })
    } else if (req.method === 'DELETE') {
      const { postId, userId } = req.body
      await prisma.like.delete({
        where: {
          postId_userId: { postId, userId },
        },
      })
      res.status(204).end()
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage })
  }
}