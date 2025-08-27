import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

interface PresenceData {
  userId: string;
  sessionId: string;
  isTyping: boolean;
  isOnline: boolean;
  lastSeen: Date;
  status: 'idle' | 'typing' | 'thinking' | 'away';
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, {
      path: '/api/chat/presence',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    // Store active users
    const activeUsers = new Map<string, PresenceData>();

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join session room
      socket.on('join-session', (data: { sessionId: string; userId: string }) => {
        socket.join(data.sessionId);
        
        const presenceData: PresenceData = {
          userId: data.userId,
          sessionId: data.sessionId,
          isTyping: false,
          isOnline: true,
          lastSeen: new Date(),
          status: 'idle'
        };
        
        activeUsers.set(socket.id, presenceData);
        
        // Notify others in the session
        socket.to(data.sessionId).emit('user-joined', {
          userId: data.userId,
          timestamp: new Date()
        });
        
        // Send current session state
        const sessionUsers = Array.from(activeUsers.values())
          .filter(user => user.sessionId === data.sessionId);
        socket.emit('session-state', sessionUsers);
      });

      // Typing indicators
      socket.on('typing-start', (data: { sessionId: string; userId: string }) => {
        const user = activeUsers.get(socket.id);
        if (user) {
          user.isTyping = true;
          user.status = 'typing';
          user.lastSeen = new Date();
        }
        
        socket.to(data.sessionId).emit('user-typing', {
          userId: data.userId,
          isTyping: true,
          timestamp: new Date()
        });
      });

      socket.on('typing-stop', (data: { sessionId: string; userId: string }) => {
        const user = activeUsers.get(socket.id);
        if (user) {
          user.isTyping = false;
          user.status = 'idle';
          user.lastSeen = new Date();
        }
        
        socket.to(data.sessionId).emit('user-typing', {
          userId: data.userId,
          isTyping: false,
          timestamp: new Date()
        });
      });

      // AI thinking indicator
      socket.on('ai-thinking', (data: { sessionId: string }) => {
        socket.to(data.sessionId).emit('ai-status', {
          status: 'thinking',
          timestamp: new Date()
        });
      });

      socket.on('ai-responding', (data: { sessionId: string }) => {
        socket.to(data.sessionId).emit('ai-status', {
          status: 'responding',
          timestamp: new Date()
        });
      });

      // User status updates
      socket.on('status-update', (data: { sessionId: string; userId: string; status: string }) => {
        const user = activeUsers.get(socket.id);
        if (user) {
          user.status = data.status as any;
          user.lastSeen = new Date();
        }
        
        socket.to(data.sessionId).emit('user-status', {
          userId: data.userId,
          status: data.status,
          timestamp: new Date()
        });
      });

      // Heartbeat to keep connection alive
      socket.on('heartbeat', () => {
        const user = activeUsers.get(socket.id);
        if (user) {
          user.lastSeen = new Date();
        }
      });

      // Disconnect handling
      socket.on('disconnect', () => {
        const user = activeUsers.get(socket.id);
        if (user) {
          socket.to(user.sessionId).emit('user-left', {
            userId: user.userId,
            timestamp: new Date()
          });
          activeUsers.delete(socket.id);
        }
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
