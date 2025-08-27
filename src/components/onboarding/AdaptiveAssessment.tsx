'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IRTQuestion, AssessmentResponse, ClinicalProfile } from '@/types/assessment';
import { AdaptiveAssessmentEngine } from '@/services/adaptiveAssessment';
import { CrisisDetectionService } from '@/services/crisisDetection';
import { BehavioralTracker } from './BehavioralTracker';
import { ProgressIndicator } from './ProgressIndicator';
import { QuestionCard } from './QuestionCard';
import { CrisisIntervention } from './CrisisIntervention';
import {
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  Brain,
  Shield,
  Lightbulb
} from 'lucide-react';

interface AdaptiveAssessmentProps {
  onComplete: (profile: ClinicalProfile) => void;
  onCrisisDetected: (riskAssessment: any) => void;
  questions: IRTQuestion[];
  className?: string;

}

export const AdaptiveAssessment: React.FC<AdaptiveAssessmentProps> = ({
  onComplete,
  onCrisisDetected,
  questions,
  className = ''
}) => {
  const [assessmentEngine] = useState(() => new AdaptiveAssessmentEngine());
  const [crisisService] = useState(() => new CrisisDetectionService());

  const [currentQuestion, setCurrentQuestion] = useState<IRTQuestion | null>(null);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [remainingQuestions, setRemainingQuestions] = useState<IRTQuestion[]>(questions);
  const [currentTheta, setCurrentTheta] = useState(0);
  const [standardError, setStandardError] = useState(2);
  const [confidence, setConfidence] = useState(0.1);
  const [isComplete, setIsComplete] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [startTime] = useState(Date.now());

  // Enhanced engagement features
  const [questionNumber, setQuestionNumber] = useState(1);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);

  // Encouragement messages
  const encouragementMessages = [
    "You're making great progress! 🌟",
    "Thanks for being open and honest 💝",
    "Every answer helps us understand you better 🧠",
    "You're doing amazing! Keep going! 🚀",
    "Your insights are valuable ✨",
    "You're helping us help you better 💪",
    "Great job staying with it! 🎯",
    "You're building a clearer picture 🌈",
    "Your courage inspires us 💖",
    "You're almost there! 🌟"
  ];

  // Initialize first question
  useEffect(() => {
    if (remainingQuestions.length > 0 && !currentQuestion && !isComplete) {
      const firstQuestion = assessmentEngine.selectNextQuestion(
        remainingQuestions,
        currentTheta,
        responses
      );
      setCurrentQuestion(firstQuestion);
    }
  }, [remainingQuestions, currentQuestion, isComplete, currentTheta, responses, assessmentEngine]);

  const handleResponse = useCallback(async (
    questionId: string,
    selectedValue: number,
    responseTime: number,
    behavioralMetrics: any
  ) => {
    const response: AssessmentResponse = {
      questionId,
      selectedValue,
      responseTime,
      confidence: confidence,
      behavioralMetrics,
      timestamp: new Date()
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    // Enhanced engagement tracking
    const newTotalAnswered = totalQuestionsAnswered + 1;
    setTotalQuestionsAnswered(newTotalAnswered);
    setQuestionNumber(prev => prev + 1);

    // Show encouragement every few questions
    if (newTotalAnswered % 5 === 0) {
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 3000);
    }

    // Track response streaks (responses under 30 seconds)
    if (responseTime < 30000) {
      setStreakCount(prev => prev + 1);
    } else {
      setStreakCount(0);
    }

    setLastResponseTime(responseTime);

    // Update IRT estimates
    const updatedEstimates = assessmentEngine.updateThetaEstimate(
      newResponses,
      questions.slice(0, newResponses.length)
    );

    setCurrentTheta(updatedEstimates.theta);
    setStandardError(updatedEstimates.standardError);
    setConfidence(updatedEstimates.confidence);

    // Crisis detection
    const riskAssessment = crisisService.assessCrisisRisk(newResponses);
    if (riskAssessment.immediateIntervention) {
      setCrisisDetected(true);
      onCrisisDetected(riskAssessment);
      return;
    }

    // Update remaining questions
    const newRemainingQuestions = remainingQuestions.filter(q => q.id !== questionId);
    setRemainingQuestions(newRemainingQuestions);

    // Check if assessment should continue
    const shouldContinue = assessmentEngine.shouldContinueAssessment(
      newResponses,
      updatedEstimates.standardError,
      newRemainingQuestions
    );

    if (!shouldContinue) {
      // Assessment complete
      setIsComplete(true);
      
      const clinicalProfile: ClinicalProfile = {
        depressionScore: calculatePHQ9Score(newResponses),
        anxietyScore: calculateGAD7Score(newResponses),
        stressLevel: calculateStressLevel(newResponses),
        cognitivePatterns: [],
        riskFactors: [],
        protectiveFactors: [],
        currentTheta: updatedEstimates.theta,
        standardError: updatedEstimates.standardError
      };

      onComplete(clinicalProfile);
    } else {
      // Select next question
      const nextQuestion = assessmentEngine.selectNextQuestion(
        newRemainingQuestions,
        updatedEstimates.theta,
        newResponses
      );
      setCurrentQuestion(nextQuestion);
    }
  }, [responses, remainingQuestions, confidence, questions, assessmentEngine, crisisService, onComplete, onCrisisDetected]);

  if (crisisDetected) {
    return <CrisisIntervention />;
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-4">Assessment Complete!</h2>
        <p className="text-gray-600 mb-6">Thank you for completing your personalized assessment.</p>
        <p className="text-gray-500 mb-8">This helps us provide you with the most appropriate support and resources.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/chat'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
          >
            <span>Continue to AI Therapy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
          >
            View Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const progress = questions.length > 0 ? (responses.length / Math.min(25, questions.length)) * 100 : 0;

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Enhanced Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Background glow effect */}
          <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl" />

          {/* Header Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Personal Assessment</h2>
                  <p className="text-slate-300 text-sm">Understanding your unique needs</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Question {questionNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round((Date.now() - startTime) / 1000 / 60)}m</span>
                </div>
                {streakCount > 2 && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Streak: {streakCount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Progress</span>
                <span className="text-sm text-emerald-400 font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <span>{responses.length} completed</span>
                <span>~{Math.max(5, Math.min(15, remainingQuestions.length))} remaining</span>
              </div>
            </div>

            {/* Encouragement Messages */}
            <AnimatePresence>
              {showEncouragement && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
                >
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">
                      {encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Question Area */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative">
              {/* Background glow for question */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 rounded-3xl blur-2xl opacity-50" />

              <div className="relative bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">
                <BehavioralTracker questionId={currentQuestion.id}>
                  <QuestionCard
                    question={currentQuestion}
                    onResponse={handleResponse}
                    questionNumber={responses.length + 1}
                    totalEstimated={Math.min(25, Math.max(8, 15 - Math.floor(confidence * 7)))}
                  />
                </BehavioralTracker>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Progress Indicator */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <motion.div
          className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{Math.round(progress)}%</div>
            <div className="text-xs text-slate-400">Complete</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper functions
function calculatePHQ9Score(responses: AssessmentResponse[]): number {
  return responses
    .filter(r => r.questionId.includes('phq9'))
    .reduce((sum, r) => sum + r.selectedValue, 0);
}

function calculateGAD7Score(responses: AssessmentResponse[]): number {
  return responses
    .filter(r => r.questionId.includes('gad7'))
    .reduce((sum, r) => sum + r.selectedValue, 0);
}

function calculateStressLevel(responses: AssessmentResponse[]): number {
  // Simplified stress calculation
  return responses
    .filter(r => r.questionId.includes('stress'))
    .reduce((sum, r) => sum + r.selectedValue, 0);
} 