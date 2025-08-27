/**
 * Voice Session Manager
 * Centralized session management for voice API endpoints
 */

export interface VoiceSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  language: string;
  personality: string | null;
  transcript: string;
  audioChunks: AudioChunkData[];
  status: 'active' | 'completed' | 'error';
  metadata: any;
}

export interface AudioChunkData {
  id: string;
  timestamp: number;
  duration: number;
  sampleRate: number;
  channels: number;
  format: string;
  transcription?: string;
}

export interface TranscriptData {
  sessionId: string;
  transcript: string;
  updates: TranscriptUpdate[];
  lastUpdated: Date;
  wordCount: number;
  characterCount: number;
}

export interface TranscriptUpdate {
  timestamp: Date;
  previousLength: number;
  newLength: number;
  delta: number;
}

class VoiceSessionManagerClass {
  private activeSessions = new Map<string, VoiceSession>();
  private sessionTranscripts = new Map<string, TranscriptData>();
  private sessionChunks = new Map<string, AudioChunkData[]>();

  /**
   * Create a new voice session
   */
  createSession(sessionData: Partial<VoiceSession>): VoiceSession {
    const sessionId = sessionData.id || `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: VoiceSession = {
      id: sessionId,
      userId: sessionData.userId || 'anonymous',
      startTime: new Date(),
      language: sessionData.language || 'en-US',
      personality: sessionData.personality || null,
      transcript: '',
      audioChunks: [],
      status: 'active',
      metadata: sessionData.metadata || {}
    };

    this.activeSessions.set(sessionId, session);
    this.sessionChunks.set(sessionId, []);

    console.log(`📝 Voice session created: ${sessionId}`);
    return session;
  }

  /**
   * Get a session by ID
   */
  getSession(sessionId: string): VoiceSession | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * Update a session
   */
  updateSession(sessionId: string, updates: Partial<VoiceSession>): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return false;
    }

    Object.assign(session, updates);
    this.activeSessions.set(sessionId, session);
    return true;
  }

  /**
   * End a session
   */
  endSession(sessionId: string, endData: Partial<VoiceSession>): VoiceSession | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return null;
    }

    session.endTime = endData.endTime ? new Date(endData.endTime) : new Date();
    session.duration = endData.duration || (session.endTime.getTime() - session.startTime.getTime());
    session.status = 'completed';
    session.transcript = endData.transcript || session.transcript;

    // Get final audio chunks
    const chunks = this.sessionChunks.get(sessionId) || [];
    session.audioChunks = chunks;

    console.log(`✅ Voice session ended: ${sessionId}`);

    // Remove from active sessions
    this.activeSessions.delete(sessionId);
    this.sessionChunks.delete(sessionId);

    return session;
  }

  /**
   * Add audio chunk to session
   */
  addAudioChunk(sessionId: string, chunkData: AudioChunkData): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      console.warn(`⚠️ Tried to add chunk to non-existent session: ${sessionId}`);
      return false;
    }

    const chunks = this.sessionChunks.get(sessionId) || [];
    chunks.push(chunkData);
    this.sessionChunks.set(sessionId, chunks);

    console.log(`📦 Audio chunk added to session ${sessionId}: ${chunkData.id}`);
    return true;
  }

  /**
   * Get audio chunks for session
   */
  getSessionChunks(sessionId: string): AudioChunkData[] {
    return this.sessionChunks.get(sessionId) || [];
  }

  /**
   * Update session transcript
   */
  updateTranscript(sessionId: string, transcript: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      console.warn(`⚠️ Tried to update transcript for non-existent session: ${sessionId}`);
      return false;
    }

    // Get existing transcript data or create new
    let transcriptData = this.sessionTranscripts.get(sessionId) || {
      sessionId,
      transcript: '',
      updates: [],
      lastUpdated: new Date(),
      wordCount: 0,
      characterCount: 0
    };

    // Update transcript data
    const previousLength = transcriptData.transcript.length;
    transcriptData.transcript = transcript;
    transcriptData.lastUpdated = new Date();
    transcriptData.characterCount = transcript.length;
    transcriptData.wordCount = transcript.split(/\s+/).filter(word => word.length > 0).length;

    // Add update entry
    transcriptData.updates.push({
      timestamp: new Date(),
      previousLength,
      newLength: transcript.length,
      delta: transcript.length - previousLength
    });

    // Limit update history to last 100 updates
    if (transcriptData.updates.length > 100) {
      transcriptData.updates = transcriptData.updates.slice(-100);
    }

    // Store updated transcript
    this.sessionTranscripts.set(sessionId, transcriptData);

    // Update session
    session.transcript = transcript;

    console.log(`📝 Transcript updated for session ${sessionId}: ${transcriptData.wordCount} words`);
    return true;
  }

  /**
   * Get transcript data for session
   */
  getTranscript(sessionId: string): TranscriptData | null {
    return this.sessionTranscripts.get(sessionId) || null;
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): VoiceSession[] {
    return Array.from(this.activeSessions.values());
  }

  /**
   * Get session statistics
   */
  getSessionStats(sessionId: string): any {
    const session = this.activeSessions.get(sessionId);
    const chunks = this.sessionChunks.get(sessionId) || [];
    const transcript = this.sessionTranscripts.get(sessionId);

    if (!session) {
      return null;
    }

    return {
      sessionId: session.id,
      status: session.status,
      duration: session.endTime 
        ? session.endTime.getTime() - session.startTime.getTime() 
        : Date.now() - session.startTime.getTime(),
      audioChunksCount: chunks.length,
      transcriptWordCount: transcript?.wordCount || 0,
      transcriptCharacterCount: transcript?.characterCount || 0,
      lastActivity: transcript?.lastUpdated || session.startTime
    };
  }

  /**
   * Cleanup expired sessions (sessions older than 1 hour)
   */
  cleanupExpiredSessions(): number {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour
    let cleanedCount = 0;

    for (const [sessionId, session] of this.activeSessions.entries()) {
      const sessionAge = now - session.startTime.getTime();
      if (sessionAge > maxAge) {
        console.log(`🧹 Cleaning up expired session: ${sessionId}`);
        this.activeSessions.delete(sessionId);
        this.sessionChunks.delete(sessionId);
        this.sessionTranscripts.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`);
    }

    return cleanedCount;
  }
}

// Create singleton instance using Node.js global to persist across API calls
declare global {
  var __voiceSessionManager: VoiceSessionManagerClass | undefined;
}

const getVoiceSessionManager = () => {
  if (!global.__voiceSessionManager) {
    global.__voiceSessionManager = new VoiceSessionManagerClass();
    console.log('🏗️ Voice Session Manager initialized');
  }
  return global.__voiceSessionManager;
};

export const voiceSessionManager = getVoiceSessionManager();

// Set up periodic cleanup (every 30 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    voiceSessionManager.cleanupExpiredSessions();
  }, 30 * 60 * 1000);
}