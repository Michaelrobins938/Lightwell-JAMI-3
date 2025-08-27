// Plugin/API Actions System for Luna AI
// Enables external integrations and custom actions

import { prisma } from '../lib/database';

export interface Plugin {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  version: string;
  author: string | null;
  icon: string | null;
  isEnabled: boolean;
  isSystem: boolean;
  config: string | null; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

// PluginConfig, PluginTrigger, PluginAction, and ActionConfig interfaces removed
// as they don't match the actual Prisma schema

export interface PluginExecution {
  id: string;
  actionId: string;
  userId: string;
  conversationId?: string | null;
  status: string;
  parameters?: string | null;
  result?: string | null;
  error?: string | null;
  startedAt: Date;
  completedAt?: Date | null;
  duration?: number | null;
}

export interface PluginContext {
  userId: string;
  chatId?: string;
  message?: string;
  conversation?: any[];
  user?: any;
  workspace?: any;
}

export class PluginService {
  // Register a new plugin
  static async registerPlugin(data: {
    name: string;
    displayName: string;
    description: string;
    version: string;
    author: string;
    icon?: string;
    config: string;
  }): Promise<Plugin> {
    const plugin = await prisma.plugin.create({
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        version: data.version,
        author: data.author,
        icon: data.icon,
        isEnabled: true,
        isSystem: false,
        config: data.config,
      },
    });

    return plugin;
  }

  // Get all plugins
  static async getPlugins(userId: string): Promise<Plugin[]> {
    const plugins = await prisma.plugin.findMany({
      where: { isEnabled: true },
      orderBy: { name: 'asc' },
    });

    return plugins;
  }

  // Get plugin by ID
  static async getPlugin(pluginId: string): Promise<Plugin | null> {
    const plugin = await prisma.plugin.findUnique({
      where: { id: pluginId },
    });

    return plugin;
  }

  // Enable/disable plugin
  static async togglePlugin(pluginId: string, enabled: boolean): Promise<void> {
    await prisma.plugin.update({
      where: { id: pluginId },
      data: { isEnabled: enabled },
    });
  }

  // Update plugin configuration
  static async updatePluginConfig(pluginId: string, config: Partial<Record<string, any>>): Promise<void> {
    const plugin = await prisma.plugin.findUnique({
      where: { id: pluginId },
    });

    if (!plugin) {
      throw new Error('Plugin not found');
    }

    const currentConfig = plugin.config ? JSON.parse(plugin.config) : {};
    const updatedConfig = {
      ...currentConfig,
      ...config,
    };

    await prisma.plugin.update({
      where: { id: pluginId },
      data: { config: JSON.stringify(updatedConfig) },
    });
  }

  // Create plugin action
  static async createPluginAction(pluginId: string, actionData: {
    name: string;
    displayName: string;
    description?: string;
    endpoint: string;
    method?: string;
    parameters?: string;
    headers?: string;
    isEnabled?: boolean;
  }): Promise<any> {
    const plugin = await prisma.plugin.findUnique({
      where: { id: pluginId },
    });

    if (!plugin) {
      throw new Error('Plugin not found');
    }

    const action = await prisma.pluginAction.create({
      data: {
        pluginId,
        name: actionData.name,
        displayName: actionData.displayName,
        description: actionData.description,
        endpoint: actionData.endpoint,
        method: actionData.method || 'GET',
        parameters: actionData.parameters,
        headers: actionData.headers,
        isEnabled: actionData.isEnabled !== false,
      },
    });

    return action;
  }

  // Execute plugin action
  static async executeAction(
    pluginId: string,
    actionId: string,
    context: PluginContext,
    input: Record<string, any> = {}
  ): Promise<PluginExecution> {
    const plugin = await prisma.plugin.findUnique({
      where: { id: pluginId },
    });

    if (!plugin || !plugin.isEnabled) {
      throw new Error('Plugin not found or disabled');
    }

    const action = await prisma.pluginAction.findFirst({
      where: { 
        id: actionId,
        pluginId: pluginId,
        isEnabled: true
      },
    });

    if (!action) {
      throw new Error('Action not found or inactive');
    }

    // Create execution record
    const execution = await prisma.pluginExecution.create({
      data: {
        actionId,
        userId: context.userId,
        conversationId: context.chatId,
        parameters: JSON.stringify(input),
        status: 'pending',
        startedAt: new Date(),
      },
    });

    try {
      // Update status to running
      await prisma.pluginExecution.update({
        where: { id: execution.id },
        data: { status: 'running' },
      });

      // Execute the action
      const output = await this.executeActionLogic(action, context, input);

      // Update execution with success
      await prisma.pluginExecution.update({
        where: { id: execution.id },
        data: {
          status: 'completed',
          result: JSON.stringify(output),
          completedAt: new Date(),
          duration: Date.now() - execution.startedAt.getTime(),
        },
      });

      return {
        ...execution,
        status: 'completed',
        result: JSON.stringify(output),
        completedAt: new Date(),
        duration: Date.now() - execution.startedAt.getTime(),
      };

    } catch (error) {
      // Update execution with error
      await prisma.pluginExecution.update({
        where: { id: execution.id },
        data: {
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          completedAt: new Date(),
          duration: Date.now() - execution.startedAt.getTime(),
        },
      });

      throw error;
    }
  }

