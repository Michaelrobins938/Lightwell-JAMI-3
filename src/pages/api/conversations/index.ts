import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const CONVERSATIONS_DIR = path.join(process.cwd(), 'data', 'conversations');

// Ensure conversations directory exists
if (!fs.existsSync(CONVERSATIONS_DIR)) {
  fs.mkdirSync(CONVERSATIONS_DIR, { recursive: true });
}

export interface ConversationMetadata {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: string;
  emotionalState?: {
    primary: string;
    intensity: number;
  };
  isBranch?: boolean; // New field
  parentChatId?: string; // New field
  branchedFromMessageId?: string; // New field
}

export interface StoredConversation {
  metadata: ConversationMetadata;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    emotionalState?: {
      primary: string;
      intensity: number;
      secondary: string[];
    };
    therapeuticNotes?: string;
  }>;
}

function getConversationPath(conversationId: string): string {
  return path.join(CONVERSATIONS_DIR, `${conversationId}.json`);
}

function generateConversationTitle(firstMessage: string): string {
  // Generate a title from the first message (like ChatGPT)
  const words = firstMessage.split(' ').slice(0, 6);
  let title = words.join(' ');
  if (firstMessage.split(' ').length > 6) {
    title += '...';
  }
  return title || 'New Conversation';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get all conversations for a user
        const { userId } = req.query;
        if (!userId) {
          return res.status(400).json({ error: 'userId is required' });
        }

        const conversationFiles = fs.readdirSync(CONVERSATIONS_DIR);
        const conversations: ConversationMetadata[] = [];

        for (const file of conversationFiles) {
          if (file.endsWith('.json')) {
            try {
              const filePath = path.join(CONVERSATIONS_DIR, file);
              const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
              if (data.metadata.userId === userId) {
                conversations.push(data.metadata);
              }
            } catch (error) {
              console.error(`Error reading conversation file ${file}:`, error);
            }
          }
        }

        // Sort by updatedAt descending
        conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        return res.status(200).json({ conversations });

      case 'POST':
        // Create a new conversation
        const { userId: createUserId, title, firstMessage, isBranch, parentChatId, branchedFromMessageId } = req.body; // Added new fields
        if (!createUserId) {
          return res.status(400).json({ error: 'userId is required' });
        }

        const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date();
        
        const newConversation: StoredConversation = {
          metadata: {
            id: conversationId,
            title: title || generateConversationTitle(firstMessage || 'New Conversation'),
            userId: createUserId,
            createdAt: now,
            updatedAt: now,
            messageCount: 0,
            isBranch: isBranch || false, // Set isBranch
            parentChatId: parentChatId || undefined, // Set parentChatId
            branchedFromMessageId: branchedFromMessageId || undefined, // Set branchedFromMessageId
          },
          messages: []
        };

        const conversationPath = getConversationPath(conversationId);
        fs.writeFileSync(conversationPath, JSON.stringify(newConversation, null, 2));

        return res.status(201).json({ 
          conversation: newConversation.metadata,
          conversationId 
        });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Conversations API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}