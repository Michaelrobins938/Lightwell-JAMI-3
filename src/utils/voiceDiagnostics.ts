/**
 * Voice System Diagnostics Logger
 * Drop-in diagnostic tool to trace the entire audio chain
 */

export interface VoiceDiagnosticEvent {
  timestamp: number;
  stage: 'mic' | 'websocket' | 'proxy' | 'openai' | 'response';
  event: string;
  data?: any;
  error?: string;
}

class VoiceDiagnostics {
  private events: VoiceDiagnosticEvent[] = [];
  private isEnabled = true;

  log(stage: VoiceDiagnosticEvent['stage'], event: string, data?: any, error?: string) {
    if (!this.isEnabled) return;

    const diagnosticEvent: VoiceDiagnosticEvent = {
      timestamp: Date.now(),
      stage,
      event,
      data,
      error
    };

    this.events.push(diagnosticEvent);
    
    // Console output with emojis for easy scanning
    const emoji = this.getStageEmoji(stage);
    const prefix = `🎤 [${emoji} ${stage.toUpperCase()}]`;
    
    if (error) {
      console.error(`${prefix} ❌ ${event}:`, error, data);
    } else {
      console.log(`${prefix} ✅ ${event}`, data);
    }
  }

  private getStageEmoji(stage: string): string {
    const emojis = {
      mic: '🎙️',
      websocket: '🔌',
      proxy: '🔄',
      openai: '🤖',
      response: '📡'
    };
    return emojis[stage as keyof typeof emojis] || '❓';
  }

  // Enable/disable logging
  enable() { this.isEnabled = true; }
  disable() { this.isEnabled = false; }

  // Get all events
  getEvents(): VoiceDiagnosticEvent[] {
    return [...this.events];
  }

  // Clear events
  clear() {
    this.events = [];
  }

  // Generate diagnostic report
  generateReport(): string {
    const report = {
      totalEvents: this.events.length,
      stages: this.getStageSummary(),
      errors: this.getErrors(),
      timeline: this.getTimeline()
    };

    console.table(report.stages);
    
    if (report.errors.length > 0) {
      console.error('🚨 ERRORS FOUND:', report.errors);
    }

    return JSON.stringify(report, null, 2);
  }

  private getStageSummary() {
    const summary: Record<string, { count: number; lastEvent?: string; errors: number }> = {};
    
    this.events.forEach(event => {
      if (!summary[event.stage]) {
        summary[event.stage] = { count: 0, errors: 0 };
      }
      summary[event.stage].count++;
      summary[event.stage].lastEvent = event.event;
      if (event.error) summary[event.stage].errors++;
    });

    return summary;
  }

  private getErrors() {
    return this.events.filter(e => e.error).map(e => ({
      stage: e.stage,
      event: e.event,
      error: e.error,
      timestamp: new Date(e.timestamp).toISOString()
    }));
  }

  private getTimeline() {
    return this.events.map(e => ({
      time: new Date(e.timestamp).toISOString(),
      stage: e.stage,
      event: e.event,
      hasError: !!e.error
    }));
  }

  // Quick health check
  checkHealth(): { healthy: boolean; issues: string[] } {
    const issues: string[] = [];
    const summary = this.getStageSummary();

    // Check if mic stage has events
    if (!summary.mic || summary.mic.count === 0) {
      issues.push('No microphone events detected');
    }

    // Check if websocket connected
    if (!summary.websocket || summary.websocket.count < 2) {
      issues.push('WebSocket connection may not be established');
    }

    // Check if proxy is working
    if (!summary.proxy || summary.proxy.count === 0) {
      issues.push('No proxy events detected');
    }

    // Check if OpenAI is responding
    if (!summary.openai || summary.openai.count === 0) {
      issues.push('No OpenAI events detected');
    }

    // Check for errors
    const errors = this.getErrors();
    if (errors.length > 0) {
      issues.push(`${errors.length} errors detected`);
    }

    return {
      healthy: issues.length === 0,
      issues
    };
  }
}

// Global diagnostic instance
export const voiceDiagnostics = new VoiceDiagnostics();

// Helper functions for common diagnostic patterns
export const diagnosticHelpers = {
  // Log microphone setup
  logMicSetup: (stream: MediaStream | null, error?: string) => {
    voiceDiagnostics.log('mic', 'setup', {
      hasStream: !!stream,
      trackCount: stream?.getTracks().length,
      trackTypes: stream?.getTracks().map(t => t.kind)
    }, error);
  },

  // Log WebSocket connection
  logWebSocketConnection: (url: string, readyState: number, error?: string) => {
    const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
    voiceDiagnostics.log('websocket', 'connection', {
      url,
      readyState: states[readyState],
      isOpen: readyState === 1
    }, error);
  },

  // Log audio chunk
  logAudioChunk: (chunkSize: number, isConnected: boolean) => {
    voiceDiagnostics.log('mic', 'audio_chunk', {
      chunkSize,
      isConnected,
      timestamp: Date.now()
    });
  },

  // Log proxy message
  logProxyMessage: (type: string, sessionId: string, data?: any) => {
    voiceDiagnostics.log('proxy', 'message', {
      type,
      sessionId,
      dataSize: data ? JSON.stringify(data).length : 0
    });
  },

  // Log OpenAI response
  logOpenAIResponse: (type: string, hasAudio: boolean, hasText: boolean) => {
    voiceDiagnostics.log('openai', 'response', {
      type,
      hasAudio,
      hasText,
      timestamp: Date.now()
    });
  },

  // Log session state
  logSessionState: (isActive: boolean, isConnected: boolean, isProcessing: boolean) => {
    voiceDiagnostics.log('proxy', 'session_state', {
      isActive,
      isConnected,
      isProcessing,
      timestamp: Date.now()
    });
  }
};

export default voiceDiagnostics;
