// Comprehensive Persistence Service for Luna AI
// Handles all backend synchronization and data persistence

// Define the missing types locally
export interface ServiceWaiverData {
  id: string;
  userId: string;
  serviceType: string;
  acceptedAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: any[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryEntry {
  key: string;
  value: any;
  category: string;
  importance: number;
  createdAt: Date;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  preferences?: Record<string, any>;
  lastUpdated: Date;
}

export interface AssessmentProgress {
  assessmentId: string;
  currentQuestion: number;
  answers: Record<string, any>;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface UserPreferences {
  theme: string;
  language: string;
  notifications: boolean;
  privacy: Record<string, any>;
  accessibility: Record<string, any>;
}

export interface UIStateData {
  sidebarCollapsed: boolean;
  sidebarPinned: boolean;
  theme: string;
  layout: string;
}

export interface PersistenceSyncData {
  userId: string;
  waivers?: ServiceWaiverData[];
  chatHistory?: ChatConversation[];
  memories?: MemoryEntry[];
  onboarding?: OnboardingProgress;
  assessment?: AssessmentProgress;
  preferences?: UserPreferences;
  uiState?: UIStateData;
  lastSync: string;
  version: string;
}

export interface SyncResult {
  success: boolean;
  syncedItems: string[];
  errors: string[];
  lastSync: string;
}

class PersistenceService {
  private static instance: PersistenceService;
  private baseUrl = '/api/persistence';
  private syncQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  private constructor() {}

  public static getInstance(): PersistenceService {
    if (!PersistenceService.instance) {
      PersistenceService.instance = new PersistenceService();
    }
    return PersistenceService.instance;
  }

  // ===== WAIVER PERSISTENCE =====

  /**
   * Save service waiver to backend
   */
  async saveWaiver(waiver: ServiceWaiverData): Promise<boolean> {
    try {
      const response = await fetch('/api/waivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waiver)
      });

      if (!response.ok) {
        throw new Error(`Failed to save waiver: ${response.statusText}`);
      }

      console.log('✅ Waiver saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save waiver:', error);
      return false;
    }
  }

  /**
   * Retrieve waiver by email
   */
  async getWaiver(email: string): Promise<ServiceWaiverData | null> {
    try {
      const response = await fetch(`/api/waivers?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to retrieve waiver: ${response.statusText}`);
      }

      const data = await response.json();
      return data.waiver;
    } catch (error) {
      console.error('❌ Failed to retrieve waiver:', error);
      return null;
    }
  }

  // ===== CHAT HISTORY PERSISTENCE =====

  /**
   * Save chat conversation to backend
   */
  async saveChatConversation(conversation: ChatConversation, userId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/chat/save-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          chatId: conversation.id,
          title: conversation.title,
          messages: conversation.messages,
          metadata: conversation.metadata
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save chat: ${response.statusText}`);
      }

      console.log('✅ Chat conversation saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save chat conversation:', error);
      return false;
    }
  }

  /**
   * Retrieve chat history for user
   */
  async getChatHistory(userId: string): Promise<ChatConversation[]> {
    try {
      const response = await fetch(`/api/chat/get-histories?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve chat history: ${response.statusText}`);
      }

      const data = await response.json();
      return data.conversations || [];
    } catch (error) {
      console.error('❌ Failed to retrieve chat history:', error);
      return [];
    }
  }

  /**
   * Sync multiple chat conversations
   */
  async syncChatHistory(userId: string, conversations: ChatConversation[]): Promise<boolean> {
    try {
      const response = await fetch('/api/chat/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          conversations: conversations.map(conv => ({
            id: conv.id,
            title: conv.title,
            messages: conv.messages,
            metadata: conv.metadata
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to sync chat history: ${response.statusText}`);
      }

