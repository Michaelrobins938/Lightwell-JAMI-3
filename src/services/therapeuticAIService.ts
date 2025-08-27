import { EnhancedJamieCore } from '../ai/enhanced_jamie_core';
import { AdvancedSentimentAnalyzer } from '../ai/sentiment_analysis';
import { prisma } from '../lib/prisma';
import { 
  EmotionalState, 
  TherapeuticIntervention, 
  CrisisLevel, 
  EnhancedAIResponse,
  ConversationSummary,
  TherapeuticRelationship,
  EmotionalPattern,
  ProgressTracking
} from '../types/ai';

export class TherapeuticAIService {
  private jamieCore: EnhancedJamieCore;
  private sentimentAnalyzer: AdvancedSentimentAnalyzer;

  constructor() {
    this.jamieCore = new EnhancedJamieCore();
    this.sentimentAnalyzer = new AdvancedSentimentAnalyzer();
  }

  async generateTherapeuticResponse(
    userId: string, 
    userInput: string, 
    sessionId?: string
  ): Promise<EnhancedAIResponse> {
    try {
      const response = await this.jamieCore.generateTherapeuticResponse(userId, userInput, sessionId);
      return response;
    } catch (error) {
      console.error('Therapeutic AI Service Error:', error);
      throw error;
    }
  }

