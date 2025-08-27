import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface ShareRequest {
  conversationId: string;
  title?: string;
  description?: string;
  isPublic?: boolean;
  expiresAt?: string;
  allowComments?: boolean;
  password?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Create a shared conversation
    try {
      const { conversationId, title, description, isPublic = false, expiresAt, allowComments = false, password }: ShareRequest = req.body;

      if (!conversationId) {
        return res.status(400).json({ error: 'Conversation ID is required' });
      }

      // Verify conversation exists
      const conversation = await prisma.chatSession.findUnique({
        where: { id: conversationId },
        include: { messages: true }
      });

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      // Generate unique share ID
      const shareId = crypto.randomBytes(16).toString('hex');
      
      // Hash password if provided
      let hashedPassword = null;
      if (password) {
        hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      }

      // Create shared conversation
      const sharedConversation = await prisma.sharedConversation.create({
        data: {
          conversationId: conversationId,
          shareToken: shareId,
          shareId: shareId,
          title: title || conversation.title,
          description: description || 'Shared conversation from Luna AI',
          isPublic: isPublic,
          allowComments: allowComments,
          password: hashedPassword,
          expiresAt: expiresAt ? new Date(expiresAt) : null
        }
      });

      // Get the conversation with messages
      const conversationWithMessages = await prisma.chatSession.findUnique({
        where: { id: conversationId },
        include: { messages: true }
      });

      return res.status(200).json({
        success: true,
        shareId: sharedConversation.shareId,
        shareToken: sharedConversation.shareToken,
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/chat/share/${sharedConversation.shareId}`,
        messages: conversationWithMessages?.messages || [],
        createdAt: conversationWithMessages?.createdAt,
        expiresAt: sharedConversation.expiresAt
      });

    } catch (error) {
      console.error('Error creating shared conversation:', error);
      res.status(500).json({ error: 'Failed to create shared conversation' });
    }
  } else if (req.method === 'GET') {
    // Get shared conversation
    try {
      const { shareId, password } = req.query;

      if (!shareId || typeof shareId !== 'string') {
        return res.status(400).json({ error: 'Share ID is required' });
      }

      const sharedConversation = await prisma.sharedConversation.findUnique({
        where: { shareId }
      });

      if (!sharedConversation) {
        return res.status(404).json({ error: 'Shared conversation not found' });
      }

      // Check if expired
      if (sharedConversation.expiresAt && new Date() > sharedConversation.expiresAt) {
        return res.status(410).json({ error: 'This shared conversation has expired' });
      }

      // Check password if required
      if (sharedConversation.password) {
        if (!password || typeof password !== 'string') {
          return res.status(401).json({ error: 'Password required' });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (hashedPassword !== sharedConversation.password) {
          return res.status(401).json({ error: 'Incorrect password' });
        }
      }

      // Get the conversation with messages
      const conversationWithMessages = await prisma.chatSession.findUnique({
        where: { id: sharedConversation.conversationId },
        include: { messages: true }
      });

      // Increment view count
      await prisma.sharedConversation.update({
        where: { shareId },
        data: { viewCount: { increment: 1 } }
      });

      // Return conversation data
      return res.status(200).json({
        success: true,
        shareId: sharedConversation.shareId,
        shareToken: sharedConversation.shareToken,
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/chat/share/${sharedConversation.shareId}`,
        messages: conversationWithMessages?.messages || [],
        createdAt: conversationWithMessages?.createdAt,
        expiresAt: sharedConversation.expiresAt
      });

    } catch (error) {
      console.error('Error fetching shared conversation:', error);
      res.status(500).json({ error: 'Failed to fetch shared conversation' });
    }
  } else if (req.method === 'DELETE') {
    // Delete shared conversation
    try {
      const { shareId } = req.query;

      if (!shareId || typeof shareId !== 'string') {
        return res.status(400).json({ error: 'Share ID is required' });
      }

      await prisma.sharedConversation.delete({
        where: { shareId }
      });

      res.status(200).json({ success: true, message: 'Shared conversation deleted' });

    } catch (error) {
      console.error('Error deleting shared conversation:', error);
      res.status(500).json({ error: 'Failed to delete shared conversation' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
