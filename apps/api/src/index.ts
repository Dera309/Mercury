import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { writeFileSync, appendFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
import { errorHandler } from './middlewares/errorHandler';

// Debug logging helper
const logDebug = (data: any) => {
  try {
    // Path from workspace root - go up from apps/api to root (mercury11)
    const workspaceRoot = join(process.cwd(), '..', '..');
    const logDir = join(workspaceRoot, '.cursor');
    const logPath = join(logDir, 'debug.log');
    // Ensure directory exists
    try {
      mkdirSync(logDir, { recursive: true });
    } catch (e) {
      // Directory might already exist, ignore
    }
    const logEntry = JSON.stringify({ ...data, timestamp: Date.now() }) + '\n';
    appendFileSync(logPath, logEntry, 'utf8');
  } catch (e) {
    // Silently fail - don't crash the server if logging fails
  }
};

// Routes - Import all routes (both production and mock)
import authRoutes from './routes/authRoutes';
import mockAuthRoutes from './routes/mockAuthRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import mockPortfolioRoutes from './routes/mockPortfolioRoutes';
import marketRoutes from './routes/marketRoutes';
import tradingRoutes from './routes/tradingRoutes';

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const app: Express = express();
const PORT = process.env.PORT || 3001;
// #region agent log
logDebug({ location: 'index.ts:22', message: 'Express app created', data: { port: PORT, env: process.env.NODE_ENV }, sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' });
// #endregion

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Async function to start the server
const startServer = async () => {
  // Configure routes based on DB connection status
  // We'll try to connect to the database first, but if it fails, we'll use mock routes
  let useMockData = true;
  let dbConnected = false;

  try {
    // #region agent log
    logDebug({ location: 'index.ts:67', message: 'Attempting DB connect', data: {}, sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' });
    // #endregion
    // Try to connect to database (required for production)
    await connectDatabase();
    dbConnected = true;
    useMockData = false;
    // #region agent log
    logDebug({ location: 'index.ts:71', message: 'Database connection successful', data: {}, sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' });
    // #endregion
    console.log('✅ MongoDB connected - Full production mode active');
  } catch (error) {
    // #region agent log
    logDebug({ location: 'index.ts:75', message: 'Database connection failed - switching to MOCK MODE', data: { errorType: error?.constructor?.name, errorMessage: error instanceof Error ? error.message : String(error) }, sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' });
    // #endregion
    console.warn('⚠️  MongoDB connection failed - switching to MOCK MODE');
    console.error('💡 DB Error:', error instanceof Error ? error.message : error);
    console.log('📝 Server will use mock routes for authentication and portfolio');
    useMockData = true; // Use mock data when DB fails
  }

  // Configure routes based on DB connection status
  if (useMockData) {
    console.log('🔧 Registering MOCK routes...');
    app.use('/api/auth', mockAuthRoutes);
    app.use('/api/portfolio', mockPortfolioRoutes);
  } else {
    console.log('🔧 Registering PRODUCTION routes...');
    app.use('/api/auth', authRoutes);
    app.use('/api/portfolio', portfolioRoutes);
  }

  // These routes work regardless of DB connection
  app.use('/api/market', marketRoutes);
  app.use('/api/trading', tradingRoutes);

  // Catch unhandled promise rejections - register after routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    // #region agent log
    logDebug({ location: 'index.ts:48', message: 'Route not found handler', data: { path: req.path, method: req.method }, sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' });
    // #endregion
    const error: any = new Error('Route not found');
    error.statusCode = 404;
    next(error);
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);
  // #region agent log
  logDebug({ location: 'index.ts:58', message: 'Error handler registered', data: { has4Params: errorHandler.length === 4 }, sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' });
  // #endregion

  // Start server
  app.listen(PORT, () => {
    // #region agent log
    logDebug({ location: 'index.ts:84', message: 'Server listening successfully', data: { port: PORT, dbConnected }, sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' });
    // #endregion
    console.log('');
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    console.log(`📋 Mode: ${dbConnected ? '✅ PRODUCTION (Database)' : '⚠️  MOCK DATA (No Database)'}`);
    console.log('');
  });
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
