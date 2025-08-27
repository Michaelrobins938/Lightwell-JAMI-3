// Service for managing per-conversation settings with model and prompt configurations

import {
  ConversationSettings,
  ConversationSettingsTemplate,
  SystemPrompt,
  ModelConfig,
  AIModel,
  ModelProvider,
  SettingsValidationResult,
  SettingsValidationError,
  SettingsValidationWarning,
  SettingsHistory,
  SettingsChange,
  SettingsUsageStats,
  SettingsPersistenceData,
  SystemPromptCategory,
  ModelCapability,
} from '../types/conversationSettings.types';

export class ConversationSettingsService {
  private static instance: ConversationSettingsService;
  private conversationSettings = new Map<string, ConversationSettings>();
  private templates = new Map<string, ConversationSettingsTemplate>();
  private systemPrompts = new Map<string, SystemPrompt>();
  private settingsHistory = new Map<string, SettingsHistory>();
  private modelConfigs = new Map<AIModel, ModelConfig>();
  private persistenceVersion = '1.0.0';

  public static getInstance(): ConversationSettingsService {
    if (!ConversationSettingsService.instance) {
      ConversationSettingsService.instance = new ConversationSettingsService();
    }
    return ConversationSettingsService.instance;
  }

  constructor() {
    this.initializeModelConfigs();
    this.initializeBuiltInSystemPrompts();
    this.initializeBuiltInTemplates();
  }

  // Model configuration management
  private initializeModelConfigs(): void {
    // OpenAI Models
    this.modelConfigs.set('gpt-4o-mini', {
      id: 'gpt-4o-mini',
      provider: 'openai',
      name: 'GPT-4o Mini',
      description: 'Fast and efficient model for most tasks',
      contextWindow: 128000,
      maxTokens: 16384,
      supportsVision: true,
      supportsStreaming: true,
      costPer1kTokens: { input: 0.00015, output: 0.0006 },
      capabilities: ['text-generation', 'vision', 'code-generation', 'reasoning', 'function-calling', 'json-mode']
    });

    this.modelConfigs.set('gpt-4o', {
      id: 'gpt-4o',
      provider: 'openai',
      name: 'GPT-4o',
      description: 'Most capable multimodal model',
      contextWindow: 128000,
      maxTokens: 4096,
      supportsVision: true,
      supportsStreaming: true,
      costPer1kTokens: { input: 0.005, output: 0.015 },
      capabilities: ['text-generation', 'vision', 'code-generation', 'reasoning', 'function-calling', 'json-mode']
    });

    this.modelConfigs.set('gpt-4-turbo', {
      id: 'gpt-4-turbo',
      provider: 'openai',
      name: 'GPT-4 Turbo',
      description: 'Latest GPT-4 with improved performance',
      contextWindow: 128000,
      maxTokens: 4096,
      supportsVision: true,
      supportsStreaming: true,
      costPer1kTokens: { input: 0.01, output: 0.03 },
      capabilities: ['text-generation', 'vision', 'code-generation', 'reasoning', 'function-calling', 'json-mode']
    });

    this.modelConfigs.set('gpt-3.5-turbo', {
      id: 'gpt-3.5-turbo',
      provider: 'openai',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and cost-effective for simple tasks',
      contextWindow: 16385,
      maxTokens: 4096,
      supportsVision: false,
      supportsStreaming: true,
      costPer1kTokens: { input: 0.0005, output: 0.0015 },
      capabilities: ['text-generation', 'code-generation', 'function-calling', 'json-mode']
    });

    // Anthropic Models
    this.modelConfigs.set('claude-3-5-sonnet-20241022', {
      id: 'claude-3-5-sonnet-20241022',
      provider: 'anthropic',
      name: 'Claude 3.5 Sonnet',
      description: 'Best balance of intelligence and speed',
      contextWindow: 200000,
      maxTokens: 8192,
      supportsVision: true,
      supportsStreaming: true,
      costPer1kTokens: { input: 0.003, output: 0.015 },
      capabilities: ['text-generation', 'vision', 'code-generation', 'reasoning', 'analysis', 'creative-writing']
    });

    this.modelConfigs.set('claude-3-opus-20240229', {
      id: 'claude-3-opus-20240229',
      provider: 'anthropic',
      name: 'Claude 3 Opus',
      description: 'Most intelligent model for complex tasks',
      contextWindow: 200000,
      maxTokens: 4096,
      supportsVision: true,
      supportsStreaming: true,
      costPer1kTokens: { input: 0.015, output: 0.075 },
      capabilities: ['text-generation', 'vision', 'code-generation', 'reasoning', 'analysis', 'creative-writing', 'math']
    });

    // Google Models
    this.modelConfigs.set('gemini-1.5-pro', {
      id: 'gemini-1.5-pro',
      provider: 'google',
      name: 'Gemini 1.5 Pro',
      description: 'Google\'s most capable model',
      contextWindow: 2097152,
      maxTokens: 8192,
      supportsVision: true,
      supportsStreaming: true,
      costPer1kTokens: { input: 0.00125, output: 0.005 },
      capabilities: ['text-generation', 'vision', 'code-generation', 'reasoning', 'analysis']
    });
  }

