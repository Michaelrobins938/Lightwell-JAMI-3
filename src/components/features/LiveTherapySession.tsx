import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TherapyStep {
  id: string;
  type: 'assessment' | 'intervention' | 'response' | 'technique';
  content: string;
  technique?: string;
  confidence: number;
  timestamp: Date;
  emotionalState: string;
  crisisLevel: 'none' | 'low' | 'medium' | 'high';
}

interface UserInput {
  id: string;
  text: string;
  emotionalTone: string;
  urgency: number;
  timestamp: Date;
}

const sampleUserInputs = [
  "I've been feeling really anxious about work lately. Every morning I wake up with this knot in my stomach.",
  "My relationship with my partner has been strained. We keep having the same arguments over and over.",
  "I'm having trouble sleeping. My mind just won't shut off at night.",
  "I feel like I'm not making progress. Sometimes I wonder if therapy is even helping.",
  "I had a panic attack yesterday. It was really scary and I don't know what triggered it.",
  "I'm feeling overwhelmed by everything. Work, family, health - it's all too much right now."
];

const therapeuticTechniques = [
  'Cognitive Restructuring',
  'Mindfulness Meditation',
  'Progressive Muscle Relaxation',
  'Exposure Therapy',
  'Behavioral Activation',
  'Emotion Regulation Skills',
  'Distress Tolerance',
  'Values Clarification'
];

