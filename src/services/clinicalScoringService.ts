import { AssessmentResponse, ClinicalScores, RiskAssessment, RiskLevel } from '@/types/assessment';

export class ClinicalScoringService {
  
  /**
   * Calculate comprehensive clinical scores from assessment responses
   */
  static calculateClinicalScores(responses: AssessmentResponse[]): ClinicalScores {
    const phq9Items = responses.filter(r => r.questionId.includes('phq9_item'));
    const gad7Items = responses.filter(r => r.questionId.includes('gad7_item'));
    const traumaItems = responses.filter(r => r.questionId.includes('ptsd_'));
    const substanceItems = responses.filter(r => r.questionId.includes('alcohol_') || r.questionId.includes('substance_'));
    const sleepItems = responses.filter(r => r.questionId.includes('sleep_'));
    const socialItems = responses.filter(r => r.questionId.includes('social_') || r.questionId.includes('isolation_'));
    const stressItems = responses.filter(r => r.questionId.includes('stress_'));
    
    return {
      depression: {
        score: this.calculatePHQ9Score(phq9Items),
        severity: this.getDepressionSeverity(this.calculatePHQ9Score(phq9Items)),
        subscales: this.calculateDepressionSubscales(phq9Items)
      },
      anxiety: {
        score: this.calculateGAD7Score(gad7Items),
        severity: this.getAnxietySeverity(this.calculateGAD7Score(gad7Items))
      },
      trauma: {
        score: this.calculateTraumaScore(traumaItems),
        severity: this.getTraumaSeverity(this.calculateTraumaScore(traumaItems)),
        clusterScores: this.calculateTraumaClusterScores(traumaItems)
      },
      functionalImpairment: this.calculateFunctionalImpairment(responses),
      protectiveFactors: this.calculateProtectiveFactors(responses),
      riskFactors: this.calculateRiskFactors(responses)
    };
  }

  /**
   * Calculate PHQ-9 depression score
   */
  static calculatePHQ9Score(responses: AssessmentResponse[]): number {
    return responses.reduce((sum, response) => sum + response.selectedValue, 0);
  }

  /**
   * Calculate GAD-7 anxiety score
   */
  static calculateGAD7Score(responses: AssessmentResponse[]): number {
    return responses.reduce((sum, response) => sum + response.selectedValue, 0);
  }

  /**
   * Calculate trauma score from PCL-5 items
   */
  static calculateTraumaScore(responses: AssessmentResponse[]): number {
    return responses.reduce((sum, response) => sum + response.selectedValue, 0);
  }

  /**
   * Calculate depression subscales
   */
  static calculateDepressionSubscales(responses: AssessmentResponse[]): {
    somaticSymptoms: number;
    cognitiveSymptoms: number;
    affectiveSymptoms: number;
  } {
    const somaticItems = responses.filter(r => 
      r.questionId.includes('phq9_item3') || // sleep
      r.questionId.includes('phq9_item4') || // energy
      r.questionId.includes('phq9_item5')    // appetite
    );
    
    const cognitiveItems = responses.filter(r => 
      r.questionId.includes('phq9_item6') || // self-worth
      r.questionId.includes('phq9_item7')    // concentration
    );
    
    const affectiveItems = responses.filter(r => 
      r.questionId.includes('phq9_item1') || // anhedonia
      r.questionId.includes('phq9_item2') || // mood
      r.questionId.includes('phq9_item9')    // suicidality
    );

    return {
      somaticSymptoms: somaticItems.reduce((sum, r) => sum + r.selectedValue, 0),
      cognitiveSymptoms: cognitiveItems.reduce((sum, r) => sum + r.selectedValue, 0),
      affectiveSymptoms: affectiveItems.reduce((sum, r) => sum + r.selectedValue, 0)
    };
  }

