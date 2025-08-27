/**
 * Shared Module
 * 
 * Reusable components, hooks, utilities, and types that can be used
 * across all features and projects. These are the building blocks
 * for consistent, maintainable applications.
 */

// Re-export all shared modules
export * from './components';
// TODO: Create missing shared modules when needed:
// export * from './hooks';
// export * from './utils';

// Shared module registry
export interface SharedModule {
  name: string;
  version: string;
  category: 'component' | 'hook' | 'utility' | 'type';
  dependencies: string[];
}

export const sharedModules: Record<string, SharedModule> = {
  components: {
    name: 'UI Components',
    version: '1.0.0',
    category: 'component',
    dependencies: []
  },
  hooks: {
    name: 'React Hooks',
    version: '1.0.0', 
    category: 'hook',
    dependencies: ['utils']
  },
  utils: {
    name: 'Utility Functions',
    version: '1.0.0',
    category: 'utility',
    dependencies: []
  }
};

// Shared configuration
export interface SharedConfig {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      in: string;
      out: string;
      inOut: string;
    };
  };
}

export const defaultSharedConfig: SharedConfig = {
  theme: {
    primary: '#f59e0b', // GPT-5 amber
    secondary: '#ec4899', // GPT-5 pink
    accent: '#8b5cf6', // GPT-5 purple
    neutral: '#f3f4f6',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#06b6d4'
  },
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px'
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};