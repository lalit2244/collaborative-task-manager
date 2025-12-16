import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

/**
 * Initialize Socket.io server with authentication
 * Handles real-time events for task updates and notifications
 */
export const initializeSocket = (httpServer: HttpServer): SocketServer => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
      };
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user.email}`);

    // Join user-specific room for targeted notifications
    socket.join(`user:${socket.data.user.id}`);

    // Handle task status updates
    socket.on('task:update', (data) => {
      io.emit('task:updated', data);
    });

    // Handle user typing indicators (optional feature)
    socket.on('user:typing', (data) => {
      socket.broadcast.emit('user:typing', {
        userId: socket.data.user.id,
        taskId: data.taskId,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.email}`);
    });
  });

  return io;
};
