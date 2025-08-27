// Export system types for chat history

export interface ExportOptions {
  format: 'json' | 'markdown' | 'html' | 'pdf';
  includeMetadata: boolean;
  includeTimestamps: boolean;
  includeBranches: boolean;
  includeSystemMessages: boolean;
  compressionLevel: 'minimal' | 'standard' | 'maximum';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ExportedChat {
  id: string;
  title: string;
  userId: string;
  exportedAt: Date;
  exportFormat: string;
  metadata: {
    messageCount: number;
    branchCount: number;
    conversationLength: number; // in minutes
    participants: string[];
    topics?: string[];
    summary?: string;
  };
  messages: ExportedMessage[];
  branches?: ExportedBranch[];
  settings?: {
    model: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  };
}

export interface ExportedMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  branchId?: string;
  parentMessageId?: string;
  metadata?: {
    tokens?: number;
    processingTime?: number;
    model?: string;
    feedback?: 'positive' | 'negative';
    edited?: boolean;
    attachments?: ExportedAttachment[];
  };
}

export interface ExportedBranch {
  id: string;
  name: string;
  startMessageId: string;
  endMessageId: string;
  createdAt: Date;
  reason: 'edit' | 'regenerate' | 'manual';
  messageIds: string[];
}

export interface ExportedAttachment {
  id: string;
  filename: string;
  type: 'image' | 'document' | 'audio';
  size: number;
  url?: string;
  base64Data?: string;
  mimeType: string;
}

export interface ExportProgress {
  stage: 'preparing' | 'processing' | 'formatting' | 'generating' | 'complete';
  progress: number; // 0-100
  currentStep?: string;
  estimatedTimeRemaining?: number;
}

export interface ExportResult {
  success: boolean;
  fileSize?: number;
  errorMessage?: string;
  warnings?: string[];
  downloadUrl?: string;
}

export interface ExportStats {
  totalExports: number;
  formatBreakdown: Record<string, number>;
  averageFileSize: number;
  popularExportOptions: Partial<ExportOptions>[];
}