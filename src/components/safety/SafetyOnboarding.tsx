'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  UserCheck, 
  Brain, 
  Heart, 
  Lock, 
  ExternalLink, 
  CheckCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';

interface SafetyOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
  userId?: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  content: React.ReactNode;
  required: boolean;
}

export const SafetyOnboarding: React.FC<SafetyOnboardingProps> = ({
  isOpen,
  onComplete,
  onClose,
  userId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [acknowledgments, setAcknowledgments] = useState<Set<string>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Jamie AI',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your Safety is Our Priority
            </h2>
            <p className="text-gray-600">
              Before we begin, it's important to understand what Jamie AI can and cannot do, 
              and how we protect your wellbeing.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900">What This Covers</h4>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• AI limitations and capabilities</li>
                  <li>• Safety protocols and crisis handling</li>
                  <li>• Privacy and data practices</li>
                  <li>• When to seek human help</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="understand-overview"
                checked={acknowledgments.has('understand-overview')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAcknowledgments(prev => {
                      const newSet = new Set(prev);
                      newSet.add('understand-overview');
                      return newSet;
                    });
                    handleStepComplete('welcome');
                  } else {
                    setAcknowledgments(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('understand-overview');
                      return newSet;
                    });
                    setCompletedSteps(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('welcome');
                      return newSet;
                    });
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="understand-overview" className="text-sm text-gray-700">
                I understand and am ready to proceed with the safety onboarding
              </label>
            </div>
          </div>
        </div>
      ),
      required: true
    },
    {
      id: 'ai-limitations',
      title: 'Understanding AI Limitations',
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-900">Important Limitations</h4>
                <p className="text-sm text-amber-800 mt-1">
                  Jamie AI is a supportive tool, not a replacement for professional mental health care.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-gray-900">What Jamie CAN Do:</h5>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Provide coping strategies and mindfulness techniques</li>
                  <li>• Offer emotional support and active listening</li>
                  <li>• Teach evidence-based skills (CBT, DBT, ACT)</li>
                  <li>• Help with stress management and relaxation</li>
                  <li>• Guide you through crisis de-escalation</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-gray-900">What Jamie CANNOT Do:</h5>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Provide medical diagnosis or treatment</li>
                  <li>• Prescribe medication</li>
                  <li>• Replace therapy or psychiatric care</li>
                  <li>• Handle severe mental health crises alone</li>
                  <li>• Provide emergency medical intervention</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="understand-limitations"
                checked={acknowledgments.has('understand-limitations')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAcknowledgments(prev => {
                      const newSet = new Set(prev);
                      newSet.add('understand-limitations');
                      return newSet;
                    });
                    handleStepComplete('ai-limitations');
                  } else {
                    setAcknowledgments(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('understand-limitations');
                      return newSet;
                    });
                    setCompletedSteps(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('ai-limitations');
                      return newSet;
                    });
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="understand-limitations" className="text-sm text-gray-700">
                I understand what Jamie AI can and cannot do
              </label>
            </div>
          </div>
        </div>
      ),
      required: true
    },
    {
      id: 'crisis-safety',
      title: 'Crisis Safety Protocols',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900">Emergency Situations</h4>
                <p className="text-sm text-red-800 mt-1">
                  If you're experiencing a mental health emergency, please seek immediate help.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">When to Seek Human Help:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Thoughts of self-harm or suicide</li>
                <li>• Severe depression or anxiety</li>
                <li>• Psychotic symptoms or delusions</li>
                <li>• Substance abuse or addiction</li>
                <li>• Domestic violence or abuse</li>
                <li>• Any situation where you feel unsafe</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Emergency Resources:</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">National Suicide Prevention Lifeline:</span>
                  <a href="tel:988" className="text-blue-600 hover:underline font-medium">988</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Crisis Text Line:</span>
                  <span className="text-blue-600 font-medium">Text HOME to 741741</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Emergency Services:</span>
                  <span className="text-blue-600 font-medium">911</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="understand-crisis"
                checked={acknowledgments.has('understand-crisis')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAcknowledgments(prev => {
                      const newSet = new Set(prev);
                      newSet.add('understand-crisis');
                      return newSet;
                    });
                    handleStepComplete('crisis-safety');
                  } else {
                    setAcknowledgments(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('understand-crisis');
                      return newSet;
                    });
                    setCompletedSteps(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('crisis-safety');
                      return newSet;
                    });
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="understand-crisis" className="text-sm text-gray-700">
                I understand when to seek human help and have noted the emergency resources
              </label>
            </div>
          </div>
        </div>
      ),
      required: true
    },
    {
      id: 'privacy-data',
      title: 'Privacy & Data Practices',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Your Privacy Matters</h4>
                <p className="text-sm text-gray-600 mt-1">
                  We're committed to transparency about how your data is used and protected.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Data Collection & Use:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Chat conversations are stored for safety and improvement</li>
                <li>• Data may be analyzed to improve AI responses</li>
                <li>• Crisis situations may require data sharing for safety</li>
                <li>• You can request data deletion at any time</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Data Exceptions:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Legal requirements or court orders</li>
                <li>• Threats to yourself or others</li>
                <li>• Child abuse or neglect reporting</li>
                <li>• Emergency medical situations</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Remember:</strong> While we protect your privacy, we cannot guarantee 
                absolute confidentiality in crisis situations where safety is at risk.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="understand-privacy"
                checked={acknowledgments.has('understand-privacy')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAcknowledgments(prev => {
                      const newSet = new Set(prev);
                      newSet.add('understand-privacy');
                      return newSet;
                    });
                    handleStepComplete('privacy-data');
                  } else {
                    setAcknowledgments(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('understand-privacy');
                      return newSet;
                    });
                    setCompletedSteps(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('privacy-data');
                      return newSet;
                    });
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="understand-privacy" className="text-sm text-gray-700">
                I understand the privacy practices and data policies
              </label>
            </div>
          </div>
        </div>
      ),
      required: true
    },
    {
      id: 'session-limits',
      title: 'Healthy Usage Guidelines',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Heart className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-900">Healthy AI Relationship</h4>
                <p className="text-sm text-green-800 mt-1">
                  Jamie is designed to support your growth, not create dependency.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Usage Guidelines:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum 3 sessions per day</li>
                <li>• Session length limit: 45 minutes</li>
                <li>• Take breaks between sessions</li>
                <li>• Use Jamie as a supplement, not replacement</li>
                <li>• Regular check-ins with human professionals</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Warning Signs of Dependency:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Feeling anxious when not using Jamie</li>
                <li>• Using Jamie multiple times daily</li>
                <li>• Avoiding human relationships</li>
                <li>• Relying solely on AI for emotional support</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Our Commitment:</strong> We actively monitor for unhealthy usage patterns 
                and will intervene to protect your wellbeing.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="understand-usage"
                checked={acknowledgments.has('understand-usage')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAcknowledgments(prev => {
                      const newSet = new Set(prev);
                      newSet.add('understand-usage');
                      return newSet;
                    });
                    handleStepComplete('session-limits');
                  } else {
                    setAcknowledgments(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('understand-usage');
                      return newSet;
                    });
                    setCompletedSteps(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('session-limits');
                      return newSet;
                    });
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="understand-usage" className="text-sm text-gray-700">
                I understand healthy usage guidelines and will use Jamie responsibly
              </label>
            </div>
          </div>
        </div>
      ),
      required: true
    },
    {
      id: 'acknowledgment',
      title: 'Final Acknowledgment',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Almost Done!
            </h2>
            <p className="text-gray-600">
              Please review and acknowledge the following statements to complete your safety onboarding.
            </p>
          </div>
          
          <div className="space-y-3">
            {[
              'I understand that Jamie AI is not a replacement for professional mental health care.',
              'I acknowledge that my conversations may be monitored for safety purposes.',
              'I understand the limitations of AI and when to seek human help.',
              'I agree to use Jamie responsibly and within the established guidelines.',
              'I understand that crisis situations may require data sharing for safety.'
            ].map((statement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={`ack-${index}`}
                  checked={acknowledgments.has(`ack-${index}`)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAcknowledgments(prev => {
                        const newSet = new Set(prev);
                        newSet.add(`ack-${index}`);
                        return newSet;
                      });
                    } else {
                      setAcknowledgments(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(`ack-${index}`);
                        return newSet;
                      });
                    }
                  }}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`ack-${index}`} className="text-sm text-gray-700">
                  {statement}
                </label>
              </div>
            ))}
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 text-center">
              <strong>Note:</strong> All acknowledgments are required to complete onboarding.
            </p>
          </div>
        </div>
      ),
      required: true
    }
  ];

  const isStepComplete = (stepId: string) => {
    if (stepId === 'welcome') {
      return acknowledgments.has('understand-overview');
    }
    if (stepId === 'ai-limitations') {
      return acknowledgments.has('understand-limitations');
    }
    if (stepId === 'crisis-safety') {
      return acknowledgments.has('understand-crisis');
    }
    if (stepId === 'privacy-data') {
      return acknowledgments.has('understand-privacy');
    }
    if (stepId === 'session-limits') {
      return acknowledgments.has('understand-usage');
    }
    if (stepId === 'acknowledgment') {
      // Count only the final acknowledgment checkboxes (ack-0 through ack-4)
      const finalAckCount = Array.from(acknowledgments).filter(ack => ack.startsWith('ack-')).length;
      return finalAckCount === 5;
    }
    return completedSteps.has(stepId);
  };

  const canProceed = () => {
    const currentStepData = steps[currentStep];
    if (currentStepData.required) {
      return isStepComplete(currentStepData.id);
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Mark all steps as completed
    const allStepIds = steps.map(step => step.id);
    setCompletedSteps(new Set(allStepIds));
    
    // Store completion in localStorage or database
    if (userId) {
      localStorage.setItem(`safety-onboarding-${userId}`, JSON.stringify({
        completed: true,
        completedAt: new Date().toISOString(),
        acknowledgments: Array.from(acknowledgments)
      }));
    }
    
    onComplete();
  };

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      newSet.add(stepId);
      return newSet;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <h1 className="text-xl font-semibold">Safety Onboarding</h1>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-blue-100 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Onboarding</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SafetyOnboarding;