  /**
   * Calculate trauma cluster scores
   */
  static calculateTraumaClusterScores(responses: AssessmentResponse[]): {
    intrusion: number;
    avoidance: number;
    negativeMood: number;
    arousal: number;
  } {
    const intrusionItems = responses.filter(r => r.questionId.includes('intrusion'));
    const avoidanceItems = responses.filter(r => r.questionId.includes('avoidance'));
    const negativeMoodItems = responses.filter(r => r.questionId.includes('negative_mood'));
    const arousalItems = responses.filter(r => r.questionId.includes('arousal'));

    return {
      intrusion: intrusionItems.reduce((sum, r) => sum + r.selectedValue, 0),
      avoidance: avoidanceItems.reduce((sum, r) => sum + r.selectedValue, 0),
      negativeMood: negativeMoodItems.reduce((sum, r) => sum + r.selectedValue, 0),
      arousal: arousalItems.reduce((sum, r) => sum + r.selectedValue, 0)
    };
  }

  /**
   * Calculate functional impairment score
   */
  static calculateFunctionalImpairment(responses: AssessmentResponse[]): number {
    const workItems = responses.filter(r => r.questionId.includes('work_functioning'));
    const socialItems = responses.filter(r => r.questionId.includes('social_'));
    
    const workScore = workItems.reduce((sum, r) => sum + r.selectedValue, 0);
    const socialScore = socialItems.reduce((sum, r) => sum + r.selectedValue, 0);
    
    return (workScore + socialScore) / 2;
  }

  /**
   * Calculate protective factors score
   */
  static calculateProtectiveFactors(responses: AssessmentResponse[]): number {
    const meaningItems = responses.filter(r => r.questionId.includes('meaning_purpose'));
    const efficacyItems = responses.filter(r => r.questionId.includes('self_efficacy'));
    const supportItems = responses.filter(r => r.questionId.includes('social_support'));
    
    const meaningScore = meaningItems.reduce((sum, r) => sum + r.selectedValue, 0);
    const efficacyScore = efficacyItems.reduce((sum, r) => sum + r.selectedValue, 0);
    const supportScore = supportItems.reduce((sum, r) => sum + r.selectedValue, 0);
    
    return (meaningScore + efficacyScore + supportScore) / 3;
  }

  /**
   * Calculate risk factors score
   */
  static calculateRiskFactors(responses: AssessmentResponse[]): number {
    const suicideItems = responses.filter(r => r.questionId.includes('suicide'));
    const selfHarmItems = responses.filter(r => r.questionId.includes('selfharm'));
    const substanceItems = responses.filter(r => r.questionId.includes('substance') || r.questionId.includes('alcohol'));
    const isolationItems = responses.filter(r => r.questionId.includes('isolation'));
    
    const suicideScore = suicideItems.reduce((sum, r) => sum + r.selectedValue, 0);
    const selfHarmScore = selfHarmItems.reduce((sum, r) => sum + r.selectedValue, 0);
    const substanceScore = substanceItems.reduce((sum, r) => sum + r.selectedValue, 0);
    const isolationScore = isolationItems.reduce((sum, r) => sum + r.selectedValue, 0);
    
    return (suicideScore + selfHarmScore + substanceScore + isolationScore) / 4;
  }

  /**
   * Assess risk levels for crisis intervention
   */
  static assessRiskLevels(responses: AssessmentResponse[]): RiskAssessment {
    const suicideItems = responses.filter(r => r.questionId.includes('suicide'));
    const selfHarmItems = responses.filter(r => r.questionId.includes('selfharm'));
    const substanceItems = responses.filter(r => r.questionId.includes('substance') || r.questionId.includes('alcohol'));
    const isolationItems = responses.filter(r => r.questionId.includes('isolation'));
    
    const suicidalIdeation = this.calculateRiskLevel(suicideItems);
    const selfHarm = this.calculateRiskLevel(selfHarmItems);
    const substanceUse = this.calculateRiskLevel(substanceItems);
    const socialIsolation = this.calculateRiskLevel(isolationItems);
    
    const overallRisk = this.calculateOverallRisk({
      suicidalIdeation,
      selfHarm,
      substanceUse,
      socialIsolation
    });
    
    return {
      suicidalIdeation,
      selfHarm,
      substanceUse,
      socialIsolation,
      overallRisk,
      immediateIntervention: overallRisk === 'severe' || suicidalIdeation === 'severe',
      escalationRequired: overallRisk === 'high' || overallRisk === 'severe'
    };
  }

