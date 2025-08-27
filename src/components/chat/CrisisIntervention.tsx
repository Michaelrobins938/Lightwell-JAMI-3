'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  Heart, 
  Shield, 
  Users, 
  Clock, 
  ArrowRight,
  X,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface CrisisInterventionProps {
  isOpen: boolean;
  onClose: () => void;
  crisisLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  triggers: string[];
  recommendations: string[];
}

export const CrisisIntervention: React.FC<CrisisInterventionProps> = ({
  isOpen,
  onClose,
  crisisLevel,
  triggers,
  recommendations
}) => {
  const [showResources, setShowResources] = useState(false);

  // Crisis resources data
  const crisisResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: '24/7 crisis support and suicide prevention',
      available: '24/7',
      priority: 'immediate'
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Free crisis counseling via text message',
      available: '24/7',
      priority: 'immediate'
    },
    {
      name: 'Emergency Services',
      phone: '911',
      description: 'For immediate life-threatening emergencies',
      available: '24/7',
      priority: 'emergency'
    },
    {
      name: 'Veterans Crisis Line',
      phone: '988, then press 1',
      description: 'Specialized support for veterans',
      available: '24/7',
      priority: 'immediate'
    }
  ];

  const localResources = [
    {
      name: 'Local Crisis Center',
      phone: 'Find your local center',
      description: 'Community-based crisis intervention',
      available: 'Varies by location',
      priority: 'immediate'
    },
    {
      name: 'Mental Health Urgent Care',
      phone: 'Check local listings',
      description: 'Same-day mental health evaluation',
      available: 'Business hours',
      priority: 'urgent'
    }
  ];

  const selfHelpStrategies = [
    {
      title: 'Grounding Techniques',
      description: 'Focus on your senses to stay present',
      steps: [
        'Name 5 things you can see',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste'
      ]
    },
    {
      title: 'Deep Breathing',
      description: 'Slow, controlled breathing to calm your nervous system',
      steps: [
        'Breathe in for 4 counts',
        'Hold for 4 counts',
        'Breathe out for 6 counts',
        'Repeat 5-10 times'
      ]
    },
    {
      title: 'Safe Environment',
      description: 'Remove yourself from immediate danger',
      steps: [
        'Go to a safe, quiet place',
        'Remove any harmful objects',
        'Call someone you trust',
        'Consider going to a public place'
      ]
    }
  ];

  const handleCallResource = (resource: any) => {
    if (resource.phone === '911') {
      if (confirm('Are you sure you want to call 911? This is for life-threatening emergencies only.')) {
        window.location.href = 'tel:911';
      }
    } else if (resource.phone.includes('988')) {
      window.location.href = 'tel:988';
    } else if (resource.phone.includes('Text')) {
      // For text-based resources, show instructions
      alert(`To use ${resource.name}: ${resource.phone}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Crisis Support</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Crisis Level Display */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-semibold text-red-800">Crisis Assessment</h3>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-red-700">Current Level:</span>
                <span className="px-3 py-1 bg-red-600 text-white rounded-full font-semibold capitalize">
                  {crisisLevel}
                </span>
              </div>
              
              {triggers.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-red-800 mb-2">Detected Triggers:</h4>
                  <div className="flex flex-wrap gap-2">
                    {triggers.map((trigger, index) => (
                      <span key={index} className="px-2 py-1 bg-red-200 text-red-800 text-sm rounded-full">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start">
                        <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Crisis Resources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Crisis Resources
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {crisisResources.map((resource, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      resource.priority === 'emergency' 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-blue-300 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{resource.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resource.priority === 'emergency' 
                          ? 'bg-red-200 text-red-800' 
                          : 'bg-blue-200 text-blue-800'
                      }`}>
                        {resource.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{resource.available}</span>
                      <button
                        onClick={() => handleCallResource(resource)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          resource.priority === 'emergency'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {resource.priority === 'emergency' ? 'Call Now' : 'Contact'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Self-Help Strategies */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                Immediate Self-Help Strategies
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {selfHelpStrategies.map((strategy, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border-2 border-purple-300 bg-purple-50"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2">{strategy.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{strategy.description}</p>
                    <ol className="text-sm text-gray-700 space-y-1">
                      {strategy.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="text-purple-600 font-medium text-xs mt-1">
                            {stepIndex + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Reminders */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-yellow-600" />
                Important Reminders
              </h3>
              <ul className="text-yellow-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-medium">•</span>
                  <span>Your feelings are valid and temporary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-medium">•</span>
                  <span>Asking for help is a sign of strength, not weakness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-medium">•</span>
                  <span>Professional help is available and effective</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-medium">•</span>
                  <span>You don't have to go through this alone</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                Remember: This is not a substitute for professional medical advice. 
                If you're in immediate danger, call 911 or go to the nearest emergency room.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CrisisIntervention;
