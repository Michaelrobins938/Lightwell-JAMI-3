import { UserProfile, PersonalizationRecommendation, BehavioralMetrics } from '../types/personalization';

export class PersonalizationEngine {
  private readonly SIMILARITY_THRESHOLD = 0.8;
  private readonly MIN_CONFIDENCE = 0.6;

  /**
   * Generate personalized recommendations using collaborative filtering
   * and content-based approaches
   */
  public async generateRecommendations(
    userProfile: UserProfile,
    similarUsers: UserProfile[] = []
  ): Promise<PersonalizationRecommendation> {
    
    const collaborativeRecommendations = this.collaborativeFiltering(userProfile, similarUsers);
    const contentBasedRecommendations = this.contentBasedFiltering(userProfile);
    const behavioralAdaptations = this.generateBehavioralAdaptations(userProfile.behavioralPatterns || this.getDefaultBehavioralMetrics());

    // Ensemble approach combining multiple recommendation strategies
    const recommendations = this.ensembleRecommendations([
      collaborativeRecommendations,
      contentBasedRecommendations
    ]);

    const confidence = this.calculateRecommendationConfidence(
      userProfile,
      recommendations,
      similarUsers.length
    );

    return {
      contentType: this.determineOptimalContentType(userProfile),
      recommendations,
      confidence,
      reasoning: this.generateRecommendationReasoning(userProfile, recommendations),
      adaptations: behavioralAdaptations
    };
  }

  /**
   * Collaborative filtering based on similar user patterns
   */
  private collaborativeFiltering(
    userProfile: UserProfile,
    similarUsers: UserProfile[]
  ): ContentRecommendation[] {
    
    if (similarUsers.length === 0) return [];

    // Calculate user similarity using cosine similarity on personalization vectors
    const similarities = similarUsers.map(similarUser => ({
      user: similarUser,
      similarity: this.calculateCosineSimilarity(
        userProfile.personalizationVector || [0.5, 0.5, 0.5, 0.5, 0.5],
        similarUser.personalizationVector || [0.5, 0.5, 0.5, 0.5, 0.5]
      )
    }));

    // Filter for highly similar users
    const highSimilarityUsers = similarities
      .filter(s => s.similarity >= this.SIMILARITY_THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10); // Top 10 similar users

    // Aggregate successful interventions from similar users
    const interventionCounts = new Map<string, { count: number; avgEffectiveness: number }>();
    
    highSimilarityUsers.forEach(({ user, similarity }) => {
      // In a real implementation, this would access historical intervention data
      user.goals.forEach(goal => {
        goal.interventions?.forEach(intervention => {
          const key = intervention.type;
          const current = interventionCounts.get(key) || { count: 0, avgEffectiveness: 0 };
          interventionCounts.set(key, {
            count: current.count + 1,
            avgEffectiveness: (current.avgEffectiveness + intervention.effectiveness * similarity) / 2
          });
        });
      });
    });

    // Convert to recommendations
    return Array.from(interventionCounts.entries())
      .sort((a, b) => b[1].avgEffectiveness - a[1].avgEffectiveness)
      .slice(0, 5)
      .map(([type, data]) => ({
        id: `collab_${type}`,
        type: type as any,
        priority: data.avgEffectiveness,
        evidence: `Recommended by ${data.count} similar users`,
        adaptations: []
      }));
  }

