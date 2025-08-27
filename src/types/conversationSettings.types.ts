// Per-conversation settings types and configurations

export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'local';

export type OpenAIModel = 
  | 'gpt-4o-mini' 
  | 'gpt-4o' 
  | 'gpt-4-turbo' 
  | 'gpt-4' 
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-16k';

export type AnthropicModel = 
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-opus-20240229' 
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307';

export type GoogleModel = 
  | 'gemini-pro' 
  | 'gemini-pro-vision' 
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash';

export type LocalModel = string; // Custom local model names

export type AIModel = OpenAIModel | AnthropicModel | GoogleModel | LocalModel;

export interface ModelConfig {
  id: AIModel;
  provider: ModelProvider;
  name: string;
  description: string;
  contextWindow: number;
  maxTokens: number;
  supportsVision: boolean;
  supportsStreaming: boolean;
  costPer1kTokens: {
    input: number;
    output: number;
  };
  capabilities: ModelCapability[];
}

export type ModelCapability = 
  | 'text-generation'
  | 'vision'
  | 'code-generation' 
  | 'math'
  | 'reasoning'
  | 'creative-writing'
  | 'analysis'
  | 'function-calling'
  | 'json-mode';

export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  description?: string;
  category: SystemPromptCategory;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export type SystemPromptCategory = 
  | 'general'
  | 'creative'
  | 'technical'
  | 'educational'
  | 'business'
  | 'personal'
  | 'custom';

export interface ConversationSettings {
  conversationId: string;
  model: AIModel;
  provider: ModelProvider;
  systemPrompt?: SystemPrompt;
  customSystemPrompt?: string;
  temperature: number;
  maxTokens?: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  streaming: boolean;
  jsonMode: boolean;
  memoryEnabled: boolean;
  autoTitle: boolean;
  customInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationSettingsTemplate {
  id: string;
  name: string;
  description: string;
  settings: Omit<ConversationSettings, 'conversationId' | 'createdAt' | 'updatedAt'>;
  isBuiltIn: boolean;
  category: 'general' | 'creative' | 'technical' | 'educational' | 'custom';
  icon?: string;
  usageCount: number;
}

export interface SettingsValidationResult {
  isValid: boolean;
  errors: SettingsValidationError[];
  warnings: SettingsValidationWarning[];
}

export interface SettingsValidationError {
  field: keyof ConversationSettings;
  message: string;
  code: string;
}

export interface SettingsValidationWarning {
  field: keyof ConversationSettings;
  message: string;
  code: string;
}

export interface SettingsHistory {
  conversationId: string;
  changes: SettingsChange[];
  totalChanges: number;
}

export interface SettingsChange {
  id: string;
  timestamp: Date;
  field: keyof ConversationSettings;
  oldValue: any;
  newValue: any;
  reason?: string;
  appliedBy: 'user' | 'system' | 'template';
}

export interface SettingsUsageStats {
  totalConversations: number;
  modelUsage: Record<AIModel, number>;
  providerUsage: Record<ModelProvider, number>;
  systemPromptUsage: Record<string, number>;
  templateUsage: Record<string, number>;
  averageTemperature: number;
  mostCommonSettings: Partial<ConversationSettings>;
}

export interface SettingsPersistenceData {
  settings: ConversationSettings;
  templates: ConversationSettingsTemplate[];
  systemPrompts: SystemPrompt[];
  history: SettingsHistory;
  version: string;
  exportedAt: Date;
}

export interface UseConversationSettingsOptions {
  persistToStorage?: boolean;
  validateOnChange?: boolean;
  trackHistory?: boolean;
  autoSave?: boolean;
  debounceDelay?: number;
  onSettingsChange?: (settings: ConversationSettings) => void;
  onValidationError?: (errors: SettingsValidationError[]) => void;
  onModelChange?: (model: AIModel, provider: ModelProvider) => void;
  onSystemPromptChange?: (prompt: SystemPrompt | null) => void;
}