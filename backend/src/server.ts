import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeSocket } from './socket/socket.handler';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Root route - ADDED THIS
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Manager API is running 🚀',
    version: '1.0.0',
    documentation: '/api-docs', // Add if you have Swagger/OpenAPI
    endpoints: {
      auth: '/api/v1/auth',
      tasks: '/api/v1/tasks',
      users: '/api/v1/users',
      health: '/health'
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected' // You could add a database check here
  });
});

// API Documentation route - ADDED THIS (optional)
app.get('/api-docs', (req, res) => {
  res.status(200).json({
    api: 'Task Manager API',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/v1/auth',
        methods: ['POST', 'GET'],
        description: 'Authentication endpoints'
      },
      {
        path: '/api/v1/tasks',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        description: 'Task management'
      },
      {
        path: '/api/v1/users',
        methods: ['GET'],
        description: 'User management'
      }
    ]
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

// 404 handler for undefined routes - ADDED THIS
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: ['/', '/health', '/api-docs', '/api/v1/auth', '/api/v1/tasks', '/api/v1/users']
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io initialized`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export { app, io };