export default function LiveTherapySession() {
  const [therapySteps, setTherapySteps] = useState<TherapyStep[]>([]);
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [currentStep, setCurrentStep] = useState<TherapyStep | null>(null);
  const [sessionProgress, setSessionProgress] = useState(0);

  // Simulate live therapy session
  useEffect(() => {
    if (!isActive) return;

    const generateTherapyStep = () => {
      const stepTypes: TherapyStep['type'][] = ['assessment', 'intervention', 'response', 'technique'];
      const emotionalStates = ['anxious', 'depressed', 'stressed', 'overwhelmed', 'hopeful', 'confused'];
      const crisisLevels: TherapyStep['crisisLevel'][] = ['none', 'low', 'medium', 'high'];

      const step: TherapyStep = {
        id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: stepTypes[Math.floor(Math.random() * stepTypes.length)],
        content: generateStepContent(),
        technique: Math.random() > 0.5 ? therapeuticTechniques[Math.floor(Math.random() * therapeuticTechniques.length)] : undefined,
        confidence: Math.random() * 0.3 + 0.7,
        timestamp: new Date(),
        emotionalState: emotionalStates[Math.floor(Math.random() * emotionalStates.length)],
        crisisLevel: crisisLevels[Math.floor(Math.random() * crisisLevels.length)]
      };

      setTherapySteps(prev => [step, ...prev.slice(0, 19)]); // Keep last 20
      setCurrentStep(step);
      setSessionProgress(prev => Math.min(100, prev + Math.random() * 15));
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance of step
        generateTherapyStep();
      }
    }, 3000 + Math.random() * 4000); // Random interval 3-7 seconds

    return () => clearInterval(interval);
  }, [isActive]);

  // Simulate user inputs
  useEffect(() => {
    if (!isActive) return;

    const generateUserInput = () => {
      const input: UserInput = {
        id: `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: sampleUserInputs[Math.floor(Math.random() * sampleUserInputs.length)],
        emotionalTone: ['anxious', 'sad', 'frustrated', 'hopeful', 'confused'][Math.floor(Math.random() * 5)],
        urgency: Math.floor(Math.random() * 10) + 1,
        timestamp: new Date()
      };

      setUserInputs(prev => [input, ...prev.slice(0, 9)]); // Keep last 10
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of input
        generateUserInput();
      }
    }, 4000 + Math.random() * 5000); // Random interval 4-9 seconds

    return () => clearInterval(interval);
  }, [isActive]);

  const generateStepContent = () => {
    const contents = [
      "Analyzing emotional patterns and identifying recurring themes...",
      "Detecting cognitive distortions and negative thought patterns...",
      "Selecting appropriate therapeutic intervention based on current state...",
      "Applying evidence-based technique with personalized adaptation...",
      "Monitoring crisis indicators and safety protocols...",
      "Integrating previous session insights with current context...",
      "Evaluating intervention effectiveness and adjusting approach...",
      "Building therapeutic alliance and rapport...",
      "Assessing progress toward treatment goals...",
      "Identifying triggers and developing coping strategies..."
    ];
    return contents[Math.floor(Math.random() * contents.length)];
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intervention': return 'bg-green-100 text-green-800 border-green-200';
      case 'response': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'technique': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCrisisColor = (level: string) => {
    switch (level) {
      case 'none': return 'bg-green-500';
      case 'low': return 'bg-yellow-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEmotionalColor = (emotion: string) => {
    switch (emotion) {
      case 'anxious': return 'text-orange-600';
      case 'depressed': return 'text-blue-600';
      case 'stressed': return 'text-red-600';
      case 'overwhelmed': return 'text-purple-600';
      case 'hopeful': return 'text-green-600';
      case 'confused': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          🎭 Live Therapy Session Simulation
        </h3>
        <p className="text-gray-600">
          Watch Jamie conduct a real-time therapy session with intelligent technique selection
        </p>
      </div>

      {/* Session Controls */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-700">
              {isActive ? 'Session Active' : 'Session Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isActive ? 'Pause Session' : 'Resume Session'}
          </button>
        </div>
      </div>

      {/* Session Progress */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <h4 className="text-lg font-semibold">📊 Session Progress</h4>
          <p className="text-blue-100 text-sm">Therapeutic journey tracking and intervention effectiveness</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Progress Bar */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Session Completion</span>
                <span className="text-sm font-medium text-blue-600">{sessionProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${sessionProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Current Status */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {therapySteps.length}
              </div>
              <div className="text-sm text-gray-600">Interventions Applied</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Therapy Step */}
      {currentStep && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
            <h4 className="text-lg font-semibold">🎯 Current Therapy Step</h4>
            <p className="text-green-100 text-sm">Jamie's latest intervention and analysis</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step Details */}
              <div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Step Type</span>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStepTypeColor(currentStep.type)}`}>
                        {currentStep.type.charAt(0).toUpperCase() + currentStep.type.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Content</span>
                    <p className="text-sm text-gray-700 mt-1">{currentStep.content}</p>
                  </div>

                  {currentStep.technique && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Technique</span>
                      <p className="text-sm text-gray-700 mt-1">{currentStep.technique}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Metrics */}
              <div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Confidence</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-blue-600">
                        {(currentStep.confidence * 100).toFixed(0)}%
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${currentStep.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Emotional State</span>
                    <p className={`text-sm font-medium mt-1 ${getEmotionalColor(currentStep.emotionalState)}`}>
                      {currentStep.emotionalState.charAt(0).toUpperCase() + currentStep.emotionalState.slice(1)}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Crisis Level</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-3 h-3 rounded-full ${getCrisisColor(currentStep.crisisLevel)}`} />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {currentStep.crisisLevel}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Timestamp</span>
                    <p className="text-sm text-gray-700 mt-1">
                      {currentStep.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent User Inputs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gray-50 p-4 border-b">
          <h4 className="text-lg font-semibold text-gray-800">💬 Recent User Inputs</h4>
          <p className="text-gray-600 text-sm">Jamie's analysis of user communications and emotional states</p>
        </div>

        <div className="p-4">
          <div className="space-y-3 max-h-48 overflow-y-auto">
            <AnimatePresence>
              {userInputs.map((input, index) => (
                <motion.div
                  key={input.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 mb-2">{input.text}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className={`px-2 py-1 rounded-full ${getEmotionalColor(input.emotionalTone)} bg-gray-100`}>
                          {input.emotionalTone}
                        </span>
                        <span className="text-gray-600">
                          Urgency: {input.urgency}/10
                        </span>
                        <span className="text-gray-500">
                          {input.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Therapy Steps History */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h4 className="text-lg font-semibold text-gray-800">📋 Therapy Steps History</h4>
          <p className="text-gray-600 text-sm">Complete record of Jamie's therapeutic interventions</p>
        </div>

        <div className="p-4">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {therapySteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStepTypeColor(step.type)}`}>
                          {step.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-600">
                          {step.timestamp.toLocaleTimeString()}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getCrisisColor(step.crisisLevel)}`} />
                          <span className="text-xs text-gray-600 capitalize">{step.crisisLevel}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-2">{step.content}</p>

                      {step.technique && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">Technique:</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {step.technique}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-gray-600">
                          Confidence: <span className="font-medium text-blue-600">{(step.confidence * 100).toFixed(0)}%</span>
                        </span>
                        <span className="text-gray-600">
                          Emotion: <span className={`font-medium ${getEmotionalColor(step.emotionalState)}`}>
                            {step.emotionalState}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}