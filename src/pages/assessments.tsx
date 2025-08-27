import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle, Clock, FileText, Play, User, AlertTriangle, Heart, ArrowLeft, ChevronRight, RotateCcw, MessageCircle } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { useRouter } from 'next/router';

interface AssessmentResult {
  id: string;
  type: string;
  createdAt: string;
  results?: {
    score: number;
    severity?: string;
    level?: string;
    interpretation: string;
    percentage?: number;
  };
}

interface Question {
  text: string;
  options: { value: number; label: string }[];
}

interface AssessmentDefinition {
  id: string;
  name: string;
  description: string;
  duration: string;
  questions: Question[];
  category: string;
  icon: React.ReactNode;
  color: string;
  instructions: string;
}

const assessmentDefinitions: AssessmentDefinition[] = [
  {
    id: 'phq-9',
    name: 'PHQ-9 Depression Screen',
    description: 'Patient Health Questionnaire for depression screening',
    duration: '5 minutes',
    category: 'Depression',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-blue-500 to-indigo-500',
    instructions: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    questions: [
      {
        text: 'Little interest or pleasure in doing things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Feeling down, depressed, or hopeless',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Trouble falling or staying asleep, or sleeping too much',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Feeling tired or having little energy',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Poor appetite or overeating',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Feeling bad about yourself or that you are a failure',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Trouble concentrating on things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Moving or speaking slowly, or being fidgety or restless',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Thoughts that you would be better off dead',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      }
    ]
  },
  {
    id: 'gad-7',
    name: 'GAD-7 Anxiety Assessment',
    description: 'Generalized Anxiety Disorder 7-item scale',
    duration: '3 minutes',
    category: 'Anxiety',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    instructions: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
    questions: [
      {
        text: 'Feeling nervous, anxious or on edge',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Not being able to stop or control worrying',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Worrying too much about different things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Trouble relaxing',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Being so restless that it is hard to sit still',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Becoming easily annoyed or irritable',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        text: 'Feeling afraid as if something awful might happen',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      }
    ]
  },
  {
    id: 'stress-scale',
    name: 'Perceived Stress Scale',
    description: 'Measure your current stress levels and coping ability',
    duration: '7 minutes',
    category: 'Stress',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'from-red-500 to-pink-500',
    instructions: 'In the last month, how often have you...',
    questions: [
      {
        text: 'Been upset because of something that happened unexpectedly?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      },
      {
        text: 'Felt that you were unable to control important things in your life?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      },
      {
        text: 'Felt nervous and stressed?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      },
      {
        text: 'Felt confident about your ability to handle personal problems?',
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly often' },
          { value: 0, label: 'Very often' }
        ]
      },
      {
        text: 'Felt that things were going your way?',
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly often' },
          { value: 0, label: 'Very often' }
        ]
      },
      {
        text: 'Found that you could not cope with all the things you had to do?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      },
      {
        text: 'Been able to control irritations in your life?',
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly often' },
          { value: 0, label: 'Very often' }
        ]
      },
      {
        text: 'Felt that you were on top of things?',
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly often' },
          { value: 0, label: 'Very often' }
        ]
      },
      {
        text: 'Been angered because of things outside of your control?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      },
      {
        text: 'Felt difficulties were piling up so high you could not overcome them?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      }
    ]
  },
  {
    id: 'wellness-check',
    name: 'General Wellness Check',
    description: 'Comprehensive assessment of your overall mental wellness',
    duration: '6 minutes',
    category: 'Wellness',
    icon: <User className="w-6 h-6" />,
    color: 'from-green-500 to-teal-500',
    instructions: 'How would you rate the following aspects of your life right now?',
    questions: [
      {
        text: 'Overall life satisfaction',
        options: [
          { value: 0, label: 'Very dissatisfied' },
          { value: 1, label: 'Dissatisfied' },
          { value: 2, label: 'Neutral' },
          { value: 3, label: 'Satisfied' },
          { value: 4, label: 'Very satisfied' }
        ]
      },
      {
        text: 'Physical health and energy levels',
        options: [
          { value: 0, label: 'Very poor' },
          { value: 1, label: 'Poor' },
          { value: 2, label: 'Fair' },
          { value: 3, label: 'Good' },
          { value: 4, label: 'Excellent' }
        ]
      },
      {
        text: 'Emotional well-being and mood',
        options: [
          { value: 0, label: 'Very poor' },
          { value: 1, label: 'Poor' },
          { value: 2, label: 'Fair' },
          { value: 3, label: 'Good' },
          { value: 4, label: 'Excellent' }
        ]
      },
      {
        text: 'Relationships and social connections',
        options: [
          { value: 0, label: 'Very poor' },
          { value: 1, label: 'Poor' },
          { value: 2, label: 'Fair' },
          { value: 3, label: 'Good' },
          { value: 4, label: 'Excellent' }
        ]
      },
      {
        text: 'Work or school performance',
        options: [
          { value: 0, label: 'Very poor' },
          { value: 1, label: 'Poor' },
          { value: 2, label: 'Fair' },
          { value: 3, label: 'Good' },
          { value: 4, label: 'Excellent' }
        ]
      },
      {
        text: 'Sleep quality',
        options: [
          { value: 0, label: 'Very poor' },
          { value: 1, label: 'Poor' },
          { value: 2, label: 'Fair' },
          { value: 3, label: 'Good' },
          { value: 4, label: 'Excellent' }
        ]
      },
      {
        text: 'Stress management abilities',
        options: [
          { value: 0, label: 'Very poor' },
          { value: 1, label: 'Poor' },
          { value: 2, label: 'Fair' },
          { value: 3, label: 'Good' },
          { value: 4, label: 'Excellent' }
        ]
      },
      {
        text: 'Self-care and personal time',
        options: [
          { value: 0, label: 'Very poor' },
          { value: 1, label: 'Poor' },
          { value: 2, label: 'Fair' },
          { value: 3, label: 'Good' },
          { value: 4, label: 'Excellent' }
        ]
      }
    ]
  }
];

export default function Assessments() {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentDefinition | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [previousResults, setPreviousResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadPreviousResults = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch('/api/assessments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPreviousResults(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load assessment results:', error);
    }
  }, []);

  useEffect(() => {
    loadPreviousResults();
  }, [loadPreviousResults]);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const startAssessment = (assessment: AssessmentDefinition) => {
    setSelectedAssessment(assessment);
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
    setResult(null);
  };

  const answerQuestion = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < selectedAssessment!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeAssessment(newAnswers);
    }
  };

  const completeAssessment = async (finalAnswers: number[]) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please log in to save assessment results');
        return;
      }

      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedAssessment!.id,
          answers: finalAnswers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.data.results);
        setIsCompleted(true);
        
        // Store assessment completion status for chat interface
        localStorage.setItem('assessmentCompleted', 'true');
        localStorage.setItem('assessmentResult', JSON.stringify(data.data.results));
        
        loadPreviousResults(); // Refresh the results list
      }
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
    setResult(null);
  };

  const getResultColor = (result: any) => {
    if (result.severity) {
      if (result.severity === 'Severe') return 'text-red-400';
      if (result.severity === 'Moderately Severe' || result.severity === 'Moderate') return 'text-orange-400';
      if (result.severity === 'Mild') return 'text-yellow-400';
      return 'text-green-400';
    }
    if (result.level) {
      if (result.level === 'Poor') return 'text-red-400';
      if (result.level === 'Fair') return 'text-orange-400';
      if (result.level === 'Good') return 'text-yellow-400';
      return 'text-green-400';
    }
    return 'text-blue-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Processing your assessment...</div>
      </div>
    );
  }

  if (selectedAssessment && !isCompleted) {
    return (
      <>
        <Head>
          <title>{selectedAssessment.name} - Luna Mental Health</title>
          <meta name="description" content={selectedAssessment.description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <main className="pt-20 pb-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-8">
                <button
                  onClick={resetAssessment}
                  className="flex items-center space-x-2 text-slate-400 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Assessments</span>
                </button>
                
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">{selectedAssessment.name}</h1>
                  <div className="flex items-center justify-center space-x-4 text-slate-300">
                    <span>Question {currentQuestion + 1} of {selectedAssessment.questions.length}</span>
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / selectedAssessment.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
                >
                  {currentQuestion === 0 && (
                    <div className="text-center mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <p className="text-blue-300 text-sm font-medium">{selectedAssessment.instructions}</p>
                    </div>
                  )}
                  
                  <h2 className="text-xl font-semibold text-white mb-6">
                    {selectedAssessment.questions[currentQuestion].text}
                  </h2>
                  
                  <div className="space-y-3">
                    {selectedAssessment.questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => answerQuestion(option.value)}
                        className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 rounded-xl transition-all hover:scale-[1.02] group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-slate-200 group-hover:text-white">{option.label}</span>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (isCompleted && result) {
    return (
      <>
        <Head>
          <title>Assessment Results - Luna Mental Health</title>
          <meta name="description" content="Your assessment results and recommendations" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <main className="pt-20 pb-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Assessment Complete</h1>
                <p className="text-slate-300">Here are your results for {selectedAssessment?.name}</p>
              </div>

              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white mb-2">
                    {result.score}
                    {result.percentage && <span className="text-xl text-slate-400">%</span>}
                  </div>
                  <div className={`text-xl font-semibold ${getResultColor(result)} mb-4`}>
                    {result.severity || result.level}
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {result.interpretation}
                  </p>
                </div>

                {(result.severity === 'Severe' || result.severity === 'Moderately Severe') && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-red-300">Important Notice</h3>
                        <p className="text-red-200 text-sm">
                          Your results suggest you may benefit from professional support. Consider reaching out to a mental health professional for further evaluation and guidance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => router.push('/chat')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Start AI Therapy Chat</span>
                  </button>
                  <button
                    onClick={resetAssessment}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Take Another Assessment
                  </button>
                  <button
                    onClick={() => startAssessment(selectedAssessment!)}
                    className="flex items-center space-x-2 bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-slate-600 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Mental Health Assessments - Luna Mental Health</title>
        <meta name="description" content="Take validated mental health assessments to understand your wellbeing and get personalized insights." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <main className="pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
                  <BarChart3 className="w-12 h-12 text-purple-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Mental Health Assessments
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Take clinically validated assessments to better understand your mental health and track your progress over time.
              </p>
            </motion.div>

            {/* Assessment Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
              {assessmentDefinitions.map((assessment, index) => (
                <motion.div
                  key={assessment.id}
                  className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all cursor-pointer group hover:scale-[1.02]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => startAssessment(assessment)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 bg-gradient-to-br ${assessment.color} bg-opacity-20 rounded-xl flex-shrink-0`}>
                      {assessment.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {assessment.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400 text-sm">{assessment.duration}</span>
                        </div>
                      </div>
                      <p className="text-slate-300 mb-4 leading-relaxed">{assessment.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="px-3 py-1 bg-slate-700/50 rounded-full text-slate-300 text-sm">
                            {assessment.category}
                          </span>
                          <span className="text-slate-400 text-sm">
                            {assessment.questions.length} questions
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-purple-400 group-hover:text-purple-300">
                          <Play className="w-4 h-4" />
                          <span className="text-sm font-semibold">Start</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Previous Results */}
            {previousResults.length > 0 && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Your Recent Results</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {previousResults.slice(0, 6).map((result) => (
                    <div
                      key={result.id}
                      className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white capitalize">
                          {result.type.replace('-', ' ')}
                        </h3>
                        <span className="text-slate-400 text-sm">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {result.results && (
                        <div>
                          <div className="text-2xl font-bold text-white mb-1">
                            {result.results.score}
                            {result.results.percentage && '%'}
                          </div>
                          <div className={`text-sm font-semibold ${getResultColor(result.results)}`}>
                            {result.results.severity || result.results.level}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Disclaimer */}
            <motion.div
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">Important Disclaimer</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    These assessments are for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. 
                    If you're experiencing thoughts of self-harm or are in crisis, please contact emergency services or a crisis hotline immediately.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}