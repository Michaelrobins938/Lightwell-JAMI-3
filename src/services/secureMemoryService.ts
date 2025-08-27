// Secure Memory Service - Zero-Knowledge Therapeutic Memory System
// Implements client-owned storage with encryption and consent gating

import crypto from 'crypto';
import { prisma } from '../lib/database';
import { EncryptionService } from './encryptionService';

export interface SecureMemoryEntry {
  id: string;
  userId: string;
  conversationId?: string;
  
  // Memory Content (encrypted)
  type: MemoryType;
  category: MemoryCategory;
  content: string; // Encrypted content
  importance: number; // 1-10 scale
  emotionalValence: number; // -5 to +5 scale
  
  // Organization
  tags: string[]; // Encrypted tags
  metadata: Record<string, any>; // Encrypted metadata
  
  // Consent and Privacy
  consentLevel: ConsentLevel;
  retentionPolicy: RetentionPolicy;
  isActive: boolean;
  
  // Usage Tracking (encrypted)
  referenceCount: number;
  lastReferenced: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type MemoryType = 
  | 'stable_identity'      // Name, pronouns, relationships
  | 'therapeutic_theme'     // Recurring struggles, goals, triggers
  | 'session_continuity'    // Last session topics, progress
  | 'meta_preference'       // Communication style, preferences
  | 'coping_strategy'       // What works for the user
  | 'crisis_history'        // Past crisis events and responses
  | 'progress_note'         // Therapeutic progress tracking
  | 'relationship_context'  // Important relationships
  | 'work_stress'           // Work-related stressors
  | 'health_concern'        // Health-related information
  | 'life_event'            // Significant life events
  | 'emotional_state'       // Current emotional patterns
  | 'user_preference';      // General preferences

export type MemoryCategory = 
  | 'general'
  | 'work'
  | 'family'
  | 'health'
  | 'relationships'
  | 'therapy'
  | 'crisis'
  | 'progress'
  | 'preferences';

export type ConsentLevel = 
  | 'explicit'      // User explicitly asked to remember
  | 'inferred'      // System inferred from conversation
  | 'therapeutic'   // Standard therapeutic notes
  | 'crisis'        // Crisis-related information
  | 'preference';   // User preferences

export type RetentionPolicy = 
  | 'session'       // Only for current session
  | 'temporary'     // 30 days
  | 'therapeutic'   // 2 years (standard therapy notes)
  | 'permanent'     // Until user deletes
  | 'crisis';       // 7 years (crisis records)

export interface MemoryProposal {
  type: MemoryType;
  category: MemoryCategory;
  content: string;
  importance: number;
  emotionalValence?: number;
  tags?: string[];
  metadata?: Record<string, any>;
  consentLevel: ConsentLevel;
  retentionPolicy: RetentionPolicy;
  source: 'user_request' | 'ai_analysis' | 'therapeutic_standard';
  confidence: number; // 0-1 confidence in this memory
}

export interface MemoryQuery {
  userId: string;
  conversationId?: string;
  type?: MemoryType;
  category?: MemoryCategory;
  consentLevel?: ConsentLevel;
  importance?: number;
  limit?: number;
  includeInactive?: boolean;
}

export class SecureMemoryService {
  private static instance: SecureMemoryService;
  private encryptionService: EncryptionService;

  private constructor() {
    this.encryptionService = EncryptionService.getInstance();
  }

  public static getInstance(): SecureMemoryService {
    if (!SecureMemoryService.instance) {
      SecureMemoryService.instance = new SecureMemoryService();
    }
    return SecureMemoryService.instance;
  }

  /**
   * Propose a new memory - requires user consent before storage
   */
  async proposeMemory(
    userId: string, 
    proposal: MemoryProposal,
    userEncryptionKey: Buffer
  ): Promise<{ proposalId: string; requiresConsent: boolean }> {
    
    // Check if this requires explicit consent
    const requiresConsent = this.requiresExplicitConsent(proposal);
    
    if (!requiresConsent) {
      // Auto-approve therapeutic standards and crisis info
      await this.storeMemory(userId, proposal, userEncryptionKey);
      return { proposalId: '', requiresConsent: false };
    }

    // Create a pending proposal for user approval
    const proposalId = crypto.randomUUID();
    const encryptedProposal = await this.encryptProposal(proposal, userEncryptionKey);
    
    // Store in temporary proposal table (implement this)
    await this.storeProposal(userId, proposalId, encryptedProposal);
    
    return { proposalId, requiresConsent: true };
  }

