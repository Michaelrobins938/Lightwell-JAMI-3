import { EventEmitter } from 'events';
import { prisma } from '../lib/database';
import { verifyToken } from '../middleware/auth-middleware';

export interface SyncEvent {
  id: string;
  userId: string;
  deviceId: string;
  eventType: 'message_sent' | 'message_edited' | 'message_deleted' | 'conversation_created' | 'conversation_updated' | 'settings_updated';
  resourceType: 'conversation' | 'message' | 'settings';
  resourceId: string;
  eventData: any;
  timestamp: Date;
  syncVersion: number;
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  userAgent?: string;
}

export interface SyncConflict {
  id: string;
  userId: string;
  resourceType: string;
  resourceId: string;
  deviceId1: string;
  deviceId2: string;
  version1: number;
  version2: number;
  data1: any;
  data2: any;
  resolution?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export class SyncService extends EventEmitter {
  private activeConnections = new Map<string, any>(); // socketId -> { userId, deviceId, socket }
  private deviceHeartbeats = new Map<string, NodeJS.Timeout>();

  constructor() {
    super();
    this.startHeartbeatCleanup();
  }

  /**
   * Register a new device connection
   */
  async registerDevice(
    socketId: string,
    userId: string,
    deviceInfo: DeviceInfo,
    socket: any
  ): Promise<void> {
    try {
      // Create or update device record
      const device = await prisma.device.upsert({
        where: {
          userId_deviceId: {
            userId,
            deviceId: deviceInfo.deviceId,
          },
        },
        update: {
          deviceName: deviceInfo.deviceName,
          deviceType: deviceInfo.deviceType,
          userAgent: deviceInfo.userAgent,
          lastSeen: new Date(),
          isActive: true,
        },
        create: {
          userId,
          deviceId: deviceInfo.deviceId,
          deviceName: deviceInfo.deviceName,
          deviceType: deviceInfo.deviceType,
          userAgent: deviceInfo.userAgent,
          syncToken: this.generateSyncToken(),
        },
      });

      // Store connection info
      this.activeConnections.set(socketId, {
        userId,
        deviceId: deviceInfo.deviceId,
        socket,
        device,
      });

      // Set up heartbeat
      this.setupHeartbeat(socketId, userId, deviceInfo.deviceId);

      // Send initial sync data
      await this.sendInitialSync(socketId, userId, deviceInfo.deviceId);

      this.emit('device_connected', { userId, deviceId: deviceInfo.deviceId, socketId });
    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  }

  /**
   * Handle device disconnection
   */
  async unregisterDevice(socketId: string): Promise<void> {
    const connection = this.activeConnections.get(socketId);
    if (!connection) return;

    const { userId, deviceId } = connection;

    // Clear heartbeat
    const heartbeatKey = `${userId}-${deviceId}`;
    const heartbeat = this.deviceHeartbeats.get(heartbeatKey);
    if (heartbeat) {
      clearInterval(heartbeat);
      this.deviceHeartbeats.delete(heartbeatKey);
    }

    // Update device status
    await prisma.device.updateMany({
      where: { userId, deviceId },
      data: { isActive: false },
    });

    // Remove connection
    this.activeConnections.delete(socketId);

    this.emit('device_disconnected', { userId, deviceId, socketId });
  }

  /**
   * Process a sync event from a device
   */
  async processSyncEvent(
    userId: string,
    deviceId: string,
    event: Omit<SyncEvent, 'id' | 'userId' | 'deviceId' | 'timestamp'> & { syncVersion?: number }
  ): Promise<void> {
    try {
      // Create sync event record
      const syncEvent = await prisma.syncEvent.create({
        data: {
          userId,
          deviceId,
          eventType: event.eventType,
          resourceType: event.resourceType,
          resourceId: event.resourceId,
          eventData: JSON.stringify(event.eventData),
          syncVersion: event.syncVersion || 1,
        },
      });

      // Process the event based on type
      await this.processEventByType(syncEvent);

      // Broadcast to other devices
      await this.broadcastToOtherDevices(userId, deviceId, {
        type: 'sync_event',
        data: {
          id: syncEvent.id,
          eventType: event.eventType,
          resourceType: event.resourceType,
          resourceId: event.resourceId,
          eventData: event.eventData,
          timestamp: syncEvent.timestamp,
          syncVersion: syncEvent.syncVersion,
        },
      });

      this.emit('sync_event_processed', { userId, deviceId, event: syncEvent });
    } catch (error) {
      console.error('Failed to process sync event:', error);
      throw error;
    }
  }

  /**
   * Handle conflict resolution
   */
  async resolveConflict(
    userId: string,
    conflictId: string,
    resolution: 'manual' | 'auto_merge' | 'device1_wins' | 'device2_wins',
    resolvedBy: string
  ): Promise<void> {
    try {
      const conflict = await prisma.syncConflict.findUnique({
        where: { id: conflictId },
      });

      if (!conflict) {
        throw new Error('Conflict not found');
      }

      // Apply resolution
      let resolvedData: any;
      switch (resolution) {
        case 'device1_wins':
          resolvedData = JSON.parse(conflict.data1);
          break;
        case 'device2_wins':
          resolvedData = JSON.parse(conflict.data2);
          break;
        case 'auto_merge':
          resolvedData = await this.autoMergeConflict(conflict);
          break;
        case 'manual':
          // For manual resolution, the resolved data should be provided
          // This would be handled by the UI
          return;
      }

      // Update the conflicted resource
      await this.updateResourceWithResolvedData(
        conflict.resourceType,
        conflict.resourceId,
        resolvedData
      );

      // Mark conflict as resolved
      await prisma.syncConflict.update({
        where: { id: conflictId },
        data: {
          resolution,
          resolvedAt: new Date(),
          resolvedBy,
        },
      });

      // Broadcast resolution to all devices
      await this.broadcastToAllDevices(userId, {
        type: 'conflict_resolved',
        data: {
          conflictId,
          resolution,
          resolvedData,
        },
      });

      this.emit('conflict_resolved', { userId, conflictId, resolution });
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
      throw error;
    }
  }

  /**
   * Get pending sync events for a device
   */
  async getPendingSyncEvents(userId: string, deviceId: string, lastSyncTime: Date): Promise<SyncEvent[]> {
    const events = await prisma.syncEvent.findMany({
      where: {
        userId,
        timestamp: { gt: lastSyncTime },
        deviceId: { not: deviceId }, // Exclude events from this device
        isProcessed: false,
      },
      orderBy: { timestamp: 'asc' },
    });

    return events.map(event => ({
      id: event.id,
      userId: event.userId,
      deviceId: event.deviceId,
      eventType: event.eventType as any,
      resourceType: event.resourceType as any,
      resourceId: event.resourceId,
      eventData: JSON.parse(event.eventData),
      timestamp: event.timestamp,
      syncVersion: event.syncVersion,
    }));
  }

  /**
   * Get active devices for a user
   */
  async getActiveDevices(userId: string): Promise<any[]> {
    return await prisma.device.findMany({
      where: {
        userId,
        isActive: true,
        lastSeen: { gt: new Date(Date.now() - 5 * 60 * 1000) }, // Active in last 5 minutes
      },
      orderBy: { lastSeen: 'desc' },
    });
  }

  /**
   * Private methods
   */
  private async processEventByType(syncEvent: any): Promise<void> {
    const eventData = JSON.parse(syncEvent.eventData);

    switch (syncEvent.eventType) {
      case 'message_sent':
        await this.processMessageSent(syncEvent, eventData);
        break;
      case 'message_edited':
        await this.processMessageEdited(syncEvent, eventData);
        break;
      case 'message_deleted':
        await this.processMessageDeleted(syncEvent, eventData);
        break;
      case 'conversation_created':
        await this.processConversationCreated(syncEvent, eventData);
        break;
      case 'conversation_updated':
        await this.processConversationUpdated(syncEvent, eventData);
        break;
      case 'settings_updated':
        await this.processSettingsUpdated(syncEvent, eventData);
        break;
    }
  }

  private async processMessageSent(syncEvent: any, eventData: any): Promise<void> {
    await prisma.conversationMessage.create({
      data: {
        conversationId: eventData.conversationId,
        userId: syncEvent.userId,
        role: eventData.role,
        content: eventData.content,
        metadata: eventData.metadata ? JSON.stringify(eventData.metadata) : null,
        deviceId: syncEvent.deviceId,
        syncVersion: syncEvent.syncVersion,
      },
    });
  }

  private async processMessageEdited(syncEvent: any, eventData: any): Promise<void> {
    await prisma.conversationMessage.update({
      where: { id: eventData.messageId },
      data: {
        content: eventData.content,
        metadata: eventData.metadata ? JSON.stringify(eventData.metadata) : undefined,
        lastEditedAt: new Date(),
        lastEditedBy: syncEvent.deviceId,
        syncVersion: syncEvent.syncVersion,
      },
    });
  }

  private async processMessageDeleted(syncEvent: any, eventData: any): Promise<void> {
    await prisma.conversationMessage.update({
      where: { id: eventData.messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: syncEvent.deviceId,
        syncVersion: syncEvent.syncVersion,
      },
    });
  }

  private async processConversationCreated(syncEvent: any, eventData: any): Promise<void> {
    await prisma.conversation.create({
      data: {
        userId: syncEvent.userId,
        content: eventData.content,
        deviceId: syncEvent.deviceId,
        syncVersion: syncEvent.syncVersion,
      },
    });
  }

  private async processConversationUpdated(syncEvent: any, eventData: any): Promise<void> {
    await prisma.conversation.update({
      where: { id: eventData.conversationId },
      data: {
        content: eventData.content,
        deviceId: syncEvent.deviceId,
        syncVersion: syncEvent.syncVersion,
        lastSyncedAt: new Date(),
      },
    });
  }

  private async processSettingsUpdated(syncEvent: any, eventData: any): Promise<void> {
    // Update user settings
    await prisma.user.update({
      where: { id: syncEvent.userId },
      data: {
        settings: JSON.stringify(eventData.settings),
      },
    });
  }

  private async broadcastToOtherDevices(userId: string, excludeDeviceId: string, message: any): Promise<void> {
    for (const [socketId, connection] of this.activeConnections.entries()) {
      if (connection.userId === userId && connection.deviceId !== excludeDeviceId) {
        try {
          connection.socket.emit('sync_message', message);
        } catch (error) {
          console.error('Failed to send sync message to device:', error);
        }
      }
    }
  }

  private async broadcastToAllDevices(userId: string, message: any): Promise<void> {
    for (const [socketId, connection] of this.activeConnections.entries()) {
      if (connection.userId === userId) {
        try {
          connection.socket.emit('sync_message', message);
        } catch (error) {
          console.error('Failed to send sync message to device:', error);
        }
      }
    }
  }

  private async sendInitialSync(socketId: string, userId: string, deviceId: string): Promise<void> {
    const connection = this.activeConnections.get(socketId);
    if (!connection) return;

    try {
      // Get recent conversations and messages
      const conversations = await prisma.conversation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50, // Limit to recent conversations
      });

      const messages = await prisma.conversationMessage.findMany({
        where: {
          conversationId: { in: conversations.map(c => c.id) },
          isDeleted: false,
        },
        orderBy: { createdAt: 'asc' },
      });

      // Send initial sync data
      connection.socket.emit('initial_sync', {
        conversations,
        messages,
        deviceId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to send initial sync:', error);
    }
  }

  private setupHeartbeat(socketId: string, userId: string, deviceId: string): void {
    const heartbeatKey = `${userId}-${deviceId}`;
    
    const heartbeat = setInterval(async () => {
      try {
        await prisma.device.updateMany({
          where: { userId, deviceId },
          data: { lastSeen: new Date() },
        });
      } catch (error) {
        console.error('Failed to update device heartbeat:', error);
        // Remove heartbeat if device is no longer valid
        clearInterval(heartbeat);
        this.deviceHeartbeats.delete(heartbeatKey);
      }
    }, 30000); // Update every 30 seconds

    this.deviceHeartbeats.set(heartbeatKey, heartbeat);
  }

  private startHeartbeatCleanup(): void {
    // Clean up inactive devices every 5 minutes
    setInterval(async () => {
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        await prisma.device.updateMany({
          where: {
            lastSeen: { lt: fiveMinutesAgo },
            isActive: true,
          },
          data: { isActive: false },
        });
      } catch (error) {
        console.error('Failed to cleanup inactive devices:', error);
      }
    }, 5 * 60 * 1000);
  }

  private async autoMergeConflict(conflict: any): Promise<any> {
    // Simple auto-merge strategy - for more complex scenarios, this would be more sophisticated
    const data1 = JSON.parse(conflict.data1);
    const data2 = JSON.parse(conflict.data2);

    // For messages, prefer the most recent edit
    if (conflict.resourceType === 'message') {
      const timestamp1 = new Date(data1.lastEditedAt || data1.createdAt);
      const timestamp2 = new Date(data2.lastEditedAt || data2.createdAt);
      return timestamp1 > timestamp2 ? data1 : data2;
    }

    // For conversations, merge content if possible
    if (conflict.resourceType === 'conversation') {
      return {
        ...data1,
        content: `${data1.content}\n\n---\n\n${data2.content}`,
        lastEditedAt: new Date(),
      };
    }

    // Default to most recent
    return data1;
  }

  private async updateResourceWithResolvedData(resourceType: string, resourceId: string, resolvedData: any): Promise<void> {
    switch (resourceType) {
      case 'message':
        await prisma.conversationMessage.update({
          where: { id: resourceId },
          data: {
            content: resolvedData.content,
            metadata: resolvedData.metadata ? JSON.stringify(resolvedData.metadata) : undefined,
            lastEditedAt: new Date(),
            syncVersion: { increment: 1 },
          },
        });
        break;
      case 'conversation':
        await prisma.conversation.update({
          where: { id: resourceId },
          data: {
            content: resolvedData.content,
            syncVersion: { increment: 1 },
            lastSyncedAt: new Date(),
          },
        });
        break;
    }
  }

  private generateSyncToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

// Singleton instance
export const syncService = new SyncService();
