import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Shield, Heart, Settings, Save, X, AlertTriangle,
  Users, BookOpen, Target, Activity, CheckCircle, Info
} from 'lucide-react';
import { PersonalityConfig } from '../../services/personalityService';

interface PersonalityEditorProps {
  personality?: PersonalityConfig | null;
  onSave: (personality: Partial<PersonalityConfig>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const PersonalityEditor: React.FC<PersonalityEditorProps> = ({
  personality,
  onSave,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState<Partial<PersonalityConfig>>({
    name: '',
    description: '',
    category: 'therapeutic',
    therapeuticApproach: '',
    specialization: '',
    coreInstructions: '',
    safetyProtocols: '',
    therapeuticTechniques: '',
    boundarySettings: '',
    crisisIntervention: '',
    communicationStyle: 'warm',
    responseLength: 'detailed',
    empathyLevel: 'high',
    directiveLevel: 'collaborative',
    safetyChecks: [],
    crisisKeywords: [],
    escalationProtocols: '',
    disclaimers: ''
  });

  const [safetyScore, setSafetyScore] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (personality) {
      setFormData(personality);
    }
  }, [personality]);

    const calculateSafetyScore = () => {
    let score = 0;
    if (formData.safetyProtocols && formData.safetyProtocols.length > 100) score += 25;
    if (formData.crisisIntervention) score += 25;
    if (formData.disclaimers) score += 25;
    if (formData.boundarySettings) score += 25;
    setSafetyScore(score);
  };

  useEffect(() => {
    if (personality) {
      setFormData(personality);
    }
  }, [personality]);

  useEffect(() => {
    calculateSafetyScore();
  }, [formData, calculateSafetyScore]);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.name?.trim()) errors.push('Name is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.coreInstructions?.trim()) errors.push('Core instructions are required');
    if (!formData.safetyProtocols?.trim()) errors.push('Safety protocols are required');
    
    if (formData.safetyProtocols && formData.safetyProtocols.length < 100) {
      errors.push('Safety protocols should be comprehensive (at least 100 characters)');
    }
    
    if (!formData.crisisIntervention?.trim()) {
      errors.push('Crisis intervention protocols are required');
    }
    
    if (!formData.disclaimers?.trim()) {
      errors.push('Disclaimers are required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const getSafetyLevel = () => {
    if (safetyScore >= 90) return { level: 'excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (safetyScore >= 70) return { level: 'good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (safetyScore >= 50) return { level: 'fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'needs-improvement', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const safety = getSafetyLevel();

  const categories = [
    { id: 'therapeutic', name: 'Therapeutic', icon: <Heart className="w-4 h-4" /> },
    { id: 'coaching', name: 'Coaching', icon: <Target className="w-4 h-4" /> },
    { id: 'educational', name: 'Educational', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'supportive', name: 'Supportive', icon: <Users className="w-4 h-4" /> }
  ];

  const therapeuticApproaches = [
    'CBT', 'DBT', 'ACT', 'Psychodynamic', 'Humanistic', 'Mindfulness-Based', 'Solution-Focused'
  ];

  const communicationStyles = [
    { id: 'warm', name: 'Warm & Empathetic' },
    { id: 'professional', name: 'Professional & Clinical' },
    { id: 'direct', name: 'Direct & Clear' },
    { id: 'calm', name: 'Calm & Soothing' },
    { id: 'structured', name: 'Structured & Educational' }
  ];

  const responseLengths = [
    { id: 'concise', name: 'Concise' },
    { id: 'moderate', name: 'Moderate' },
    { id: 'detailed', name: 'Detailed' }
  ];

  const empathyLevels = [
    { id: 'low', name: 'Low' },
    { id: 'moderate', name: 'Moderate' },
    { id: 'high', name: 'High' }
  ];

  const directiveLevels = [
    { id: 'non-directive', name: 'Non-Directive' },
    { id: 'collaborative', name: 'Collaborative' },
    { id: 'directive', name: 'Directive' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {personality ? 'Edit Personality' : 'Create New Personality'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800 dark:text-red-200">Validation Errors</h3>
              </div>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Score */}
          <div className={`p-4 rounded-lg border ${safety.bg} border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className={`w-5 h-5 ${safety.color}`} />
                <span className={`font-semibold ${safety.color}`}>
                  Safety Score: {safetyScore}%
                </span>
              </div>
              <span className={`text-sm font-medium ${safety.color}`}>
                {safety.level.toUpperCase()}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  safetyScore >= 90 ? 'bg-green-500' :
                  safetyScore >= 70 ? 'bg-blue-500' :
                  safetyScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${safetyScore}%` }}
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Jamie - Therapeutic Companion"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Therapeutic Approach
              </label>
              <select
                value={formData.therapeuticApproach || ''}
                onChange={(e) => setFormData({ ...formData, therapeuticApproach: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select approach</option>
                {therapeuticApproaches.map((approach) => (
                  <option key={approach} value={approach}>
                    {approach}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization || ''}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., anxiety, depression, trauma"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Describe this personality's approach and style..."
            />
          </div>

          {/* Communication Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Communication Style
              </label>
              <select
                value={formData.communicationStyle || ''}
                onChange={(e) => setFormData({ ...formData, communicationStyle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {communicationStyles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Response Length
              </label>
              <select
                value={formData.responseLength || ''}
                onChange={(e) => setFormData({ ...formData, responseLength: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {responseLengths.map((length) => (
                  <option key={length.id} value={length.id}>
                    {length.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Empathy Level
              </label>
              <select
                value={formData.empathyLevel || ''}
                onChange={(e) => setFormData({ ...formData, empathyLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {empathyLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Core Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Core Instructions *
            </label>
            <textarea
              value={formData.coreInstructions || ''}
              onChange={(e) => setFormData({ ...formData, coreInstructions: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Define the core personality, principles, and communication style..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              This is the main instruction set that defines how the AI will behave and respond.
            </p>
          </div>

          {/* Safety Protocols */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Safety Protocols *
            </label>
            <textarea
              value={formData.safetyProtocols || ''}
              onChange={(e) => setFormData({ ...formData, safetyProtocols: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Define crisis detection, escalation procedures, and safety measures..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Comprehensive safety protocols are required for all therapeutic AI personalities.
            </p>
          </div>

          {/* Crisis Intervention */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Crisis Intervention Protocols *
            </label>
            <textarea
              value={formData.crisisIntervention || ''}
              onChange={(e) => setFormData({ ...formData, crisisIntervention: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Define specific crisis response procedures..."
            />
          </div>

          {/* Disclaimers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Disclaimers *
            </label>
            <textarea
              value={formData.disclaimers || ''}
              onChange={(e) => setFormData({ ...formData, disclaimers: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Required disclaimers about limitations and when to seek professional help..."
            />
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Therapeutic Techniques
              </label>
              <textarea
                value={formData.therapeuticTechniques || ''}
                onChange={(e) => setFormData({ ...formData, therapeuticTechniques: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Specific therapeutic techniques to use..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Professional Boundaries
              </label>
              <textarea
                value={formData.boundarySettings || ''}
                onChange={(e) => setFormData({ ...formData, boundarySettings: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Define professional boundaries and limitations..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Info className="w-4 h-4" />
            <span>All fields marked with * are required</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Personality
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