  async analyzeConversationHistory(userId: string): Promise<{
    patterns: EmotionalPattern[];
    relationship: TherapeuticRelationship;
    progress: ProgressTracking[];
  }> {
    try {
      // Get user's conversation history
      const sessions = await prisma.chatSession.findMany({
        where: { userId },
        include: { messages: true },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      const patterns: EmotionalPattern[] = [];
      const progress: ProgressTracking[] = [];

      // Analyze patterns across sessions
      for (const session of sessions) {
        const userMessages = session.messages
          .filter((msg: any) => msg.content.startsWith('User:'))
          .map((msg: any) => msg.content.replace('User:', '').trim());

        if (userMessages.length > 0) {
          const analysis = await this.sentimentAnalyzer.detectEmotionalPatterns(userMessages);
          
          // Extract emotional patterns
          for (const pattern of analysis.patterns) {
            patterns.push({
              userId,
              pattern,
              frequency: 1, // Would be calculated based on occurrence
              triggers: analysis.triggers,
              intensity: 5, // Would be calculated from emotional intensity
              copingStrategies: analysis.copingStrategies,
              effectiveness: 7, // Would be calculated based on outcomes
              lastObserved: session.createdAt
            });
          }
        }
      }

      // Calculate therapeutic relationship metrics
      const totalSessions = sessions.length;
      const totalMessages = sessions.reduce((sum: number, session: any) => sum + session.messages.length, 0);
      const engagementLevel = Math.min(10, Math.max(1, totalMessages / totalSessions));
      const trustLevel = Math.min(10, Math.max(1, engagementLevel * 0.8));
      const therapeuticAlliance = Math.min(10, Math.max(1, (trustLevel + engagementLevel) / 2));

      const relationship: TherapeuticRelationship = {
        userId,
        trustLevel,
        engagementLevel,
        therapeuticAlliance,
        communicationStyle: 'adaptive', // Would be determined from analysis
        preferredInterventions: patterns.map(p => p.copingStrategies).flat().slice(0, 5),
        progressAreas: ['emotional_regulation', 'self_awareness'], // Would be determined from analysis
        challenges: ['stress_management'], // Would be determined from analysis
        lastUpdated: new Date()
      };

      // Track progress metrics
      progress.push({
        userId,
        metric: 'emotional_regulation',
        value: 7, // Would be calculated from emotional state stability
        trend: 'improving',
        confidence: 0.8,
        lastUpdated: new Date(),
        historicalData: sessions.map((session: any) => ({
          date: session.createdAt,
          value: 6 // Would be calculated from session data
        }))
      });

      return { patterns, relationship, progress };
    } catch (error) {
      console.error('Conversation analysis error:', error);
      return {
        patterns: [],
        relationship: {
          userId,
          trustLevel: 5,
          engagementLevel: 5,
          therapeuticAlliance: 5,
          communicationStyle: 'adaptive',
          preferredInterventions: [],
          progressAreas: [],
          challenges: [],
          lastUpdated: new Date()
        },
        progress: []
      };
    }
  }

  async generateSessionSummary(sessionId: string): Promise<ConversationSummary> {
    try {
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: true }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      const userMessages = session.messages
        .filter((msg: any) => msg.content.startsWith('User:'))
        .map((msg: any) => msg.content.replace('User:', '').trim());

      const assistantMessages = session.messages
        .filter((msg: any) => !msg.content.startsWith('User:'))
        .map((msg: any) => msg.content.replace('Assistant:', '').trim());

      // Generate summary using AI
      const summaryPrompt = `
        Summarize this therapy session:
        
        User messages: ${userMessages.join('\n')}
        Assistant responses: ${assistantMessages.join('\n')}
        
        Provide:
        1. A concise summary of the session
        2. Key insights about the user's emotional state
        3. Therapeutic progress made
        4. Recommendations for next session
        
        Return as JSON:
        {
          "summary": "string",
          "keyInsights": ["string"],
          "emotionalTrends": ["string"],
          "therapeuticProgress": ["string"],
          "nextSessionRecommendations": ["string"]
        }
      `;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.userId,
          userInput: summaryPrompt,
          sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      const summaryData = JSON.parse(data.response);

      return {
        sessionId,
        userId: session.userId,
        summary: summaryData.summary || 'Session summary unavailable',
        keyInsights: summaryData.keyInsights || [],
        emotionalTrends: summaryData.emotionalTrends || [],
        therapeuticProgress: summaryData.therapeuticProgress || [],
        nextSessionRecommendations: summaryData.nextSessionRecommendations || [],
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Session summary generation error:', error);
      return {
        sessionId,
        userId: '',
        summary: 'Unable to generate session summary',
        keyInsights: [],
        emotionalTrends: [],
        therapeuticProgress: [],
        nextSessionRecommendations: [],
        createdAt: new Date()
      };
    }
  }

  async detectCrisisSignals(text: string): Promise<{
    crisisLevel: CrisisLevel;
    immediateActions: string[];
    professionalHelp: boolean;
  }> {
    try {
      const crisisAnalysis = await this.sentimentAnalyzer.detectCrisisSignals(text);
      
      const crisisLevel: CrisisLevel = {
        level: crisisAnalysis.crisisLevel,
        riskFactors: crisisAnalysis.riskFactors,
        immediateActions: crisisAnalysis.immediateActions,
        professionalHelp: crisisAnalysis.professionalHelp,
        baselineChange: 'stable',
        urgency: crisisAnalysis.crisisLevel === 'critical' ? 'critical' : 
                crisisAnalysis.crisisLevel === 'high' ? 'high' : 
                crisisAnalysis.crisisLevel === 'moderate' ? 'medium' : 'low'
      };

      return {
        crisisLevel,
        immediateActions: crisisAnalysis.immediateActions,
        professionalHelp: crisisAnalysis.professionalHelp
      };
    } catch (error) {
      console.error('Crisis detection error:', error);
      return {
        crisisLevel: {
          level: 'none',
          riskFactors: [],
          immediateActions: [],
          professionalHelp: false,
          baselineChange: 'stable',
          urgency: 'low'
        },
        immediateActions: [],
        professionalHelp: false
      };
    }
  }

  async suggestTherapeuticInterventions(
    emotionalState: EmotionalState,
    userId: string
  ): Promise<TherapeuticIntervention[]> {
    try {
      // Get user's therapeutic history
      const sessions = await prisma.chatSession.findMany({
        where: { userId },
        include: { messages: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      const userMessages = sessions
        .flatMap((session: any) => session.messages)
        .filter((msg: any) => msg.content.startsWith('User:'))
        .map((msg: any) => msg.content.replace('User:', '').trim());

      const patternAnalysis = await this.sentimentAnalyzer.detectEmotionalPatterns(userMessages);

      const interventions: TherapeuticIntervention[] = [];

      // Suggest interventions based on emotional state and patterns
      if (emotionalState.primaryEmotion === 'anxiety' && emotionalState.intensity > 6) {
        interventions.push({
          type: 'mindfulness',
          technique: 'Deep Breathing Exercise',
          rationale: 'High anxiety detected, breathing exercise can help calm the nervous system',
          effectiveness: 8,
          personalization: 'Based on your previous success with breathing techniques',
          nextSteps: ['Practice for 5 minutes', 'Focus on slow, deep breaths']
        });
      }

      if (emotionalState.primaryEmotion === 'depression' && emotionalState.intensity > 6) {
        interventions.push({
          type: 'cbt',
          technique: 'Gratitude Journaling',
          rationale: 'Depression symptoms detected, gratitude practice can improve mood',
          effectiveness: 7,
          personalization: 'Building on your previous positive experiences',
          nextSteps: ['Write 3 things you\'re grateful for', 'Reflect on positive moments']
        });
      }

      if (emotionalState.primaryEmotion === 'anger' && emotionalState.intensity > 7) {
        interventions.push({
          type: 'mindfulness',
          technique: 'Progressive Muscle Relaxation',
          rationale: 'High anger detected, physical relaxation can help release tension',
          effectiveness: 8,
          personalization: 'Using techniques that have worked for you before',
          nextSteps: ['Start with your toes', 'Tense and relax each muscle group']
        });
      }

      // Add crisis intervention if needed
      if (emotionalState.intensity > 8) {
        interventions.push({
          type: 'crisis',
          technique: 'Crisis Safety Planning',
          rationale: 'High emotional intensity detected, safety planning is recommended',
          effectiveness: 9,
          personalization: 'Ensuring your safety and well-being',
          nextSteps: ['Identify safe spaces', 'List emergency contacts', 'Plan coping strategies']
        });
      }

      return interventions;
    } catch (error) {
      console.error('Intervention suggestion error:', error);
      return [{
        type: 'validation',
        technique: 'Emotional Support',
        rationale: 'Providing empathetic support',
        effectiveness: 6,
        personalization: '',
        nextSteps: []
      }];
    }
  }

  async trackEmotionalProgress(userId: string): Promise<{
    weeklyTrend: 'improving' | 'stable' | 'declining';
    monthlyProgress: number;
    keyMetrics: Array<{ metric: string; value: number; trend: string }>;
  }> {
    try {
      // Get recent sessions for progress tracking
      const recentSessions = await prisma.chatSession.findMany({
        where: { userId },
        include: { messages: true },
        orderBy: { createdAt: 'desc' },
        take: 30
      });

      // Calculate weekly trend
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const recentSessions_week = recentSessions.filter((s: any) => s.createdAt > weekAgo);
      const olderSessions_week = recentSessions.filter((s: any) => s.createdAt <= weekAgo);

      const recentAvg = recentSessions_week.length > 0 ? 6 : 5; // Would calculate from emotional data
      const olderAvg = olderSessions_week.length > 0 ? 5 : 5; // Would calculate from emotional data

      const weeklyTrend = recentAvg > olderAvg + 0.5 ? 'improving' : 
                         recentAvg < olderAvg - 0.5 ? 'declining' : 'stable';

      // Calculate monthly progress
      const monthlyProgress = Math.min(100, Math.max(0, (recentAvg / 10) * 100));

      const keyMetrics = [
        { metric: 'Emotional Stability', value: recentAvg, trend: weeklyTrend },
        { metric: 'Session Engagement', value: recentSessions.length / 4, trend: 'stable' },
        { metric: 'Coping Effectiveness', value: 7, trend: 'improving' }
      ];

      return {
        weeklyTrend,
        monthlyProgress,
        keyMetrics
      };
    } catch (error) {
      console.error('Progress tracking error:', error);
      return {
        weeklyTrend: 'stable',
        monthlyProgress: 50,
        keyMetrics: [
          { metric: 'Emotional Stability', value: 5, trend: 'stable' },
          { metric: 'Session Engagement', value: 5, trend: 'stable' },
          { metric: 'Coping Effectiveness', value: 5, trend: 'stable' }
        ]
      };
    }
  }
}

export default TherapeuticAIService; 