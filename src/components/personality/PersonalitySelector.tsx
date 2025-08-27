import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Shield, Heart, Settings, Plus, Check, AlertTriangle,
  Users, Star, Clock, Zap, BookOpen, Target, Activity
} from 'lucide-react';
import { PersonalityConfig } from '../../services/personalityService';

interface PersonalitySelectorProps {
  onPersonalitySelect: (personality: PersonalityConfig) => void;
  activePersonality?: PersonalityConfig | null;
  className?: string;
}

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({
  onPersonalitySelect,
  activePersonality,
  className = ''
}) => {
  const [personalities, setPersonalities] = useState<PersonalityConfig[]>([]);
  const [systemPersonalities, setSystemPersonalities] = useState<PersonalityConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadPersonalities();
  }, []);

  const loadPersonalities = async () => {
    try {
      setIsLoading(true);
      
      // Load user personalities
      const userResponse = await fetch('/api/personalities?type=user');
      const userData = await userResponse.json();
      setPersonalities(userData.personalities || []);

      // Load system personalities
      const systemResponse = await fetch('/api/personalities?type=system');
      const systemData = await systemResponse.json();
      setSystemPersonalities(systemData.personalities || []);
    } catch (error) {
      console.error('Failed to load personalities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'therapeutic':
        return <Heart className="w-4 h-4" />;
      case 'coaching':
        return <Target className="w-4 h-4" />;
      case 'educational':
        return <BookOpen className="w-4 h-4" />;
      case 'supportive':
        return <Users className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getSafetyLevel = (personality: PersonalityConfig) => {
    const hasSafetyProtocols = personality.safetyProtocols && personality.safetyProtocols.length > 100;
    const hasCrisisIntervention = !!personality.crisisIntervention;
    const hasDisclaimers = !!personality.disclaimers;
    const hasBoundaries = !!personality.boundarySettings;

    const safetyScore = [hasSafetyProtocols, hasCrisisIntervention, hasDisclaimers, hasBoundaries]
      .filter(Boolean).length;

    if (safetyScore === 4) return { level: 'excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (safetyScore >= 3) return { level: 'good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (safetyScore >= 2) return { level: 'fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'needs-review', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getApproachBadge = (approach?: string) => {
    if (!approach) return null;
    
    const approaches = {
      'CBT': { label: 'CBT', color: 'bg-blue-100 text-blue-800' },
      'DBT': { label: 'DBT', color: 'bg-purple-100 text-purple-800' },
      'ACT': { label: 'ACT', color: 'bg-green-100 text-green-800' },
      'Psychodynamic': { label: 'Psychodynamic', color: 'bg-orange-100 text-orange-800' },
      'Humanistic': { label: 'Humanistic', color: 'bg-pink-100 text-pink-800' }
    };

    return approaches[approach as keyof typeof approaches] || { label: approach, color: 'bg-gray-100 text-gray-800' };
  };

  const filteredPersonalities = [...personalities, ...systemPersonalities].filter(personality => {
    if (selectedCategory === 'all') return true;
    return personality.category === selectedCategory;
  });

  const categories = [
    { id: 'all', name: 'All', icon: <Brain className="w-4 h-4" /> },
    { id: 'therapeutic', name: 'Therapeutic', icon: <Heart className="w-4 h-4" /> },
    { id: 'coaching', name: 'Coaching', icon: <Target className="w-4 h-4" /> },
    { id: 'educational', name: 'Educational', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'supportive', name: 'Supportive', icon: <Users className="w-4 h-4" /> }
  ];

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Personality
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose how your AI therapist will respond and interact
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      {/* Active Personality Display */}
      {activePersonality && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {activePersonality.name}
                </h4>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activePersonality.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Personalities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPersonalities.map((personality) => {
          const safety = getSafetyLevel(personality);
          const approachBadge = getApproachBadge(personality.therapeuticApproach);
          const isActive = activePersonality?.id === personality.id;

          return (
            <motion.div
              key={personality.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                isActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => onPersonalitySelect(personality)}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              )}

              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg ${safety.bg}`}>
                  {getCategoryIcon(personality.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {personality.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {personality.category}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {personality.description || 'No description available'}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {approachBadge && (
                  <span className={`px-2 py-1 text-xs rounded-full ${approachBadge.color}`}>
                    {approachBadge.label}
                  </span>
                )}
                {personality.specialization && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full">
                    {personality.specialization}
                  </span>
                )}
              </div>

              {/* Safety Indicator */}
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${safety.color}`} />
                <span className={`text-xs font-medium ${safety.color}`}>
                  Safety: {safety.level}
                </span>
                {safety.level === 'needs-review' && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>

              {/* Communication Style */}
              {personality.communicationStyle && (
                <div className="flex items-center gap-2 mt-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {personality.communicationStyle}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPersonalities.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No personalities found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {selectedCategory === 'all' 
              ? 'Create your first AI personality to get started'
              : `No ${selectedCategory} personalities available`
            }
          </p>
          {selectedCategory === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Personality
            </button>
          )}
        </div>
      )}

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Personality</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This feature is coming soon. You'll be able to create custom AI personalities with comprehensive safety protocols.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