  private initializeBuiltInSystemPrompts(): void {
    const builtInPrompts: Omit<SystemPrompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>[] = [
      {
        name: 'Default Assistant',
        content: 'You are a helpful, harmless, and honest AI assistant.',
        description: 'Standard helpful assistant behavior',
        category: 'general',
        isCustom: false,
      },
      {
        name: 'Code Assistant',
        content: 'You are an expert software developer. Provide clean, well-commented code with explanations. Focus on best practices, security, and maintainability.',
        description: 'Specialized for programming tasks',
        category: 'technical',
        isCustom: false,
      },
      {
        name: 'Creative Writer',
        content: 'You are a creative writing assistant. Help with storytelling, character development, and creative expression. Be imaginative and supportive.',
        description: 'For creative writing and storytelling',
        category: 'creative',
        isCustom: false,
      },
      {
        name: 'Research Assistant',
        content: 'You are a thorough research assistant. Provide detailed, well-sourced information. Break down complex topics and present multiple perspectives.',
        description: 'For research and analysis tasks',
        category: 'educational',
        isCustom: false,
      },
      {
        name: 'Business Advisor',
        content: 'You are a knowledgeable business consultant. Provide strategic advice, analyze problems, and suggest practical solutions with ROI considerations.',
        description: 'For business strategy and decisions',
        category: 'business',
        isCustom: false,
      },
      {
        name: 'Therapist',
        content: 'You are a compassionate AI therapist named Luna. You provide empathetic, supportive responses while maintaining professional boundaries. Focus on active listening and helpful guidance.',
        description: 'Therapeutic and supportive conversations',
        category: 'personal',
        isCustom: false,
      },
    ];

    builtInPrompts.forEach((prompt, index) => {
      const id = `builtin-${index + 1}`;
      this.systemPrompts.set(id, {
        ...prompt,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
      });
    });
  }