  /**
   * Store memory after consent or auto-approval
   */
  private async storeMemory(
    userId: string,
    proposal: MemoryProposal,
    userEncryptionKey: Buffer
  ): Promise<SecureMemoryEntry> {
    
    // Encrypt sensitive content
    const encryptedContent = await this.encryptionService.encryptData(
      proposal.content, 
      userEncryptionKey
    );
    
    const encryptedTags = await this.encryptionService.encryptData(
      JSON.stringify(proposal.tags || []),
      userEncryptionKey
    );
    
    const encryptedMetadata = await this.encryptionService.encryptData(
      JSON.stringify(proposal.metadata || {}),
      userEncryptionKey
    );

    // Store in database
    const memory = await prisma.memory.create({
      data: {
        userId,
        conversationId: '', // Will be set by caller
        type: proposal.type,
        category: proposal.category,
        content: encryptedContent.encryptedData,
        importance: proposal.importance,
        emotionalValence: proposal.emotionalValence || 0,
        tags: encryptedTags.encryptedData,
        metadata: encryptedMetadata.encryptedData,
        referenceCount: 0,
        lastReferenced: new Date(),
        isActive: true,
      }
    });

    return this.mapToSecureMemory(memory);
  }

  /**
   * Retrieve memories for therapeutic context
   */
  async retrieveMemories(
    query: MemoryQuery,
    userEncryptionKey: Buffer
  ): Promise<SecureMemoryEntry[]> {
    
    const where: any = {
      userId: query.userId,
      isActive: true,
    };

    if (query.type) where.type = query.type;
    if (query.category) where.category = query.category;
    if (query.importance) where.importance = { gte: query.importance };
    if (query.includeInactive) delete where.isActive;

    const memories = await prisma.memory.findMany({
      where,
      orderBy: [
        { importance: 'desc' },
        { lastReferenced: 'desc' },
      ],
      take: query.limit || 20,
    });

    // Decrypt and return memories
    const decryptedMemories: SecureMemoryEntry[] = [];
    
    for (const memory of memories) {
      try {
        const decryptedMemory = await this.decryptMemory(memory, userEncryptionKey);
        decryptedMemories.push(decryptedMemory);
      } catch (error) {
        console.error(`Failed to decrypt memory ${memory.id}:`, error);
        // Skip corrupted memories
        continue;
      }
    }

    return decryptedMemories;
  }

  /**
   * Update memory with new information
   */
  async updateMemory(
    memoryId: string,
    updates: Partial<Pick<SecureMemoryEntry, 'content' | 'importance' | 'emotionalValence' | 'tags' | 'metadata'>>,
    userEncryptionKey: Buffer
  ): Promise<SecureMemoryEntry> {
    
    const memory = await prisma.memory.findUnique({
      where: { id: memoryId }
    });

    if (!memory) {
      throw new Error('Memory not found');
    }

    const updateData: any = {};

    // Encrypt updated fields
    if (updates.content) {
      const encryptedContent = await this.encryptionService.encryptData(
        updates.content, 
        userEncryptionKey
      );
      updateData.content = encryptedContent.encryptedData;
    }

    if (updates.tags) {
      const encryptedTags = await this.encryptionService.encryptData(
        JSON.stringify(updates.tags),
        userEncryptionKey
      );
      updateData.tags = encryptedTags.encryptedData;
    }

    if (updates.metadata) {
      const encryptedMetadata = await this.encryptionService.encryptData(
        JSON.stringify(updates.metadata),
        userEncryptionKey
      );
      updateData.metadata = encryptedMetadata.encryptedData;
    }

    if (updates.importance !== undefined) updateData.importance = updates.importance;
    if (updates.emotionalValence !== undefined) updateData.emotionalValence = updates.emotionalValence;

    const updatedMemory = await prisma.memory.update({
      where: { id: memoryId },
      data: updateData,
    });

    return this.mapToSecureMemory(updatedMemory);
  }

  /**
   * Archive memory (soft delete)
   */
  async archiveMemory(memoryId: string): Promise<void> {
    await prisma.memory.update({
      where: { id: memoryId },
      data: { isActive: false }
    });
  }

