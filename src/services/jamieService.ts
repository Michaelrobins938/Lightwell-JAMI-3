import { JamieExecutionHarness } from '../ai/jamie_execution_harness';
import { TherapeuticAIService } from './therapeuticAIService';
import { EnhancedVoiceAgent } from './enhancedVoiceAgent';

export interface JamieResponse {
  text: string;
  safetyStatus: 'safe' | 'warning' | 'critical';
  auditId: string;
  metadata: {
    confidence: number;
    processingTime: number;
    ethicalCompliance: number;
    crisisDetected: boolean;
    emotionalAnalysis?: any;
    therapeuticTechniques?: string[];
  };
}

export interface JamieVoiceResponse {
  text: string;
  emotionalTone: string;
  notes: string;
  nextIntervention?: string;
}

export class JamieService {
  private executionHarness: JamieExecutionHarness;
  private therapeuticService: TherapeuticAIService;
  private voiceAgent: EnhancedVoiceAgent;

  constructor() {
    this.executionHarness = new JamieExecutionHarness();
    this.therapeuticService = new TherapeuticAIService();
    this.voiceAgent = new EnhancedVoiceAgent({
      personality: {
        name: 'Jamie',
        role: 'AI Therapist',
        tone: 'warm',
        therapeuticApproach: 'person-centered',
        voicePersonality: 'caring'
      },
      voiceSettings: {
        voice: 'alloy',
        speed: 1.0,
        pitch: 1.0,
        volume: 1.0,
        style: 'natural',
        emotion: 'calm'
      },
      therapeuticApproach: {
        primaryTechniques: ['active-listening', 'validation', 'reflection'],
        crisisProtocols: ['crisis-detection', 'safety-planning'],
        empathyLevel: 9,
        validationStyle: 'unconditional-positive-regard'
      },
      crisisProtocols: {
        detectionKeywords: ['suicide', 'self-harm', 'crisis', 'emergency'],
        immediateActions: ['safety-assessment', 'crisis-resources'],
        escalationThreshold: 7,
        emergencyContacts: ['911', 'crisis-hotline']
      }
    });
  }

  /**
   * Main method to get a response from Jamie
   * This uses the full advanced Jamie system with all safety protocols
   */
  async getResponse(
    userId: string,
    userInput: string,
    sessionId?: string
  ): Promise<JamieResponse> {
    try {
      const result = await this.executionHarness.executeSecurely(userId, userInput, sessionId);
      
      return {
        text: result.response,
        safetyStatus: result.safetyStatus,
        auditId: result.auditId,
        metadata: result.metadata
      };
    } catch (error) {
      console.error('Jamie service error:', error);
      throw error;
    }
  }

  /**
   * Get a therapeutic response with emotional analysis
   */
  async getTherapeuticResponse(
    userId: string,
    userInput: string,
    sessionId?: string
  ): Promise<JamieResponse> {
    try {
      const result = await this.therapeuticService.generateTherapeuticResponse(userId, userInput, sessionId);
      
      return {
        text: result.response,
        safetyStatus: 'safe', // Therapeutic service handles safety internally
        auditId: `therapeutic_${Date.now()}`,
        metadata: {
          confidence: result.metadata?.confidence || 0.8,
          processingTime: result.metadata?.processingTime || 0,
          ethicalCompliance: 1.0,
          crisisDetected: result.crisisLevel?.level !== 'none',
          emotionalAnalysis: result.emotionalAssessment,
          therapeuticTechniques: result.therapeuticIntervention?.technique ? [result.therapeuticIntervention.technique] : []
        }
      };
    } catch (error) {
      console.error('Jamie therapeutic service error:', error);
      throw error;
    }
  }

  /**
   * Get a voice response from Jamie
   */
  async getVoiceResponse(
    userInput: string,
    emotionalContext?: any,
    conversationHistory?: any[]
  ): Promise<JamieVoiceResponse> {
    try {
      // Convert text input to audio buffer for processing
      const textEncoder = new TextEncoder();
      const audioBuffer = textEncoder.encode(userInput).buffer;
      
      const result = await this.voiceAgent.processUserInput(audioBuffer, 'voice-session');
      
      return {
        text: result.text,
        emotionalTone: result.emotionalTone,
        notes: result.therapeuticNotes,
        nextIntervention: result.nextIntervention
      };
    } catch (error) {
      console.error('Jamie voice service error:', error);
      throw error;
    }
  }

  /**
   * Check if Jamie is available and working
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      executionHarness: boolean;
      therapeuticService: boolean;
      voiceAgent: boolean;
    };
    timestamp: Date;
  }> {
    const services = {
      executionHarness: true,
      therapeuticService: true,
      voiceAgent: true
    };

    try {
      // Test execution harness
      await this.executionHarness.executeSecurely('test', 'Hello', 'test-session');
    } catch (error) {
      services.executionHarness = false;
    }

    try {
      // Test therapeutic service
      await this.therapeuticService.generateTherapeuticResponse('test', 'Hello', 'test-session');
    } catch (error) {
      services.therapeuticService = false;
    }

    try {
      // Test voice agent
      const testAudioBuffer = new ArrayBuffer(1024);
      await this.voiceAgent.processUserInput(testAudioBuffer, 'test-session');
    } catch (error) {
      services.voiceAgent = false;
    }

    const healthyServices = Object.values(services).filter(Boolean).length;
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (healthyServices === 0) {
      status = 'unhealthy';
    } else if (healthyServices < Object.keys(services).length) {
      status = 'degraded';
    }

    return {
      status,
      services,
      timestamp: new Date()
    };
  }
}

// Export singleton instance
export const jamieService = new JamieService();