      console.log('✅ Chat history synced successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to sync chat history:', error);
      return false;
    }
  }

  // ===== MEMORY PERSISTENCE =====

  /**
   * Save memory entry to backend
   */
  async saveMemory(memory: MemoryEntry, userId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          key: memory.key,
          value: memory.value,
          category: memory.category,
          importance: memory.importance
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save memory: ${response.statusText}`);
      }

      console.log('✅ Memory saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save memory:', error);
      return false;
    }
  }

  /**
   * Retrieve memories for user
   */
  async getMemories(userId: string): Promise<MemoryEntry[]> {
    try {
      const response = await fetch(`/api/memory?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve memories: ${response.statusText}`);
      }

      const data = await response.json();
      return data.memories || [];
    } catch (error) {
      console.error('❌ Failed to retrieve memories:', error);
      return [];
    }
  }

  /**
   * Sync multiple memories
   */
  async syncMemories(userId: string, memories: MemoryEntry[]): Promise<boolean> {
    try {
      const response = await fetch('/api/memory/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          memories: memories.map(mem => ({
            key: mem.key,
            value: mem.value,
            category: mem.category,
            importance: mem.importance
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to sync memories: ${response.statusText}`);
      }

      console.log('✅ Memories synced successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to sync memories:', error);
      return false;
    }
  }

  // ===== PROGRESS PERSISTENCE =====

  /**
   * Save onboarding progress
   */
  async saveOnboardingProgress(userId: string, progress: OnboardingProgress): Promise<boolean> {
    try {
      const response = await fetch('/api/progress/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          progress
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save onboarding progress: ${response.statusText}`);
      }

      console.log('✅ Onboarding progress saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save onboarding progress:', error);
      return false;
    }
  }

  /**
   * Save assessment progress
   */
  async saveAssessmentProgress(userId: string, progress: AssessmentProgress): Promise<boolean> {
    try {
      const response = await fetch('/api/progress/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          progress
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save assessment progress: ${response.statusText}`);
      }

      console.log('✅ Assessment progress saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save assessment progress:', error);
      return false;
    }
  }

  // ===== PREFERENCES PERSISTENCE =====

  /**
   * Save user preferences
   */
  async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<boolean> {
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          preferences
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save preferences: ${response.statusText}`);
      }

      console.log('✅ User preferences saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save user preferences:', error);
      return false;
    }
  }

  /**
   * Retrieve user preferences
   */
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const response = await fetch(`/api/preferences?userId=${userId}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to retrieve preferences: ${response.statusText}`);
      }

      const data = await response.json();
      return data.preferences;
    } catch (error) {
      console.error('❌ Failed to retrieve user preferences:', error);
      return null;
    }
  }

  // ===== COMPREHENSIVE SYNC =====

  /**
   * Sync all persistence data with backend
   */
  async syncAllData(syncData: PersistenceSyncData): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      syncedItems: [],
      errors: [],
      lastSync: new Date().toISOString()
    };

    try {
      // Sync waivers
      if (syncData.waivers && syncData.waivers.length > 0) {
        for (const waiver of syncData.waivers) {
          const success = await this.saveWaiver(waiver);
          if (success) {
            result.syncedItems.push(`waiver-${waiver.id}`);
          } else {
            result.errors.push(`Failed to sync waiver ${waiver.id}`);
            result.success = false;
          }
        }
      }

      // Sync chat history
      if (syncData.chatHistory && syncData.chatHistory.length > 0) {
        const success = await this.syncChatHistory(syncData.userId, syncData.chatHistory);
        if (success) {
          result.syncedItems.push(`chat-history-${syncData.chatHistory.length}-conversations`);
        } else {
          result.errors.push('Failed to sync chat history');
          result.success = false;
        }
      }

      // Sync memories
      if (syncData.memories && syncData.memories.length > 0) {
        const success = await this.syncMemories(syncData.userId, syncData.memories);
        if (success) {
          result.syncedItems.push(`memories-${syncData.memories.length}-entries`);
        } else {
          result.errors.push('Failed to sync memories');
          result.success = false;
        }
      }

      // Sync onboarding progress
      if (syncData.onboarding) {
        const success = await this.saveOnboardingProgress(syncData.userId, syncData.onboarding);
        if (success) {
          result.syncedItems.push('onboarding-progress');
        } else {
          result.errors.push('Failed to sync onboarding progress');
          result.success = false;
        }
      }

      // Sync assessment progress
      if (syncData.assessment) {
        const success = await this.saveAssessmentProgress(syncData.userId, syncData.assessment);
        if (success) {
          result.syncedItems.push('assessment-progress');
        } else {
          result.errors.push('Failed to sync assessment progress');
          result.success = false;
        }
      }

      // Sync preferences
      if (syncData.preferences) {
        const success = await this.saveUserPreferences(syncData.userId, syncData.preferences);
        if (success) {
          result.syncedItems.push('user-preferences');
        } else {
          result.errors.push('Failed to sync user preferences');
          result.success = false;
        }
      }

      console.log(`✅ Sync completed: ${result.syncedItems.length} items, ${result.errors.length} errors`);
      return result;

    } catch (error) {
      console.error('❌ Comprehensive sync failed:', error);
      result.success = false;
      result.errors.push(`Sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  /**
   * Load all persistence data from backend
   */
  async loadAllData(userId: string): Promise<Partial<PersistenceSyncData>> {
    const loadedData: Partial<PersistenceSyncData> = {
      userId,
      lastSync: new Date().toISOString(),
      version: '1.0'
    };

    try {
      // Load chat history
      const chatHistory = await this.getChatHistory(userId);
      if (chatHistory.length > 0) {
        loadedData.chatHistory = chatHistory;
      }

      // Load memories
      const memories = await this.getMemories(userId);
      if (memories.length > 0) {
        loadedData.memories = memories;
      }

      // Load preferences
      const preferences = await this.getUserPreferences(userId);
      if (preferences) {
        loadedData.preferences = preferences;
      }

      console.log('✅ All persistence data loaded successfully');
      return loadedData;

    } catch (error) {
      console.error('❌ Failed to load persistence data:', error);
      return loadedData;
    }
  }

  // ===== QUEUE MANAGEMENT =====

  /**
   * Add sync operation to queue
   */
  addToSyncQueue(syncOperation: () => Promise<void>): void {
    this.syncQueue.push(syncOperation);
    this.processQueue();
  }

  /**
   * Process sync queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.syncQueue.length === 0) return;

    this.isProcessingQueue = true;
    
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.error('❌ Sync operation failed:', error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  // ===== UTILITY METHODS =====

  /**
   * Check if backend is available
   */
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/health');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): { isProcessing: boolean; queueLength: number } {
    return {
      isProcessing: this.isProcessingQueue,
      queueLength: this.syncQueue.length
    };
  }

  /**
   * Clear sync queue
   */
  clearSyncQueue(): void {
    this.syncQueue = [];
    this.isProcessingQueue = false;
  }
}

export { PersistenceService };
export default PersistenceService;
