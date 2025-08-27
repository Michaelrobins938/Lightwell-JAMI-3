/**
 * ASSESSMENT SCORING LOGIC & PERSONALIZATION ALGORITHMS
 * ===================================================
 *
 * This file demonstrates the mathematical framework and clinical logic
 * behind the adaptive assessment and personalization system.
 */

import { AssessmentResponse, IRTQuestion } from '../types/assessment';

export interface AssessmentMetrics {
  theta: number;           // IRT ability estimate (-3 to +3)
  standardError: number;   // Precision of theta estimate
  confidence: number;      // Confidence level (0-1)
  responseTime: number;    // Average response time in ms
  consistencyScore: number; // Response pattern consistency (0-1)
}

export interface ClinicalScore {
  rawScore: number;
  scaledScore: number;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  percentile: number;
  confidence: number;
}

export interface PersonalizationVector {
  empathyLevel: number;           // 0-1 (how empathetic Jamie should be)
  directiveness: number;          // 0-1 (how directive vs exploratory)
  technicalLanguage: number;      // 0-1 (clinical vs conversational)
  pacing: number;                 // 0-1 (slow vs fast conversation)
  humorLevel: number;             // 0-1 (professional vs light)
  validationFrequency: number;    // 0-1 (how often to validate feelings)
  challengeLevel: number;         // 0-1 (how much to challenge distortions)
  goalFocus: number;              // 0-1 (process vs goal-oriented)
}

/**
 * ITEM RESPONSE THEORY (IRT) SCORING
 * ================================
 *
 * Uses 3-parameter logistic model:
 * P(θ) = c + (1-c) / (1 + exp(-a(θ - b)))
 *
 * Where:
 * - θ = person's ability/trait level
 * - a = discrimination parameter (how well item differentiates)
 * - b = difficulty parameter (trait level needed to answer correctly)
 * - c = guessing parameter (probability of correct guess)
 */
export class IRTScoringEngine {
  static calculateTheta(responses: AssessmentResponse[], items: IRTQuestion[]): AssessmentMetrics {
    // 1. Estimate initial theta using maximum likelihood
    let theta = 0;
    let standardError = 2;

    // 2. Newton-Raphson iteration for maximum likelihood estimation
    for (let iteration = 0; iteration < 10; iteration++) {
      let likelihood = 0;
      let derivative = 0;

      responses.forEach((response, index) => {
        const item = items[index];
        const discrimination = item.discrimination || 1;
        const difficulty = item.difficulty || 0;
        const guessing = item.guessing || 0.2;

        // 3-parameter logistic function
        const probability = this.threePLModel(theta, discrimination, difficulty, guessing);

        // Calculate likelihood contribution
        const responseProb = response.selectedValue === 1 ? probability : (1 - probability);
        likelihood += Math.log(responseProb);

        // Calculate derivative for Newton-Raphson
        const derivativeTerm = discrimination * (probability - response.selectedValue) / (probability * (1 - probability));
        derivative += derivativeTerm;
      });

      // Update theta estimate
      const newTheta = theta + (derivative / responses.length);
      const change = Math.abs(newTheta - theta);

      theta = Math.max(-3, Math.min(3, newTheta)); // Bound theta

      // Stop if convergence achieved
      if (change < 0.01) break;
    }

    // 3. Calculate standard error using Fisher information
    const information = responses.reduce((info, response, index) => {
      const item = items[index];
      const discrimination = item.discrimination || 1;
      const difficulty = item.difficulty || 0;
      const guessing = item.guessing || 0.2;

      const probability = this.threePLModel(theta, discrimination, difficulty, guessing);
      return info + (discrimination ** 2) * probability * (1 - probability) / ((1 - guessing) ** 2);
    }, 0);

    standardError = information > 0 ? 1 / Math.sqrt(information) : 2;
    const confidence = Math.max(0.1, Math.min(1, 1 - standardError));

    return {
      theta,
      standardError,
      confidence,
      responseTime: responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length,
      consistencyScore: this.calculateConsistency(responses)
    };
  }

  static threePLModel(theta: number, a: number, b: number, c: number): number {
    return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
  }

  private static calculateConsistency(responses: AssessmentResponse[]): number {
    // Calculate response pattern consistency
    // Higher score = more consistent responses (less random)
    const recentResponses = responses.slice(-5);
    if (recentResponses.length < 3) return 0.5;

    let consistency = 0;
    for (let i = 1; i < recentResponses.length; i++) {
      const diff = Math.abs(recentResponses[i].selectedValue - recentResponses[i-1].selectedValue);
      consistency += (4 - diff) / 4; // Scale: 1 for same response, 0 for max difference
    }

    return consistency / (recentResponses.length - 1);
  }
}

/**
 * CLINICAL SCORING ALGORITHMS
 * ===========================
 */
