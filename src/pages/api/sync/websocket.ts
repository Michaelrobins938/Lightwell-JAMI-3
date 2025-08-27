import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { syncService } from '../../../services/syncService';
import { verifyToken } from '../../../middleware/auth-middleware';

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: any & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/sync/websocket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('🔌 Sync client connected:', socket.id);
      
      let authenticatedUser: { userId: string } | null = null;
      let deviceInfo: any = null;

      // Handle authentication
      socket.on('authenticate', async (data: { token: string }) => {
        try {
          const decoded = verifyToken(data.token);
          if (!decoded) {
            socket.emit('auth_error', { message: 'Invalid token' });
            return;
          }

          authenticatedUser = { userId: decoded.userId };
          socket.emit('authenticated', { userId: decoded.userId });
          
          console.log('✅ User authenticated:', decoded.userId);
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('auth_error', { message: 'Authentication failed' });
        }
      });

      // Handle device registration
      socket.on('register_device', async (data: {
        deviceId: string;
        deviceName: string;
        deviceType: 'mobile' | 'desktop' | 'tablet';
        userAgent?: string;
      }) => {
        if (!authenticatedUser) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        try {
          deviceInfo = {
            deviceId: data.deviceId,
            deviceName: data.deviceName,
            deviceType: data.deviceType,
            userAgent: data.userAgent,
          };

          await syncService.registerDevice(
            socket.id,
            authenticatedUser.userId,
            deviceInfo,
            socket
          );

          socket.emit('device_registered', {
            deviceId: data.deviceId,
            message: 'Device registered successfully',
          });

          console.log('📱 Device registered:', data.deviceName);
        } catch (error) {
          console.error('Device registration error:', error);
          socket.emit('error', { message: 'Device registration failed' });
        }
      });

      // Handle sync events
      socket.on('sync_event', async (data: {
        eventType: string;
        resourceType: string;
        resourceId: string;
        eventData: any;
        syncVersion: number;
      }) => {
        if (!authenticatedUser || !deviceInfo) {
          socket.emit('error', { message: 'Not authenticated or device not registered' });
          return;
        }

        try {
          await syncService.processSyncEvent(
            authenticatedUser.userId,
            deviceInfo.deviceId,
            {
              eventType: data.eventType as any,
              resourceType: data.resourceType as any,
              resourceId: data.resourceId,
              eventData: data.eventData,
              syncVersion: data.syncVersion || 1,
            }
          );

          socket.emit('sync_event_ack', {
            eventId: data.resourceId,
            status: 'processed',
          });
        } catch (error) {
          console.error('Sync event processing error:', error);
          socket.emit('sync_event_error', {
            eventId: data.resourceId,
            error: 'Failed to process sync event',
          });
        }
      });

      // Handle conflict resolution
      socket.on('resolve_conflict', async (data: {
        conflictId: string;
        resolution: 'manual' | 'auto_merge' | 'device1_wins' | 'device2_wins';
      }) => {
        if (!authenticatedUser || !deviceInfo) {
          socket.emit('error', { message: 'Not authenticated or device not registered' });
          return;
        }

        try {
          await syncService.resolveConflict(
            authenticatedUser.userId,
            data.conflictId,
            data.resolution,
            deviceInfo.deviceId
          );

          socket.emit('conflict_resolved', {
            conflictId: data.conflictId,
            resolution: data.resolution,
          });
        } catch (error) {
          console.error('Conflict resolution error:', error);
          socket.emit('error', { message: 'Failed to resolve conflict' });
        }
      });

      // Handle sync status requests
      socket.on('get_sync_status', async () => {
        if (!authenticatedUser || !deviceInfo) {
          socket.emit('error', { message: 'Not authenticated or device not registered' });
          return;
        }

        try {
          const activeDevices = await syncService.getActiveDevices(authenticatedUser.userId);
          socket.emit('sync_status', {
            activeDevices,
            currentDevice: deviceInfo,
            lastSyncTime: new Date(),
          });
        } catch (error) {
          console.error('Sync status error:', error);
          socket.emit('error', { message: 'Failed to get sync status' });
        }
      });

      // Handle manual sync requests
      socket.on('request_sync', async (data: { lastSyncTime: string }) => {
        if (!authenticatedUser || !deviceInfo) {
          socket.emit('error', { message: 'Not authenticated or device not registered' });
          return;
        }

        try {
          const pendingEvents = await syncService.getPendingSyncEvents(
            authenticatedUser.userId,
            deviceInfo.deviceId,
            new Date(data.lastSyncTime)
          );

          socket.emit('sync_data', {
            events: pendingEvents,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error('Manual sync error:', error);
          socket.emit('error', { message: 'Failed to sync data' });
        }
      });

      // Handle heartbeat
      socket.on('heartbeat', () => {
        socket.emit('heartbeat_ack', { timestamp: new Date() });
      });

      // Handle disconnection
      socket.on('disconnect', async () => {
        console.log('🔌 Sync client disconnected:', socket.id);
        
        if (authenticatedUser && deviceInfo) {
          await syncService.unregisterDevice(socket.id);
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;

// Disable body parser for WebSocket
export const config = {
  api: {
    bodyParser: false,
  },
};
