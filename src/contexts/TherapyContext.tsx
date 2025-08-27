import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface TherapySession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  emotionalState: string;
  crisisLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  therapeuticTechniques: string[];
  notes: string;
}

export interface TherapyContextType {
  currentSession: TherapySession | null;
  sessionHistory: TherapySession[];
  isInSession: boolean;
  startSession: (userId: string) => Promise<void>;
  endSession: () => Promise<void>;
  updateSession: (updates: Partial<TherapySession>) => Promise<void>;
  addNote: (note: string) => Promise<void>;
}

const TherapyContext = createContext<TherapyContextType | undefined>(undefined);

export function useTherapy() {
  const context = useContext(TherapyContext);
  if (context === undefined) {
    throw new Error('useTherapy must be used within a TherapyProvider');
  }
  return context;
}

interface TherapyProviderProps {
  children: ReactNode;
}

export function TherapyProvider({ children }: TherapyProviderProps) {
  const [currentSession, setCurrentSession] = useState<TherapySession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<TherapySession[]>([]);

  const startSession = async (userId: string) => {
    const newSession: TherapySession = {
      id: `session-${Date.now()}`,
      userId,
      startTime: new Date(),
      emotionalState: 'neutral',
      crisisLevel: 'NONE',
      therapeuticTechniques: [],
      notes: ''
    };
    setCurrentSession(newSession);
  };

  const endSession = async () => {
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        endTime: new Date()
      };
      setSessionHistory(prev => [...prev, endedSession]);
      setCurrentSession(null);
    }
  };

  const updateSession = async (updates: Partial<TherapySession>) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addNote = async (note: string) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        notes: prev.notes ? `${prev.notes}\n${note}` : note
      } : null);
    }
  };

  const value: TherapyContextType = {
    currentSession,
    sessionHistory,
    isInSession: !!currentSession,
    startSession,
    endSession,
    updateSession,
    addNote
  };

  return (
    <TherapyContext.Provider value={value}>
      {children}
    </TherapyContext.Provider>
  );
}