  /**
   * Calculate individual risk level
   */
  private static calculateRiskLevel(responses: AssessmentResponse[]): RiskLevel {
    if (responses.length === 0) return 'none';
    
    const maxScore = responses.reduce((max, r) => Math.max(max, r.selectedValue), 0);
    const totalScore = responses.reduce((sum, r) => sum + r.selectedValue, 0);
    
    if (maxScore >= 3) return 'severe';
    if (maxScore >= 2 || totalScore >= 4) return 'high';
    if (maxScore >= 1 || totalScore >= 2) return 'moderate';
    if (totalScore >= 1) return 'low';
    return 'none';
  }

  /**
   * Calculate overall risk level
   */
  private static calculateOverallRisk(risks: {
    suicidalIdeation: RiskLevel;
    selfHarm: RiskLevel;
    substanceUse: RiskLevel;
    socialIsolation: RiskLevel;
  }): RiskLevel {
    const riskValues = {
      'none': 0,
      'low': 1,
      'moderate': 2,
      'high': 3,
      'severe': 4
    };
    
    const maxRisk = Math.max(
      riskValues[risks.suicidalIdeation],
      riskValues[risks.selfHarm],
      riskValues[risks.substanceUse],
      riskValues[risks.socialIsolation]
    );
    
    if (maxRisk >= 4) return 'severe';
    if (maxRisk >= 3) return 'high';
    if (maxRisk >= 2) return 'moderate';
    if (maxRisk >= 1) return 'low';
    return 'none';
  }

  /**
   * Get depression severity level
   */
  static getDepressionSeverity(score: number): 'minimal' | 'mild' | 'moderate' | 'severe' {
    if (score <= 4) return 'minimal';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    return 'severe';
  }

  /**
   * Get anxiety severity level
   */
  static getAnxietySeverity(score: number): 'minimal' | 'mild' | 'moderate' | 'severe' {
    if (score <= 4) return 'minimal';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    return 'severe';
  }

  /**
   * Get trauma severity level
   */
  static getTraumaSeverity(score: number): 'minimal' | 'mild' | 'moderate' | 'severe' {
    if (score <= 10) return 'minimal';
    if (score <= 20) return 'mild';
    if (score <= 30) return 'moderate';
    return 'severe';
  }

  /**
   * Generate clinical recommendations based on scores
   */
  static generateRecommendations(scores: ClinicalScores, riskAssessment: RiskAssessment): string[] {
    const recommendations: string[] = [];
    
    // Depression recommendations
    if (scores.depression.severity === 'severe') {
      recommendations.push('Immediate professional evaluation recommended for severe depression symptoms');
    } else if (scores.depression.severity === 'moderate') {
      recommendations.push('Consider professional therapy for moderate depression symptoms');
    }
    
    // Anxiety recommendations
    if (scores.anxiety.severity === 'severe') {
      recommendations.push('Professional anxiety treatment recommended');
    } else if (scores.anxiety.severity === 'moderate') {
      recommendations.push('Consider anxiety management techniques and therapy');
    }
    
    // Trauma recommendations
    if (scores.trauma.severity === 'severe' || scores.trauma.severity === 'moderate') {
      recommendations.push('Trauma-informed therapy recommended');
    }
    
    // Crisis recommendations
    if (riskAssessment.immediateIntervention) {
      recommendations.push('CRISIS: Immediate professional intervention required');
      recommendations.push('Contact crisis hotline or emergency services if needed');
    }
    
    // Protective factors
    if (scores.protectiveFactors < 2) {
      recommendations.push('Focus on building social support and meaning in life');
    }
    
    return recommendations;
  }
} 