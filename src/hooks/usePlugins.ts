import { useState, useCallback, useEffect } from 'react';

export interface Plugin {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  category: 'productivity' | 'utility' | 'entertainment' | 'integration';
  description: string;
  execute: (params: any) => Promise<any>;
  config?: Record<string, any>;
}

export interface UsePluginsReturn {
  plugins: Plugin[];
  enabledPlugins: Plugin[];
  isLoading: boolean;
  error: string | null;
  loadPlugins: () => Promise<void>;
  enablePlugin: (pluginId: string) => Promise<void>;
  disablePlugin: (pluginId: string) => Promise<void>;
  executePlugin: (pluginId: string, params: any) => Promise<any>;
  getPluginByCategory: (category: string) => Plugin[];
  installPlugin: (plugin: Omit<Plugin, 'id'>) => Promise<void>;
  uninstallPlugin: (pluginId: string) => Promise<void>;
}

export function usePlugins(): UsePluginsReturn {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabledPlugins = plugins.filter(plugin => plugin.enabled);

  const loadPlugins = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/plugins');
      if (!response.ok) {
        throw new Error(`Failed to load plugins: ${response.status}`);
      }

      const data = await response.json();
      setPlugins(data.plugins || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plugins');
      console.error('Plugin loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enablePlugin = useCallback(async (pluginId: string) => {
    try {
      const response = await fetch(`/api/plugins/${pluginId}/enable`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to enable plugin: ${response.status}`);
      }

      setPlugins(prev => 
        prev.map(plugin => 
          plugin.id === pluginId 
            ? { ...plugin, enabled: true }
            : plugin
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable plugin');
      console.error('Plugin enable error:', err);
    }
  }, []);

  const disablePlugin = useCallback(async (pluginId: string) => {
    try {
      const response = await fetch(`/api/plugins/${pluginId}/disable`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to disable plugin: ${response.status}`);
      }

      setPlugins(prev => 
        prev.map(plugin => 
          plugin.id === pluginId 
            ? { ...plugin, enabled: false }
            : plugin
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable plugin');
      console.error('Plugin disable error:', err);
    }
  }, []);

  const executePlugin = useCallback(async (pluginId: string, params: any) => {
    const plugin = plugins.find(p => p.id === pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (!plugin.enabled) {
      throw new Error(`Plugin ${pluginId} is not enabled`);
    }

    try {
      return await plugin.execute(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Plugin execution failed');
      throw err;
    }
  }, [plugins]);

  const getPluginByCategory = useCallback((category: string): Plugin[] => {
    return plugins.filter(plugin => plugin.category === category);
  }, [plugins]);

  const installPlugin = useCallback(async (plugin: Omit<Plugin, 'id'>) => {
    try {
      const response = await fetch('/api/plugins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plugin),
      });

      if (!response.ok) {
        throw new Error(`Failed to install plugin: ${response.status}`);
      }

      const installedPlugin = await response.json();
      setPlugins(prev => [...prev, installedPlugin]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to install plugin');
      console.error('Plugin install error:', err);
    }
  }, []);

  const uninstallPlugin = useCallback(async (pluginId: string) => {
    try {
      const response = await fetch(`/api/plugins/${pluginId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to uninstall plugin: ${response.status}`);
      }

      setPlugins(prev => prev.filter(plugin => plugin.id !== pluginId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to uninstall plugin');
      console.error('Plugin uninstall error:', err);
    }
  }, []);

  useEffect(() => {
    loadPlugins();
  }, [loadPlugins]);

  return {
    plugins,
    enabledPlugins,
    isLoading,
    error,
    loadPlugins,
    enablePlugin,
    disablePlugin,
    executePlugin,
    getPluginByCategory,
    installPlugin,
    uninstallPlugin,
  };
}