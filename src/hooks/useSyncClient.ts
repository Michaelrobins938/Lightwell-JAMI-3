import { useState, useEffect, useCallback } from 'react';

interface SyncClientState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  error: string | null;
}

interface SyncClientActions {
  sync: () => Promise<void>;
  forceSync: () => Promise<void>;
  reconnect: () => Promise<void>;
}

export const useSyncClient = (): SyncClientState & SyncClientActions => {
  const [state, setState] = useState<SyncClientState>({
    isConnected: false,
    isSyncing: false,
    lastSyncTime: null,
    error: null
  });

  const sync = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isSyncing: true, error: null }));

      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState(prev => ({
        ...prev,
        isConnected: true,
        isSyncing: false,
        lastSyncTime: new Date()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      }));
    }
  }, []);

  const forceSync = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isSyncing: true, error: null }));

      // Force sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setState(prev => ({
        ...prev,
        isConnected: true,
        isSyncing: false,
        lastSyncTime: new Date()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Force sync failed'
      }));
    }
  }, []);

  const reconnect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isConnected: false, error: null }));

      // Reconnection logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      setState(prev => ({
        ...prev,
        isConnected: true,
        lastSyncTime: new Date()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Reconnection failed'
      }));
    }
  }, []);

  useEffect(() => {
    // Initialize connection
    sync();

    // Set up periodic sync
    const interval = setInterval(() => {
      if (state.isConnected && !state.isSyncing) {
        sync();
      }
    }, 30000); // Sync every 30 seconds

    return () => clearInterval(interval);
  }, [sync, state.isConnected, state.isSyncing]);

  return {
    ...state,
    sync,
    forceSync,
    reconnect
  };
};


