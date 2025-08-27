import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Puzzle, Play, Settings, AlertTriangle, CheckCircle,
  Clock, Zap, X, ChevronDown, ChevronRight
} from 'lucide-react';
import { usePlugins } from '../../hooks/usePlugins';

interface PluginExecutorProps {
  conversationId?: string;
  onResult?: (result: any) => void;
  className?: string;
}

export const PluginExecutor: React.FC<PluginExecutorProps> = ({
  conversationId,
  onResult,
  className = ''
}) => {
  const { plugins, executePluginAction } = usePlugins();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [parameters, setParameters] = useState('{}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!selectedAction) return;

    setIsExecuting(true);
    setError(null);
    setExecutionResult(null);

    try {
      const parsedParams = JSON.parse(parameters);
      const result = await executePluginAction(selectedAction.id, conversationId, parsedParams);
      setExecutionResult(result);
      onResult?.(result);
    } catch (err: any) {
      setError(err.message || 'Failed to execute plugin action');
    } finally {
      setIsExecuting(false);
    }
  };

  const resetExecution = () => {
    setExecutionResult(null);
    setError(null);
    setParameters('{}');
  };

  const availablePlugins = plugins.filter(plugin => plugin.isEnabled);

  return (
    <div className={`${className} bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-900 dark:text-white">
              Plugin Actions
            </span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {availablePlugins.length === 0 ? (
                <div className="text-center py-4">
                  <Puzzle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No plugins available
                  </p>
                </div>
              ) : (
                <>
                  {/* Plugin Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Plugin
                    </label>
                    <select
                      value={selectedPlugin?.id || ''}
                      onChange={(e) => {
                        const plugin = availablePlugins.find(p => p.id === e.target.value);
                        setSelectedPlugin(plugin || null);
                        setSelectedAction(null);
                        resetExecution();
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Choose a plugin...</option>
                      {availablePlugins.map((plugin) => (
                        <option key={plugin.id} value={plugin.id}>
                          {plugin.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Selection */}
                  {selectedPlugin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Action
                      </label>
                      <select
                        value={selectedAction?.id || ''}
                        onChange={(e) => {
                          const action = selectedPlugin.actions?.find((a: any) => a.id === e.target.value);
                          setSelectedAction(action || null);
                          resetExecution();
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Choose an action...</option>
                        {selectedPlugin.actions?.map((action: any) => (
                          <option key={action.id} value={action.id}>
                            {action.displayName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Parameters Input */}
                  {selectedAction && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Parameters (JSON)
                      </label>
                      <textarea
                        value={parameters}
                        onChange={(e) => setParameters(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        rows={3}
                        placeholder='{"key": "value"}'
                      />
                    </div>
                  )}

                  {/* Execute Button */}
                  {selectedAction && (
                    <button
                      onClick={handleExecute}
                      disabled={isExecuting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isExecuting ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Execute Action
                        </>
                      )}
                    </button>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
                        <button
                          onClick={() => setError(null)}
                          className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Result Display */}
                  {executionResult && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-green-800 dark:text-green-200 font-medium text-sm">
                          Execution Successful
                        </span>
                        <button
                          onClick={() => setExecutionResult(null)}
                          className="ml-auto text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <pre className="text-green-700 dark:text-green-300 text-xs overflow-x-auto">
                        {JSON.stringify(executionResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


