import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { StoredConversation, ConversationMetadata } from '../index';

const CONVERSATIONS_DIR = path.join(process.cwd(), 'data', 'conversations');

function getConversationPath(conversationId: string): string {
  return path.join(CONVERSATIONS_DIR, `${conversationId}.json`);
}

function generateConversationTitle(firstMessage: string): string {
  const words = firstMessage.split(' ').slice(0, 6);
  let title = words.join(' ');
  if (firstMessage.split(' ').length > 6) {
    title += '...';
  }
  return title;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid conversation ID' });
  }

  const conversationPath = getConversationPath(id);

  try {
    switch (req.method) {
      case 'GET': {
        if (!fs.existsSync(conversationPath)) {
          return res.status(404).json({ error: 'Conversation not found' });
        }

        const conversationData = fs.readFileSync(conversationPath, 'utf8');
        const conversation: StoredConversation = JSON.parse(conversationData);

        res.status(200).json(conversation);
        break;
      }

      case 'DELETE': {
        if (!fs.existsSync(conversationPath)) {
          return res.status(404).json({ error: 'Conversation not found' });
        }

        fs.unlinkSync(conversationPath);

        // Update index file
        const indexPath = path.join(CONVERSATIONS_DIR, 'index.json');
        if (fs.existsSync(indexPath)) {
          const indexData = fs.readFileSync(indexPath, 'utf8');
          const index: ConversationMetadata[] = JSON.parse(indexData);
          const updatedIndex = index.filter(conv => conv.id !== id);
          fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2));
        }

        res.status(200).json({ message: 'Conversation deleted successfully' });
        break;
      }

      default:
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Error handling conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
