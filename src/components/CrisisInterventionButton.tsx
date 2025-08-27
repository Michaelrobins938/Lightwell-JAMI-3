import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Heart, 
  X, 
  Shield,
  Users,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface CrisisResource {
  id: string;
  name: string;
  phone: string;
  description: string;
  available: boolean;
  type: 'suicide' | 'crisis' | 'domestic_violence' | 'substance_abuse' | 'general';
}

interface CrisisInterventionButtonProps {
  onCrisisDetected?: () => void;
  onProfessionalHandoff?: () => void;
  className?: string;
}

const CRISIS_RESOURCES: CrisisResource[] = [
  {
    id: 'suicide-prevention',
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 suicide prevention and crisis support',
    available: true,
    type: 'suicide'
  },
  {
    id: 'crisis-text',
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: '24/7 crisis support via text message',
    available: true,
    type: 'crisis'
  },
  {
    id: 'domestic-violence',
    name: 'National Domestic Violence Hotline',
    phone: '1-800-799-7233',
    description: '24/7 support for domestic violence',
    available: true,
    type: 'domestic_violence'
  },
  {
    id: 'substance-abuse',
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Treatment referral for substance abuse',
    available: true,
    type: 'substance_abuse'
  },
  {
    id: 'veterans-crisis',
    name: 'Veterans Crisis Line',
    phone: '1-800-273-8255',
    description: 'Crisis support for veterans',
    available: true,
    type: 'crisis'
  }
];

