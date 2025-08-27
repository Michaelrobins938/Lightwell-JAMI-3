interface UserAssessmentData {
  clinicalProfile: {
    depressionScore: number;
    anxietyScore: number;
    traumaScore: number;
    stressLevel: number;
    functionalImpairmentScore: number;
    socialFunctioningScore: number;
  };
  clinicalScores: {
    depression: {
      score: number;
      severity: 'none' | 'mild' | 'moderate' | 'severe';
    };
    anxiety: {
      score: number;
      severity: 'none' | 'mild' | 'moderate' | 'severe';
    };
    trauma: {
      score: number;
      severity: 'none' | 'mild' | 'moderate' | 'severe';
    };
  };
  goals: Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  riskAssessment: {
    suicidalIdeation: 'none' | 'low' | 'moderate' | 'high';
    selfHarm: 'none' | 'low' | 'moderate' | 'high';
    substanceUse: 'none' | 'low' | 'moderate' | 'high';
    socialIsolation: 'none' | 'low' | 'moderate' | 'high';
    overallRisk: 'none' | 'low' | 'moderate' | 'high';
  };
  assessmentCompleted: boolean;
  assessmentDate: string;
}

class UserAssessmentService {
  private static instance: UserAssessmentService;
  private readonly STORAGE_KEYS = {
    USER_PROFILE: 'lunaUserProfile',
    CLINICAL_SCORES: 'lunaClinicalScores',
    RECOMMENDATIONS: 'lunaRecommendations',
    RISK_ASSESSMENT: 'lunaRiskAssessment',
    CLINICAL_RECOMMENDATIONS: 'lunaClinicalRecommendations'
  };

  static getInstance(): UserAssessmentService {
    if (!UserAssessmentService.instance) {
      UserAssessmentService.instance = new UserAssessmentService();
    }
    return UserAssessmentService.instance;
  }

  // Get comprehensive user assessment data
  getUserAssessmentData(): UserAssessmentData | null {
    try {
      const userProfile = localStorage.getItem(this.STORAGE_KEYS.USER_PROFILE);
      const clinicalScores = localStorage.getItem(this.STORAGE_KEYS.CLINICAL_SCORES);
      const riskAssessment = localStorage.getItem(this.STORAGE_KEYS.RISK_ASSESSMENT);

      if (!userProfile || !clinicalScores || !riskAssessment) {
        return null;
      }

      return {
        clinicalProfile: JSON.parse(userProfile).clinicalProfile,
        clinicalScores: JSON.parse(clinicalScores),
        goals: JSON.parse(userProfile).goals || [],
        riskAssessment: JSON.parse(riskAssessment),
        assessmentCompleted: true,
        assessmentDate: JSON.parse(userProfile).lastUpdated || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error loading user assessment data:', error);
      return null;
    }
  }

  // Check if user has completed assessment
  hasCompletedAssessment(): boolean {
    return this.getUserAssessmentData() !== null;
  }

  // Generate personalized context for Jamie
  generateJamieContext(): string {
    const assessmentData = this.getUserAssessmentData();
    if (!assessmentData) {
      return '';
    }

    const context = [];

    // Clinical profile summary
    context.push('## User Assessment Summary');
    context.push(`Assessment Date: ${new Date(assessmentData.assessmentDate).toLocaleDateString()}`);
    context.push('');

    // Mental health scores
    context.push('### Mental Health Indicators:');
    context.push(`- Depression: ${assessmentData.clinicalScores.depression.score}/27 (${assessmentData.clinicalScores.depression.severity})`);
    context.push(`- Anxiety: ${assessmentData.clinicalScores.anxiety.score}/21 (${assessmentData.clinicalScores.anxiety.severity})`);
    if (assessmentData.clinicalScores.trauma.score > 0) {
      context.push(`- Trauma: ${assessmentData.clinicalScores.trauma.score}/20 (${assessmentData.clinicalScores.trauma.severity})`);
    }
    context.push(`- Stress Level: ${assessmentData.clinicalProfile.stressLevel}/10`);
    context.push('');

    // Risk assessment
    if (assessmentData.riskAssessment.overallRisk !== 'none') {
      context.push('### Risk Assessment:');
      if (assessmentData.riskAssessment.suicidalIdeation !== 'none') {
        context.push(`- Suicidal Ideation: ${assessmentData.riskAssessment.suicidalIdeation}`);
      }
      if (assessmentData.riskAssessment.selfHarm !== 'none') {
        context.push(`- Self-Harm: ${assessmentData.riskAssessment.selfHarm}`);
      }
      if (assessmentData.riskAssessment.socialIsolation !== 'none') {
        context.push(`- Social Isolation: ${assessmentData.riskAssessment.socialIsolation}`);
      }
      context.push('');
    }

    // Goals
    if (assessmentData.goals.length > 0) {
      context.push('### User Goals:');
      assessmentData.goals.forEach((goal, index) => {
        context.push(`${index + 1}. ${goal.title} - ${goal.description}`);
      });
      context.push('');
    }

    // Clinical recommendations
    const clinicalRecommendations = localStorage.getItem(this.STORAGE_KEYS.CLINICAL_RECOMMENDATIONS);
    if (clinicalRecommendations) {
      const recommendations = JSON.parse(clinicalRecommendations);
      if (recommendations.length > 0) {
        context.push('### Clinical Recommendations:');
        recommendations.forEach((rec: string, index: number) => {
          context.push(`${index + 1}. ${rec}`);
        });
        context.push('');
      }
    }

    // Guidance for Jamie
    context.push('### Guidance for Therapy:');
    context.push('- Use this assessment data to inform therapeutic approach');
    context.push('- Pay attention to identified risk factors');
    context.push('- Focus on goals and priorities identified by the user');
    context.push('- Adapt therapeutic techniques based on clinical indicators');
    context.push('- Monitor for changes in mental health status');

    return context.join('\n');
  }

  // Get assessment data formatted for immediate use
  getAssessmentSummary(): string {
    const data = this.getUserAssessmentData();
    if (!data) {
      return 'No assessment data available. Consider starting with a general conversation to understand the user\'s needs.';
    }

    const summary = [
      `User has completed mental health assessment on ${new Date(data.assessmentDate).toLocaleDateString()}.`,
      `Current mental health indicators: Depression ${data.clinicalScores.depression.severity}, Anxiety ${data.clinicalScores.anxiety.severity}.`,
      `Stress level: ${data.clinicalProfile.stressLevel}/10.`,
      data.goals.length > 0 ? `Has ${data.goals.length} personal goals focused on ${data.goals.map(g => g.category).join(', ')}.` : 'No specific goals identified.',
      data.riskAssessment.overallRisk !== 'none' ? `Risk assessment shows ${data.riskAssessment.overallRisk} overall risk level.` : 'No significant risk factors identified.'
    ];

    return summary.join(' ');
  }

  // Clear assessment data
  clearAssessmentData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Check if assessment data is stale (older than 30 days)
  isAssessmentStale(): boolean {
    const data = this.getUserAssessmentData();
    if (!data) return true;

    const assessmentDate = new Date(data.assessmentDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return assessmentDate < thirtyDaysAgo;
  }
}

export default UserAssessmentService;
export type { UserAssessmentData };