  private initializeBuiltInTemplates(): void {
    const builtInTemplates: Omit<ConversationSettingsTemplate, 'id' | 'usageCount'>[] = [
      {
        name: 'Balanced Chat',
        description: 'Good balance of creativity and consistency',
        category: 'general',
        isBuiltIn: true,
        icon: 'chat',
        settings: {
          model: 'gpt-4o-mini',
          provider: 'openai',
          systemPrompt: this.systemPrompts.get('builtin-1'),
          temperature: 0.7,
          maxTokens: 2048,
          topP: 1.0,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0,
          streaming: true,
          jsonMode: false,
          memoryEnabled: true,
          autoTitle: true,
        },
      },
      {
        name: 'Creative Mode',
        description: 'High creativity for storytelling and brainstorming',
        category: 'creative',
        isBuiltIn: true,
        icon: 'lightbulb',
        settings: {
          model: 'gpt-4o',
          provider: 'openai',
          systemPrompt: this.systemPrompts.get('builtin-3'),
          temperature: 1.0,
          maxTokens: 4096,
          topP: 0.95,
          frequencyPenalty: 0.1,
          presencePenalty: 0.1,
          streaming: true,
          jsonMode: false,
          memoryEnabled: true,
          autoTitle: true,
        },
      },
      {
        name: 'Code Assistant',
        description: 'Optimized for programming and technical discussions',
        category: 'technical',
        isBuiltIn: true,
        icon: 'code',
        settings: {
          model: 'gpt-4o-mini',
          provider: 'openai',
          systemPrompt: this.systemPrompts.get('builtin-2'),
          temperature: 0.3,
          maxTokens: 4096,
          topP: 1.0,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0,
          streaming: true,
          jsonMode: false,
          memoryEnabled: true,
          autoTitle: true,
        },
      },
      {
        name: 'Research Mode',
        description: 'Focused on detailed analysis and research',
        category: 'educational',
        isBuiltIn: true,
        icon: 'book',
        settings: {
          model: 'claude-3-5-sonnet-20241022',
          provider: 'anthropic',
          systemPrompt: this.systemPrompts.get('builtin-4'),
          temperature: 0.2,
          maxTokens: 4096,
          topP: 1.0,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0,
          streaming: true,
          jsonMode: false,
          memoryEnabled: true,
          autoTitle: true,
        },
      },
      {
        name: 'Therapy Session',
        description: 'Empathetic AI therapist with supportive responses',
        category: 'general',
        isBuiltIn: true,
        icon: 'heart',
        settings: {
          model: 'gpt-4o',
          provider: 'openai',
          systemPrompt: this.systemPrompts.get('builtin-6'),
          temperature: 0.8,
          maxTokens: 3000,
          topP: 0.9,
          frequencyPenalty: 0.2,
          presencePenalty: 0.3,
          streaming: true,
          jsonMode: false,
          memoryEnabled: true,
          autoTitle: true,
        },
      },
    ];

    builtInTemplates.forEach((template, index) => {
      const id = `builtin-template-${index + 1}`;
      this.templates.set(id, {
        ...template,
        id,
        usageCount: 0,
      });
    });
  }