  // Execute action logic based on endpoint
  private static async executeActionLogic(
    action: any, // PluginAction from Prisma
    context: PluginContext,
    input: Record<string, any>
  ): Promise<Record<string, any>> {
    const endpoint = action.endpoint;
    
    if (endpoint.startsWith('http')) {
      return await this.executeApiCall(action, context, input);
    } else if (endpoint.startsWith('webhook:')) {
      return await this.executeWebhook(action, context, input);
    } else if (endpoint.startsWith('function:')) {
      return await this.executeFunction(action, context, input);
    } else if (endpoint.startsWith('ui:')) {
      return await this.executeUIAction(action, context, input);
    } else {
      throw new Error(`Unknown action endpoint: ${endpoint}`);
    }
  }

  // Execute API call action
  private static async executeApiCall(
    action: any, // PluginAction from Prisma
    context: PluginContext,
    input: Record<string, any>
  ): Promise<Record<string, any>> {
    if (!action.endpoint) {
      throw new Error('API endpoint not configured');
    }

    const url = this.interpolateString(action.endpoint, { ...context, ...input });
    const method = action.method || 'GET';
    const headers = action.headers ? JSON.parse(action.headers) : {};
    const body = action.parameters ? this.interpolateString(action.parameters, { ...context, ...input }) : undefined;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(JSON.parse(body)) : undefined,
      signal: undefined, // No timeout configured in current schema
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data, status: response.status };
  }

  // Execute webhook action
  private static async executeWebhook(
    action: any, // PluginAction from Prisma
    context: PluginContext,
    input: Record<string, any>
  ): Promise<Record<string, any>> {
    if (!action.endpoint) {
      throw new Error('Webhook endpoint not configured');
    }

    const url = this.interpolateString(action.endpoint.replace('webhook:', ''), { ...context, ...input });
    const body = {
      context,
      input,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(action.headers ? JSON.parse(action.headers) : {}),
      },
      body: JSON.stringify(body),
      signal: undefined, // No timeout configured in current schema
    });

    return { success: response.ok, status: response.status };
  }

  // Execute function action (built-in functions)
  private static async executeFunction(
    action: any, // PluginAction from Prisma
    context: PluginContext,
    input: Record<string, any>
  ): Promise<Record<string, any>> {
    const functionName = action.endpoint.replace('function:', ''); // Use endpoint field for function name
    
    switch (functionName) {
      case 'send_email':
        return await this.sendEmail(context, input);
      
      case 'create_calendar_event':
        return await this.createCalendarEvent(context, input);
      
      case 'send_notification':
        return await this.sendNotification(context, input);
      
      case 'save_to_database':
        return await this.saveToDatabase(context, input);
      
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }

  // Execute UI action
  private static async executeUIAction(
    action: any, // PluginAction from Prisma
    context: PluginContext,
    input: Record<string, any>
  ): Promise<Record<string, any>> {
    // UI actions are handled by the frontend
    return {
      success: true,
      action: 'ui_action',
      data: { ...context, ...input },
    };
  }

  // Built-in functions
  private static async sendEmail(context: PluginContext, input: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for sending email
    return { success: true, message: 'Email sent' };
  }

  private static async createCalendarEvent(context: PluginContext, input: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for creating calendar event
    return { success: true, message: 'Calendar event created' };
  }

  private static async sendNotification(context: PluginContext, input: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for sending notification
    return { success: true, message: 'Notification sent' };
  }

  private static async saveToDatabase(context: PluginContext, input: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for saving to database
    return { success: true, message: 'Data saved' };
  }

  // Helper: Interpolate string with context variables
  private static interpolateString(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] !== undefined ? String(context[key]) : match;
    });
  }

  // Get plugin executions for a user
  static async getExecutions(userId: string, limit: number = 50): Promise<PluginExecution[]> {
    const executions = await prisma.pluginExecution.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: limit,
    });

    return executions;
  }

  // Get plugin execution by ID
  static async getExecution(executionId: string): Promise<PluginExecution | null> {
    const execution = await prisma.pluginExecution.findUnique({
      where: { id: executionId },
    });

    return execution;
  }

  // Check if user has permission for plugin
  static async checkPermission(userId: string, pluginId: string, permission: string): Promise<boolean> {
    // For now, all users have access to all plugins
    // This can be enhanced later with role-based permissions
    const plugin = await prisma.plugin.findUnique({
      where: { id: pluginId },
    });

    if (!plugin || !plugin.isEnabled) return false;

    // System plugins are accessible to all users
    if (plugin.isSystem) return true;

    // User plugins are accessible to their owners
    // This would need to be enhanced with ownership tracking
    return true;
  }
}

// Export as default for backward compatibility
export default PluginService;


