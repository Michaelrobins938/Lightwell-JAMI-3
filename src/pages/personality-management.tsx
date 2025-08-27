import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Plus, Settings, Shield, AlertTriangle, CheckCircle,
  Edit, Trash2, Copy, Star, Users, BookOpen, Target, Heart, X
} from 'lucide-react';
import { PersonalitySelector } from '../components/personality/PersonalitySelector';
import { PersonalityEditor } from '../components/personality/PersonalityEditor';
import { usePersonality, Personality } from '../hooks/usePersonality';
import Layout from '../components/layout/Layout';

const PersonalityManagement: React.FC = () => {
  const {
    personalities,
    systemPersonalities,
    activePersonality,
    isLoading,
    error,
    createPersonality,
    updatePersonality,
    deletePersonality,
    setActive,
    clearError
  } = usePersonality();

  const [showEditor, setShowEditor] = useState(false);
  const [editingPersonality, setEditingPersonality] = useState<Personality | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleCreatePersonality = () => {
    setEditingPersonality(null);
    setShowEditor(true);
  };

  const handleEditPersonality = (personality: Personality) => {
    setEditingPersonality(personality);
    setShowEditor(true);
  };

  const handleSavePersonality = async (personalityData: Partial<Personality>) => {
    try {
      if (editingPersonality) {
        await updatePersonality(editingPersonality.id, personalityData);
      } else {
        await createPersonality(personalityData);
      }
      setShowEditor(false);
      setEditingPersonality(null);
    } catch (error) {
      console.error('Failed to save personality:', error);
    }
  };

  const handleDeletePersonality = async (id: string) => {
    try {
      await deletePersonality(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete personality:', error);
    }
  };

  const handlePersonalitySelect = async (personality: Personality) => {
    try {
      await setActive(personality.id);
    } catch (error) {
      console.error('Failed to set active personality:', error);
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

  const getSafetyLevel = (personality: Personality) => {
    const hasSafetyProtocols = personality.safetyProtocols && personality.safetyProtocols.length > 100;
    const hasCrisisIntervention = !!personality.crisisIntervention;
    const hasDisclaimers = !!personality.disclaimers;
    const hasBoundaries = !!personality.boundarySettings;

    const safetyScore = [hasSafetyProtocols, hasCrisisIntervention, hasDisclaimers, hasBoundaries]
      .filter(Boolean).length * 25;

    if (safetyScore >= 90) return { level: 'excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (safetyScore >= 70) return { level: 'good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (safetyScore >= 50) return { level: 'fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'needs-review', color: 'text-red-600', bg: 'bg-red-50' };
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI Personality Management
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Manage and customize your AI therapeutic personalities
                </p>
              </div>
              <button
                onClick={handleCreatePersonality}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Personality
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 dark:text-red-200">{error}</span>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Personality Display */}
        {activePersonality && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {activePersonality.name}
                      </h2>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {activePersonality.description || 'No description available'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(activePersonality.category)}
                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {activePersonality.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personality Selector */}
            <div className="lg:col-span-2">
              <PersonalitySelector
                onPersonalitySelect={handlePersonalitySelect}
                activePersonality={activePersonality}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              />
            </div>

            {/* User Personalities */}
            <div className="space-y-6">
              {/* User Personalities */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Personalities
                </h3>
                
                {personalities.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You haven't created any custom personalities yet.
                    </p>
                    <button
                      onClick={handleCreatePersonality}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create Your First
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {personalities.map((personality) => {
                      const safety = getSafetyLevel(personality);
                      const isActive = activePersonality?.id === personality.id;

                      return (
                        <motion.div
                          key={personality.id}
                          layout
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                            isActive
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                          onClick={() => handlePersonalitySelect(personality)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {personality.name}
                                </h4>
                                {isActive && (
                                  <CheckCircle className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                {personality.description || 'No description'}
                              </p>
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(personality.category)}
                                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                  {personality.category}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Shield className={`w-3 h-3 ${safety.color}`} />
                                  <span className={`text-xs ${safety.color}`}>
                                    {safety.level}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPersonality(personality);
                                }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <Edit className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDeleteConfirm(personality.id);
                                }}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* System Personalities */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  System Personalities
                </h3>
                
                <div className="space-y-3">
                  {systemPersonalities.map((personality) => {
                    const safety = getSafetyLevel(personality);
                    const isActive = activePersonality?.id === personality.id;

                    return (
                      <motion.div
                        key={personality.id}
                        layout
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                          isActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => handlePersonalitySelect(personality)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {personality.name}
                              </h4>
                              {isActive && (
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                              )}
                              <Star className="w-4 h-4 text-yellow-500" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {personality.description || 'No description'}
                            </p>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(personality.category)}
                              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {personality.category}
                              </span>
                              <div className="flex items-center gap-1">
                                <Shield className={`w-3 h-3 ${safety.color}`} />
                                <span className={`text-xs ${safety.color}`}>
                                  {safety.level}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personality Editor Modal */}
        <PersonalityEditor
          personality={editingPersonality}
          onSave={handleSavePersonality}
          onCancel={() => {
            setShowEditor(false);
            setEditingPersonality(null);
          }}
          isOpen={showEditor}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Personality
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this personality? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePersonality(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PersonalityManagement;


