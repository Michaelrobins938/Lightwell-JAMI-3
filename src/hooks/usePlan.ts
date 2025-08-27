import { useState } from 'react';

export type PlanTier = 'free' | 'plus' | 'team' | 'enterprise';

export interface UserPlan {
  tier: PlanTier;
  maxTokens: number;
  maxModels: number;
  canUploadFiles: boolean;
  canUseVoiceInput: boolean;
}

export function usePlan() {
  const [userPlan, setUserPlan] = useState<UserPlan>({
    tier: 'free',
    maxTokens: 10000,
    maxModels: 2,
    canUploadFiles: false,
    canUseVoiceInput: false
  });

  const availableModels = {
    free: ['GPT-3.5', 'GPT-4o-lite'],
    plus: ['GPT-3.5', 'GPT-4o', 'GPT-4o-turbo'],
    team: ['GPT-3.5', 'GPT-4o', 'GPT-4o-turbo', 'Claude-3', 'Gemini-Pro'],
    enterprise: ['GPT-3.5', 'GPT-4o', 'GPT-4o-turbo', 'Claude-3', 'Gemini-Pro', 'Custom Models']
  };

  const upgradePlan = (newTier: PlanTier) => {
    const planUpgrades: Record<PlanTier, Partial<UserPlan>> = {
      free: {},
      plus: {
        maxTokens: 50000,
        maxModels: 4,
        canUploadFiles: true,
        canUseVoiceInput: true
      },
      team: {
        maxTokens: 100000,
        maxModels: 6,
        canUploadFiles: true,
        canUseVoiceInput: true
      },
      enterprise: {
        maxTokens: Infinity,
        maxModels: Infinity,
        canUploadFiles: true,
        canUseVoiceInput: true
      }
    };

    setUserPlan(prev => ({
      ...prev,
      tier: newTier,
      ...planUpgrades[newTier]
    }));
  };

  const checkFeatureAccess = (feature: keyof UserPlan) => {
    return userPlan[feature];
  };

  return {
    userPlan,
    availableModels: availableModels[userPlan.tier],
    upgradePlan,
    checkFeatureAccess
  };
}
