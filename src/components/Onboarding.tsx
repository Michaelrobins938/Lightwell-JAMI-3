// src/components/Onboarding.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const onboardingSteps = [
  {
    title: 'Welcome to Luna',
    content: 'Your AI companion for mental health and personal growth.',
  },
  {
    title: 'Track Your Mood',
    content: 'Log your daily emotions and see patterns over time.',
  },
  // Add more steps for each feature
];

export const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4">{onboardingSteps[currentStep].title}</h2>
        <p className="mb-6">{onboardingSteps[currentStep].content}</p>
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentStep < onboardingSteps.length - 1) {
                setCurrentStep((prev) => prev + 1);
              } else {
                // Complete onboarding
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};