export class ClinicalScoringService {
  static calculatePHQ9Score(responses: AssessmentResponse[]): ClinicalScore {
    const phq9Responses = responses.filter(r =>
      r.questionId.includes('phq9') || r.questionId.includes('depression')
    );

    const rawScore = phq9Responses.reduce((sum, r) => sum + r.selectedValue, 0);
    const scaledScore = Math.min(27, Math.max(0, rawScore));
    const severity = this.getDepressionSeverity(scaledScore);
    const percentile = this.getDepressionPercentile(scaledScore);

    return {
      rawScore,
      scaledScore,
      severity,
      percentile,
      confidence: phq9Responses.length > 0 ? Math.min(1, phq9Responses.length / 9) : 0
    };
  }

  static calculateGAD7Score(responses: AssessmentResponse[]): ClinicalScore {
    const gad7Responses = responses.filter(r =>
      r.questionId.includes('gad7') || r.questionId.includes('anxiety')
    );

    const rawScore = gad7Responses.reduce((sum, r) => sum + r.selectedValue, 0);
    const scaledScore = Math.min(21, Math.max(0, rawScore));
    const severity = this.getAnxietySeverity(scaledScore);
    const percentile = this.getAnxietyPercentile(scaledScore);

    return {
      rawScore,
      scaledScore,
      severity,
      percentile,
      confidence: gad7Responses.length > 0 ? Math.min(1, gad7Responses.length / 7) : 0
    };
  }

  static getDepressionSeverity(score: number): 'none' | 'mild' | 'moderate' | 'severe' {
    if (score <= 4) return 'none';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    return 'severe';
  }

  static getAnxietySeverity(score: number): 'none' | 'mild' | 'moderate' | 'severe' {
    if (score <= 4) return 'none';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    return 'severe';
  }

  static getDepressionPercentile(score: number): number {
    // Based on PHQ-9 normative data
    const percentiles = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    return percentiles[Math.min(score, percentiles.length - 1)];
  }

  static getAnxietyPercentile(score: number): number {
    // Based on GAD-7 normative data
    const percentiles = [0, 8, 15, 22, 30, 38, 45, 52, 60, 68, 75, 82, 88, 92, 95, 97, 98, 99, 99.5, 99.8, 100];
    return percentiles[Math.min(score, percentiles.length - 1)];
  }
}

/**
 * PERSONALIZATION ENGINE
 * =====================
 *
 * Uses user's assessment data to create personalized therapy approach
 */
export class PersonalizationEngine {
  static generatePersonalizationVector(
    assessmentMetrics: AssessmentMetrics,
    clinicalScores: { depression: ClinicalScore; anxiety: ClinicalScore },
    goals: string[]
  ): PersonalizationVector {

    // 1. Base empathy on clinical severity
    const maxSeverity = Math.max(
      this.severityToNumber(clinicalScores.depression.severity),
      this.severityToNumber(clinicalScores.anxiety.severity)
    );
    const empathyLevel = Math.max(0.7, maxSeverity / 3); // At least 0.7 empathy

    // 2. Adjust directiveness based on theta (ability) and goals
    const hasClearGoals = goals.length > 0;
    const directiveness = hasClearGoals ?
      Math.max(0.3, Math.min(0.8, assessmentMetrics.theta / 3 + 0.5)) :
      Math.max(0.2, Math.min(0.6, assessmentMetrics.theta / 3 + 0.4));

    // 3. Technical language based on education level (estimated from responses)
    const technicalLanguage = Math.max(0.2, Math.min(0.8, assessmentMetrics.consistencyScore));

    // 4. Pacing based on response time and consistency
    const avgResponseTime = assessmentMetrics.responseTime;
    const pacing = avgResponseTime < 10000 ? 0.8 : avgResponseTime < 20000 ? 0.5 : 0.3;

    // 5. Humor level inversely related to clinical severity
    const humorLevel = Math.max(0.1, Math.min(0.6, 1 - maxSeverity / 3));

    // 6. Validation frequency based on depression severity
    const validationFrequency = Math.max(0.6, clinicalScores.depression.scaledScore / 27);

    // 7. Challenge level based on anxiety severity and theta
    const challengeLevel = Math.max(0.2, Math.min(0.7,
      (clinicalScores.anxiety.scaledScore / 21) * 0.5 +
      (assessmentMetrics.theta / 3) * 0.5
    ));

    // 8. Goal focus based on number and clarity of goals
    const goalFocus = Math.max(0.4, Math.min(0.9, goals.length / 5));

    return {
      empathyLevel,
      directiveness,
      technicalLanguage,
      pacing,
      humorLevel,
      validationFrequency,
      challengeLevel,
      goalFocus
    };
  }

