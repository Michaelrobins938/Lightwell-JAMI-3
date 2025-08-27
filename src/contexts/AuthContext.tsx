import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

export enum UserPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  plan: UserPlan;
  planExpiresAt?: string;
  features: {
    maxTokens: number;
    maxContextLength: number;
    customInstructions: boolean;
    prioritySupport: boolean;
    teamWorkspace: boolean;
    adminDashboard: boolean;
    sso: boolean;
    soc2Compliance: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userPlan: UserPlan;
  hasFeature: (feature: keyof User['features']) => boolean;
  isPlanOrHigher: (plan: UserPlan) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  upgradePlan: (plan: UserPlan) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Default features for each plan
  const getPlanFeatures = (plan: UserPlan) => {
    switch (plan) {
      case UserPlan.FREE:
        return {
          maxTokens: 1000,
          maxContextLength: 2000,
          customInstructions: false,
          prioritySupport: false,
          teamWorkspace: false,
          adminDashboard: false,
          sso: false,
          soc2Compliance: false,
        };
      case UserPlan.PRO:
        return {
          maxTokens: 10000,
          maxContextLength: 100000,
          customInstructions: true,
          prioritySupport: true,
          teamWorkspace: false,
          adminDashboard: false,
          sso: false,
          soc2Compliance: false,
        };
      case UserPlan.ENTERPRISE:
        return {
          maxTokens: 100000,
          maxContextLength: 1000000,
          customInstructions: true,
          prioritySupport: true,
          teamWorkspace: true,
          adminDashboard: true,
          sso: true,
          soc2Compliance: true,
        };
      default:
        return getPlanFeatures(UserPlan.FREE);
    }
  };

  const checkAuth = async () => {
    // Only run auth check on client side
    if (!mounted) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const userWithFeatures = {
          ...userData,
          features: getPlanFeatures(userData.plan)
        };
        setUser(userWithFeatures);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('auth-token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (mounted) {
        localStorage.removeItem('auth-token');
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (!mounted) {
      throw new Error('Authentication not available during server-side rendering');
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('auth-token', data.data.token);

      // Fetch user data with plan info
      await checkAuth();

      // Check if user has completed onboarding
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');

      // Redirect based on onboarding status and plan
      if (!onboardingCompleted) {
        router.push('/onboarding');
      } else if (user?.plan === UserPlan.FREE) {
        router.push('/chat');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!mounted) {
      setUser(null);
      router.push('/public');
      return;
    }

    try {
      // Call logout API to invalidate token on server
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('auth-token');
      setUser(null);
      router.push('/public');
    }
  };

  const upgradePlan = async (plan: UserPlan) => {
    if (!mounted) {
      throw new Error('Plan upgrade not available during server-side rendering');
    }

    try {
      const response = await fetch('/api/billing/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upgrade failed');
      }

      // Refresh user data to get new plan
      await checkAuth();
    } catch (error) {
      console.error('Upgrade error:', error);
      throw error;
    }
  };

  // Check if user has access to a specific feature
  const hasFeature = (feature: keyof User['features']): boolean => {
    const value = user?.features[feature];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value > 0;
    return false;
  };

  // Check if user's plan is at least the specified level
  const isPlanOrHigher = (plan: UserPlan): boolean => {
    if (!user) return false;
    
    const planHierarchy = {
      [UserPlan.FREE]: 0,
      [UserPlan.PRO]: 1,
      [UserPlan.ENTERPRISE]: 2,
    };
    
    return planHierarchy[user.plan] >= planHierarchy[plan];
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      checkAuth();
    }
  }, [mounted]);

  // Redirect authenticated users away from public pages
  useEffect(() => {
    if (!isLoading && user && router.pathname === '/public') {
      if (user.plan === UserPlan.FREE) {
        router.push('/chat');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    userPlan: user?.plan || UserPlan.FREE,
    hasFeature,
    isPlanOrHigher,
    login,
    logout,
    checkAuth,
    upgradePlan,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}