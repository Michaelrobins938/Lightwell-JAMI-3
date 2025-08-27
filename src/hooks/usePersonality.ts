import { useState, useEffect } from 'react';

export interface Personality {
  id: string;
  name: string;
  description: string;
  avatar: string;
  traits: string[];
  specialties: string[];
  tone: 'empathetic' | 'professional' | 'casual' | 'supportive';
  color: string;
  category?: string;
  safetyProtocols?: string;
  crisisIntervention?: string;
  disclaimers?: string;
  boundarySettings?: string;
}

const DEFAULT_PERSONALITIES: Personality[] = [
  {
    id: 'jamie',
    name: 'Jamie',
    description: 'A compassionate AI therapist focused on emotional support and personal growth.',
    avatar: '🧠',
    traits: ['Empathetic', 'Patient', 'Insightful', 'Non-judgmental'],
    specialties: ['Anxiety', 'Depression', 'Stress Management', 'Personal Growth'],
    tone: 'empathetic',
    color: '#8B5CF6',
    category: 'therapeutic',
    safetyProtocols: 'Comprehensive safety guidelines for emotional support',
    crisisIntervention: 'Immediate referral to professional help',
    disclaimers: 'AI-assisted support, not a substitute for professional therapy',
    boundarySettings: 'Maintain professional and ethical boundaries'
  },
  {
    id: 'alex',
    name: 'Alex',
    description: 'A practical therapist who focuses on CBT techniques and problem-solving.',
    avatar: '🎯',
    traits: ['Practical', 'Solution-focused', 'Structured', 'Encouraging'],
    specialties: ['CBT', 'Problem Solving', 'Goal Setting', 'Motivation'],
    tone: 'professional',
    color: '#3B82F6'
  },
  {
    id: 'sara',
    name: 'Sara',
    description: 'A supportive therapist specializing in relationships and self-care.',
    avatar: '💝',
    traits: ['Warm', 'Understanding', 'Gentle', 'Nurturing'],
    specialties: ['Relationships', 'Self-Care', 'Emotional Intelligence', 'Mindfulness'],
    tone: 'supportive',
    color: '#EC4899'
  },
  {
    id: 'dr-smith',
    name: 'Dr. Smith',
    description: 'A clinical psychologist with expertise in various therapeutic approaches.',
    avatar: '👨‍⚕️',
    traits: ['Clinical', 'Knowledgeable', 'Analytical', 'Professional'],
    specialties: ['Clinical Psychology', 'Therapy', 'Mental Health', 'Assessment'],
    tone: 'professional',
    color: '#10B981'
  }
];

const SYSTEM_PERSONALITIES: Personality[] = [
  {
    id: 'crisis-support',
    name: 'Crisis Support',
    description: 'Specialized AI for immediate crisis intervention and support.',
    avatar: '🚨',
    traits: ['Urgent', 'Compassionate', 'Direct', 'Supportive'],
    specialties: ['Crisis Intervention', 'Emergency Support', 'Safety Planning'],
    tone: 'professional',
    color: '#EF4444',
    category: 'crisis',
    safetyProtocols: 'Strict emergency response protocols',
    crisisIntervention: 'Immediate escalation and professional referral',
    disclaimers: 'Designed for urgent mental health situations',
    boundarySettings: 'Prioritize user safety above all'
  },
  // Add more system personalities as needed
];

export const usePersonality = () => {
  const [personalities] = useState<Personality[]>(DEFAULT_PERSONALITIES);
  const [systemPersonalities] = useState<Personality[]>(SYSTEM_PERSONALITIES);
  const [activePersonality, setActivePersonality] = useState<Personality | null>(DEFAULT_PERSONALITIES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setActive = (personalityId: string) => {
    const personality = [...personalities, ...systemPersonalities].find(p => p.id === personalityId);
    if (personality) {
      setActivePersonality(personality);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('active-personality', personalityId);
      }
    }
  };

  const createPersonality = async (personalityData: Partial<Personality>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock implementation - in real app this would call an API
      const newPersonality: Personality = {
        id: `personality-${Date.now()}`,
        name: personalityData.name || 'New Personality',
        description: personalityData.description || 'A new AI personality',
        avatar: personalityData.avatar || '🤖',
        traits: personalityData.traits || [],
        specialties: personalityData.specialties || [],
        tone: personalityData.tone || 'professional',
        color: personalityData.color || '#6B7280',
        ...personalityData
      };
      // In real implementation, save to backend
      console.log('Creating personality:', newPersonality);
      return newPersonality;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create personality');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePersonality = async (id: string, personalityData: Partial<Personality>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock implementation - in real app this would call an API
      console.log('Updating personality:', id, personalityData);
      // In real implementation, update in backend
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update personality');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePersonality = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock implementation - in real app this would call an API
      console.log('Deleting personality:', id);
      // In real implementation, delete from backend
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete personality');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    // Load active personality from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('active-personality');
      if (saved) {
        const personality = [...personalities, ...systemPersonalities].find(p => p.id === saved);
        if (personality) {
          setActivePersonality(personality);
        }
      }
    }
  }, [personalities, systemPersonalities]);

  return {
    personalities,
    systemPersonalities,
    activePersonality,
    setActive,
    isLoading,
    error,
    createPersonality,
    updatePersonality,
    deletePersonality,
    clearError
  };
};


