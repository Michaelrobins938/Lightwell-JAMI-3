/**
 * Features Module
 * 
 * Business logic modules that provide specific functionality.
 * Each feature is self-contained and can be enabled/disabled
 * independently for maximum modularity.
 */

// Feature modules - only export what exists
export * from './chat';

// TODO: Create missing feature modules when needed:
// export * from './ai-therapy';
// export * from './voice';
// export * from './assessment';
// export * from './community';
// export * from './progress';

// Feature registry and management
export interface Feature {
  name: string;
  version: string;
  enabled: boolean;
  dependencies: string[];
  config?: any;
}

export const availableFeatures: Record<string, Feature> = {
  chat: {
    name: 'Chat System',
    version: '1.0.0',
    enabled: true,
    dependencies: ['core/auth', 'core/database', 'shared/components']
  },
  'ai-therapy': {
    name: 'AI Therapy',
    version: '1.0.0', 
    enabled: true,
    dependencies: ['chat', 'assessment', 'core/api']
  },
  voice: {
    name: 'Voice Interaction',
    version: '1.0.0',
    enabled: true,
    dependencies: ['chat', 'core/api']
  },
  assessment: {
    name: 'Mental Health Assessment',
    version: '1.0.0',
    enabled: true,
    dependencies: ['core/auth', 'core/database']
  },
  community: {
    name: 'Community Features',
    version: '1.0.0',
    enabled: true,
    dependencies: ['core/auth', 'core/database', 'shared/components']
  },
  progress: {
    name: 'Progress Tracking',
    version: '1.0.0',
    enabled: true,
    dependencies: ['core/auth', 'core/database', 'assessment']
  }
};

// Feature manager
export class FeatureManager {
  private enabledFeatures: Set<string> = new Set();

  constructor() {
    // Initialize enabled features from config
    Object.entries(availableFeatures).forEach(([key, feature]) => {
      if (feature.enabled) {
        this.enabledFeatures.add(key);
      }
    });
  }

  isEnabled(featureName: string): boolean {
    return this.enabledFeatures.has(featureName);
  }

  enable(featureName: string): void {
    if (availableFeatures[featureName]) {
      this.enabledFeatures.add(featureName);
    }
  }

  disable(featureName: string): void {
    this.enabledFeatures.delete(featureName);
  }

  getEnabledFeatures(): string[] {
    return Array.from(this.enabledFeatures);
  }

  getDependencies(featureName: string): string[] {
    return availableFeatures[featureName]?.dependencies || [];
  }

  // Check if all dependencies for a feature are enabled
  canEnable(featureName: string): boolean {
    const feature = availableFeatures[featureName];
    if (!feature) return false;

    return feature.dependencies.every(dep => {
      // Core dependencies are always considered available
      if (dep.startsWith('core/') || dep.startsWith('shared/')) {
        return true;
      }
      return this.isEnabled(dep);
    });
  }
}

// Global feature manager instance
export const featureManager = new FeatureManager();

// Feature configuration interface
export interface FeatureConfig {
  chat?: {
    maxMessages: number;
    enableFileUpload: boolean;
    enableVoiceMessages: boolean;
  };
  'ai-therapy'?: {
    enableCrisisDetection: boolean;
    maxSessionLength: number;
    personalities: string[];
  };
  voice?: {
    enableRealtime: boolean;
    enableTTS: boolean;
    enableSTT: boolean;
  };
  assessment?: {
    enableAutoSchedule: boolean;
    supportedTypes: string[];
  };
  community?: {
    enablePublicSharing: boolean;
    moderationLevel: 'low' | 'medium' | 'high';
  };
  progress?: {
    enableGoalSetting: boolean;
    enableAnalytics: boolean;
  };
}