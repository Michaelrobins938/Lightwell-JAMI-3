import { useState, useEffect, useCallback } from 'react';

// Define User interface
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'superadmin';
  permissions?: string[];
  lastLogin?: Date;
  isActive?: boolean;
}

// Authentication state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  // Initial state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulated login - replace with actual authentication logic
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: 'Test User',
        role: 'user',
        avatar: '/default-avatar.png',
        permissions: ['read', 'write'],
        lastLogin: new Date(),
        isActive: true
      };

      // Simulate async login process
      await new Promise(resolve => setTimeout(resolve, 500));

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return mockUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate logout process
      await new Promise(resolve => setTimeout(resolve, 300));

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: Partial<User> & { password: string }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulated registration - replace with actual registration logic
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email || '',
        name: userData.name,
        role: 'user',
        avatar: userData.avatar || '/default-avatar.png',
        permissions: ['read'],
        lastLogin: new Date(),
        isActive: true
      };

      // Simulate async registration process
      await new Promise(resolve => setTimeout(resolve, 500));

      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      setAuthState(prev => {
        if (!prev.user) throw new Error('No user logged in');
        
        const updatedUser = { ...prev.user, ...updates };
        
        return {
          ...prev,
          user: updatedUser,
          isLoading: false,
          error: null
        };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate checking authentication status
        // In a real app, this would check for a valid token, session, etc.
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setAuthState({
            user: parsedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication check failed'
        });
      }
    };

    checkAuthStatus();
  }, []);

  // Return auth methods and state
  return {
    ...authState,
    login,
    logout,
    register,
    updateProfile
  };
};