  // Settings management
  initializeConversationSettings(conversationId: string, template?: ConversationSettingsTemplate): ConversationSettings {
    const existingSettings = this.getConversationSettings(conversationId);
    if (existingSettings) {
      return existingSettings;
    }

    const baseSettings = template?.settings || this.getDefaultSettings();
    const settings: ConversationSettings = {
      conversationId,
      ...baseSettings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.conversationSettings.set(conversationId, settings);
    this.persistSettings(conversationId);
    
    if (template) {
      this.incrementTemplateUsage(template.id);
    }

    return settings;
  }

  getConversationSettings(conversationId: string): ConversationSettings | null {
    // Try to get from memory first
    let settings = this.conversationSettings.get(conversationId);
    
    // If not in memory, try to load from persistence
    if (!settings) {
      const persistedSettings = this.loadPersistedSettings(conversationId);
      settings = persistedSettings || undefined;
      if (settings) {
        this.conversationSettings.set(conversationId, settings);
      }
    }

    return settings || null;
  }

  updateConversationSettings(
    conversationId: string, 
    updates: Partial<ConversationSettings>,
    reason?: string
  ): ConversationSettings {
    const currentSettings = this.getConversationSettings(conversationId);
    if (!currentSettings) {
      throw new Error(`Conversation settings not found for ${conversationId}`);
    }

    // Track changes for history
    const changes: SettingsChange[] = [];
    Object.entries(updates).forEach(([key, newValue]) => {
      const field = key as keyof ConversationSettings;
      const oldValue = currentSettings[field];
      
      if (oldValue !== newValue) {
        changes.push({
          id: `${conversationId}-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          field,
          oldValue,
          newValue,
          reason,
          appliedBy: 'user',
        });
      }
    });

    const updatedSettings: ConversationSettings = {
      ...currentSettings,
      ...updates,
      updatedAt: new Date(),
    };

    this.conversationSettings.set(conversationId, updatedSettings);
    this.addSettingsHistory(conversationId, changes);
    this.persistSettings(conversationId);

    return updatedSettings;
  }

  // Model management
  getAvailableModels(): ModelConfig[] {
    return Array.from(this.modelConfigs.values());
  }

  getModelConfig(modelId: AIModel): ModelConfig | null {
    return this.modelConfigs.get(modelId) || null;
  }

  getModelsByProvider(provider: ModelProvider): ModelConfig[] {
    return Array.from(this.modelConfigs.values())
      .filter(config => config.provider === provider);
  }

  getModelsByCapability(capability: ModelCapability): ModelConfig[] {
    return Array.from(this.modelConfigs.values())
      .filter(config => config.capabilities.includes(capability));
  }

  // System prompts management
  getSystemPrompts(): SystemPrompt[] {
    return Array.from(this.systemPrompts.values());
  }

  getSystemPromptsByCategory(category: SystemPromptCategory): SystemPrompt[] {
    return Array.from(this.systemPrompts.values())
      .filter(prompt => prompt.category === category);
  }

  createSystemPrompt(prompt: Omit<SystemPrompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): SystemPrompt {
    const id = `custom-${Date.now()}-${Math.random()}`;
    const newPrompt: SystemPrompt = {
      ...prompt,
      id,
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
    };

    this.systemPrompts.set(id, newPrompt);
    this.persistSystemPrompts();
    return newPrompt;
  }

  updateSystemPrompt(id: string, updates: Partial<SystemPrompt>): SystemPrompt {
    const prompt = this.systemPrompts.get(id);
    if (!prompt) {
      throw new Error(`System prompt ${id} not found`);
    }

    if (!prompt.isCustom) {
      throw new Error(`Cannot modify built-in system prompt ${id}`);
    }

    const updatedPrompt: SystemPrompt = {
      ...prompt,
      ...updates,
      updatedAt: new Date(),
    };

    this.systemPrompts.set(id, updatedPrompt);
    this.persistSystemPrompts();
    return updatedPrompt;
  }

  deleteSystemPrompt(id: string): boolean {
    const prompt = this.systemPrompts.get(id);
    if (!prompt || !prompt.isCustom) {
      return false;
    }

    this.systemPrompts.delete(id);
    this.persistSystemPrompts();
    return true;
  }

  // Templates management
  getSettingsTemplates(): ConversationSettingsTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: string): ConversationSettingsTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.category === category);
  }

  createSettingsTemplate(template: Omit<ConversationSettingsTemplate, 'id' | 'usageCount'>): ConversationSettingsTemplate {
    const id = `custom-template-${Date.now()}-${Math.random()}`;
    const newTemplate: ConversationSettingsTemplate = {
      ...template,
      id,
      isBuiltIn: false,
      usageCount: 0,
    };

    this.templates.set(id, newTemplate);
    this.persistTemplates();
    return newTemplate;
  }

  // Validation
  validateSettings(settings: Partial<ConversationSettings>): SettingsValidationResult {
    const errors: SettingsValidationError[] = [];
    const warnings: SettingsValidationWarning[] = [];

    // Validate model
    if (settings.model && !this.modelConfigs.has(settings.model)) {
      errors.push({
        field: 'model',
        message: `Model "${settings.model}" is not supported`,
        code: 'INVALID_MODEL'
      });
    }

    // Validate temperature
    if (settings.temperature !== undefined && (settings.temperature < 0 || settings.temperature > 2)) {
      errors.push({
        field: 'temperature',
        message: 'Temperature must be between 0 and 2',
        code: 'INVALID_TEMPERATURE'
      });
    }

    // Validate maxTokens
    if (settings.maxTokens !== undefined && settings.model) {
      const modelConfig = this.modelConfigs.get(settings.model);
      if (modelConfig && settings.maxTokens > modelConfig.maxTokens) {
        warnings.push({
          field: 'maxTokens',
          message: `Max tokens (${settings.maxTokens}) exceeds model limit (${modelConfig.maxTokens})`,
          code: 'EXCEEDS_MODEL_LIMIT'
        });
      }
    }

    // Validate topP
    if (settings.topP !== undefined && (settings.topP < 0 || settings.topP > 1)) {
      errors.push({
        field: 'topP',
        message: 'Top P must be between 0 and 1',
        code: 'INVALID_TOP_P'
      });
    }

    // Validate penalties
    if (settings.frequencyPenalty !== undefined && (settings.frequencyPenalty < -2 || settings.frequencyPenalty > 2)) {
      errors.push({
        field: 'frequencyPenalty',
        message: 'Frequency penalty must be between -2 and 2',
        code: 'INVALID_FREQUENCY_PENALTY'
      });
    }

    if (settings.presencePenalty !== undefined && (settings.presencePenalty < -2 || settings.presencePenalty > 2)) {
      errors.push({
        field: 'presencePenalty',
        message: 'Presence penalty must be between -2 and 2',
        code: 'INVALID_PRESENCE_PENALTY'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Statistics
  getUsageStats(): SettingsUsageStats {
    const allSettings = Array.from(this.conversationSettings.values());
    
    if (allSettings.length === 0) {
      return {
        totalConversations: 0,
        modelUsage: {} as Record<AIModel, number>,
        providerUsage: {} as Record<ModelProvider, number>,
        systemPromptUsage: {},
        templateUsage: {},
        averageTemperature: 0,
        mostCommonSettings: {},
      };
    }

    // Calculate model usage
    const modelUsage = allSettings.reduce((acc, settings) => {
      acc[settings.model] = (acc[settings.model] || 0) + 1;
      return acc;
    }, {} as Record<AIModel, number>);

    // Calculate provider usage
    const providerUsage = allSettings.reduce((acc, settings) => {
      acc[settings.provider] = (acc[settings.provider] || 0) + 1;
      return acc;
    }, {} as Record<ModelProvider, number>);

    // Calculate system prompt usage
    const systemPromptUsage = allSettings.reduce((acc, settings) => {
      if (settings.systemPrompt) {
        acc[settings.systemPrompt.id] = (acc[settings.systemPrompt.id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Calculate template usage
    const templateUsage = Array.from(this.templates.values()).reduce((acc, template) => {
      acc[template.id] = template.usageCount;
      return acc;
    }, {} as Record<string, number>);

    // Calculate average temperature
    const averageTemperature = allSettings.reduce((sum, settings) => sum + settings.temperature, 0) / allSettings.length;

    // Find most common settings
    const mostCommonModel = Object.entries(modelUsage).sort(([,a], [,b]) => b - a)[0]?.[0] as AIModel;
    const mostCommonProvider = Object.entries(providerUsage).sort(([,a], [,b]) => b - a)[0]?.[0] as ModelProvider;

    return {
      totalConversations: allSettings.length,
      modelUsage,
      providerUsage,
      systemPromptUsage,
      templateUsage,
      averageTemperature,
      mostCommonSettings: {
        model: mostCommonModel,
        provider: mostCommonProvider,
        temperature: Math.round(averageTemperature * 100) / 100,
      },
    };
  }

  // Private helper methods
  public getDefaultSettings(): Omit<ConversationSettings, 'conversationId' | 'createdAt' | 'updatedAt'> {
    return {
      model: 'gpt-4o-mini',
      provider: 'openai',
      systemPrompt: this.systemPrompts.get('builtin-1'),
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1.0,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      streaming: true,
      jsonMode: false,
      memoryEnabled: true,
      autoTitle: true,
    };
  }

  private addSettingsHistory(conversationId: string, changes: SettingsChange[]): void {
    if (changes.length === 0) return;

    let history = this.settingsHistory.get(conversationId);
    if (!history) {
      history = {
        conversationId,
        changes: [],
        totalChanges: 0,
      };
    }

    history.changes.push(...changes);
    history.totalChanges += changes.length;
    
    // Keep only last 50 changes
    if (history.changes.length > 50) {
      history.changes = history.changes.slice(-50);
    }

    this.settingsHistory.set(conversationId, history);
  }

  private incrementTemplateUsage(templateId: string): void {
    const template = this.templates.get(templateId);
    if (template) {
      template.usageCount++;
      this.templates.set(templateId, template);
    }
  }

  // Persistence
  private persistSettings(conversationId: string): void {
    if (typeof window === 'undefined') return;

    const settings = this.conversationSettings.get(conversationId);
    if (!settings) return;

    try {
      localStorage.setItem(
        `luna-conversation-settings-${conversationId}`,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.warn('Failed to persist conversation settings:', error);
    }
  }

  private loadPersistedSettings(conversationId: string): ConversationSettings | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(`luna-conversation-settings-${conversationId}`);
      if (stored) {
        const settings = JSON.parse(stored) as ConversationSettings;
        // Convert date strings back to Date objects
        settings.createdAt = new Date(settings.createdAt);
        settings.updatedAt = new Date(settings.updatedAt);
        return settings;
      }
    } catch (error) {
      console.warn('Failed to load persisted settings:', error);
    }

    return null;
  }

  private persistSystemPrompts(): void {
    if (typeof window === 'undefined') return;

    const customPrompts = Array.from(this.systemPrompts.values()).filter(p => p.isCustom);
    try {
      localStorage.setItem('luna-custom-system-prompts', JSON.stringify(customPrompts));
    } catch (error) {
      console.warn('Failed to persist system prompts:', error);
    }
  }

  private persistTemplates(): void {
    if (typeof window === 'undefined') return;

    const customTemplates = Array.from(this.templates.values()).filter(t => !t.isBuiltIn);
    try {
      localStorage.setItem('luna-custom-templates', JSON.stringify(customTemplates));
    } catch (error) {
      console.warn('Failed to persist templates:', error);
    }
  }

  // Export/Import
  exportConversationSettings(conversationId: string): string | null {
    const settings = this.getConversationSettings(conversationId);
    const history = this.settingsHistory.get(conversationId);
    
    if (!settings) return null;

    const exportData: SettingsPersistenceData = {
      settings,
      templates: Array.from(this.templates.values()),
      systemPrompts: Array.from(this.systemPrompts.values()),
      history: history || { conversationId, changes: [], totalChanges: 0 },
      version: this.persistenceVersion,
      exportedAt: new Date(),
    };

    return JSON.stringify(exportData, null, 2);
  }

  importConversationSettings(conversationId: string, dataJson: string): boolean {
    try {
      const data = JSON.parse(dataJson) as SettingsPersistenceData;
      
      // Validate version compatibility
      if (data.version !== this.persistenceVersion) {
        console.warn('Settings version mismatch, some features may not work correctly');
      }

      // Import settings
      const settings: ConversationSettings = {
        ...data.settings,
        conversationId, // Ensure correct conversation ID
        createdAt: new Date(data.settings.createdAt),
        updatedAt: new Date(),
      };

      this.conversationSettings.set(conversationId, settings);
      this.persistSettings(conversationId);

      return true;
    } catch (error) {
      console.error('Failed to import conversation settings:', error);
      return false;
    }
  }

  // Create temporary settings for new conversations
  createTemporarySettings(settings: Partial<ConversationSettings>): ConversationSettings {
    const defaultSettings = this.getDefaultSettings();
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const tempSettings: ConversationSettings = {
      conversationId: tempId,
      ...defaultSettings,
      ...settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store temporarily for later use when conversation is created
    this.conversationSettings.set(tempId, tempSettings);
    
    return tempSettings;
  }

  // Cleanup
  dispose(): void {
    this.conversationSettings.clear();
    this.templates.clear();
    this.systemPrompts.clear();
    this.settingsHistory.clear();
    this.modelConfigs.clear();
  }
}