  /**
   * Content-based filtering using clinical profile and preferences
   */
  private contentBasedFiltering(userProfile: UserProfile): ContentRecommendation[] {
    const recommendations: ContentRecommendation[] = [];
    const { clinicalProfile, preferences, goals } = userProfile;

    // Depression-specific recommendations
    if (clinicalProfile.depressionScore > 10) {
      recommendations.push({
        id: 'cbt_depression',
        type: 'intervention',
        priority: 0.9,
        evidence: 'CBT is evidence-based for depression (Beck et al., 1979)',
        adaptations: this.adaptForEngagement(userProfile.engagementStyle || {
          preferredModality: 'mixed',
          gamificationPreference: 0.5,
          narrativeStyle: 'conversational',
          pacingPreference: 'moderate',
          feedbackFrequency: 'periodic'
        })
      });

      if (clinicalProfile.depressionScore > 15) {
        recommendations.push({
          id: 'behavioral_activation',
          type: 'intervention',
          priority: 0.85,
          evidence: 'Behavioral activation effective for severe depression',
          adaptations: []
        });
      }
    }

    // Anxiety-specific recommendations
    if (clinicalProfile.anxietyScore > 8) {
      recommendations.push({
        id: 'breathing_exercises',
        type: 'exercise',
        priority: 0.8,
        evidence: 'Diaphragmatic breathing reduces anxiety symptoms',
        adaptations: []
      });

      recommendations.push({
        id: 'progressive_muscle_relaxation',
        type: 'exercise',
        priority: 0.75,
        evidence: 'PMR effective for anxiety disorders (Jacobson, 1938)',
        adaptations: []
      });
    }

    // Goal-based recommendations
    goals.forEach(goal => {
      if (goal.category === 'mood' && goal.priority === 'high') {
        recommendations.push({
          id: 'mood_tracking',
          type: 'resource',
          priority: 0.7,
          evidence: 'Mood tracking improves self-awareness and outcomes',
          adaptations: []
        });
      }
    });

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Generate behavioral adaptations based on user interaction patterns
   */
  private generateBehavioralAdaptations(behavioral: BehavioralMetrics): InterfaceAdaptation[] {
    const adaptations: InterfaceAdaptation[] = [];

    // Slow response time - suggest simplified interface
    if (behavioral.avgResponseTime > 5000) {
      adaptations.push({
        type: 'interface',
        change: 'simplify_layout',
        reason: 'User shows slower response times',
        implementation: {
          reduceOptions: true,
          largerButtons: true,
          clearerLabels: true
        }
      });
    }

    // High hesitation pattern - provide more guidance
    if (behavioral.hesitationPattern.some(h => h > 3)) {
      adaptations.push({
        type: 'guidance',
        change: 'increase_support',
        reason: 'User shows hesitation patterns',
        implementation: {
          tooltips: true,
          examples: true,
          progressIndicators: true
        }
      });
    }

    // Low engagement - gamify experience
    if (behavioral.engagementScore < 0.6) {
      adaptations.push({
        type: 'gamification',
        change: 'add_engagement_elements',
        reason: 'Low engagement score detected',
        implementation: {
          progressBars: true,
          achievements: true,
          visualFeedback: true
        }
      });
    }

    return adaptations;
  }

  private calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) return 0;

    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private ensembleRecommendations(
    recommendationSets: ContentRecommendation[][]
  ): ContentRecommendation[] {
    const combined = new Map<string, ContentRecommendation>();

    recommendationSets.forEach(set => {
      set.forEach(rec => {
        const existing = combined.get(rec.id);
        if (existing) {
          // Boost priority for recommendations that appear in multiple sets
          existing.priority = (existing.priority + rec.priority) / 2 * 1.2;
        } else {
          combined.set(rec.id, { ...rec });
        }
      });
    });

    return Array.from(combined.values())
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8); // Top 8 recommendations
  }

  private calculateRecommendationConfidence(
    userProfile: UserProfile,
    recommendations: ContentRecommendation[],
    similarUserCount: number
  ): number {
    let confidence = 0.5; // Base confidence

    // Boost confidence based on clinical data completeness
    if (userProfile.clinicalProfile?.depressionScore > 0) confidence += 0.1;
    if (userProfile.clinicalProfile?.anxietyScore > 0) confidence += 0.1;
    if (userProfile.goals?.length > 0) confidence += 0.1;

    // Boost confidence based on similar users
    confidence += Math.min(similarUserCount * 0.05, 0.2);

    // Boost confidence based on recommendation quality
    const avgPriority = recommendations.reduce((sum, r) => sum + r.priority, 0) / recommendations.length;
    confidence += avgPriority * 0.2;

    return Math.min(confidence, 1.0);
  }

  private determineOptimalContentType(userProfile: UserProfile): 'intervention' | 'resource' | 'exercise' | 'education' {
    const { clinicalProfile, engagementStyle } = userProfile;

    if (clinicalProfile?.depressionScore > 15 || clinicalProfile?.anxietyScore > 12) {
      return 'intervention';
    }

    // Add null check for engagementStyle
    if (engagementStyle?.preferredModality === 'kinesthetic') {
      return 'exercise';
    }

    if (engagementStyle?.gamificationPreference > 0.7) {
      return 'resource';
    }

    return 'education';
  }

  private generateRecommendationReasoning(
    userProfile: UserProfile,
    recommendations: ContentRecommendation[]
  ): string[] {
    const reasoning: string[] = [];

    if (userProfile.clinicalProfile?.depressionScore > 10) {
      reasoning.push('Elevated depression scores indicate need for mood-focused interventions');
    }

    if (userProfile.clinicalProfile?.anxietyScore > 8) {
      reasoning.push('Anxiety symptoms suggest benefit from relaxation and coping strategies');
    }

    if (userProfile.behavioralPatterns?.engagementScore < 0.6) {
      reasoning.push('Low engagement patterns indicate need for more interactive content');
    }

    if (userProfile.goals?.length > 3) {
      reasoning.push('Multiple goals suggest structured approach with progress tracking');
    }

    return reasoning;
  }

  private adaptForEngagement(engagementStyle: any): any[] {
    // Implementation for engagement-based adaptations
    return [];
  }

  /**
   * Get default behavioral metrics for new users
   */
  private getDefaultBehavioralMetrics(): BehavioralMetrics {
    return {
      avgResponseTime: 2000, // 2 seconds default
      hesitationPattern: [1, 1, 1], // Default low hesitation
      engagementScore: 0.7, // Default moderate engagement
      completionRate: 0.8, // Default 80% completion
      mouseMovements: {
        totalDistance: 1000,
        avgVelocity: 50,
        clickCount: 10,
        maxIdleTime: 5000
      },
      scrollPatterns: {
        totalDistance: 500,
        scrollCount: 5,
        avgScrollVelocity: 30
      },
      dropOffPoints: []
    };
  }
}

// Additional types needed
interface ContentRecommendation {
  id: string;
  type: 'intervention' | 'resource' | 'exercise' | 'education';
  priority: number;
  evidence: string;
  adaptations: any[];
}

interface InterfaceAdaptation {
  type: string;
  change: string;
  reason: string;
  implementation: any;
} 