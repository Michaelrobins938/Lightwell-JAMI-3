/**
 * Authentication Module
 * 
 * Provides authentication functionality and user management.
 * Integrates with the existing AuthContext system.
 */

import { useAuth as useExistingAuth, UserPlan } from '../../../contexts/AuthContext';

// Re-export the existing auth hook
export const useAuth = useExistingAuth;

// Re-export types for compatibility
export { UserPlan } from '../../../contexts/AuthContext';

// Auth module interface
export interface AuthModule {
  useAuth: typeof useExistingAuth;
  UserPlan: typeof UserPlan;
}

// Default export for the auth module
export default {
  useAuth: useExistingAuth,
  UserPlan,
} as AuthModule;