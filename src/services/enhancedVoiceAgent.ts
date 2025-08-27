import OpenAI from 'openai';
import { getTechniquesForSituation, getTechniqueById, therapeuticTechniques, TherapeuticTechnique } from '../ai/therapeutic_techniques';
import { JAMIE_CORE_SYSTEM_PROMPT } from '../ai/jamie_core_system_prompt';
import { ConversationMarkovChain, ConversationState as MarkovConversationState } from './conversationMarkovChain';

export interface VoiceAgentConfig {
  personality: {
    name: string;
    role: string;
    tone: string;
    therapeuticApproach: string;
    voicePersonality: string;
  };
  voiceSettings: {
    voice: string;
    speed: number;
    pitch: number;
    volume: number;
    style: string;
    emotion: string;
  };
  therapeuticApproach: {
    primaryTechniques: string[];
    crisisProtocols: string[];
    empathyLevel: number;
    validationStyle: string;
  };
  crisisProtocols: {
    detectionKeywords: string[];
    immediateActions: string[];
    escalationThreshold: number;
    emergencyContacts: string[];
  };
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotionalState?: {
    primary: string;
    intensity: number;
    secondary: string[];
  };
  therapeuticNotes?: string;
}

export interface ConversationState {
  emotionalState: {
    primary: string;
    intensity: number;
    secondary: string[];
    triggers: string[];
  };
  crisisLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  sessionProgress: {
    trustLevel: number;
    engagement: number;
    therapeuticAlliance: number;
  };
  userProfile: {
    communicationStyle: string;
    copingPreferences: string[];
    therapeuticGoals: string[];
  };
  conversationHistory: ConversationMessage[];
  therapeuticContext: {
    techniques: string[];
    insights: string[];
    patterns: string[];
  };
}

export interface VoiceResponse {
  text: string;
  audioBuffer: ArrayBuffer;
  emotionalTone: string;
  therapeuticNotes: string;
  nextIntervention?: string;
  crisisAssessment?: {
    level: 'none' | 'low' | 'medium' | 'high' | 'critical';
    triggers: string[];
    recommendations: string[];
  };
}

export class EnhancedVoiceAgent {
  private openai: OpenAI;
  private config: VoiceAgentConfig;
  private conversationState: ConversationState | null;
  private markovChain: ConversationMarkovChain;