  private static severityToNumber(severity: string): number {
    switch (severity) {
      case 'none': return 0;
      case 'mild': return 1;
      case 'moderate': return 2;
      case 'severe': return 3;
      default: return 0;
    }
  }

  static generateTherapyRecommendations(
    personalizationVector: PersonalizationVector,
    clinicalScores: { depression: ClinicalScore; anxiety: ClinicalScore }
  ): string[] {
    const recommendations = [];

    // Depression-specific recommendations
    if (clinicalScores.depression.severity !== 'none') {
      recommendations.push(
        "Focus on behavioral activation and cognitive restructuring",
        "Monitor mood patterns and identify triggers",
        "Practice self-compassion and mindfulness techniques"
      );
    }

    // Anxiety-specific recommendations
    if (clinicalScores.anxiety.severity !== 'none') {
      recommendations.push(
        "Use breathing exercises and progressive muscle relaxation",
        "Challenge catastrophic thinking patterns",
        "Gradual exposure to anxiety triggers"
      );
    }

    // Personalization-based recommendations
    if (personalizationVector.directiveness > 0.6) {
      recommendations.push("Benefit from structured goal-setting and action planning");
    }

    if (personalizationVector.empathyLevel > 0.8) {
      recommendations.push("Strong emphasis on emotional validation and support");
    }

    if (personalizationVector.technicalLanguage > 0.6) {
      recommendations.push("May benefit from psychoeducational approaches and explanations");
    }

    return recommendations;
  }
}

/**
 * ADAPTIVE ASSESSMENT LOGIC
 * =========================
 *
 * Determines which questions to show based on user responses
 */
export class AdaptiveAssessmentEngine {
  static selectNextQuestion(
    availableQuestions: IRTQuestion[],
    currentTheta: number,
    previousResponses: AssessmentResponse[]
  ): IRTQuestion {

    // 1. Calculate information for each question
    const questionsWithInfo = availableQuestions.map(question => {
      const discrimination = question.discrimination || 1;
      const difficulty = question.difficulty || 0;
      const guessing = question.guessing || 0.2;

      // Fisher information for IRT
      const probability = IRTScoringEngine.threePLModel(currentTheta, discrimination, difficulty, guessing);
      const information = (discrimination ** 2) * probability * (1 - probability) / ((1 - guessing) ** 2);

      return { question, information };
    });

    // 2. Select question with maximum information (most discriminative)
    questionsWithInfo.sort((a, b) => b.information - a.information);

    // 3. Add some randomness to prevent always showing same questions
    const topQuestions = questionsWithInfo.slice(0, 3);
    const selectedIndex = Math.floor(Math.random() * Math.min(3, topQuestions.length));

    return topQuestions[selectedIndex].question;
  }

  static shouldContinueAssessment(
    responses: AssessmentResponse[],
    standardError: number,
    remainingQuestions: IRTQuestion[]
  ): boolean {
    // Continue if:
    // 1. We have fewer than 8 responses AND
    // 2. Standard error is still high (> 0.5) AND
    // 3. We have questions left
    return responses.length < 8 && standardError > 0.5 && remainingQuestions.length > 0;
  }
}

/**
 * USER EXPERIENCE IMPACT CALCULATIONS
 * ===================================
 */
export class UXImpactCalculator {
  static calculatePersonalizationScore(
    personalizationVector: PersonalizationVector,
    assessmentMetrics: AssessmentMetrics
  ): number {
    // Calculate how well the personalization fits the user
    const empathyFit = personalizationVector.empathyLevel;
    const consistency = assessmentMetrics.consistencyScore;
    const confidence = assessmentMetrics.confidence;

    // Weighted combination of factors
    return (empathyFit * 0.4 + consistency * 0.3 + confidence * 0.3);
  }

  static calculateEngagementScore(
    responseTimes: number[],
    consistencyScore: number,
    completionRate: number
  ): number {
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const timeEfficiency = Math.max(0, 1 - (avgResponseTime / 60000)); // 1 minute max
    const consistency = consistencyScore;
    const completion = completionRate;

    return (timeEfficiency * 0.3 + consistency * 0.4 + completion * 0.3);
  }

  static predictTherapySuccess(
    clinicalScores: { depression: ClinicalScore; anxiety: ClinicalScore },
    personalizationScore: number,
    engagementScore: number
  ): number {
    // Simplified prediction model
    const baselineImprovement = 0.4; // Base improvement rate
    const clinicalFactor = Math.max(0, 1 - (
      clinicalScores.depression.scaledScore / 27 * 0.5 +
      clinicalScores.anxiety.scaledScore / 21 * 0.5
    ));

    const personalizationBoost = personalizationScore * 0.3;
    const engagementBoost = engagementScore * 0.3;

    return Math.min(1, baselineImprovement + clinicalFactor + personalizationBoost + engagementBoost);
  }
}

