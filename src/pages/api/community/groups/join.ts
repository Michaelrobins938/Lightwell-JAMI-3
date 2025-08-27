import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { groupId } = req.body;
      
      // Get current user (you'll need to implement authentication)
      const userId = 'placeholder-user-id'; // Replace with actual user ID from auth
      
      // Check if group exists
      const group = await prisma.supportGroup.findUnique({
        where: { id: groupId },
        include: { members: true },
      });

      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }

      // Check if user is already a member
      const isAlreadyMember = group.members.some(member => member.id === userId);
      if (isAlreadyMember) {
        return res.status(400).json({ message: 'Already a member of this group' });
      }

      // Check if group is full
      if (group.maxMembers && group.members.length >= group.maxMembers) {
        return res.status(400).json({ message: 'Group is full' });
      }

      // Add user to group
      await prisma.supportGroup.update({
        where: { id: groupId },
        data: {
          members: {
            connect: { id: userId },
          },
        },
      });

      res.status(200).json({ message: 'Successfully joined group' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
} 