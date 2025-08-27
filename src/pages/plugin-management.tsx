import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Puzzle, Plus, Settings, Play, AlertTriangle, CheckCircle,
  Edit, Trash2, Copy, Star, Zap, Globe, Lock, X, Code, Database
} from 'lucide-react';
import { usePlugins } from '../hooks/usePlugins';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

const PluginManagement: React.FC = () => {
  const { user } = useAuth();
  const {
    plugins,
    currentPlugin,
    isLoading,
    error,
    createPlugin,
    updatePlugin,
    deletePlugin,
    getPluginDetails,
    createPluginAction,
    executePluginAction,
    setCurrentPlugin,
    clearError
  } = usePlugins();

  const [showPluginModal, setShowPluginModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState<any>(null);
  const [editingAction, setEditingAction] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign in required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to manage plugins.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleCreatePlugin = async (pluginData: any) => {
    try {
      await createPlugin(pluginData);
      setShowPluginModal(false);
    } catch (error) {
      console.error('Failed to create plugin:', error);
    }
  };

  const handleUpdatePlugin = async (pluginId: string, updates: any) => {
    try {
      await updatePlugin(pluginId, updates);
      setShowPluginModal(false);
      setEditingPlugin(null);
    } catch (error) {
      console.error('Failed to update plugin:', error);
    }
  };

  const handleDeletePlugin = async (pluginId: string) => {
    try {
      await deletePlugin(pluginId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete plugin:', error);
    }
  };

  const handleCreateAction = async (pluginId: string, actionData: any) => {
    try {
      await createPluginAction(pluginId, actionData);
      setShowActionModal(false);
    } catch (error) {
      console.error('Failed to create action:', error);
    }
  };

  const handleExecuteAction = async (actionId: string, parameters: any) => {
    try {
      const result = await executePluginAction(actionId, undefined, parameters);
      setShowExecuteModal(false);
      setSelectedAction(null);
      // You could show the result in a toast or modal
      console.log('Plugin execution result:', result);
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Plugin Management
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Manage external integrations and API actions
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingPlugin(null);
                  setShowPluginModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Plugin
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">{error}</span>
                <button
                  onClick={clearError}
                  className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {plugins.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Puzzle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No plugins yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first plugin to extend Luna's capabilities
              </p>
              <button
                onClick={() => {
                  setEditingPlugin(null);
                  setShowPluginModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Plugin
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plugins.map((plugin) => (
                <motion.div
                  key={plugin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Puzzle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {plugin.displayName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          v{plugin.version}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {plugin.isSystem ? (
                        <Star className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Code className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {plugin.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {plugin.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {plugin.author && <span>by {plugin.author}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentPlugin(plugin);
                        setShowActionModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Add Action
                    </button>
                    <button
                      onClick={() => {
                        setEditingPlugin(plugin);
                        setShowPluginModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(plugin.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Plugin Modal */}
        {showPluginModal && (
          <PluginModal
            plugin={editingPlugin}
            onSave={editingPlugin ? handleUpdatePlugin : handleCreatePlugin}
            onCancel={() => {
              setShowPluginModal(false);
              setEditingPlugin(null);
            }}
          />
        )}

        {/* Action Modal */}
        {showActionModal && currentPlugin && (
          <ActionModal
            plugin={currentPlugin}
            action={editingAction}
            onSave={editingAction ? 
              (actionId: string, updates: any) => {
                // Handle update action
                setShowActionModal(false);
                setEditingAction(null);
              } : 
              (pluginId: string, actionData: any) => handleCreateAction(pluginId, actionData)
            }
            onCancel={() => {
              setShowActionModal(false);
              setEditingAction(null);
            }}
          />
        )}

        {/* Execute Modal */}
        {showExecuteModal && selectedAction && (
          <ExecuteModal
            action={selectedAction}
            onExecute={handleExecuteAction}
            onCancel={() => {
              setShowExecuteModal(false);
              setSelectedAction(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmModal
            onConfirm={() => handleDeletePlugin(showDeleteConfirm)}
            onCancel={() => setShowDeleteConfirm(null)}
            itemType="plugin"
          />
        )}
      </div>
    </Layout>
  );
};

// Plugin Modal Component
const PluginModal: React.FC<{
  plugin?: any;
  onSave: (pluginId: string, data: any) => void;
  onCancel: () => void;
}> = ({ plugin, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: plugin?.name || '',
    displayName: plugin?.displayName || '',
    description: plugin?.description || '',
    version: plugin?.version || '1.0.0',
    author: plugin?.author || '',
    icon: plugin?.icon || '',
    isSystem: plugin?.isSystem || false,
    config: plugin?.config || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plugin) {
      onSave(plugin.id, formData);
    } else {
      onSave('', formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {plugin ? 'Edit Plugin' : 'Create Plugin'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Plugin Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
              disabled={plugin?.isSystem}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Version
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSystem"
              checked={formData.isSystem}
              onChange={(e) => setFormData({ ...formData, isSystem: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isSystem" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              System plugin
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {plugin ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Action Modal Component
const ActionModal: React.FC<{
  plugin: any;
  action?: any;
  onSave: (pluginId: string, data: any) => void;
  onCancel: () => void;
}> = ({ plugin, action, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: action?.name || '',
    displayName: action?.displayName || '',
    description: action?.description || '',
    endpoint: action?.endpoint || '',
    method: action?.method || 'GET',
    parameters: action?.parameters || '',
    headers: action?.headers || '',
    authType: action?.authType || 'none'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(plugin.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {action ? 'Edit Action' : 'Create Action'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Action Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Endpoint
            </label>
            <input
              type="text"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Method
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Auth Type
              </label>
              <select
                value={formData.authType}
                onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="none">None</option>
                <option value="api_key">API Key</option>
                <option value="bearer">Bearer Token</option>
                <option value="oauth">OAuth</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {action ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Execute Modal Component
const ExecuteModal: React.FC<{
  action: any;
  onExecute: (actionId: string, parameters: any) => void;
  onCancel: () => void;
}> = ({ action, onExecute, onCancel }) => {
  const [parameters, setParameters] = useState('{}');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedParams = JSON.parse(parameters);
      onExecute(action.id, parsedParams);
    } catch (error) {
      alert('Invalid JSON parameters');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Execute Action: {action.displayName}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parameters (JSON)
            </label>
            <textarea
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={4}
              placeholder='{"key": "value"}'
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Execute
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
  itemType: 'plugin' | 'action';
}> = ({ onConfirm, onCancel, itemType }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Delete {itemType}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this {itemType}? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PluginManagement;


