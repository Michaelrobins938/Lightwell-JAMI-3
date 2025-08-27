// Memory system type definitions for Luna AI Therapist

export interface Memory {
  id: string;
  userId: string;
  key: string; // "preferences", "context", "facts", "personality"
  value: string;
  chatId?: string; // optional link to originating conversation
  category: MemoryCategory;
  confidence: number; // 0-1 confidence in this memory
  createdAt: Date;
  updatedAt: Date;
}

export type MemoryCategory = 
  | "preferences"    // User likes/dislikes, style preferences
  | "context"        // Current life situation, projects
  | "facts"          // Personal facts, background info
  | "personality"    // Communication style, therapy preferences
  | "goals"          // Therapeutic goals, aspirations
  | "triggers"       // Sensitive topics, trauma indicators
  | "progress"       // Therapy progress, milestones

export interface MemoryQuery {
  userId: string;
  categories?: MemoryCategory[];
  searchTerm?: string;
  limit?: number;
  confidence?: number; // minimum confidence threshold
}

export interface MemoryExtraction {
  text: string;
  extractedMemories: Partial<Memory>[];
  confidence: number;
}

export interface MemoryUpdate {
  id: string;
  value?: string;
  confidence?: number;
  category?: MemoryCategory;
}

export interface MemoryContext {
  memories: Memory[];
  isLoading: boolean;
  error: string | null;
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Memory>;
  updateMemory: (update: MemoryUpdate) => Promise<Memory>;
  deleteMemory: (id: string) => Promise<void>;
  searchMemories: (query: MemoryQuery) => Promise<Memory[]>;
  extractMemoriesFromText: (text: string, chatId?: string) => Promise<MemoryExtraction>;
  refreshMemories: () => Promise<void>;
}

// Prisma schema addition for memory system
export const MEMORY_PRISMA_SCHEMA = `
model Memory {
  id         String        @id @default(cuid())
  userId     String
  key        String
  value      String
  chatId     String?
  category   String        // MemoryCategory enum as string
  confidence Float         @default(0.8)
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
  
  @@index([userId])
  @@index([userId, category])
  @@index([userId, key])
}
`;