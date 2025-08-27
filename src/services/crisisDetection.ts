import { AssessmentResponse, RiskAssessment, RiskLevel } from '../types/assessment';

export class CrisisDetectionService {
  private readonly CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end it all', 'no point living', 'better off dead',
    'harm myself', 'hurt myself', 'cut myself', 'overdose', 'plan to die'
  ];

  private readonly SEVERITY_THRESHOLDS = {
    PHQ9_SUICIDE_ITEM: 1, // PHQ-9 item 9 (suicidal ideation)
    GAD7_SEVERE: 15,
    PHQ9_SEVERE: 20,
    COMBINED_HIGH_RISK: 25
  };

  public assessCrisisRisk(
    responses: AssessmentResponse[],
    textResponses: string[] = []
  ): RiskAssessment {
    
    const suicidalIdeation = this.assessSuicidalIdeation(responses, textResponses);
    const selfHarm = this.assessSelfHarm(responses, textResponses);
    const severityScores = this.calculateSeverityScores(responses);
    
    const overallRisk = this.calculateOverallRisk({
      suicidalIdeation,
      selfHarm,
      severityScores
    });

    const immediateIntervention = this.requiresImmediateIntervention(overallRisk);
    const escalationRequired = this.requiresEscalation(overallRisk, severityScores);

    return {
      suicidalIdeation,
      selfHarm,
      substanceUse: this.assessSubstanceRisk(responses),
      socialIsolation: this.assessSocialIsolation(responses),
      overallRisk,
      immediateIntervention,
      escalationRequired
    };
  }

  private assessSuicidalIdeation(
    responses: AssessmentResponse[],
    textResponses: string[]
  ): RiskLevel {
    // Check PHQ-9 item 9 (suicidal ideation)
    const suicideQuestionResponse = responses.find(r => 
      r.questionId.includes('phq9_item9') || r.questionId.includes('suicide')
    );

    if (suicideQuestionResponse && suicideQuestionResponse.selectedValue >= this.SEVERITY_THRESHOLDS.PHQ9_SUICIDE_ITEM) {
      return suicideQuestionResponse.selectedValue >= 3 ? 'severe' : 'high';
    }

    // Text analysis for suicide indicators
    const textRisk = this.analyzeTextForSuicidalContent(textResponses);
    if (textRisk === 'high' || textRisk === 'severe') {
      return textRisk;
    }

    return 'none';
  }

  private analyzeTextForSuicidalContent(textResponses: string[]): RiskLevel {
    const combinedText = textResponses.join(' ').toLowerCase();
    
    const severeCrisisIndicators = [
      'plan to kill myself', 'going to end it', 'suicide plan', 'tonight',
      'today', 'now', 'soon', 'have pills', 'have gun'
    ];

    const highRiskIndicators = [
      'want to die', 'wish I was dead', 'life not worth living',
      'everyone better without me', 'burden to others'
    ];

    if (severeCrisisIndicators.some(indicator => combinedText.includes(indicator))) {
      return 'severe';
    }

    if (highRiskIndicators.some(indicator => combinedText.includes(indicator)) ||
        this.CRISIS_KEYWORDS.some(keyword => combinedText.includes(keyword))) {
      return 'high';
    }

    return 'none';
  }

  private calculateSeverityScores(responses: AssessmentResponse[]): {
    depression: number;
    anxiety: number;
    combined: number;
  } {
    const phq9Responses = responses.filter(r => r.questionId.includes('phq9'));
    const gad7Responses = responses.filter(r => r.questionId.includes('gad7'));

    const depression = phq9Responses.reduce((sum, r) => sum + r.selectedValue, 0);
    const anxiety = gad7Responses.reduce((sum, r) => sum + r.selectedValue, 0);
    
    return {
      depression,
      anxiety,
      combined: depression + anxiety
    };
  }

  private requiresImmediateIntervention(overallRisk: RiskLevel): boolean {
    return overallRisk === 'severe';
  }

  private requiresEscalation(overallRisk: RiskLevel, severityScores: any): boolean {
    return overallRisk === 'high' || overallRisk === 'severe' ||
           severityScores.depression >= this.SEVERITY_THRESHOLDS.PHQ9_SEVERE ||
           severityScores.anxiety >= this.SEVERITY_THRESHOLDS.GAD7_SEVERE;
  }

  private assessSelfHarm(responses: AssessmentResponse[], textResponses: string[]): RiskLevel {
    // Implementation for self-harm assessment
    return 'none'; // Simplified for brevity
  }

  private assessSubstanceRisk(responses: AssessmentResponse[]): RiskLevel {
    // Implementation for substance use assessment
    return 'none'; // Simplified for brevity
  }

  private assessSocialIsolation(responses: AssessmentResponse[]): RiskLevel {
    // Implementation for social isolation assessment
    return 'none'; // Simplified for brevity
  }

  private calculateOverallRisk(factors: {
    suicidalIdeation: RiskLevel;
    selfHarm: RiskLevel;
    severityScores: any;
  }): RiskLevel {
    const riskScores = {
      'none': 0,
      'low': 1,
      'moderate': 2,
      'high': 3,
      'severe': 4
    };

    const maxRisk = Math.max(
      riskScores[factors.suicidalIdeation],
      riskScores[factors.selfHarm]
    );

    const riskLevels: RiskLevel[] = ['none', 'low', 'moderate', 'high', 'severe'];
    return riskLevels[maxRisk];
  }

  /**
   * Get immediate intervention resources
   */
  public getInterventionResources(riskLevel: RiskLevel): {
    hotlines: string[];
    emergencyContacts: string[];
    immediateActions: string[];
    followUpRequired: boolean;
  } {
    const baseResources: {
      hotlines: string[];
      emergencyContacts: string[];
      immediateActions: string[];
      followUpRequired: boolean;
    } = {
      hotlines: [
        '988 - Suicide & Crisis Lifeline',
        'Text HOME to 741741 - Crisis Text Line'
      ],
      emergencyContacts: ['911 - Emergency Services'],
      immediateActions: [],
      followUpRequired: true
    };

    if (riskLevel === 'severe') {
      baseResources.immediateActions = [
        'Contact emergency services immediately',
        'Do not leave the person alone',
        'Remove any means of self-harm',
        'Stay with them until professional help arrives'
      ];
    } else if (riskLevel === 'high') {
      baseResources.immediateActions = [
        'Contact a mental health professional today',
        'Reach out to a trusted friend or family member',
        'Call a crisis hotline for immediate support',
        'Consider going to an emergency room if thoughts intensify'
      ];
    }

    return baseResources;
  }
} 