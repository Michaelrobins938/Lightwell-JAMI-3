export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    emotion?: string;
    intensity?: number;
    tokens?: number;
    model?: string;
    attachments?: Array<{
      type: 'image' | 'file' | 'audio';
      url: string;
      name: string;
    }>;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  preview: string;
  messageCount?: number;
  lastActivity?: Date;
  tags?: string[];
  starred?: boolean;
  archived?: boolean;
}