const CrisisInterventionButton: React.FC<CrisisInterventionButtonProps> = ({
  onCrisisDetected,
  onProfessionalHandoff,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<CrisisResource | null>(null);
  const [showSafetyPlan, setShowSafetyPlan] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Auto-detect crisis keywords in user input
  useEffect(() => {
    const detectCrisisKeywords = () => {
      const userInput = document.querySelector('input, textarea') as HTMLInputElement;
      if (userInput) {
        const crisisKeywords = [
          'suicide', 'kill myself', 'end it all', 'want to die', 'better off dead',
          'no reason to live', 'everyone would be better off', 'plan to end my life',
          'cut myself', 'hurt myself', 'self-harm', 'self-injury',
          'hurt someone', 'attack', 'violent', 'rage', 'anger',
          'overdose', 'take pills', 'drink too much', 'drugs',
          'hearing voices', 'seeing things', 'paranoid', 'delusions',
          'abuse', 'domestic violence', 'hit me', 'threaten', 'control'
        ];

        const inputValue = userInput.value.toLowerCase();
        const hasCrisisKeywords = crisisKeywords.some(keyword => 
          inputValue.includes(keyword)
        );

        if (hasCrisisKeywords && !emergencyMode) {
          setEmergencyMode(true);
          onCrisisDetected?.();
        }
      }
    };

    // Monitor user input for crisis keywords
    const interval = setInterval(detectCrisisKeywords, 2000);
    return () => clearInterval(interval);
  }, [emergencyMode, onCrisisDetected]);

  const handleCrisisButtonClick = () => {
    setIsOpen(true);
    setEmergencyMode(true);
    onCrisisDetected?.();
  };

  const handleResourceSelect = (resource: CrisisResource) => {
    setSelectedResource(resource);
    
    // Auto-dial for phone numbers
    if (resource.phone && resource.phone !== 'Text HOME to 741741') {
      window.open(`tel:${resource.phone.replace(/\D/g, '')}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleProfessionalHandoff = () => {
    onProfessionalHandoff?.();
    setIsOpen(false);
  };

  const handleSafetyPlan = () => {
    setShowSafetyPlan(true);
  };

  const SafetyPlanModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-luna-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-luna-900 dark:text-luna-100">
            Safety Plan
          </h3>
          <button
            onClick={() => setShowSafetyPlan(false)}
            className="p-2 hover:bg-luna-100 dark:hover:bg-luna-700 rounded-full transition-colors"
            aria-label="Close safety plan"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              Immediate Steps
            </h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li>• Remove yourself from any dangerous situation</li>
              <li>• Call emergency services if needed (911)</li>
              <li>• Reach out to a trusted person</li>
              <li>• Use the crisis resources below</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Coping Strategies
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Deep breathing exercises</li>
              <li>• Grounding techniques (5-4-3-2-1)</li>
              <li>• Call a friend or family member</li>
              <li>• Engage in a distracting activity</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Professional Help
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Contact a mental health professional</li>
              <li>• Schedule an emergency appointment</li>
              <li>• Consider inpatient treatment if needed</li>
              <li>• Work with a crisis intervention team</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setShowSafetyPlan(false)}
            className="flex-1 px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition-colors"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {/* Crisis Intervention Button */}
      <motion.button
        onClick={handleCrisisButtonClick}
        className={`fixed bottom-6 left-6 z-30 p-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-4 focus:ring-red-300 ${
          emergencyMode ? 'animate-pulse' : ''
        } ${className}`}
        style={{ left: '1.5rem' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Crisis intervention and emergency resources"
      >
        <AlertTriangle size={24} />
      </motion.button>

      {/* Crisis Resources Modal */}
      {isOpen && (
        <motion.div
          key="crisis-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white dark:bg-luna-800 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                        <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-luna-900 dark:text-luna-100">
                          Crisis Support
                        </h2>
                        <p className="text-sm text-luna-600 dark:text-luna-400">
                          You're not alone. Help is available 24/7.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-luna-100 dark:hover:bg-luna-700 rounded-full transition-colors"
                      aria-label="Close crisis resources"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Emergency Alert */}
                  {emergencyMode && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                        <span className="font-semibold text-red-800 dark:text-red-200">
                          Emergency Mode Activated
                        </span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        We've detected crisis indicators. Please use these resources immediately.
                      </p>
                    </div>
                  )}

                  {/* Crisis Resources */}
                  <div className="space-y-3 mb-6">
                    {CRISIS_RESOURCES.map((resource) => (
                      <motion.button
                        key={resource.id}
                        onClick={() => handleResourceSelect(resource)}
                        className={`w-full p-4 rounded-lg border transition-colors text-left ${
                          selectedResource?.id === resource.id
                            ? 'bg-luna-500 text-white border-luna-500'
                            : 'bg-white dark:bg-luna-700 border-luna-200 dark:border-luna-600 hover:bg-luna-50 dark:hover:bg-luna-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Phone size={16} />
                              <span className="font-semibold">{resource.name}</span>
                            </div>
                            <p className="text-sm opacity-80">{resource.description}</p>
                            <p className="text-sm font-mono mt-1">{resource.phone}</p>
                          </div>
                          <ExternalLink size={16} />
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleSafetyPlan}
                      className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Shield size={16} />
                      <span>View Safety Plan</span>
                    </button>

                    <button
                      onClick={handleProfessionalHandoff}
                      className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Users size={16} />
                      <span>Connect with Professional</span>
                    </button>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full p-3 bg-luna-100 dark:bg-luna-700 text-luna-700 dark:text-luna-300 rounded-lg hover:bg-luna-200 dark:hover:bg-luna-600 transition-colors"
                    >
                      I'm Safe Now
                    </button>
                  </div>

                  {/* Important Notice */}
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Clock size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-semibold mb-1">Important:</p>
                        <p>If you're in immediate danger, call 911 or go to the nearest emergency room. These resources are available 24/7 for support and guidance.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
        </motion.div>
      )}

      {/* Safety Plan Modal */}
      {showSafetyPlan && <SafetyPlanModal key="safety-plan-modal" />}

      {/* Emergency Mode Indicator */}
      {emergencyMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 p-3 bg-red-500 text-white rounded-lg shadow-lg flex items-center space-x-2"
        >
          <AlertTriangle size={16} />
          <span className="text-sm font-medium">Crisis Mode Active</span>
        </motion.div>
      )}
    </>
  );
};

export default CrisisInterventionButton; 