/**
 * Luna Web 2025 - Modular Architecture
 * Main entry point for all modules
 * 
 * This file provides the complete plug-and-play system for Luna Web.
 * Import only what you need, or import everything for a full-featured app.
 */

// Core modules - Essential system functionality
export * from './core';
export { initializeCoreModules } from './core';

// Shared modules - Reusable components and utilities
export * from './shared';

// Feature modules - Business logic and functionality
export { featureManager, availableFeatures } from './features';
// TODO: Export specific feature modules when they're created:
// export * from './features/chat';

// Configuration and app setup
export * from './config';
export { defaultConfig as config, validateConfig } from './config/index';

// Main app initialization
export async function initializeLunaWeb(customConfig?: any) {
  console.log('🚀 Initializing Luna Web 2025...');
  
  try {
    // 1. Validate configuration
    const configValid = validateConfig();
    if (!configValid) {
      throw new Error('Configuration validation failed');
    }
    console.log('✅ Configuration validated');

    // 2. Initialize core modules
    const coreStatus = await initializeCoreModules();
    console.log('✅ Core modules initialized:', coreStatus);

    // 3. Initialize enabled features
    const enabledFeatures = featureManager.getEnabledFeatures();
    console.log('✅ Enabled features:', enabledFeatures);

    // 4. Setup complete
    console.log('🎉 Luna Web 2025 initialized successfully!');
    
    return {
      success: true,
      coreModules: coreStatus,
      features: enabledFeatures,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Failed to initialize Luna Web:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

// Quick start presets
export const presets = {
  // Minimal chat app
  chatOnly: {
    features: {
      chat: { maxMessages: 100, enableFileUpload: false, enableVoiceMessages: false }
    }
  },
  
  // Full therapy platform
  fullTherapy: {
    features: {
      chat: { maxMessages: 1000, enableFileUpload: true, enableVoiceMessages: true },
      'ai-therapy': { enableCrisisDetection: true, maxSessionLength: 60, personalities: ['jamie'] },
      voice: { enableRealtime: true, enableTTS: true, enableSTT: true },
      assessment: { enableAutoSchedule: true, supportedTypes: ['PHQ-9', 'GAD-7'] },
      progress: { enableGoalSetting: true, enableAnalytics: true }
    }
  },
  
  // Community platform
  community: {
    features: {
      chat: { maxMessages: 500, enableFileUpload: true, enableVoiceMessages: false },
      community: { enablePublicSharing: true, moderationLevel: 'high' as const },
      progress: { enableGoalSetting: true, enableAnalytics: false }
    }
  }
};

// Export individual modules for tree-shaking
export { ChatWindow, ChatInput, ChatMessage } from './features/chat';
// TODO: Create missing components when needed:
// export { VoiceButton } from './features/voice';
// export { Header } from './shared/components';
// export { Button, Input, Modal } from './shared/components';
export { Button } from './shared/components';

// Version info
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

// Development utilities
export const devUtils = {
  listAvailableModules: () => {
    console.log('📦 Available modules:');
    console.log('  Core:', ['auth', 'database', 'api', 'config']);
    console.log('  Shared:', ['components', 'hooks', 'utils', 'types']);
    console.log('  Features:', Object.keys(availableFeatures));
  },
  
  checkFeatureDependencies: (featureName: string) => {
    const feature = availableFeatures[featureName];
    if (!feature) {
      console.warn(`Feature '${featureName}' not found`);
      return false;
    }
    
    console.log(`Feature '${featureName}' dependencies:`, feature.dependencies);
    const canEnable = featureManager.canEnable(featureName);
    console.log(`Can enable: ${canEnable}`);
    return canEnable;
  }
};

// Type exports for TypeScript users
export type { AppConfig, FeatureConfig } from './config';
export type { User, Session } from './core/auth';
export type { ComponentVariant, ComponentSize, ComponentColor } from './shared/components';

// React component exports with proper typing
export type { ButtonProps } from './shared/components/Button/types';