  constructor(config: VoiceAgentConfig) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.config = config;
    this.conversationState = null;
    this.markovChain = new ConversationMarkovChain();
  }

  async initializeSession(sessionId: string, userId: string): Promise<void> {
    this.conversationState = {
      emotionalState: {
        primary: 'neutral',
        intensity: 5,
        secondary: [],
        triggers: []
      },
      crisisLevel: 'none',
      sessionProgress: {
        trustLevel: 5,
        engagement: 5,
        therapeuticAlliance: 5
      },
      userProfile: {
        communicationStyle: 'direct',
        copingPreferences: [],
        therapeuticGoals: []
      },
      conversationHistory: [],
      therapeuticContext: {
        techniques: [],
        insights: [],
        patterns: []
      }
    };
  }

  async processUserInput(audioInput: ArrayBuffer, sessionId: string): Promise<VoiceResponse> {
    try {
      // Transcribe audio
      const transcription = await this.transcribeAudio(audioInput);
      
      // Add user message to conversation history
      if (this.conversationState) {
        this.conversationState.conversationHistory.push({
          role: 'user',
          content: transcription.text,
          timestamp: new Date()
        });
      }
      
      // Analyze emotional content with conversation context
      const emotionalAnalysis = await this.analyzeEmotionalContent(
        transcription.text, 
        this.conversationState?.conversationHistory || []
      );
      
      // Update conversation state
      this.updateConversationState(emotionalAnalysis);
      
      // NEW: Markov chain prediction for next conversation state
      const currentMarkovState: MarkovConversationState = {
        emotionalState: emotionalAnalysis.primaryEmotion || 'neutral',
        therapeuticPhase: this.conversationState?.therapeuticContext.techniques.length ? 'intervention' : 'assessment',
        userEngagement: this.getEngagementLevel(),
        crisisLevel: this.conversationState?.crisisLevel || 'none'
      };
      
      const markovPrediction = this.markovChain.predictNextConversationState(
        currentMarkovState,
        { 
          conversationHistory: this.conversationState?.conversationHistory || [],
          userInput: transcription.text
        }
      );
      
      // Generate therapeutic response with conversation history and Markov prediction
      const therapeuticResponse = await this.generateTherapeuticResponse(
        transcription.text, 
        emotionalAnalysis,
        this.conversationState?.conversationHistory || [],
        markovPrediction
      );
      
      // Add assistant response to conversation history
      if (this.conversationState) {
        this.conversationState.conversationHistory.push({
          role: 'assistant',
          content: therapeuticResponse.text,
          timestamp: new Date(),
          emotionalState: {
            primary: emotionalAnalysis.primaryEmotion || 'calm',
            intensity: emotionalAnalysis.intensity || 5,
            secondary: emotionalAnalysis.secondaryEmotions || []
          },
          therapeuticNotes: therapeuticResponse.notes
        });

        // Keep only last 20 messages to prevent overwhelming context
        if (this.conversationState.conversationHistory.length > 20) {
          this.conversationState.conversationHistory = this.conversationState.conversationHistory.slice(-20);
        }

        // NEW: Update Markov chain with the observed conversation transition
        const newMarkovState: MarkovConversationState = {
          emotionalState: emotionalAnalysis.primaryEmotion || 'neutral',
          therapeuticPhase: this.conversationState.therapeuticContext.techniques.length ? 'intervention' : 'assessment',
          userEngagement: this.getEngagementLevel(),
          crisisLevel: this.conversationState.crisisLevel || 'none'
        };

        this.markovChain.updateFromConversation(
          currentMarkovState,
          newMarkovState,
          { 
            conversationHistory: this.conversationState.conversationHistory,
            therapeuticResponse: therapeuticResponse.text
          }
        );
      }
      
      // Synthesize speech with warm, natural voice
      const audioBuffer = await this.synthesizeSpeech(therapeuticResponse.text);
      
      return {
        text: therapeuticResponse.text,
        audioBuffer,
        emotionalTone: therapeuticResponse.emotionalTone,
        therapeuticNotes: therapeuticResponse.notes,
        nextIntervention: therapeuticResponse.nextIntervention,
        crisisAssessment: this.assessCrisis(transcription.text, emotionalAnalysis)
      };
    } catch (error) {
      console.error('Error processing user input:', error);
      throw error;
    }
  }

  private async transcribeAudio(audioBuffer: ArrayBuffer): Promise<{ text: string; confidence: number }> {
    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: new File([audioBuffer], 'audio.webm', { type: 'audio/webm' }),
        model: 'whisper-1',
        response_format: 'verbose_json',
        language: 'en'
      });
      
      return {
        text: transcription.text,
        confidence: transcription.words?.[0]?.hasOwnProperty('confidence') ? (transcription.words[0] as any).confidence : 0.8
      };
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  private async analyzeEmotionalContent(text: string, conversationHistory: ConversationMessage[] = []): Promise<any> {
    const recentHistory = conversationHistory.slice(-6); // Last 3 exchanges
    const historyContext = recentHistory.length > 0 
      ? `\n\nRecent conversation context:\n${recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
      : '';

    const prompt = `Analyze the emotional content of this text from a therapeutic perspective:

Current message: "${text}"${historyContext}

Please provide a detailed analysis including:
1. Primary emotion and intensity (1-10)
2. Secondary emotions
3. Potential triggers or stressors
4. Communication style indicators
5. Therapeutic needs or concerns
6. Risk factors for crisis
7. Patterns or themes from conversation history

Consider the conversation context to provide more nuanced emotional understanding.

Respond in JSON format.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 600
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      return {
        primaryEmotion: 'neutral',
        intensity: 5,
        secondaryEmotions: [],
        triggers: [],
        communicationStyle: 'neutral',
        therapeuticNeeds: [],
        riskFactors: []
      };
    }
  }

  private updateConversationState(emotionalAnalysis: any): void {
    if (!this.conversationState) return;

    this.conversationState.emotionalState = {
      primary: emotionalAnalysis.primaryEmotion || 'neutral',
      intensity: Math.min(emotionalAnalysis.intensity || 5, 10),
      secondary: emotionalAnalysis.secondaryEmotions || [],
      triggers: emotionalAnalysis.triggers || []
    };

    // More conservative crisis level assessment based on emotional analysis
    const riskFactors = emotionalAnalysis.riskFactors || [];
    const criticalTerms = ['suicidal', 'self-harm'];
    const highRiskTerms = ['hopeless', 'desperate', 'unbearable'];
    
    if (riskFactors.some((factor: string) => 
      criticalTerms.some((term: string) => factor.toLowerCase().includes(term))
    )) {
      this.conversationState.crisisLevel = 'critical';
    } else if (riskFactors.some((factor: string) => 
      highRiskTerms.some((term: string) => factor.toLowerCase().includes(term))
    ) && emotionalAnalysis.intensity >= 8) {
      this.conversationState.crisisLevel = 'high';
    } else if (emotionalAnalysis.intensity >= 9 && riskFactors.length > 2) {
      this.conversationState.crisisLevel = 'medium';
    } else {
      this.conversationState.crisisLevel = 'none';
    }
  }

  private async generateTherapeuticResponse(
    userInput: string, 
    emotionalAnalysis: any,
    conversationHistory: ConversationMessage[] = [],
    markovPrediction?: any
  ): Promise<{ text: string; emotionalTone: string; notes: string; nextIntervention?: string }> {
    
    // Build conversation context from recent history
    const recentHistory = conversationHistory.slice(-8); // Last 4 exchanges
    const historyContext = recentHistory.length > 0 
      ? recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
      : '';

    // Get relevant therapeutic techniques based on emotional state
    const symptoms = [
      emotionalAnalysis.primaryEmotion,
      ...(emotionalAnalysis.secondaryEmotions || []),
      ...(emotionalAnalysis.therapeuticNeeds || [])
    ].filter(Boolean);
    
    const relevantTechniques = getTechniquesForSituation(symptoms).slice(0, 3);
    const techniqueContext = relevantTechniques.length > 0
      ? `\n\nRelevant evidence-based techniques available:
${relevantTechniques.map(t => `- ${t.name}: ${t.description}`).join('\n')}`
      : '';

    // NEW: Incorporate Markov chain prediction into the prompt
    const markovContext = markovPrediction ? `
Markov Chain Prediction:
- Next likely emotional state: ${markovPrediction.nextEmotionalState} (${Math.round(markovPrediction.probability * 100)}% confidence)
- Recommended intervention: ${markovPrediction.recommendedIntervention}
- Expected outcome: ${markovPrediction.expectedOutcome}
- Recommended actions: ${markovPrediction.recommendedActions?.join(', ') || 'none'}
` : '';

    const systemPrompt = JAMIE_CORE_SYSTEM_PROMPT + `

Current emotional assessment: ${JSON.stringify(emotionalAnalysis)}
${techniqueContext}
${markovContext}

Recent conversation context:
${historyContext}

Respond as Jamie with deep therapeutic insight while maintaining warmth and accessibility. Consider the predicted emotional trajectory and recommended interventions. Keep response conversational and under 3 sentences for voice synthesis.`;

    const userPrompt = `The user just said: "${userInput}"

Please respond as Jamie with deep therapeutic insight that would make the great psychiatrists proud, while maintaining warmth and accessibility. Reference our conversation history when relevant and show sophisticated understanding of their emotional journey. If appropriate, naturally weave in evidence-based techniques. Keep response conversational and under 3 sentences for voice synthesis.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 250
    });

    const responseText = response.choices[0].message.content || "I hear you, and I want you to know that your feelings are completely valid.";

    // Update therapeutic context with techniques used
    if (this.conversationState && relevantTechniques.length > 0) {
      this.conversationState.therapeuticContext.techniques = Array.from(new Set([
        ...this.conversationState.therapeuticContext.techniques,
        ...relevantTechniques.map(t => t.name)
      ]));
    }

    // NEW: Use Markov prediction for next intervention if available
    const nextIntervention = markovPrediction?.recommendedIntervention 
      ? this.mapMarkovInterventionToTechnique(markovPrediction.recommendedIntervention, relevantTechniques)
      : this.suggestAdvancedIntervention(emotionalAnalysis, relevantTechniques);

    return {
      text: responseText,
      emotionalTone: this.determineEmotionalTone(emotionalAnalysis, responseText),
      notes: `Provided sophisticated therapeutic support for ${emotionalAnalysis.primaryEmotion} emotion with evidence-based techniques: ${relevantTechniques.map(t => t.name).join(', ')}. Markov prediction: ${markovPrediction?.nextEmotionalState || 'none'}`,
      nextIntervention
    };
  }

  private determineEmotionalTone(emotionalAnalysis: any, responseText: string): string {
    const primaryEmotion = emotionalAnalysis.primaryEmotion?.toLowerCase();
    
    if (primaryEmotion?.includes('sad') || primaryEmotion?.includes('depressed')) {
      return 'gentle_compassionate';
    } else if (primaryEmotion?.includes('anxious') || primaryEmotion?.includes('worried')) {
      return 'calm_reassuring';
    } else if (primaryEmotion?.includes('angry') || primaryEmotion?.includes('frustrated')) {
      return 'understanding_steady';
    } else if (primaryEmotion?.includes('overwhelmed') || primaryEmotion?.includes('stressed')) {
      return 'soothing_grounding';
    } else {
      return 'warm_supportive';
    }
  }

  private mapMarkovInterventionToTechnique(markovIntervention: string, availableTechniques: TherapeuticTechnique[]): string | undefined {
    const interventionMap: Record<string, string[]> = {
      'crisis_intervention': ['crisis', 'grounding', 'safety'],
      'anxiety_reduction': ['breathing', 'relaxation', 'mindfulness'],
      'mood_elevation': ['compassion', 'gratitude', 'positive'],
      'anger_management': ['regulation', 'timeout', 'communication'],
      'grounding_techniques': ['grounding', 'senses', 'present'],
      'safety_establishment': ['safety', 'coping', 'support'],
      'rapport_building': ['listening', 'validation', 'empathy'],
      'general_support': ['general', 'support', 'listening']
    };

    const keywords = interventionMap[markovIntervention] || ['general'];
    
    for (const keyword of keywords) {
      const matchingTechnique = availableTechniques.find(t => 
        t.name.toLowerCase().includes(keyword) || 
        t.description.toLowerCase().includes(keyword) ||
        t.category.toLowerCase().includes(keyword)
      );
      if (matchingTechnique) {
        return matchingTechnique.id;
      }
    }

    return availableTechniques.length > 0 ? availableTechniques[0].id : undefined;
  }

  private suggestAdvancedIntervention(emotionalAnalysis: any, availableTechniques: TherapeuticTechnique[]): string | undefined {
    const primaryEmotion = emotionalAnalysis.primaryEmotion?.toLowerCase();
    const intensity = emotionalAnalysis.intensity || 5;
    
    // For high intensity emotions, prioritize crisis and stabilization techniques
    if (intensity >= 8) {
      const crisisTechniques = availableTechniques.filter(t => 
        t.category === 'crisis' || t.name.includes('Grounding')
      );
      if (crisisTechniques.length > 0) {
        return crisisTechniques[0].id;
      }
    }
    
    // Match specific emotions to advanced techniques
    if (primaryEmotion?.includes('anxious') || primaryEmotion?.includes('panic')) {
      const anxietyTechniques = availableTechniques.filter(t => 
        t.whenToUse.some(use => use.toLowerCase().includes('anxiety'))
      );
      return anxietyTechniques[0]?.id || 'mindful-breathing';
    }
    
    if (primaryEmotion?.includes('overwhelmed') || primaryEmotion?.includes('stressed')) {
      return 'grounding-54321';
    }
    
    if (primaryEmotion?.includes('sad') || primaryEmotion?.includes('depressed')) {
      const moodTechniques = availableTechniques.filter(t => 
        t.category === 'cbt' || t.name.includes('Compassion')
      );
      return moodTechniques[0]?.id || 'self-compassion';
    }
    
    if (primaryEmotion?.includes('angry') || primaryEmotion?.includes('frustrated')) {
      return 'emotion-regulation';
    }
    
    // Default to the most effective available technique
    return availableTechniques.length > 0 ? availableTechniques[0].id : undefined;
  }

  private suggestNextIntervention(emotionalAnalysis: any): string | undefined {
    // Keep this for backward compatibility
    return this.suggestAdvancedIntervention(emotionalAnalysis, []);
  }

  private async synthesizeSpeech(text: string): Promise<ArrayBuffer> {
    try {
      // Use OpenAI's highest quality TTS-1-HD with optimized voice settings
      const speech = await this.openai.audio.speech.create({
        model: 'tts-1-hd', // High quality model for more natural speech
        voice: 'nova', // Most human-like and natural voice
        input: text,
        response_format: 'mp3', // Better quality than opus
        speed: this.config.voiceSettings.speed || 0.85, // Slightly slower for therapeutic pacing
      });

      return await speech.arrayBuffer();
    } catch (error) {
      console.error('Speech synthesis error:', error);
      throw new Error('Failed to synthesize speech');
    }
  }

  private getEngagementLevel(): string {
    if (!this.conversationState) return 'moderate_engagement';
    
    const messageCount = this.conversationState.conversationHistory.length;
    const recentMessages = this.conversationState.conversationHistory.slice(-5);
    const userMessages = recentMessages.filter(msg => msg.role === 'user');
    
    if (messageCount < 3) return 'low_engagement';
    if (userMessages.length === 0) return 'withdrawn';
    if (userMessages.length >= 3) return 'high_engagement';
    if (userMessages.length === 1) return 'resistant';
    
    return 'moderate_engagement';
  }

  private assessCrisis(userInput: string, emotionalAnalysis: any): any {
    const criticalKeywords = [
      'suicidal', 'kill myself', 'want to die', 'end it all', 'suicide',
      'self-harm', 'hurt myself', 'cut myself',
      'no point in living', 'better off dead'
    ];

    const highRiskKeywords = [
      'hopeless', 'no point', 'can\'t go on', 'give up',
      'overwhelming pain', 'unbearable'
    ];

    const inputLower = userInput.toLowerCase();
    
    // Check for critical crisis indicators
    const criticalTriggers = criticalKeywords.filter(keyword => {
      // More precise matching to avoid false positives
      const words = inputLower.split(/\s+/);
      return words.some(word => word === keyword || inputLower.includes(keyword));
    });

    if (criticalTriggers.length > 0) {
      return {
        level: 'critical' as const,
        triggers: criticalTriggers,
        recommendations: [
          'Please know you\'re not alone and help is available',
          'Consider reaching out to a crisis hotline (988)',
          'Talk to a trusted friend, family member, or mental health professional',
          'Remember that these feelings are temporary and can be worked through'
        ]
      };
    }

    // Check for high risk indicators with emotional analysis
    const highRiskTriggers = highRiskKeywords.filter(keyword => 
      inputLower.includes(keyword)
    );

    if (highRiskTriggers.length > 0 && emotionalAnalysis.intensity >= 8) {
      return {
        level: 'high' as const,
        triggers: highRiskTriggers,
        recommendations: [
          'These feelings sound very challenging right now',
          'Consider reaching out for professional support',
          'Remember that you don\'t have to go through this alone'
        ]
      };
    }

    // Only flag as medium if multiple concerning factors are present
    if (emotionalAnalysis.intensity >= 9 && 
        (emotionalAnalysis.primaryEmotion === 'sadness' || 
         emotionalAnalysis.primaryEmotion === 'despair' ||
         emotionalAnalysis.primaryEmotion === 'hopeless')) {
      return {
        level: 'medium' as const,
        triggers: ['high intensity negative emotions'],
        recommendations: [
          'These intense emotions are valid and can be worked through',
          'Consider professional support if feelings persist'
        ]
      };
    }

    return {
      level: 'none' as const,
      triggers: [],
      recommendations: []
    };
  }

  getConversationState(): ConversationState | null {
    return this.conversationState;
  }

  endSession(): void {
    this.conversationState = null;
  }

  updateVoiceSettings(settings: Partial<VoiceAgentConfig['voiceSettings']>): void {
    this.config.voiceSettings = { ...this.config.voiceSettings, ...settings };
  }

  async synthesizePreviewSpeech(text: string, voice?: string, speed?: number): Promise<ArrayBuffer> {
    try {
      const speech = await this.openai.audio.speech.create({
        model: 'tts-1-hd',
        voice: (voice as any) || this.config.voiceSettings.voice,
        input: text,
        response_format: 'mp3',
        speed: speed || this.config.voiceSettings.speed || 0.85,
      });

      return await speech.arrayBuffer();
    } catch (error) {
      console.error('Preview speech synthesis error:', error);
      throw new Error('Failed to synthesize preview speech');
    }
  }
}

// Enhanced voice configuration for a warm, therapeutic experience
export const jamieVoiceAgentConfig: VoiceAgentConfig = {
  personality: {
    name: 'Jamie',
    role: 'AI Mental Health Counselor',
    tone: 'Warm, empathetic, and nurturing',
    therapeuticApproach: 'Person-centered with cognitive behavioral techniques',
    voicePersonality: 'Gentle, caring, and reassuring like a trusted friend'
  },
  voiceSettings: {
    voice: 'nova', // Most human-like and expressive voice
    speed: 0.85, // Slower, more therapeutic pacing
    pitch: 1.0, // Natural pitch
    volume: 1.0, // Full volume
    style: 'warm_therapeutic',
    emotion: 'compassionate'
  },
  therapeuticApproach: {
    primaryTechniques: [
      'Active listening and validation',
      'Cognitive reframing',
      'Mindfulness and grounding',
      'Emotion regulation skills',
      'Self-compassion practices'
    ],
    crisisProtocols: [
      'Immediate safety assessment',
      'Crisis hotline referrals',
      'Professional help encouragement',
      'Support network activation'
    ],
    empathyLevel: 9,
    validationStyle: 'Unconditional positive regard with gentle guidance'
  },
  crisisProtocols: {
    detectionKeywords: [
      'suicidal', 'self-harm', 'hopeless', 'desperate',
      'overwhelmed', 'can\'t take it', 'end it all'
    ],
    immediateActions: [
      'Assess immediate safety',
      'Provide crisis resources',
      'Encourage professional help',
      'Activate support network'
    ],
    escalationThreshold: 0.7,
    emergencyContacts: [
      '988 - Suicide & Crisis Lifeline',
      '911 - Emergency Services',
      'Local mental health crisis line'
    ]
  }
};

export const enhancedVoiceAgent = new EnhancedVoiceAgent(jamieVoiceAgentConfig);
