import { createContext, useContext, useState, ReactNode } from "react";

interface CurrentSessionContextType {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
}

const CurrentSessionContext = createContext<CurrentSessionContextType | null>(null);

export function CurrentSessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  return (
    <CurrentSessionContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </CurrentSessionContext.Provider>
  );
}

export function useCurrentSession() {
  const context = useContext(CurrentSessionContext);
  if (!context) {
    throw new Error("useCurrentSession must be used within a CurrentSessionProvider");
  }
  return context;
}
