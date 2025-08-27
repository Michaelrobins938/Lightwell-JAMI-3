import { openRouterChatCompletion } from '../services/openRouterService';

interface LearningProfile {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed';
  cognitiveLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredTopics: string[];
  learningPace: 'slow' | 'moderate' | 'fast';
  engagementLevel: number;
  retentionRate: number;
  comprehensionScore: number;
}

interface EducationalContent {
  type: 'lesson' | 'exercise' | 'assessment' | 'resource' | 'intervention';
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  format: 'text' | 'video' | 'audio' | 'interactive' | 'mixed';
  duration: number; // minutes
  learningObjectives: string[];
  prerequisites: string[];
  content: string;
}

interface LearningProgress {
  userId: string;
  topic: string;
  progress: number; // 0-100
  timeSpent: number; // minutes
  assessmentsCompleted: number;
  averageScore: number;
  lastAccessed: Date;
  nextRecommended: string;
}

interface AdaptiveRecommendation {
  type: 'content' | 'exercise' | 'assessment' | 'intervention';
  recommendation: string;
  rationale: string;
  expectedOutcome: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface EducationalInsight {
  type: 'learning_pattern' | 'knowledge_gap' | 'strength' | 'weakness' | 'opportunity';
  insight: string;
  confidence: number;
  actionable: boolean;
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default class EducationalIntelligenceSystem {
  private learningProfiles: Map<string, LearningProfile> = new Map();
  private learningProgress: Map<string, LearningProgress[]> = new Map();
  private educationalContent: Map<string, EducationalContent[]> = new Map();
  private insightsHistory: Map<string, EducationalInsight[]> = new Map();

  async createLearningProfile(
    userId: string,
    initialData: Partial<LearningProfile>
  ): Promise<LearningProfile> {
    const prompt = `
    Create learning profile for user ${userId} with initial data:
    ${JSON.stringify(initialData)}
    
    Analyze and create comprehensive learning profile including:
    - Learning style preferences
    - Cognitive level assessment
    - Topic preferences
    - Learning pace
    - Engagement patterns
    
    Return as JSON:
    {
      "userId": "string",
      "learningStyle": "visual" | "auditory" | "kinesthetic" | "reading" | "mixed",
      "cognitiveLevel": "beginner" | "intermediate" | "advanced" | "expert",
      "preferredTopics": ["string"],
      "learningPace": "slow" | "moderate" | "fast",
      "engagementLevel": number,
      "retentionRate": number,
      "comprehensionScore": number
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const profile = JSON.parse(content);
      
      const learningProfile: LearningProfile = {
        userId,
        learningStyle: profile.learningStyle || 'mixed',
        cognitiveLevel: profile.cognitiveLevel || 'beginner',
        preferredTopics: profile.preferredTopics || ['emotional_wellness'],
        learningPace: profile.learningPace || 'moderate',
        engagementLevel: profile.engagementLevel || 0.7,
        retentionRate: profile.retentionRate || 0.6,
        comprehensionScore: profile.comprehensionScore || 0.5
      };

      this.learningProfiles.set(userId, learningProfile);
      return learningProfile;
    } catch (error) {
      const learningProfile: LearningProfile = {
        userId,
        learningStyle: 'mixed',
        cognitiveLevel: 'beginner',
        preferredTopics: ['emotional_wellness'],
        learningPace: 'moderate',
        engagementLevel: 0.7,
        retentionRate: 0.6,
        comprehensionScore: 0.5
      };

      this.learningProfiles.set(userId, learningProfile);
      return learningProfile;
    }
  }

  async generateAdaptiveContent(
    userId: string,
    topic: string,
    currentProgress: number
  ): Promise<EducationalContent> {
    const profile = this.learningProfiles.get(userId);
    if (!profile) {
      throw new Error(`Learning profile not found for user ${userId}`);
    }

    const prompt = `
    Generate adaptive educational content for user ${userId}:
    Learning Profile: ${JSON.stringify(profile)}
    Topic: ${topic}
    Current Progress: ${currentProgress}%
    
    Create content that:
    - Matches learning style
    - Appropriate difficulty level
    - Engaging format
    - Clear learning objectives
    - Supports current progress
    
    Return as JSON:
    {
      "type": "lesson" | "exercise" | "assessment" | "resource" | "intervention",
      "topic": "string",
      "difficulty": "beginner" | "intermediate" | "advanced",
      "format": "text" | "video" | "audio" | "interactive" | "mixed",
      "duration": number,
      "learningObjectives": ["string"],
      "prerequisites": ["string"],
      "content": "string"
    }
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const educationalContent = JSON.parse(content);
      
      return {
        type: educationalContent.type || 'lesson',
        topic: educationalContent.topic || topic,
        difficulty: educationalContent.difficulty || 'intermediate',
        format: educationalContent.format || 'text',
        duration: educationalContent.duration || 15,
        learningObjectives: educationalContent.learningObjectives || [`Learn about ${topic}`],
        prerequisites: educationalContent.prerequisites || [],
        content: educationalContent.content || `Educational content about ${topic}`
      };
    } catch (error) {
      return {
        type: 'lesson',
        topic,
        difficulty: 'intermediate',
        format: 'text',
        duration: 15,
        learningObjectives: [`Learn about ${topic}`],
        prerequisites: [],
        content: `Educational content about ${topic}`
      };
    }
  }

  async recommendNextContent(
    userId: string,
    completedContent: string,
    performance: number
  ): Promise<AdaptiveRecommendation[]> {
    const profile = this.learningProfiles.get(userId);
    const progress = this.learningProgress.get(userId) || [];
    
    if (!profile) {
      return [{
        type: 'content',
        recommendation: 'emotional_wellness_basics',
        rationale: 'Start with foundational content',
        expectedOutcome: 'Basic understanding of emotional wellness',
        difficulty: 'beginner',
        estimatedDuration: 20,
        priority: 'high'
      }];
    }

    const prompt = `
    Recommend next educational content for user ${userId}:
    Learning Profile: ${JSON.stringify(profile)}
    Completed Content: ${completedContent}
    Performance: ${performance}%
    Progress History: ${JSON.stringify(progress)}
    
    Recommend content that:
    - Builds on completed content
    - Matches learning style
    - Appropriate difficulty
    - Supports learning goals
    - Addresses knowledge gaps
    
    Return as JSON array:
    [
      {
        "type": "content" | "exercise" | "assessment" | "intervention",
        "recommendation": "string",
        "rationale": "string",
        "expectedOutcome": "string",
        "difficulty": "beginner" | "intermediate" | "advanced",
        "estimatedDuration": number,
        "priority": "low" | "medium" | "high" | "critical"
      }
    ]
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const recommendations = JSON.parse(content);
      
      return Array.isArray(recommendations) ? recommendations : [{
        type: 'content',
        recommendation: 'emotional_regulation_techniques',
        rationale: 'Build on emotional wellness foundation',
        expectedOutcome: 'Improved emotional regulation skills',
        difficulty: 'intermediate',
        estimatedDuration: 25,
        priority: 'high'
      }];
    } catch (error) {
      return [{
        type: 'content',
        recommendation: 'emotional_regulation_techniques',
        rationale: 'Build on emotional wellness foundation',
        expectedOutcome: 'Improved emotional regulation skills',
        difficulty: 'intermediate',
        estimatedDuration: 25,
        priority: 'high'
      }];
    }
  }

  async analyzeLearningPatterns(
    userId: string,
    sessionData: any
  ): Promise<EducationalInsight[]> {
    const profile = this.learningProfiles.get(userId);
    const progress = this.learningProgress.get(userId) || [];
    
    if (!profile) {
      return [];
    }

    const prompt = `
    Analyze learning patterns for user ${userId}:
    Learning Profile: ${JSON.stringify(profile)}
    Progress History: ${JSON.stringify(progress)}
    Session Data: ${JSON.stringify(sessionData)}
    
    Generate insights about:
    - Learning patterns and preferences
    - Knowledge gaps and strengths
    - Engagement patterns
    - Learning opportunities
    - Areas for improvement
    
    Return as JSON array:
    [
      {
        "type": "learning_pattern" | "knowledge_gap" | "strength" | "weakness" | "opportunity",
        "insight": "string",
        "confidence": number,
        "actionable": boolean,
        "recommendations": ["string"],
        "priority": "low" | "medium" | "high" | "critical"
      }
    ]
    `;

    try {
      const response = await openRouterChatCompletion([
        { role: 'user', content: prompt }
      ]);
      
      const content = response?.choices?.[0]?.message?.content || '';
      const insights = JSON.parse(content);
      
      const educationalInsights: EducationalInsight[] = Array.isArray(insights) ? insights : [{
        type: 'learning_pattern',
        insight: 'User shows consistent engagement with interactive content',
        confidence: 0.8,
        actionable: true,
        recommendations: ['Provide more interactive content', 'Monitor engagement levels'],
        priority: 'medium'
      }];

      // Store insights
      const userInsights = this.insightsHistory.get(userId) || [];
      userInsights.push(...educationalInsights);
      this.insightsHistory.set(userId, userInsights);

      return educationalInsights;
    } catch (error) {
      return [{
        type: 'learning_pattern',
        insight: 'User shows consistent engagement with interactive content',
        confidence: 0.8,
        actionable: true,
        recommendations: ['Provide more interactive content', 'Monitor engagement levels'],
        priority: 'medium'
      }];
    }
  }

  async updateLearningProgress(
    userId: string,
    topic: string,
    progress: number,
    timeSpent: number,
    assessmentScore?: number
  ): Promise<LearningProgress> {
    const existingProgress = this.learningProgress.get(userId) || [];
    const topicProgress = existingProgress.find(p => p.topic === topic);

    const updatedProgress: LearningProgress = {
      userId,
      topic,
      progress: Math.min(100, Math.max(0, progress)),
      timeSpent: (topicProgress?.timeSpent || 0) + timeSpent,
      assessmentsCompleted: (topicProgress?.assessmentsCompleted || 0) + (assessmentScore ? 1 : 0),
      averageScore: assessmentScore ? 
        ((topicProgress?.averageScore || 0) * (topicProgress?.assessmentsCompleted || 0) + assessmentScore) / 
        ((topicProgress?.assessmentsCompleted || 0) + 1) : 
        (topicProgress?.averageScore || 0),
      lastAccessed: new Date(),
      nextRecommended: topicProgress?.nextRecommended || ''
    };

    // Update or add progress
    const otherProgress = existingProgress.filter(p => p.topic !== topic);
    this.learningProgress.set(userId, [...otherProgress, updatedProgress]);

    return updatedProgress;
  }

  async getLearningAnalytics(userId: string): Promise<any> {
    const profile = this.learningProfiles.get(userId);
    const progress = this.learningProgress.get(userId) || [];
    const insights = this.insightsHistory.get(userId) || [];

    if (!profile) {
      return {
        profile: null,
        progress: [],
        insights: [],
        analytics: {
          totalTopics: 0,
          averageProgress: 0,
          totalTimeSpent: 0,
          averageScore: 0
        }
      };
    }

    const analytics = {
      totalTopics: progress.length,
      averageProgress: progress.length > 0 ? 
        progress.reduce((sum, p) => sum + p.progress, 0) / progress.length : 0,
      totalTimeSpent: progress.reduce((sum, p) => sum + p.timeSpent, 0),
      averageScore: progress.length > 0 ? 
        progress.reduce((sum, p) => sum + p.averageScore, 0) / progress.length : 0
    };

    return {
      profile,
      progress,
      insights,
      analytics
    };
  }

  async getEducationalRecommendations(userId: string): Promise<AdaptiveRecommendation[]> {
    const profile = this.learningProfiles.get(userId);
    const progress = this.learningProgress.get(userId) || [];
    
    if (!profile) {
      return [{
        type: 'content',
        recommendation: 'emotional_wellness_introduction',
        rationale: 'Start with foundational content',
        expectedOutcome: 'Basic understanding of emotional wellness',
        difficulty: 'beginner',
        estimatedDuration: 15,
        priority: 'high'
      }];
    }

    // Find topics with low progress
    const lowProgressTopics = progress.filter(p => p.progress < 50);
    const completedTopics = progress.filter(p => p.progress >= 100);

    if (lowProgressTopics.length > 0) {
      return lowProgressTopics.map(topic => ({
        type: 'content' as const,
        recommendation: `${topic.topic}_continuation`,
        rationale: `Continue learning about ${topic.topic}`,
        expectedOutcome: `Complete understanding of ${topic.topic}`,
        difficulty: 'intermediate' as const,
        estimatedDuration: 20,
        priority: 'high' as const
      }));
    }

    // Recommend new topics based on profile
    return [{
      type: 'content',
      recommendation: 'advanced_emotional_techniques',
      rationale: 'Build on completed topics',
      expectedOutcome: 'Advanced emotional wellness skills',
      difficulty: 'advanced',
      estimatedDuration: 30,
      priority: 'medium'
    }];
  }
} 