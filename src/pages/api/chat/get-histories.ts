import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    // If specific conversation ID is requested
    if (id && typeof id === 'string') {
      const conversation = await prisma.chatSession.findUnique({
        where: { id },
        include: {
          chatMessages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      return res.status(200).json({
        conversation: {
          id: conversation.id,
          title: conversation.title,
          messages: conversation.chatMessages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt
          })),
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          messageCount: conversation.chatMessages.length
        }
      });
    }

    // Get all conversations
    const conversations = await prisma.chatSession.findMany({
      include: {
        chatMessages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    const formattedConversations = conversations.map(conversation => ({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: conversation.chatMessages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        createdAt: msg.createdAt
      })),
      messageCount: conversation.chatMessages.length
    }));

    return res.status(200).json({
      success: true,
      conversations: formattedConversations,
      total: formattedConversations.length
    });

  } catch (error) {
    console.error('Error fetching chat histories:', error);
    res.status(500).json({ error: 'Failed to fetch chat histories' });
  } finally {
    await prisma.$disconnect();
  }
}