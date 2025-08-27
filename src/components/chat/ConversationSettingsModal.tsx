import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Settings, ChevronDown } from 'lucide-react';
// Disabled toast to eliminate spammy notifications
// import { toast } from 'react-toastify';
import { 
  ConversationSettings,
  AIModel,
  ModelProvider,
  SystemPrompt,
  ModelConfig
} from '../../types/conversationSettings.types';
import { ConversationSettingsService } from '../../services/conversationSettingsService';

interface ConversationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string | null;
  onSave: (settings: ConversationSettings) => void;
}

export const ConversationSettingsModal: React.FC<ConversationSettingsModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  onSave,
}) => {
  const settingsService = ConversationSettingsService.getInstance();
  const [currentSettings, setCurrentSettings] = useState<Partial<ConversationSettings>>({});
  const [availableModels, setAvailableModels] = useState<ModelConfig[]>([]);
  const [availableSystemPrompts, setAvailableSystemPrompts] = useState<SystemPrompt[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (conversationId) {
        const loadedSettings = settingsService.getConversationSettings(conversationId);
        setCurrentSettings(loadedSettings || settingsService.initializeConversationSettings(conversationId));
      } else {
        // Initialize with default settings for new conversation
        setCurrentSettings(settingsService.getDefaultSettings());
      }
      setAvailableModels(settingsService.getAvailableModels());
      setAvailableSystemPrompts(settingsService.getSystemPrompts());
    }
  }, [isOpen, conversationId, settingsService]);

  const handleChange = (field: keyof ConversationSettings, value: any) => {
    setCurrentSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModelId = e.target.value as AIModel;
    const modelConfig = settingsService.getModelConfig(selectedModelId);
    if (modelConfig) {
      setCurrentSettings(prev => ({
        ...prev,
        model: selectedModelId,
        provider: modelConfig.provider,
      }));
    }
  };

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPromptId = e.target.value;
    const selectedPrompt = availableSystemPrompts.find(p => p.id === selectedPromptId);
    setCurrentSettings(prev => ({
      ...prev,
      systemPrompt: selectedPrompt || undefined,
      customSystemPrompt: selectedPrompt ? undefined : prev.customSystemPrompt, // Clear custom if built-in selected
    }));
  };

  const handleCustomSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentSettings(prev => ({
      ...prev,
      customSystemPrompt: e.target.value,
      systemPrompt: undefined, // Clear built-in if custom is being used
    }));
  };

  const handleSave = () => {
    if (currentSettings.model && currentSettings.provider) {
      try {
        let updatedSettings: ConversationSettings;
        
        if (conversationId) {
          // Update existing conversation settings
          updatedSettings = settingsService.updateConversationSettings(
            conversationId,
            currentSettings as Partial<ConversationSettings>
          );
        } else {
          // Create new conversation settings (will be applied when conversation is created)
          updatedSettings = settingsService.createTemporarySettings(
            currentSettings as Partial<ConversationSettings>
          );
        }
        
        onSave(updatedSettings);
        // toast.success('Settings saved successfully!');
        console.log('Settings saved successfully!');
        onClose();
      } catch (error) {
        console.error('Failed to save settings:', error);
        // toast.error(`Failed to save settings: ${error.message}`);
      }
    } else {
      console.log('Please select a model and provider.');
      // toast.error('Please select a model and provider.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-400" />
                Conversation Settings
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-100 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-gray-300">
              {/* Model Selection */}
              <div>
                <label htmlFor="model-select" className="block text-sm font-medium mb-1">AI Model</label>
                <div className="relative">
                  <select
                    id="model-select"
                    className="block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentSettings.model || ''}
                    onChange={handleModelChange}
                  >
                    <option value="" disabled>Select a model</option>
                    {availableModels.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name} ({model.provider.toUpperCase()})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* System Prompt Selection */}
              <div>
                <label htmlFor="system-prompt-select" className="block text-sm font-medium mb-1">System Prompt</label>
                <div className="relative">
                  <select
                    id="system-prompt-select"
                    className="block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentSettings.systemPrompt?.id || ''}
                    onChange={handleSystemPromptChange}
                  >
                    <option value="" disabled>Select a system prompt</option>
                    {availableSystemPrompts.map(prompt => (
                      <option key={prompt.id} value={prompt.id}>
                        {prompt.name}
                      </option>
                    ))}
                    <option value="custom">Custom Prompt</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Custom System Prompt Input */}
              {currentSettings.systemPrompt?.id === 'custom' || (!currentSettings.systemPrompt && currentSettings.customSystemPrompt) ? (
                <div>
                  <label htmlFor="custom-system-prompt" className="block text-sm font-medium mb-1">Custom System Prompt</label>
                  <textarea
                    id="custom-system-prompt"
                    className="block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={currentSettings.customSystemPrompt || ''}
                    onChange={handleCustomSystemPromptChange}
                    placeholder="Enter your custom system prompt here..."
                  />
                </div>
              ) : null}

              {/* Temperature */}
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium mb-1">Temperature ({currentSettings.temperature?.toFixed(1)})</label>
                <input
                  type="range"
                  id="temperature"
                  min="0" max="2" step="0.1"
                  value={currentSettings.temperature || 0.7}
                  onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg"
                />
              </div>

              {/* Max Tokens */}
              <div>
                <label htmlFor="max-tokens" className="block text-sm font-medium mb-1">Max Tokens ({currentSettings.maxTokens})</label>
                <input
                  type="number"
                  id="max-tokens"
                  min="1"
                  value={currentSettings.maxTokens || 2048}
                  onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                  className="block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Streaming Toggle */}
              <div className="flex items-center justify-between">
                <label htmlFor="streaming" className="text-sm font-medium">Streaming Responses</label>
                <input
                  type="checkbox"
                  id="streaming"
                  checked={currentSettings.streaming || false}
                  onChange={(e) => handleChange('streaming', e.target.checked)}
                  className="toggle toggle-primary"
                />
              </div>

              {/* JSON Mode Toggle */}
              <div className="flex items-center justify-between">
                <label htmlFor="json-mode" className="text-sm font-medium">JSON Mode</label>
                <input
                  type="checkbox"
                  id="json-mode"
                  checked={currentSettings.jsonMode || false}
                  onChange={(e) => handleChange('jsonMode', e.target.checked)}
                  className="toggle toggle-primary"
                />
              </div>

              {/* Memory Enabled Toggle */}
              <div className="flex items-center justify-between">
                <label htmlFor="memory-enabled" className="text-sm font-medium">Memory Enabled</label>
                <input
                  type="checkbox"
                  id="memory-enabled"
                  checked={currentSettings.memoryEnabled || false}
                  onChange={(e) => handleChange('memoryEnabled', e.target.checked)}
                  className="toggle toggle-primary"
                />
              </div>

              {/* Auto Title Toggle */}
              <div className="flex items-center justify-between">
                <label htmlFor="auto-title" className="text-sm font-medium">Auto Title Conversation</label>
                <input
                  type="checkbox"
                  id="auto-title"
                  checked={currentSettings.autoTitle || false}
                  onChange={(e) => handleChange('autoTitle', e.target.checked)}
                  className="toggle toggle-primary"
                />
              </div>

              {/* Custom Instructions */}
              <div>
                <label htmlFor="custom-instructions" className="block text-sm font-medium mb-1">Custom Instructions</label>
                <textarea
                  id="custom-instructions"
                  className="block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={currentSettings.customInstructions || ''}
                  onChange={(e) => handleChange('customInstructions', e.target.value)}
                  placeholder="Enter custom instructions for the AI..."
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};