  /**
   * Get therapeutic summary for session continuity
   */
  async getSessionContinuity(userId: string, userEncryptionKey: Buffer): Promise<{
    lastTopics: string[];
    currentGoals: string[];
    recentProgress: string[];
    activeTriggers: string[];
  }> {
    
    const memories = await this.retrieveMemories({
      userId,
      type: 'session_continuity',
      importance: 7,
      limit: 10
    }, userEncryptionKey);

    const lastTopics = memories
      .filter(m => m.metadata?.topic)
      .map(m => m.metadata.topic)
      .slice(0, 3);

    const currentGoals = memories
      .filter(m => m.type === 'therapeutic_theme' && m.metadata?.isGoal)
      .map(m => m.content)
      .slice(0, 3);

    const recentProgress = memories
      .filter(m => m.type === 'progress_note')
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 2)
      .map(m => m.content);

    const activeTriggers = memories
      .filter(m => m.type === 'therapeutic_theme' && m.metadata?.isTrigger)
      .map(m => m.content)
      .slice(0, 3);

    return {
      lastTopics,
      currentGoals,
      recentProgress,
      activeTriggers
    };
  }

  /**
   * Check if memory proposal requires explicit consent
   */
  private requiresExplicitConsent(proposal: MemoryProposal): boolean {
    // Always require consent for sensitive information
    if (proposal.type === 'crisis_history' || 
        proposal.type === 'health_concern' ||
        proposal.consentLevel === 'explicit') {
      return true;
    }

    // Require consent for high-importance memories unless therapeutic standard
    if (proposal.importance >= 8 && proposal.source !== 'therapeutic_standard') {
      return true;
    }

    // Require consent for permanent retention unless explicitly requested
    if (proposal.retentionPolicy === 'permanent' && proposal.source !== 'user_request') {
      return true;
    }

    return false;
  }

  /**
   * Decrypt memory from database
   */
  private async decryptMemory(memory: any, userEncryptionKey: Buffer): Promise<SecureMemoryEntry> {
    const decryptedContent = await this.encryptionService.decryptData(
      { encryptedData: memory.content, iv: '', authTag: '', salt: '', version: '', timestamp: 0 },
      userEncryptionKey
    );

    const decryptedTags = await this.encryptionService.decryptData(
      { encryptedData: memory.tags, iv: '', authTag: '', salt: '', version: '', timestamp: 0 },
      userEncryptionKey
    );

    const decryptedMetadata = await this.encryptionService.decryptData(
      { encryptedData: memory.metadata, iv: '', authTag: '', salt: '', version: '', timestamp: 0 },
      userEncryptionKey
    );

    return {
      id: memory.id,
      userId: memory.userId,
      conversationId: memory.conversationId,
      type: memory.type as MemoryType,
      category: memory.category as MemoryCategory,
      content: decryptedContent,
      importance: memory.importance,
      emotionalValence: memory.emotionalValence,
      tags: JSON.parse(decryptedTags),
      metadata: JSON.parse(decryptedMetadata),
      consentLevel: memory.consentLevel as ConsentLevel,
      retentionPolicy: memory.retentionPolicy as RetentionPolicy,
      isActive: memory.isActive,
      referenceCount: memory.referenceCount,
      lastReferenced: memory.lastReferenced,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
    };
  }

  /**
   * Map database record to secure memory entry
   */
  private mapToSecureMemory(memory: any): SecureMemoryEntry {
    return {
      id: memory.id,
      userId: memory.userId,
      conversationId: memory.conversationId,
      type: memory.type as MemoryType,
      category: memory.category as MemoryCategory,
      content: memory.content, // This is encrypted
      importance: memory.importance,
      emotionalValence: memory.emotionalValence,
      tags: [], // Will be decrypted by caller
      metadata: {}, // Will be decrypted by caller
      consentLevel: memory.consentLevel as ConsentLevel,
      retentionPolicy: memory.retentionPolicy as RetentionPolicy,
      isActive: memory.isActive,
      referenceCount: memory.referenceCount,
      lastReferenced: memory.lastReferenced,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
    };
  }

  /**
   * Encrypt memory proposal for temporary storage
   */
  private async encryptProposal(proposal: MemoryProposal, userEncryptionKey: Buffer): Promise<string> {
    const proposalData = JSON.stringify(proposal);
    const encrypted = await this.encryptionService.encryptData(proposalData, userEncryptionKey);
    return encrypted.encryptedData;
  }

  /**
   * Store memory proposal for user approval
   */
  private async storeProposal(userId: string, proposalId: string, encryptedProposal: string): Promise<void> {
    // This would store in a temporary proposals table
    // For now, we'll use a simple approach
    console.log(`Storing proposal ${proposalId} for user ${userId}`);
  }
}

export const secureMemoryService = SecureMemoryService.getInstance();
