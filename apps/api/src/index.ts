// Load environment variables FIRST - before any other imports
import dotenv from 'dotenv';
import { join } from 'path';

// When running with ts-node, __dirname is src/, so we need to go up one level to find .env
dotenv.config({ path: join(__dirname, '..', '.env') });
// Also try loading from current working directory as fallback
if (!process.env.JWT_SECRET) {
  dotenv.config();
}

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { writeFileSync, appendFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
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



const app: Express = express();
const PORT = process.env.PORT || 3001;
// #region agent log
logDebug({ location: 'index.ts:22', message: 'Express app created', data: { port: PORT, env: process.env.NODE_ENV }, sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' });
// #endregion

// Middleware
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// MANUAL CORS DIAGNOSTIC (Top of stack)
app.use((req, res, next) => {
  const origin = req.header('Origin');
  const host = req.header('Host');
  console.log(`📡 Incoming Request: ${req.method} ${req.url} | Host: ${host} | Origin: ${origin}`);
  
  if (req.method === 'OPTIONS') {
    console.log(`✨ MANUAL OPTIONS HANDLER: Responding to preflight from ${origin}`);
    // Reflect the incoming Origin (required when using credentials).
    // If Origin is missing, fall back to a permissive wildcard.
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    // Echo back requested headers when possible; otherwise, use the known set.
    const requestedHeaders = req.header('Access-Control-Request-Headers');
    res.setHeader(
      'Access-Control-Allow-Headers',
      requestedHeaders || 'Content-Type, Authorization, X-Requested-With'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

// CORS: Allow everything during debugging
app.use(cors({
  origin: (origin, callback) => {
    console.log(`🔍 CORS MIDDLEWARE: Processing origin "${origin}"`);
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// SECURITY: Helmet headers
app.use(helmet()); 

// Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} | Origin: ${req.header('Origin')}`);
  next();
});

// Middleware
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// Apply rate limiting to all requests
app.use(limiter);

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

  // SECURITY: Block mock routes in production
  const isProduction = process.env.NODE_ENV === 'production';

  // Configure routes based on DB connection status
  if (useMockData) {
    if (isProduction) {
      console.error('🚨 CRITICAL: Cannot use mock routes in production! Database connection is required.');
      console.error('💡 Please configure MONGODB_URI in your environment variables.');
      process.exit(1); // Exit with error - production MUST have database
    }
    console.log('🔧 Registering MOCK routes (development only)...');
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

  // Catch unhandled route requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.error(`[404 NOT FOUND] ${req.method} ${req.originalUrl}`);
    const error: any = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
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
