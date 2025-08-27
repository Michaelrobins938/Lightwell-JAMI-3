import { IRTQuestion, AssessmentResponse, ClinicalProfile } from '../types/assessment';

export class AdaptiveAssessmentEngine {
  private readonly THETA_MIN = -4;
  private readonly THETA_MAX = 4;
  private readonly STANDARD_ERROR_THRESHOLD = 0.32; // Clinical precision threshold
  private readonly MAX_QUESTIONS = 25;
  private readonly MIN_QUESTIONS = 8;

  /**
   * Item Response Theory 3-Parameter Logistic Model
   * P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))
   */
  private calculateItemProbability(theta: number, question: IRTQuestion): number {
    const { difficulty, discrimination, guessing } = question;
    const exponent = -discrimination * (theta - difficulty);
    return guessing + (1 - guessing) / (1 + Math.exp(exponent));
  }

  /**
   * Fisher Information Function for IRT
   * I(θ) = a²(1-c)² * e^(-a(θ-b)) / [c*e^(-a(θ-b)) + 1]²
   */
  private calculateInformation(theta: number, question: IRTQuestion): number {
    const { difficulty, discrimination, guessing } = question;
    const prob = this.calculateItemProbability(theta, question);
    const qMinusC = prob - guessing;
    const oneMinusC = 1 - guessing;
    
    if (oneMinusC === 0) return 0;
    
    return Math.pow(discrimination, 2) * Math.pow(qMinusC, 2) * (1 - prob) / 
           (Math.pow(oneMinusC, 2) * prob);
  }

  /**
   * Select next optimal question using Maximum Information Criterion
   */
  public selectNextQuestion(
    remainingQuestions: IRTQuestion[],
    currentTheta: number,
    responses: AssessmentResponse[]
  ): IRTQuestion | null {
    
    if (remainingQuestions.length === 0) return null;

    // Calculate information for each remaining question
    const questionInfos = remainingQuestions.map(question => ({
      question,
      information: this.calculateInformation(currentTheta, question),
      exposure: this.calculateExposureControl(question, responses)
    }));

    // Apply exposure control and select highest information question
    const validQuestions = questionInfos.filter(q => q.exposure < 0.8);
    const targetQuestions = validQuestions.length > 0 ? validQuestions : questionInfos;
    
    return targetQuestions.reduce((best, current) => 
      current.information > best.information ? current : best
    ).question;
  }

  /**
   * Update theta estimate using Maximum Likelihood Estimation
   */
  public updateThetaEstimate(
    responses: AssessmentResponse[],
    questions: IRTQuestion[]
  ): { theta: number; standardError: number; confidence: number } {
    
    if (responses.length === 0) {
      return { theta: 0, standardError: 2, confidence: 0.1 };
    }

    let theta = 0; // Starting estimate
    const maxIterations = 50;
    const tolerance = 0.001;

    // Newton-Raphson method for MLE
    for (let iter = 0; iter < maxIterations; iter++) {
      let logLikelihoodDerivative = 0;
      let secondDerivative = 0;

      responses.forEach((response, index) => {
        const question = questions[index];
        const prob = this.calculateItemProbability(theta, question);
        const isCorrect = response.selectedValue > question.responseOptions[0].value;
        
        logLikelihoodDerivative += question.discrimination * 
          (isCorrect ? (1 - prob) : -prob);
        
        secondDerivative -= Math.pow(question.discrimination, 2) * 
          prob * (1 - prob);
      });

      if (Math.abs(logLikelihoodDerivative) < tolerance) break;
      
      const deltaTheta = -logLikelihoodDerivative / secondDerivative;
      theta += deltaTheta;
      
      // Constrain theta to reasonable bounds
      theta = Math.max(this.THETA_MIN, Math.min(this.THETA_MAX, theta));
    }

    // Calculate standard error
    const information = responses.reduce((sum, response, index) => {
      return sum + this.calculateInformation(theta, questions[index]);
    }, 0);

    const standardError = information > 0 ? 1 / Math.sqrt(information) : 2;
    const confidence = 1 - (standardError / 2); // Normalize to 0-1

    return { theta, standardError, confidence };
  }

  /**
   * Determine if assessment should continue
   */
  public shouldContinueAssessment(
    responses: AssessmentResponse[],
    standardError: number,
    remainingQuestions: IRTQuestion[]
  ): boolean {
    const hasMinQuestions = responses.length >= this.MIN_QUESTIONS;
    const hasMaxQuestions = responses.length >= this.MAX_QUESTIONS;
    const hasPrecision = standardError <= this.STANDARD_ERROR_THRESHOLD;
    const hasQuestions = remainingQuestions.length > 0;

    return !hasMaxQuestions && hasQuestions && (!hasMinQuestions || !hasPrecision);
  }

  private calculateExposureControl(question: IRTQuestion, responses: AssessmentResponse[]): number {
    // Simple exposure control - in production, this would use historical data
    const totalAssessments = 1000; // Mock total assessments
    const questionUsage = 100; // Mock usage count
    return questionUsage / totalAssessments;
  }
} 